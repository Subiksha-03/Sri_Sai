/*
# Tighten public gallery and enquiry access

1. Security changes
- Gallery images remain publicly readable so visitors can view the portfolio.
- Gallery writes are limited to authenticated operators; visitors cannot alter portfolio content.
- Enquiry submissions remain open to visitors so the public form works.
- Enquiry rows are no longer readable by anonymous or authenticated visitors, protecting contact details.

2. Data safety
- No tables or columns are removed or changed.
*/

DROP POLICY IF EXISTS "anon_insert_gallery" ON gallery_images;
DROP POLICY IF EXISTS "anon_update_gallery" ON gallery_images;
DROP POLICY IF EXISTS "anon_delete_gallery" ON gallery_images;
DROP POLICY IF EXISTS "anon_read_enquiries" ON enquiries;

CREATE POLICY "authenticated_insert_gallery" ON gallery_images FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated_update_gallery" ON gallery_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_gallery" ON gallery_images FOR DELETE
  TO authenticated USING (true);
