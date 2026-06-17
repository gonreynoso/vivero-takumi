-- 0. Limpieza por si quedó algo a medio crear de un intento anterior
drop table if exists plantas;
drop table if exists categorias;

-- 1. Tablas
create table categorias (
  nombre text primary key
);

create table plantas (
  id bigint generated always as identity primary key,
  nombre text not null,
  categoria text not null references categorias(nombre) on update cascade on delete restrict,
  precio numeric not null,
  stock integer not null default 0,
  imagen text,
  dificultad text not null,
  descripcion text,
  guia_cuidado jsonb,
  rating numeric,
  habilitada boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Seguridad: RLS habilitado, con políticas abiertas por ahora.
-- La app todavía no tiene autenticación real contra Supabase (es la próxima etapa de la migración),
-- así que esto deja el mismo nivel de seguridad que tenía la app hoy (el admin se valida solo en el cliente).
-- Cuando migremos el login a Supabase Auth, estas políticas se van a restringir por rol.
alter table categorias enable row level security;
alter table plantas enable row level security;

create policy "categorias_select_publico" on categorias for select using (true);
create policy "categorias_escritura_abierta" on categorias for all using (true) with check (true);

create policy "plantas_select_publico" on plantas for select using (true);
create policy "plantas_escritura_abierta" on plantas for all using (true) with check (true);

-- 3. Datos semilla (migrados de data/categorias.js y data/plantas.js)
insert into categorias (nombre) values
  ('Interior'), ('Exterior'), ('Suculentas'), ('Aromáticas'), ('Frutales');

insert into plantas (nombre, categoria, precio, stock, imagen, dificultad, descripcion, guia_cuidado, rating, habilitada) values
('Monstera Deliciosa', 'Interior', 4500, 12, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400', 'fácil',
 'Planta tropical de hojas grandes y recortadas, ideal para dar un toque jungla al interior del hogar.',
 jsonb_build_object('riego', 'Una vez por semana, dejando secar la tierra entre riegos.', 'luz', 'Luz indirecta brillante, evitar sol directo.', 'temperatura', '18°C a 27°C.', 'tips', 'Limpiar las hojas con un paño húmedo para que respiren mejor.'), 4.8, true),

('Potus', 'Interior', 2200, 20, 'https://images.unsplash.com/photo-1612363148951-15f16817648f?w=400', 'fácil',
 'Enredadera de hojas en forma de corazón, muy resistente y perfecta para principiantes.',
 jsonb_build_object('riego', 'Cada 7-10 días, tolera olvidos de riego.', 'luz', 'Se adapta a poca luz, prefiere luz indirecta.', 'temperatura', '15°C a 28°C.', 'tips', 'Podar las puntas para que crezca más frondosa.'), 4.5, true),

('Helecho Boston', 'Interior', 3200, 8, 'https://images.unsplash.com/photo-1497877164981-9c2afdf31e9e?w=400', 'media',
 'Helecho frondoso de follaje delicado, aporta frescura y humedad al ambiente.',
 jsonb_build_object('riego', 'Mantener el sustrato húmedo, sin encharcar.', 'luz', 'Luz indirecta media, evitar sol directo.', 'temperatura', '16°C a 24°C.', 'tips', 'Pulverizar agua sobre las hojas para aumentar la humedad ambiente.'), 4.3, true),

('Ficus Lyrata', 'Interior', 6800, 4, 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=400', 'media',
 'Conocido como higuera de hoja de violín, con hojas grandes y onduladas muy decorativas.',
 jsonb_build_object('riego', 'Cada 7 días en verano, espaciar en invierno.', 'luz', 'Luz indirecta intensa, cerca de una ventana.', 'temperatura', '18°C a 26°C.', 'tips', 'No mover de lugar seguido, le cuesta adaptarse a cambios.'), 4.6, true),

('Lavanda', 'Exterior', 1800, 15, 'https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400', 'fácil',
 'Arbusto aromático de flores violetas, ideal para jardines soleados y atraer abejas.',
 jsonb_build_object('riego', 'Escaso, solo cuando la tierra esté seca.', 'luz', 'Pleno sol, mínimo 6 horas diarias.', 'temperatura', '15°C a 30°C.', 'tips', 'Podar después de la floración para renovar el arbusto.'), 4.7, true),

('Rosal', 'Exterior', 3500, 10, 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=400', 'media',
 'Arbusto clásico de flores vistosas y perfumadas, disponible en varios colores.',
 jsonb_build_object('riego', 'Dos a tres veces por semana en épocas cálidas.', 'luz', 'Pleno sol directo.', 'temperatura', '12°C a 28°C.', 'tips', 'Fertilizar cada mes durante la temporada de floración.'), 4.4, true),

('Buganvilla', 'Exterior', 4200, 3, 'https://images.unsplash.com/photo-1637924925587-2551d0661c52?w=400', 'fácil',
 'Enredadera trepadora de brácteas coloridas, perfecta para cubrir muros y pérgolas.',
 jsonb_build_object('riego', 'Moderado, dejar secar entre riegos.', 'luz', 'Pleno sol.', 'temperatura', '18°C a 32°C.', 'tips', 'Florece más si se mantiene con un riego algo restringido.'), 4.2, true),

('Echeveria', 'Suculentas', 1200, 25, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400', 'fácil',
 'Suculenta en forma de roseta, de hojas carnosas y colores que van del verde al rosado.',
 jsonb_build_object('riego', 'Cada 2 semanas, dejar secar completamente el sustrato.', 'luz', 'Mucha luz, sol directo suave por la mañana.', 'temperatura', '10°C a 28°C.', 'tips', 'Usar sustrato bien drenado para evitar pudrición de raíces.'), 4.9, true),

('Cactus San Pedro', 'Suculentas', 2800, 2, 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400', 'fácil',
 'Cactus columnar de crecimiento rápido, muy resistente a la sequía.',
 jsonb_build_object('riego', 'Muy escaso, una vez al mes en invierno.', 'luz', 'Pleno sol.', 'temperatura', '15°C a 35°C.', 'tips', 'Evitar exceso de agua, es la principal causa de muerte de la planta.'), 4.6, true),

('Sedum Morado', 'Suculentas', 1500, 18, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', 'fácil',
 'Suculenta rastrera de tonos morados, ideal para macetas colgantes o bordes de jardín.',
 jsonb_build_object('riego', 'Cada 10 días aproximadamente.', 'luz', 'Sol directo a media sombra.', 'temperatura', '10°C a 30°C.', 'tips', 'Se propaga fácilmente por esquejes de hoja.'), 4.5, true),

('Albahaca', 'Aromáticas', 900, 30, 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400', 'fácil',
 'Hierba aromática indispensable en la cocina, de aroma intenso y fresco.',
 jsonb_build_object('riego', 'Frecuente, mantener el sustrato siempre húmedo.', 'luz', 'Luz solar directa varias horas al día.', 'temperatura', '18°C a 28°C.', 'tips', 'Cortar las flores apenas aparecen para que las hojas no pierdan sabor.'), 4.7, true),

('Romero', 'Aromáticas', 1100, 1, 'https://images.unsplash.com/photo-1632622337567-be3d44239805?w=400', 'media',
 'Arbusto aromático perenne, muy usado en gastronomía y de gran resistencia.',
 jsonb_build_object('riego', 'Escaso, tolera bien la sequía.', 'luz', 'Pleno sol.', 'temperatura', '10°C a 30°C.', 'tips', 'No tolera el exceso de humedad en las raíces.'), 4.3, true),

('Menta', 'Aromáticas', 850, 22, 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400', 'fácil',
 'Planta aromática de crecimiento rápido y expansivo, ideal para infusiones.',
 jsonb_build_object('riego', 'Frecuente, le gusta la humedad constante.', 'luz', 'Semisombra a sol parcial.', 'temperatura', '15°C a 26°C.', 'tips', 'Plantar en maceta aparte porque tiende a invadir el resto del jardín.'), 4.4, true),

('Limonero', 'Frutales', 7500, 6, 'https://images.unsplash.com/photo-1575574202227-6b68bd6e3f29?w=400', 'media',
 'Árbol frutal cítrico que produce limones aromáticos, apto para maceta grande o jardín.',
 jsonb_build_object('riego', 'Dos a tres veces por semana, sin encharcar.', 'luz', 'Pleno sol.', 'temperatura', '15°C a 30°C.', 'tips', 'Fertilizar en primavera y verano para favorecer la fructificación.'), 4.8, true),

('Frutilla', 'Frutales', 1600, 14, 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=400', 'media',
 'Planta baja de frutos rojos dulces, perfecta para macetas, jardineras o el suelo del huerto.',
 jsonb_build_object('riego', 'Frecuente, mantener humedad constante sin encharcar.', 'luz', 'Sol directo de 6 a 8 horas.', 'temperatura', '15°C a 26°C.', 'tips', 'Retirar los estolones si se quiere concentrar energía en los frutos.'), 4.6, true);
