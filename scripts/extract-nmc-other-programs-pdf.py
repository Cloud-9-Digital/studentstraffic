#!/usr/bin/env python3

from __future__ import annotations

import argparse
import csv
import re
import sys
from pathlib import Path

try:
    from pypdf import PdfReader
except ModuleNotFoundError:
    bundled_site_packages = (
        Path.home()
        / ".cache/codex-runtimes/codex-primary-runtime/dependencies/python/lib/python3.12/site-packages"
    )
    if bundled_site_packages.exists():
        sys.path.append(str(bundled_site_packages))
    from pypdf import PdfReader


STATE_CODE_MAP = {
    "AN": "Andaman and Nicobar Islands",
    "AP": "Andhra Pradesh",
    "AR": "Arunachal Pradesh",
    "AS": "Assam",
    "BH": "Bihar",
    "BR": "Bihar",
    "CH": "Chandigarh",
    "CG": "Chhattisgarh",
    "CT": "Chhattisgarh",
    "DD": "Dadra and Nagar Haveli",
    "DL": "Delhi",
    "GA": "Goa",
    "GJ": "Gujarat",
    "HR": "Haryana",
    "HP": "Himachal Pradesh",
    "JK": "Jammu & Kashmir",
    "JH": "Jharkhand",
    "KA": "Karnataka",
    "KL": "Kerala",
    "MP": "Madhya Pradesh",
    "MH": "Maharashtra",
    "MN": "Manipur",
    "ML": "Meghalaya",
    "MZ": "Mizoram",
    "NL": "Nagaland",
    "OR": "Odisha",
    "OD": "Odisha",
    "PY": "Puducherry",
    "PD": "Puducherry",
    "PB": "Punjab",
    "RJ": "Rajasthan",
    "SK": "Sikkim",
    "TN": "Tamil Nadu",
    "TG": "Telangana",
    "TS": "Telangana",
    "TR": "Tripura",
    "UP": "Uttar Pradesh",
    "UK": "Uttarakhand",
    "UT": "Uttarakhand",
    "WB": "West Bengal",
}


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("\x00", "")).strip()


def split_camel_words(value: str) -> str:
    value = re.sub(r"(?<=[a-z])(?=[A-Z])", " ", value)
    value = re.sub(r"(?<=[A-Za-z])(?=\d)", " ", value)
    value = re.sub(r"(?<=\d)(?=[A-Za-z])", " ", value)
    return clean_text(value)


def strip_artifacts(value: str) -> str:
    cleaned = value
    for fragment in [
        "Showing",
        "entries Print",
        "Print ‹ ›",
        "Print",
        "‹ ›",
        "of Medical College /",
        "of College",
        "State Name",
        "Name State",
    ]:
        cleaned = cleaned.replace(fragment, " ")
    return clean_text(cleaned)


def canonicalize_state_name(raw_state: str, college_code: str = "") -> str:
    cleaned = strip_artifacts(split_camel_words(raw_state))
    cleaned = re.sub(r"Showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+entries.*$", "", cleaned).strip()
    if college_code:
        code = college_code.split("/")
        state_prefix = code[1] if code and code[0] == "PG" and len(code) > 1 else code[0]
        if state_prefix in STATE_CODE_MAP:
            return STATE_CODE_MAP[state_prefix]
    return cleaned


def get_segments(line: str) -> list[tuple[int, str]]:
    return [
        (match.start(), clean_text(match.group(0)))
        for match in re.finditer(r"\S(?:.*?\S)?(?=(?:\s{2,}|$))", line)
    ]


def split_new_row(segments: list[tuple[int, str]]) -> dict[str, str] | None:
    if not segments or segments[0][0] > 2:
        return None

    first_segment = segments[0][1]
    slno = ""
    row_segments = segments[1:]
    initial_course = ""

    if first_segment.isdigit():
        slno = first_segment
    else:
        match = re.match(r"^(?P<slno>\d+)\s+(?P<course>.+)$", first_segment)
        if not match:
            return None
        slno = match.group("slno")
        initial_course = match.group("course")

    row = {
        "slno": slno,
        "course_name": initial_course,
        "state_name": "",
        "college_blob": "",
        "university_name": "",
        "management_type": "",
        "year_of_inception": "",
        "annual_intake_seats": "",
    }
    apply_continuation_segments(row, row_segments)

    if not row["course_name"] or not row["state_name"] or not row["college_blob"]:
        return None

    return row


def apply_continuation_segments(
    current: dict[str, str], segments: list[tuple[int, str]]
) -> None:
    for start, text in segments:
        if start < 35:
            current["course_name"] = clean_text(
                f"{current.get('course_name', '')} {text}"
            )
            continue
        if start < 48:
            current["state_name"] = clean_text(
                f"{current.get('state_name', '')} {text}"
            )
            continue
        if start < 73:
            current["college_blob"] = clean_text(
                f"{current.get('college_blob', '')} {text}"
            )
            continue
        if start < 93:
            current["university_name"] = clean_text(
                f"{current.get('university_name', '')} {text}"
            )
            continue
        if start < 111:
            current["management_type"] = clean_text(
                f"{current.get('management_type', '')} {text}"
            )
            continue
        if start < 124:
            current["year_of_inception"] = clean_text(
                f"{current.get('year_of_inception', '')} {text}"
            )
            continue
        if start < 135:
            current["annual_intake_seats"] = clean_text(
                f"{current.get('annual_intake_seats', '')} {text}"
            )
            continue


