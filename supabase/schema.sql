-- Production migration blueprint.
-- The current admin panel writes to local JSON files and is ideal for local development
-- or a persistent Node.js server. Before deploying to a serverless platform, migrate
-- books and poems to these Supabase tables.

create table if not exists books (
  slug text primary key,
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists poems (
  id text primary key,
  slug text not null,
  book_slug text not null references books(slug) on delete cascade,
  title text not null,
  body text not null,
  display_order integer not null,
  start_page integer,
  end_page integer,
  status text not null default 'draft',
  topics text[] not null default '{}',
  keywords text[] not null default '{}',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(book_slug, slug)
);
