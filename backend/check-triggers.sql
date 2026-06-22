-- Find all triggers on users and wallets tables
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('users', 'wallets');

-- Find all unique constraints
SELECT conname, contype, conrelid::regclass
FROM pg_constraint
WHERE conrelid::regclass::text IN ('users', 'wallets')
AND contype IN ('u', 'p');
