-- ==============================================================================
-- Migration: Articles Table Published Column, Index, and Seed Data
-- ==============================================================================

-- Step 1 — Update the schema
ALTER TABLE articles ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published, published_at DESC);

-- Step 2 — Seed your 8 existing articles so nothing is lost
INSERT INTO articles (title, slug, excerpt, content, category, image_url, published_at, published) VALUES
('How Real Estate Loans Work in Cameroon (Simple Guide)', 'how-real-estate-loans-work-in-cameroon', 'A comprehensive breakdown of the loan process, requirements, and what you need to know before applying. Learn about CFC and other lenders, interest rates, and eligibility criteria.', 'A comprehensive breakdown of the loan process, requirements, and what you need to know before applying. Learn about CFC and other lenders, interest rates, and eligibility criteria.\n\n[Full article content to be added.]', 'Loan Guidance', NULL, '2025-11-28', true),
('7 Red Flags When Buying Land in Yaoundé', '7-red-flags-buying-land-yaounde', 'Learn to identify warning signs that could save you from fraud and costly mistakes. From fake documents to disputed land, here''s what to watch for.', 'Learn to identify warning signs that could save you from fraud and costly mistakes. From fake documents to disputed land, here''s what to watch for.\n\n[Full article content to be added.]', 'Property Verification', NULL, '2025-11-25', true),
('The Diaspora Investor''s Roadmap (2025 Guide)', 'diaspora-investors-roadmap-2025', 'Essential strategies for Cameroonians abroad looking to invest safely in real estate back home. Navigate the challenges and build a profitable portfolio from anywhere in the world.', 'Essential strategies for Cameroonians abroad looking to invest safely in real estate back home. Navigate the challenges and build a profitable portfolio from anywhere in the world.\n\n[Full article content to be added.]', 'Diaspora Investment', NULL, '2025-11-20', true),
('How to Verify a Property Before Paying Even 1 Franc', 'verify-property-before-paying', 'Step-by-step verification process to protect yourself from scams and ensure legitimate property deals. Your complete anti-fraud checklist.', 'Step-by-step verification process to protect yourself from scams and ensure legitimate property deals. Your complete anti-fraud checklist.\n\n[Full article content to be added.]', 'Property Verification', NULL, '2025-11-15', true),
('Understanding Land Titles in Cameroon: A Complete Guide', 'understanding-land-titles-cameroon', 'Everything you need to know about land certificates, titles, and the process of securing proper documentation for your property.', 'Everything you need to know about land certificates, titles, and the process of securing proper documentation for your property.\n\n[Full article content to be added.]', 'Documentation', NULL, '2025-11-10', true),
('Is Real Estate Investment in Cameroon Worth It? 2025 Analysis', 'real-estate-investment-cameroon-2025-analysis', 'An honest, data-driven analysis of Cameroon''s real estate market. Opportunities, risks, and where the smart money is going.', 'An honest, data-driven analysis of Cameroon''s real estate market. Opportunities, risks, and where the smart money is going.\n\n[Full article content to be added.]', 'Market Insights', NULL, '2025-11-05', true),
('How I Helped a Diaspora Client Avoid a 15M FCFA Scam', 'diaspora-client-avoid-15m-fcfa-scam', 'A real case study of how property verification saved a client from a sophisticated fraud scheme. Learn from this close call.', 'A real case study of how property verification saved a client from a sophisticated fraud scheme. Learn from this close call.\n\n[Full article content to be added.]', 'Case Studies', NULL, '2025-10-28', true),
('Rental Property Management: What Landlords Should Know', 'rental-property-management-landlords', 'Best practices for managing rental properties in Yaoundé and Douala. From tenant selection to maintenance and rent collection.', 'Best practices for managing rental properties in Yaoundé and Douala. From tenant selection to maintenance and rent collection.\n\n[Full article content to be added.]', 'Market Insights', NULL, '2025-10-20', true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  published_at = EXCLUDED.published_at,
  published = EXCLUDED.published;
