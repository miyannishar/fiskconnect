-- Run this in Supabase SQL Editor AFTER at least one alumni has signed up and completed onboarding.
-- This seeds opportunities, announcements, events, and donations for demo purposes.

-- Opportunities (8)
INSERT INTO public.opportunities (author_id, title, description, type, company, location, is_remote, link, status)
SELECT p.id, 'Software Engineering Intern', 'Summer internship for CS students. Work on real products alongside our engineering team.', 'internship', 'Tech Corp', 'Nashville, TN', false, 'https://example.com/apply', 'open'
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.opportunities (author_id, title, description, type, company, location, is_remote, status)
SELECT p.id, 'Data Analyst – Full Time', 'Entry-level data analyst role. SQL and Excel required.', 'job', 'DataCo', 'Remote', true, 'open'
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.opportunities (author_id, title, description, type, company, location, is_remote, status)
SELECT p.id, 'Research Assistant – Biology', 'Assist with lab research and data collection.', 'research', 'Fisk University', 'Nashville, TN', false, 'open'
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.opportunities (author_id, title, description, type, company, location, is_remote, status)
SELECT p.id, 'Community Volunteer – Tutoring', 'Tutor local high school students in math and science.', 'volunteer', 'Community Center', 'Nashville, TN', false, 'open'
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.opportunities (author_id, title, description, type, company, location, is_remote, status)
SELECT p.id, 'Product Management Intern', 'Learn product development and user research.', 'internship', 'StartupXYZ', 'Remote', true, 'open'
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.opportunities (author_id, title, description, type, company, location, is_remote, status)
SELECT p.id, 'Marketing Coordinator', 'Support marketing campaigns and social media.', 'job', 'Marketing Co', 'Nashville, TN', false, 'open'
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.opportunities (author_id, title, description, type, company, location, is_remote, status)
SELECT p.id, 'Open Source Project – Contribute', 'Contribute to an open-source project with mentor support.', 'project', 'Open Source', 'Remote', true, 'open'
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.opportunities (author_id, title, description, type, company, location, is_remote, status)
SELECT p.id, 'Finance Intern – Summer', 'Shadow analysts and learn financial modeling.', 'internship', 'Finance Group', 'Nashville, TN', false, 'open'
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;

-- Announcements (3)
INSERT INTO public.announcements (author_id, title, content, audience, pinned)
SELECT p.id, 'Welcome to FiskConnect', 'We are excited to have you here. Use this platform to find opportunities, connect with alumni, and stay in touch with Fisk.', 'all', true
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.announcements (author_id, title, content, audience, pinned)
SELECT p.id, 'Career Fair 2026', 'Save the date: Our annual career fair will be held in March. More details to follow.', 'students', false
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.announcements (author_id, title, content, audience, pinned)
SELECT p.id, 'Alumni Giving Campaign', 'Thank you to everyone who has given back. Your support helps current students succeed.', 'alumni', false
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;

-- Events (3)
INSERT INTO public.events (organizer_id, title, description, event_type, date, location, is_virtual, status)
SELECT p.id, 'Networking Mixer', 'Connect with alumni and peers over light refreshments.', 'event', (now() + interval '14 days'), 'Fisk Campus', false, 'pending'
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.events (organizer_id, title, description, event_type, date, location, is_virtual, status)
SELECT p.id, 'Tech Career Workshop', 'Resume review and interview tips from industry alumni.', 'workshop', (now() + interval '7 days'), 'Virtual', true, 'approved'
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.events (organizer_id, title, description, event_type, date, location, is_virtual, status)
SELECT p.id, 'Alumni Panel – Leadership', 'Hear from Fisk alumni in leadership roles.', 'event', (now() + interval '21 days'), 'Auditorium', false, 'approved'
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;

-- Donations (5)
INSERT INTO public.donations (donor_id, amount, purpose, message, is_anonymous)
SELECT p.id, 50.00, 'scholarships', 'Happy to support.', false
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.donations (donor_id, amount, purpose, message, is_anonymous)
SELECT p.id, 100.00, 'general', null, false
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.donations (donor_id, amount, purpose, message, is_anonymous)
SELECT p.id, 25.00, 'student emergency fund', 'For students in need.', true
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.donations (donor_id, amount, purpose, message, is_anonymous)
SELECT p.id, 200.00, 'campus improvements', null, false
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
INSERT INTO public.donations (donor_id, amount, purpose, message, is_anonymous)
SELECT p.id, 75.00, 'scholarships', 'In memory of my time at Fisk.', false
FROM public.profiles p WHERE p.role = 'alumni' LIMIT 1;
