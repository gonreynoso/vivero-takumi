alter table profiles add column if not exists apellido text;
alter table profiles add column if not exists telefono text;
alter table profiles add column if not exists direccion text;
alter table profiles add column if not exists ciudad text;
alter table profiles add column if not exists dni text;
create or replace function public.handle_new_user() returns trigger as $$ begin insert into public.profiles (id, nombre, apellido, email, telefono, direccion, ciudad, dni, rol) values (new.id, coalesce(new.raw_user_meta_data->>'nombre', new.email), new.raw_user_meta_data->>'apellido', new.email, new.raw_user_meta_data->>'telefono', new.raw_user_meta_data->>'direccion', new.raw_user_meta_data->>'ciudad', new.raw_user_meta_data->>'dni', 'cliente'); return new; end; $$ language plpgsql security definer set search_path = public;
