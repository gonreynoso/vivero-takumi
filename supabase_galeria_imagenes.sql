alter table plantas add column if not exists imagenes jsonb not null default '[]'::jsonb;
