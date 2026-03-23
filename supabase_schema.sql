-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the passwords table
create table passwords (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  website text not null,
  username text not null,
  encrypted_password text not null,
  strength text not null check (strength in ('Weak', 'Medium', 'Strong')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security
alter table passwords enable row level security;

create policy "Users can view their own passwords"
  on passwords for select
  using (auth.uid() = user_id);

create policy "Users can insert their own passwords"
  on passwords for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own passwords"
  on passwords for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own passwords"
  on passwords for delete
  using (auth.uid() = user_id);
