create table profiles (id uuid primary key references auth.users(id) on delete cascade, nombre text, email text, rol text not null default 'cliente');
alter table profiles enable row level security;
create policy "profiles_select_propio" on profiles for select using (auth.uid() = id);
insert into profiles (id, nombre, email, rol) values ('7c447bf2-5d12-4a69-9799-5cf19a023d4e', 'Gonzalo Reynoso', 'gonzalo.reynoso9@gmail.com', 'admin');
drop policy "categorias_escritura_abierta" on categorias;
drop policy "plantas_escritura_abierta" on plantas;
create policy "categorias_escritura_admin" on categorias for all using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.rol in ('admin','manager'))) with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.rol in ('admin','manager')));
create policy "plantas_escritura_admin" on plantas for all using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.rol in ('admin','manager'))) with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.rol in ('admin','manager')));
