-- Seed data for local development
-- This file is automatically run when you reset the database with `supabase db reset`

-- Insert sample actions
INSERT INTO public.action (name, description, type, level, created_at)
VALUES
  ('Daily Stretches', NULL, 1, 1, NOW()),
  ('50+ Push-ups', NULL, 1, 1, NOW()),
  ('100 Squats', NULL, 1, 1, NOW()),
  ('Yoga Session', NULL, 1, 1, NOW()),
  ('30min Workout', NULL, 1, 2, NOW()),
  ('Handstand Practice', NULL, 1, 2, NOW()),
  ('20min Jump Rope', NULL, 1, 2, NOW()),
  ('Sporty Activity', 'Snowboarding, Hiking, PingPong, etc.', 1, 3, NOW()),
  ('Cycling', NULL, 1, 4, NOW()),
  ('Laboratorium Workout', NULL, 1, 4, NOW()),
  ('Extensive Sport Activity', 'E.g Cycling +80km, BJJ Sparring', 1, 5, NOW()),
  ('Sweets', NULL, 2, 1, NOW()),
  ('Smoking', NULL, 2, 2, NOW()),
  ('Party', NULL, 2, 4, NOW()),
  ('Learning Session', NULL, 3, 2, NOW())
ON CONFLICT DO NOTHING;

-- Insert sample habits (linked to actions)
INSERT INTO public.habit (action_id, note, completed_at, created_at)
VALUES
  ((SELECT id FROM public.action WHERE name = 'Daily Stretches' LIMIT 1), 'Morning routine', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 day'),
  ((SELECT id FROM public.action WHERE name = '50+ Push-ups' LIMIT 1), 'Did 55 push-ups', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM public.action WHERE name = '100 Squats' LIMIT 1), 'Completed all sets', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 day'),
  ((SELECT id FROM public.action WHERE name = 'Yoga Session' LIMIT 1), '30 min session', NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM public.action WHERE name = '30min Workout' LIMIT 1), 'Full body workout', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '1 day'),
  ((SELECT id FROM public.action WHERE name = 'Handstand Practice' LIMIT 1), 'Practiced for 15 min', NULL, NOW() - INTERVAL '4 days'),
  ((SELECT id FROM public.action WHERE name = '20min Jump Rope' LIMIT 1), 'Great cardio session', NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM public.action WHERE name = 'Sporty Activity' LIMIT 1), 'Went hiking in the mountains', NOW() - INTERVAL '3 days', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM public.action WHERE name = 'Cycling' LIMIT 1), 'Rode 25km', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM public.action WHERE name = 'Laboratorium Workout' LIMIT 1), 'Intense session', NULL, NOW() - INTERVAL '6 days'),
  ((SELECT id FROM public.action WHERE name = 'Extensive Sport Activity' LIMIT 1), 'Cycled 85km today!', NOW() - INTERVAL '2 days', NOW() - INTERVAL '7 days'),
  ((SELECT id FROM public.action WHERE name = 'Sweets' LIMIT 1), 'Had a piece of cake', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM public.action WHERE name = 'Smoking' LIMIT 1), NULL, NULL, NOW() - INTERVAL '10 days'),
  ((SELECT id FROM public.action WHERE name = 'Party' LIMIT 1), 'Birthday party', NOW() - INTERVAL '5 days', NOW() - INTERVAL '8 days'),
  ((SELECT id FROM public.action WHERE name = 'Learning Session' LIMIT 1), 'Studied TypeScript advanced patterns', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

