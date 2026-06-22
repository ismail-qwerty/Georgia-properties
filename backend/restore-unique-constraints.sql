-- Restore unique constraints dropped during UUID-to-integer migration
-- Run this in Supabase SQL Editor

ALTER TABLE users ADD CONSTRAINT users_reference_code_key UNIQUE (reference_code);
ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
