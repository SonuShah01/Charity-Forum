-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES table (Public profile info for each user)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text not null,
  name text,
  role text check (role in ('donor', 'beneficiary', 'admin')),
  organization text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Policies for profiles
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- DONATIONS table
create table if not exists donations (
  id uuid default uuid_generate_v4() primary key,
  donor_id uuid references profiles(id) not null,
  title text not null,
  description text,
  category text,
  condition text check (condition in ('new', 'like-new', 'good', 'fair')),
  quantity integer default 1,
  status text default 'pending' check (status in ('pending', 'approved', 'completed', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on donations
alter table donations enable row level security;

-- Policies for donations
drop policy if exists "Approved donations are viewable by everyone." on donations;
create policy "Approved donations are viewable by everyone."
  on donations for select
  using ( status = 'approved' );

drop policy if exists "Donors can see all their own donations." on donations;
create policy "Donors can see all their own donations."
  on donations for select
  using ( auth.uid() = donor_id );

drop policy if exists "Donors can insert their own donations." on donations;
create policy "Donors can insert their own donations."
  on donations for insert
  with check ( auth.uid() = donor_id );

drop policy if exists "Donors can update their own donations." on donations;
create policy "Donors can update their own donations."
  on donations for update
  using ( auth.uid() = donor_id );

-- REQUESTS table
create table if not exists requests (
  id uuid default uuid_generate_v4() primary key,
  beneficiary_id uuid references profiles(id) not null,
  title text not null,
  description text,
  category text,
  quantity integer default 1,
  urgency text check (urgency in ('low', 'medium', 'high')),
  status text default 'pending' check (status in ('pending', 'approved', 'fulfilled', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on requests
alter table requests enable row level security;

-- Policies for requests
drop policy if exists "Approved requests are viewable by everyone." on requests;
create policy "Approved requests are viewable by everyone."
  on requests for select
  using ( status = 'approved' );

drop policy if exists "Beneficiaries can see all their own requests." on requests;
create policy "Beneficiaries can see all their own requests."
  on requests for select
  using ( auth.uid() = beneficiary_id );

drop policy if exists "Beneficiaries can insert their own requests." on requests;
create policy "Beneficiaries can insert their own requests."
  on requests for insert
  with check ( auth.uid() = beneficiary_id );

drop policy if exists "Beneficiaries can update their own requests." on requests;
create policy "Beneficiaries can update their own requests."
  on requests for update
  using ( auth.uid() = beneficiary_id );

-- TRIGGERS for updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profile_updated on profiles;
create trigger on_profile_updated
  before update on profiles
  for each row execute procedure handle_updated_at();

drop trigger if exists on_donation_updated on donations;
create trigger on_donation_updated
  before update on donations
  for each row execute procedure handle_updated_at();

drop trigger if exists on_request_updated on requests;
create trigger on_request_updated
  before update on requests
  for each row execute procedure handle_updated_at();

-- TRIGGER for creating profile on signup (Optional but recommended)
-- This assumes you pass metadata or handle it on the client side insert. 
-- However, for better security, client-side insert into profiles is often used, or a function.
-- Here we'll rely on the client inserting the profile after signup, as defined in the RLS 'insert' policy.
