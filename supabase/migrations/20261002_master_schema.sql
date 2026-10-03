-- ==============================================================================
-- REI Consulting Website — Master Database Schema & Migrations
-- Target: Supabase (PostgreSQL 15+)
-- Follows: Master Implementation Prompt (Phase 1, 3, 6)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. Profiles Table (Access Control Seam - Phase 1.1)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
CREATE POLICY "Public Read Profiles" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Function & Trigger: Automatically create a profile row when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'admin')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==============================================================================
-- 3. Properties Table RLS Policies (Listings CRUD - Phase 1.3)
-- ==============================================================================
ALTER TABLE IF EXISTS public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Properties" ON public.properties;
CREATE POLICY "Public Read Properties" ON public.properties
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Insert Properties" ON public.properties;
CREATE POLICY "Authenticated Insert Properties" ON public.properties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Update Properties" ON public.properties;
CREATE POLICY "Authenticated Update Properties" ON public.properties
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Delete Properties" ON public.properties;
CREATE POLICY "Authenticated Delete Properties" ON public.properties
    FOR DELETE USING (auth.role() = 'authenticated');


-- ==============================================================================
-- 4. Supabase Storage for Photos (Phase 1.2)
-- Create bucket 'media' (public read, authenticated write)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Media" ON storage.objects;
CREATE POLICY "Public Read Media" ON storage.objects
    FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated Upload Media" ON storage.objects;
CREATE POLICY "Authenticated Upload Media" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Update Media" ON storage.objects;
CREATE POLICY "Authenticated Update Media" ON storage.objects
    FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Delete Media" ON storage.objects;
CREATE POLICY "Authenticated Delete Media" ON storage.objects
    FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');


-- ==============================================================================
-- 5. Articles Table RLS Policies (Blog Management - Phase 3)
-- ==============================================================================
ALTER TABLE IF EXISTS public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Articles" ON public.articles;
CREATE POLICY "Public Read Articles" ON public.articles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Insert Articles" ON public.articles;
CREATE POLICY "Authenticated Insert Articles" ON public.articles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Update Articles" ON public.articles;
CREATE POLICY "Authenticated Update Articles" ON public.articles
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Delete Articles" ON public.articles;
CREATE POLICY "Authenticated Delete Articles" ON public.articles
    FOR DELETE USING (auth.role() = 'authenticated');


-- ==============================================================================
-- 6. Eligibility Leads Table (Funnel Storage - Phase 6.5)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.eligibility_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    language TEXT,
    project_type TEXT,
    property_purpose TEXT,
    has_title BOOLEAN,
    project_cost NUMERIC,
    own_funds NUMERIC,
    total_debt NUMERIC,
    total_savings NUMERIC,
    age INTEGER,
    monthly_income NUMERIC,
    employment_type TEXT,
    location TEXT,
    matched_loan_type TEXT,
    score NUMERIC,
    band TEXT, -- 'qualified' | 'workable' | 'needs_work'
    followed_up BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.eligibility_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Insert Leads" ON public.eligibility_leads;
CREATE POLICY "Public Insert Leads" ON public.eligibility_leads
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated Read Leads" ON public.eligibility_leads;
CREATE POLICY "Authenticated Read Leads" ON public.eligibility_leads
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Update Leads" ON public.eligibility_leads;
CREATE POLICY "Authenticated Update Leads" ON public.eligibility_leads
    FOR UPDATE USING (auth.role() = 'authenticated');
