# Owned media delivery

Serve public images, flags and decorative files from storage controlled by Students Traffic. Source links document provenance or attribution; they must not be runtime fallback URLs. Keep documents and recordings separate from any public website bucket.

- `studentstraffic-public-media` serves validated, content-addressed WebP files through `https://media.studentstraffic.com/images/owned/v1/`.
- `studentstraffic-private-files` has no public URL. Authorised app endpoints check access before reading an object and must prevent public caching.
- Photos and flags bundled under `public/images` are also served from our own origin. Keep creator, source, licence and change notices in `public/images/location-media/credits.json`. If reuse is not verified, use a bundled country image.

## Migration sequence

1. Inventory actual public content by field. Keep the original checksummed archive separate from objects served publicly. Rasterise formats such as SVG and EPS before delivery.
2. Upload public files and verify HTTPS, image type and the response checksum for every expected object. Test the R2 hostname through the private release before changing references.
3. Keep URL validation compatible with the existing Cloudinary URLs during rollout. Keep a source-to-replacement map and update only current matching references; preserve published timestamps and accessibility text.
4. Use bucket-scoped server credentials for new writes. Migrate the admin blog upload and active automation before retiring Cloudinary so content can still publish without a deploy.
5. For protected brochures, documents or recordings, copy only to the private bucket. Verify the existing access checks using a private rehearsal before using R2 in production. Older external URLs in downstream workflows need their own compatibility plan.
6. Verify website and mobile clients using the new URLs. Leave existing Cloudinary assets available until old app responses, bookmarks and publishing clients no longer depend on them.

DNS for the website and API stays unchanged. Only the new media hostname is attached to the public bucket.
