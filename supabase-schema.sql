create extension if not exists pgcrypto;

create table if not exists public.equipment_enquiries (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    product_name text not null,
    product_slug text,
    attachments jsonb not null default '[]'::jsonb,
    first_name text not null,
    last_name text not null,
    email text not null,
    phone text not null,
    purchasing_for text,
    payment_method text,
    message text,
    page_url text,
    status text not null default 'new',
    constraint equipment_enquiries_status_check check (status in ('new', 'contacted', 'closed')),
    constraint equipment_enquiries_attachments_check check (jsonb_typeof(attachments) = 'array'),
    constraint equipment_enquiries_required_text_check check (
        char_length(trim(product_name)) between 1 and 200 and
        char_length(trim(first_name)) between 1 and 100 and
        char_length(trim(last_name)) between 1 and 100 and
        char_length(trim(email)) between 3 and 320 and
        char_length(trim(phone)) between 3 and 60
    )
);

create table if not exists public.contact_enquiries (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    name text not null,
    email text not null,
    phone text not null,
    message text,
    page_url text,
    status text not null default 'new',
    constraint contact_enquiries_status_check check (status in ('new', 'contacted', 'closed')),
    constraint contact_enquiries_required_text_check check (
        char_length(trim(name)) between 1 and 200 and
        char_length(trim(email)) between 3 and 320 and
        char_length(trim(phone)) between 3 and 60
    )
);

alter table public.equipment_enquiries enable row level security;
alter table public.contact_enquiries enable row level security;

revoke all on table public.equipment_enquiries from anon, authenticated;
revoke all on table public.contact_enquiries from anon, authenticated;
grant insert on table public.equipment_enquiries to anon, authenticated;
grant insert on table public.contact_enquiries to anon, authenticated;

drop policy if exists "Public can submit equipment enquiries" on public.equipment_enquiries;
create policy "Public can submit equipment enquiries"
on public.equipment_enquiries
for insert
to anon, authenticated
with check (
    status = 'new' and
    char_length(trim(product_name)) between 1 and 200 and
    char_length(trim(first_name)) between 1 and 100 and
    char_length(trim(last_name)) between 1 and 100 and
    char_length(trim(email)) between 3 and 320 and
    char_length(trim(phone)) between 3 and 60
);

drop policy if exists "Public can submit contact enquiries" on public.contact_enquiries;
create policy "Public can submit contact enquiries"
on public.contact_enquiries
for insert
to anon, authenticated
with check (
    status = 'new' and
    char_length(trim(name)) between 1 and 200 and
    char_length(trim(email)) between 3 and 320 and
    char_length(trim(phone)) between 3 and 60
);