def finalize_record(record: dict[str, str]) -> dict[str, str] | None:
    college_blob = clean_text(record.get("college_blob", ""))
    if not college_blob:
        return None

    code_match = re.match(
        r"(?P<code>(?:PG/)?[A-Z]{2}/\d+/[A-Z]/\d+):\s*(?P<name>.+)",
        college_blob,
    )
    college_code = code_match.group("code") if code_match else ""
    college_name = strip_artifacts(
        split_camel_words(code_match.group("name") if code_match else college_blob)
    )
    state_name = canonicalize_state_name(record.get("state_name", ""), college_code)
    university_name = strip_artifacts(split_camel_words(record.get("university_name", "")))
    management_type = clean_text(record.get("management_type", ""))
    management_match = re.search(
        r"(Govt-Society|Govt\.|Trust|Society|Private|Autonomous|Statutory)",
        management_type,
    )
    management_type = management_match.group(1) if management_match else split_camel_words(management_type)
    year_match = re.search(r"\b(19|20)\d{2}\b", record.get("year_of_inception", ""))
    year = year_match.group(0) if year_match else ""
    intake_match = re.search(r"\b\d+\b", record.get("annual_intake_seats", ""))
    intake = intake_match.group(0) if intake_match else ""
    course_name = strip_artifacts(split_camel_words(record.get("course_name", "")))
    city_name = ""
    if "," in college_name:
        city_name = strip_artifacts(split_camel_words(college_name.split(",")[-1])).rstrip(")")

    return {
        "College Code": college_code,
        "College Name": college_name,
        "State Name": state_name,
        "City Name": city_name,
        "Management Type": management_type,
        "University Name": university_name,
        "Course Name": course_name,
        "Year of Inception of College": year,
        "Annual Intake (Seats)": intake,
    }


def parse_pdf(pdf_path: Path) -> list[dict[str, str]]:
    reader = PdfReader(str(pdf_path))
    rows: list[dict[str, str]] = []
    current: dict[str, str] | None = None

    for page in reader.pages:
        text = page.extract_text(extraction_mode="layout") or ""
        for raw_line in text.splitlines():
            if not raw_line.strip():
                continue

            line = raw_line.rstrip()
            normalized_line = clean_text(line)

            if "Sl.No." in line and "Course Name" in line:
                continue
            if normalized_line.startswith("Course Name"):
                continue
            if normalized_line.startswith("Select a"):
                continue
            if normalized_line.startswith("State"):
                continue
            if normalized_line.startswith("Name and Address"):
                continue
            if normalized_line.startswith("University Name"):
                continue
            if normalized_line.startswith("Management of College"):
                continue
            if normalized_line.startswith("Year of Inception"):
                continue
            if normalized_line.startswith("Annual Intake"):
                continue
            if normalized_line.startswith("Status"):
                continue
            if "Medical College /" in line or "Medical Institution" in line:
                continue
            if "Total College Count" in line or "Total results found" in line:
                continue
            if "COLLEGE AND COURSE SEARCH" in line or "Go Back" in line:
                continue
            if "Specify search filters" in line or "View Results" in line:
                continue
            if normalized_line in {"of", "(Seats)", "College"}:
                continue
            if line.strip().startswith("Page ") or line.strip().startswith("Updated on:"):
                continue

            if "Disclaimer" in normalized_line or "National Medical" in normalized_line:
                continue
            if "entries" in normalized_line and "to" in normalized_line and "of" in normalized_line:
                continue

            segments = get_segments(line)
            new_row = split_new_row(segments)

            if new_row:
                if current:
                    finalized = finalize_record(current)
                    if finalized:
                        rows.append(finalized)
                current = new_row
                continue

            if not current:
                continue

            apply_continuation_segments(current, segments)

    if current:
        finalized = finalize_record(current)
        if finalized:
            rows.append(finalized)

    return rows


def write_tsv(rows: list[dict[str, str]], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "College Code",
        "College Name",
        "State Name",
        "City Name",
        "Management Type",
        "University Name",
        "Course Name",
        "Year of Inception of College",
        "Annual Intake (Seats)",
    ]
    with output_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, delimiter="\t")
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Extract NMC non-MBBS course rows into TSV."
    )
    parser.add_argument("--file", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    pdf_path = Path(args.file).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve()

    rows = parse_pdf(pdf_path)
    if not rows:
        raise SystemExit("No rows extracted from PDF.")

    write_tsv(rows, output_path)
    print(f"Extracted {len(rows)} rows to {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
