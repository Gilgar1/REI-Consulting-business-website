# Migration Plan: Django to Supabase

## 1. Executive Summary
This document outlines the strategy to migrate the REI Consulting backend from Django to Supabase. This transformation will move the application to a serverless architecture, improving scalability to handle 500+ concurrent users with minimal maintenance.

## 2. Architecture Changes
- **Database:** SQLite (Django default) -> PostgreSQL (Supabase)
- **Authentication:** Django Auth -> Supabase Auth (JWT)
- **API:** Django REST Framework -> Supabase Client (Direct DB access with RLS)
- **Realtime:** None -> Supabase Realtime (for listings/updates)
- **Storage:** Static files -> Supabase Storage

## 3. Database Schema (SQL)
The following SQL commands will create the necessary tables in Supabase, mirroring the Django models.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Core: Site Hero
CREATE TABLE site_heroes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_text TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Content: Who We Are
CREATE TABLE who_we_are_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Content: Why Choose Reasons
CREATE TABLE why_choose_reasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Services: Service
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    height TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Listings: Property
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    location TEXT NOT NULL,
    price TEXT NOT NULL,
    features TEXT,
    verified BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Blog: Article
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE site_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE who_we_are_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies
CREATE POLICY "Public Read Heroes" ON site_heroes FOR SELECT USING (true);
CREATE POLICY "Public Read WhoWeAre" ON who_we_are_items FOR SELECT USING (true);
CREATE POLICY "Public Read WhyChoose" ON why_choose_reasons FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public Read Articles" ON articles FOR SELECT USING (true);
```

## 4. Frontend Implementation Steps

### Step 4.1: Install Dependencies
`npm install @supabase/supabase-js`

### Step 4.2: Supabase Client Setup
Create `src/supabaseClient.ts` to initialize the connection.

### Step 4.3: Authentication Migration
Rewrite `src/context/AuthContext.tsx` to use `supabase.auth.signInWithPassword`, `signOut`, and `getUser`.

### Step 4.4: Data Fetching Updates
Replace Axios calls in components with Supabase queries.
- **Example:** `api.get('/listings')` -> `supabase.from('properties').select('*')`

## 5. Security & Performance
- **RLS:** All tables are secured by default. Only public read access is granted. Write access requires authenticated admin users (policy to be added).
- **Indexing:** Primary keys are UUIDs (optimal for distribution).
- **Realtime:** Can be enabled on 'properties' table for live listing updates.

## 6. Deployment
- **Frontend:** Deploy to Vercel/Netlify.
- **Backend:** Managed by Supabase.
- **Env Vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
