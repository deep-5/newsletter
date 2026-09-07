-- =========================================================================
-- AIRA Newsletter - Supabase Database Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor -> Run
-- =========================================================================

-- 1. Subscribers Table (For Email Newsletter signups with date)
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) & allow anonymous public inserts
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public newsletter subscriptions" 
ON subscribers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow authenticated read subscriptions" 
ON subscribers FOR SELECT 
USING (true);


-- 2. Comments / Discussions Table (With author, text, date)
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_slug TEXT NOT NULL,
    author_name TEXT NOT NULL DEFAULT 'AI Enthusiast',
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read comments" 
ON comments FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert comments" 
ON comments FOR INSERT 
WITH CHECK (true);


-- 3. Likes Table
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_slug TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read likes" 
ON likes FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert likes" 
ON likes FOR INSERT 
WITH CHECK (true);


-- 4. Poll Feedback Votes (Loved it, Good, Needs improvement)
CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_slug TEXT NOT NULL,
    vote TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read poll_votes" 
ON poll_votes FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert poll_votes" 
ON poll_votes FOR INSERT 
WITH CHECK (true);
