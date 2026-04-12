-- EKATVA Database Force Sync Schema
-- WARNING: This will drop existing tables and recreate them. 
-- Make sure you have backed up any important data.

-- Drop existing tables if they exist to ensure a clean sync
drop table if exists messages cascade;
drop table if exists conversations cascade;
drop table if exists marketplace_items cascade;
drop table if exists job_applications cascade;
drop table if exists jobs cascade;
drop table if exists club_members cascade;
drop table if exists clubs cascade;
drop table if exists event_registrations cascade;
drop table if exists events cascade;
drop table if exists posts cascade;
drop table if exists gamification cascade;
drop table if exists digital_twins cascade;
drop table if exists connection_requests cascade;
drop table if exists users cascade;
drop table if exists wishlists cascade;
drop table if exists purchases cascade;
drop table if exists enrollments cascade;
drop table if exists generated_exams cascade;
drop table if exists posts cascade;
drop table if exists gamification cascade;
drop table if exists digital_twins cascade;
drop table if exists connection_requests cascade;
drop table if exists users cascade;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table users (
    id uuid primary key default uuid_generate_v4(),
    first_name text not null,
    last_name text not null,
    email text unique not null,
    password text not null,
    profile_image text,
    bio text DEFAULT '',
    college text not null,
    course text not null,
    year integer check (year between 1 and 4),
    roll_number text unique not null,
    skills text[] default '{}',
    interests text[] default '{}',
    xp integer default 0,
    level integer default 1,
    streak integer default 0,
    last_active_date timestamp with time zone,
    role text default 'student',
    is_active boolean default true,
    is_verified boolean default false,
    gpa numeric(4,2) default 0,
    attendance integer default 0,
    connections uuid[] default '{}',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Connection Requests Table
create table connection_requests (
    id uuid primary key default uuid_generate_v4(),
    from_user_id uuid references users(id) on delete cascade,
    to_user_id uuid references users(id) on delete cascade,
    status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
    created_at timestamp with time zone default now()
);

-- Digital Twin Table
create table digital_twins (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade unique,
    personality text,
    learning_style text,
    current_gpa numeric(4,2) default 0,
    attendance jsonb default '{"totalClasses": 0, "attendedClasses": 0, "attendancePercentage": 0, "lastUpdated": null}',
    study_hours jsonb default '{"currentWeek": 0, "totalHours": 0, "weeklyTarget": 10, "history": []}',
    assignments jsonb default '{"total": 0, "completed": 0, "pending": []}',
    activity_score jsonb default '{"dailyScore": 0, "activities": []}',
    academic_health text default 'Stable',
    insights jsonb default '[]',
    last_insight_generated timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Gamification Table
create table gamification (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade unique,
    level integer default 1,
    total_xp integer default 0,
    daily_streak integer default 0,
    badges jsonb default '[]',
    challenges_completed jsonb default '[]',
    xp_history jsonb default '[]',
    daily_tasks jsonb default '[]',
    missions jsonb default '[]',
    last_activity_date timestamp with time zone,
    max_daily_streak integer default 0,
    last_xp_awarded timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Posts Table
create table posts (
    id uuid primary key default uuid_generate_v4(),
    author_id uuid references users(id) on delete cascade,
    content text not null,
    images text[] default '{}',
    likes uuid[] default '{}',
    comments jsonb default '[]',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Events Table
create table events (
    id uuid primary key default uuid_generate_v4(),
    organizer_id uuid references users(id) on delete cascade,
    title text not null,
    description text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    location text,
    capacity integer default 100,
    is_registration_open boolean default true,
    is_active boolean default true,
    associated_club_id uuid,
    attendees uuid[] default '{}',
    created_at timestamp with time zone default now()
);

-- Event Registrations Table
create table event_registrations (
    id uuid primary key default uuid_generate_v4(),
    event_id uuid references events(id) on delete cascade,
    user_id uuid references users(id) on delete cascade,
    attended boolean default false,
    created_at timestamp with time zone default now(),
    unique(event_id, user_id)
);

-- Clubs Table
create table clubs (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    president_id uuid references users(id),
    category text,
    capacity integer default 50,
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Club Members Table
create table club_members (
    id uuid primary key default uuid_generate_v4(),
    club_id uuid references clubs(id) on delete cascade,
    user_id uuid references users(id) on delete cascade,
    role text default 'member',
    joined_at timestamp with time zone default now(),
    unique(club_id, user_id)
);

-- Jobs Table
create table jobs (
    id uuid primary key default uuid_generate_v4(),
    posted_by uuid references users(id) on delete cascade,
    title text not null,
    company text not null,
    description text,
    location text,
    job_type text,
    salary_min integer,
    salary_max integer,
    required_skills text[] default '{}',
    course text,
    year integer,
    minimum_gpa numeric(4,2),
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

-- Job Applications Table
create table job_applications (
    id uuid primary key default uuid_generate_v4(),
    job_id uuid references jobs(id) on delete cascade,
    user_id uuid references users(id) on delete cascade,
    status text default 'pending',
    resume_url text,
    cover_letter text,
    applied_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(job_id, user_id)
);

-- Marketplace Table
create table marketplace_items (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references users(id) on delete cascade,
    title text not null,
    description text,
    price numeric(10,2),
    images text[] default '{}',
    category text,
    condition text,
    status text default 'available',
    views integer default 0,
    likes uuid[] default '{}',
    inquiries jsonb default '[]',
    sold_to uuid references users(id),
    sold_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Conversations Table
create table conversations (
    id uuid primary key default uuid_generate_v4(),
    participants uuid[] not null,
    last_message_text text,
    last_message_time timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Messages Table
create table messages (
    id uuid primary key default uuid_generate_v4(),
    conversation_id uuid references conversations(id) on delete cascade,
    sender_id text not null, -- using text to bypass strict user dependency mapping for testing
    receiver_id text not null,
    content text not null,
    is_read boolean default false,
    read_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Wishlists Table
create table wishlists (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    item_name text not null,
    created_at timestamp with time zone default now()
);

-- Purchases Table
create table purchases (
    id uuid primary key default uuid_generate_v4(),
    buyer_id uuid references users(id) on delete cascade,
    seller_name text not null,
    item_name text not null,
    price text not null,
    purchased_at timestamp with time zone default now()
);

-- Enrollments Table
create table enrollments (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    program text not null,
    status text default 'enrolled',
    enrolled_at timestamp with time zone default now(),
    unique(user_id, program)
);

-- Generated Exams Table
create table generated_exams (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    topic text not null,
    content jsonb not null,
    created_at timestamp with time zone default now()
);

-- Update trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at before update on users for each row execute procedure update_updated_at_column();
create trigger update_digital_twins_updated_at before update on digital_twins for each row execute procedure update_updated_at_column();
create trigger update_gamification_updated_at before update on gamification for each row execute procedure update_updated_at_column();

-- Function to add a connection to a user's connections array
create or replace function add_connection(user_id uuid, friend_id uuid)
returns void as $$
begin
    update users
    set connections = array_append(connections, friend_id)
    where id = user_id and not (friend_id = any(connections));
end;
$$ language plpgsql;

-- Function to increment marketplace item views
create or replace function increment_item_views(item_id uuid)
returns void as $$
begin
    update marketplace_items
    set views = views + 1
    where id = item_id;
end;
$$ language plpgsql;
