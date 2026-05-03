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


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("\x00", "")).strip()


def normalize_state_name(value: str) -> str:
    cleaned = clean_text(value)
    cleaned = re.sub(r"(?<=[a-z])(?=[A-Z])", " ", cleaned)
    return cleaned


def split_camel_words(value: str) -> str:
    value = re.sub(r"(?<=[a-z])(?=[A-Z])", " ", value)
    value = re.sub(r"(?<=[A-Za-z])(?=\d)", " ", value)
    value = re.sub(r"(?<=\d)(?=[A-Za-z])", " ", value)
    return clean_text(value)


def strip_header_artifacts(value: str) -> str:
    cleaned = value
    for fragment in [
        "Name State",
        "State Name",
        "of Medical College /",
        "of College",
    ]:
        cleaned = cleaned.replace(fragment, " ")

    return clean_text(cleaned)


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


STATE_NAME_NORMALIZATION = {
    "Andaman": "Andaman and Nicobar Islands",
    "Andaman Nicobar Islands": "Andaman and Nicobar Islands",
    "Andaman & Nicobar Islands": "Andaman and Nicobar Islands",
    "Chattisgarh": "Chhattisgarh",
    "Orissa": "Odisha",
    "Pondicherry": "Puducherry",
}


def canonicalize_state_name(value: str, college_code: str = "") -> str:
    cleaned = strip_header_artifacts(normalize_state_name(value))
    cleaned = re.sub(r"Showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+entries.*$", "", cleaned).strip()

    if college_code:
        prefix = college_code.split("/", 1)[0]
        if prefix in STATE_CODE_MAP:
            return STATE_CODE_MAP[prefix]

    return STATE_NAME_NORMALIZATION.get(cleaned, cleaned)


def get_segments(line: str) -> list[tuple[int, str]]:
    return [
        (match.start(), clean_text(match.group(0)))
        for match in re.finditer(r"\S(?:.*?\S)?(?=(?:\s{2,}|$))", line)
    ]


def split_new_row(segments: list[tuple[int, str]]) -> dict[str, str] | None:
    if not segments:
        return None

    first_text = segments[0][1]
    state_index = 1

    combined_match = re.match(r"^(?P<slno>\d+)\s+(?P<course>M\.B\.B\.S\.)$", first_text)
    if combined_match:
        slno = combined_match.group("slno")
        course = combined_match.group("course")
    elif (
        len(segments) > 1
        and first_text.isdigit()
        and segments[1][1].upper().replace(".", "") == "MBBS"
    ):
        slno = first_text
        course = segments[1][1]
        state_index = 2
    else:
        return None

    remaining = [text for _, text in segments[state_index:]]
    if len(remaining) < 3:
        return None

    row = {
        "slno": slno,
        "course_name": course,
        "state_name": remaining[0],
        "college_blob": remaining[1],
        "university_name": remaining[2],
        "management_type": "",
        "year_of_inception": "",
        "annual_intake_seats": "",
    }

    if len(remaining) == 4:
        row["management_type"] = remaining[3]
    elif len(remaining) == 5:
        row["management_type"] = remaining[3]
        row["annual_intake_seats"] = remaining[4]
    else:
        row["management_type"] = remaining[3]
        row["year_of_inception"] = remaining[4]
        row["annual_intake_seats"] = remaining[5]

    return row


def apply_continuation_segments(
    current: dict[str, str], segments: list[tuple[int, str]], mode: str
) -> None:
    if mode == "public":
        college_boundary = 64
        university_boundary = 89
        management_boundary = 107
        year_boundary = 121
        intake_boundary = 132
    else:
        college_boundary = 75
        university_boundary = 105
        management_boundary = 123
        year_boundary = 137
        intake_boundary = 999

    for start, text in segments:
        if start < 30:
            current["state_name"] = clean_text(f"{current.get('state_name', '')} {text}")
            continue

        if start < college_boundary:
            current["college_blob"] = clean_text(
                f"{current.get('college_blob', '')} {text}"
            )
            continue

        if start < university_boundary:
            current["university_name"] = clean_text(
                f"{current.get('university_name', '')} {text}"
            )
            continue

        if start < management_boundary:
            current["management_type"] = clean_text(
                f"{current.get('management_type', '')} {text}"
            )
            continue

        if start < year_boundary:
            current["year_of_inception"] = clean_text(
                f"{current.get('year_of_inception', '')} {text}"
            )
            continue

        if start < intake_boundary:
            current["annual_intake_seats"] = clean_text(
                f"{current.get('annual_intake_seats', '')} {text}"
            )


