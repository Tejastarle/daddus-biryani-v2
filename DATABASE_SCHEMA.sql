-- ========================================
-- DADDU'S BIRYANI - DATABASE SCHEMA
-- ========================================
-- Run this ONCE in the Supabase SQL Editor:
--   supabase.com -> your project -> SQL Editor -> New query
--   -> paste this whole file -> Run
--
-- It creates every table the website needs, adds the columns the blog pages
-- expect, and sets the security rules so visitors can submit enquiries but
-- only a logged-in admin can read them.
--
-- Safe to run again: nothing is dropped and no data is deleted.
-- ========================================

-- LEADS TABLE
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  is_veg BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS menu_items_category_idx ON menu_items(category);

-- BLOGS TABLE
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  image TEXT,
  category TEXT,
  author TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs(slug);
CREATE INDEX IF NOT EXISTS blogs_category_idx ON blogs(category);

-- GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- COLUMNS THE BLOG PAGES EXPECT
-- ========================================
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS video_file_url TEXT;

-- The website's forms ask for a phone number, not an email, so email is optional.
ALTER TABLE leads ALTER COLUMN email DROP NOT NULL;

-- ========================================
-- SECURITY RULES (row level security)
-- ========================================
-- Without these, either nothing saves or anyone could read your customers'
-- names and phone numbers.

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Visitors: may submit an enquiry, may not read any
DROP POLICY IF EXISTS "public can submit leads" ON leads;
CREATE POLICY "public can submit leads" ON leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public can send messages" ON contact_messages;
CREATE POLICY "public can send messages" ON contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Visitors: may read published blog posts only
DROP POLICY IF EXISTS "public can read published blogs" ON blogs;
CREATE POLICY "public can read published blogs" ON blogs
  FOR SELECT TO anon USING (status = 'published');

-- Logged-in admin: full access
DROP POLICY IF EXISTS "admin manages leads" ON leads;
CREATE POLICY "admin manages leads" ON leads
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin manages blogs" ON blogs;
CREATE POLICY "admin manages blogs" ON blogs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin reads messages" ON contact_messages;
CREATE POLICY "admin reads messages" ON contact_messages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========================================
-- SAMPLE DATA
-- ========================================
-- Intentionally empty.
--
-- Earlier versions inserted example leads, blog posts and customer
-- testimonials. Those were invented, and the blog rows would have appeared on
-- the public website. Add only real content.
--
-- Menu prices are NOT stored here. They come from data/menu.json, which is
-- generated from the pricing workbook by scripts/extract_menu.py.

-- ========================================
-- DONE
-- ========================================
-- Next step: Authentication -> Users -> Add user, to create your admin login.
