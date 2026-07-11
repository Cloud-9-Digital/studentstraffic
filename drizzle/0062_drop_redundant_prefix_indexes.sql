-- These single-column indexes are already covered by the leftmost columns of
-- composite indexes and only add write/storage overhead.
DROP INDEX IF EXISTS universities_country_idx;
DROP INDEX IF EXISTS program_offerings_university_idx;
DROP INDEX IF EXISTS blog_posts_status_idx;
