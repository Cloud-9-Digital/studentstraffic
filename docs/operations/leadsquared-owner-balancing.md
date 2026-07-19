# LeadSquared owner balancing

## Purpose

This process balances the leads in the three NEET 2026 static lists across Abirami, Prema and Shoba Rajan. It changes only `OwnerId`; it does not update `mx_City` or any other lead field.

## Safety rules

- The script defaults to dry-run mode. `--apply` is required for mutations.
- LeadSquared list retrieval is paginated at 1,000 records per page.
- LeadSquared bulk update V2 is limited to 25 leads per request, so the script never exceeds that limit.
- Requests use bounded concurrency, request timeouts, retry-after handling, exponential backoff and a retry limit for 429/5xx responses.
- Updates are addressed by `ProspectId`, never by email or phone, to avoid duplicate/ambiguous matches.
- The script verifies that every list page returned the expected record count before starting updates.
- After mutation, the script retrieves the list again and verifies the expected distribution.

## Usage

```bash
# Preview counts and batch sizes; makes no changes.
node scripts/leadsquared-balance-owners.mjs

# Apply to all three lists.
node scripts/leadsquared-balance-owners.mjs --apply

# Apply to one list only.
node scripts/leadsquared-balance-owners.mjs --apply --list="Thiruvallur NEET Data 2026"
```

Expected splits are calculated automatically. For a remainder, the extra lead(s) go to the first owner(s) in the configured order: Abirami, then Prema, then Shoba Rajan.

## API references

- [Get leads in a list](https://apidocs.leadsquared.com/get-leads-in-a-list-2/)
- [Update Leads in Bulk V2](https://apidocs.leadsquared.com/update-lead-in-bulk-v2/)
- [LeadSquared rate limits](https://apidocs.leadsquared.com/rate-limits/)
