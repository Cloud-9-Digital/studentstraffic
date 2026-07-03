CREATE INDEX IF NOT EXISTS "blog_posts_status_published_at_idx"
  ON "blog_posts" USING btree ("status", "published_at");

CREATE INDEX IF NOT EXISTS "blog_posts_status_category_published_at_idx"
  ON "blog_posts" USING btree ("status", "category", "published_at");
