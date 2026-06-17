update plantas set imagen = regexp_replace(imagen, '\s+', '', 'g');

update plantas set descripcion = regexp_replace(descripcion, '\s*\n\s*', ' ', 'g');

update plantas set guia_cuidado = jsonb_build_object(
  'riego', regexp_replace(guia_cuidado->>'riego', '\s*\n\s*', ' ', 'g'),
  'luz', regexp_replace(guia_cuidado->>'luz', '\s*\n\s*', ' ', 'g'),
  'temperatura', regexp_replace(guia_cuidado->>'temperatura', '\s*\n\s*', ' ', 'g'),
  'tips', regexp_replace(guia_cuidado->>'tips', '\s*\n\s*', ' ', 'g')
);