def finalize_record(record: dict[str, str]) -> dict[str, str] | None:
    if not record.get("college_blob") or not record.get("state_name"):
        return None

    college_blob = clean_text(record["college_blob"])
    university_name = clean_text(record.get("university_name", ""))
    management_type = clean_text(record.get("management_type", ""))
    course_name = clean_text(record.get("course_name", "")) or "MBBS"
    year_of_inception = "".join(re.findall(r"\d+", record.get("year_of_inception", "")))
    annual_intake = "".join(re.findall(r"\d+", record.get("annual_intake_seats", "")))

    code_match = re.match(r"(?P<code>[A-Z]{2}/\d+/[A-Z]/\d+):\s*(?P<name>.+)", college_blob)
    college_code = code_match.group("code") if code_match else ""
    college_name = strip_header_artifacts(split_camel_words(
        code_match.group("name") if code_match else college_blob
    ))
    university_name = strip_header_artifacts(split_camel_words(university_name))

    city_name = ""
    if "," in college_name:
        city_name = strip_header_artifacts(split_camel_words(college_name.split(",")[-1])).rstrip(")")

    management_match = re.search(
        r"(Govt\.|Trust|Society|Private|Autonomous|Statutory)",
        management_type,
    )
    management_type = (
        management_match.group(1)
        if management_match
        else strip_header_artifacts(split_camel_words(management_type))
    )

    return {
        "College Code": college_code,
        "College Name": college_name,
        "State Name": canonicalize_state_name(record["state_name"], college_code),
        "City Name": city_name,
        "Management Type": management_type,
        "University Name": university_name,
        "Course Name": course_name,
        "Year of Inception of College": year_of_inception,
        "Annual Intake (Seats)": annual_intake,
    }


def parse_first_page_fallback(pdf_path: Path) -> dict[str, str] | None:
    reader = PdfReader(str(pdf_path))
    text = reader.pages[0].extract_text() or ""
    match = re.search(
        r"1\s+M\.B\.B\.S\.\s+(?P<state>[A-Za-z]+)\s+"
        r"(?P<code>[A-Z]{2}/\d+/[A-Z]/\d+):\s*"
        r"(?P<rest>.+?)\s+"
        r"(?P<management>Govt\.|Trust|Society|Private)\s+"
        r"(?P<year>\d{4})\s+"
        r"(?P<intake>\d+)",
        text,
    )

    if not match:
        return None

    rest = clean_text(match.group("rest"))
    college_name = rest
    university_name = ""

    if " DR." in rest:
        college_name, university_tail = rest.rsplit(" DR.", 1)
        university_name = f"DR. {university_tail}"

    city_name = strip_header_artifacts(split_camel_words(college_name.split(",")[-1])) if "," in college_name else ""

    return {
        "College Code": match.group("code"),
        "College Name": strip_header_artifacts(split_camel_words(college_name)),
        "State Name": canonicalize_state_name(match.group("state"), match.group("code")),
        "City Name": city_name,
        "Management Type": split_camel_words(match.group("management")),
        "University Name": strip_header_artifacts(split_camel_words(university_name)),
        "Course Name": "M.B.B.S.",
        "Year of Inception of College": match.group("year"),
        "Annual Intake (Seats)": match.group("intake"),
    }


def parse_pdf(pdf_path: Path) -> list[dict[str, str]]:
    reader = PdfReader(str(pdf_path))
    rows: list[dict[str, str]] = []
    current: dict[str, str] | None = None

    for page in reader.pages:
        text = page.extract_text(extraction_mode="layout") or ""
        mode = "public" if "Status of N" in text else "private"
        for raw_line in text.splitlines():
            if not raw_line.strip():
                continue

            line = raw_line.rstrip()

            if "Sl.No." in line and "University Name" in line:
                continue
            if "Medical College / Medical" in line or "Institution" in line:
                continue
            if "Total College Count" in line or "Total results found" in line:
                continue
            if "COLLEGE AND COURSE SEARCH" in line or "Go Back" in line:
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

            apply_continuation_segments(current, segments, mode)

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
        description="Extract MBBS colleges from an NMC college search PDF into TSV."
    )
    parser.add_argument("--file", required=True, help="Path to the NMC PDF file")
    parser.add_argument("--output", required=True, help="Path to the output TSV file")
    args = parser.parse_args()

    pdf_path = Path(args.file).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve()

    rows = parse_pdf(pdf_path)
    first_page_row = parse_first_page_fallback(pdf_path)
    if first_page_row:
        replaced = False
        for index, row in enumerate(rows):
            if row["College Code"] == first_page_row["College Code"]:
                rows[index] = first_page_row
                replaced = True
                break
        if not replaced:
            rows.insert(0, first_page_row)

    if not rows:
        raise SystemExit("No MBBS rows were extracted from the PDF.")

    write_tsv(rows, output_path)
    print(f"Extracted {len(rows)} MBBS rows to {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
