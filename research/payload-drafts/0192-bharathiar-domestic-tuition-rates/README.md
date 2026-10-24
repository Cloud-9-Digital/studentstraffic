# Bharathiar domestic tuition correction

Prepared 25 October 2026 as a full superseding payload copied from applied migration 0189. Includes only Bharathiar University, its 30 used generic courses, scoped original evidence and 43 new fee evidence items. The 44 supported programme entries, primary international USD750 annual tuition, admissions content and published Cloudinary media are preserved.

## Domestic tuition

42 programmes receive `additionalFees` with domestic audience and INR currency for academic year 2026–27. The source is the official 2026–27 university calendar, printed pages 42–49:

https://drive.google.com/file/d/19grcvrWLEVmZIX6UZPO4sEa8AGy9JyVa/view

The table explicitly separates tuition per semester in the “others” column from lab, course-material, infrastructure, special and admission/other charges and from total-semester charges. Annual equivalent = two regular semesters × the stated semester tuition. Every structured rate includes the original semester amount and arithmetic in its public note. The calendar's tentative examination schedule, printed pages 35–36, identifies the regular odd and even semesters in the same academic year. No total-semester charge was treated as tuition.

Domestic rate eligibility is the general “others” category. No automatic SC/ST or disability waiver is asserted. Any concession needs separate eligibility confirmation. MBA uses only the explicitly labelled MBA Regular row, excluding the differential-fee row.

## Secondary rates withheld

- M.A. Career Guidance lateral entry: printed page 50 labels INR6,550 as a composite III/IV semester fee alongside INR1,150 lab charges; tuition alone is not separately established.
- M.Lib.I.Sc.: printed page 48 lists INR3,040 as semester tuition but INR2,640 as II/IV semester total, an internal inconsistency. No domestic amount is published pending corroboration.

The primary international tuition remains unchanged on both entries.

No database query/write, media apply or commit was performed while preparing this correction. The numbered manifest was reserved using `content:reserve`; the draft payload stayed outside content-migrations until the parent completed its independent second-batch apply. It now lives at `content-migrations/0192-bharathiar-domestic-tuition-rates/payload.json`; the duplicate draft was removed. The publishing ledger was superseded using its locked mutation helper, preserving the owner. Scoped `content:validate -- --id 0192-bharathiar-domestic-tuition-rates` passed with zero expired review-by warnings.
