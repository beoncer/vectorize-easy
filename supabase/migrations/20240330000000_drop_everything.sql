-- Drop everything using dynamic SQL to avoid errors
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop triggers
    FOR r IN (SELECT DISTINCT trigger_name, event_object_table 
              FROM information_schema.triggers 
              WHERE trigger_schema = 'public') 
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I CASCADE;',
            r.trigger_name,
            r.event_object_table);
    END LOOP;

    -- Drop functions
    FOR r IN (SELECT oid::regproc AS funcname 
              FROM pg_proc 
              WHERE pronamespace = 'public'::regnamespace)
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %s CASCADE;', r.funcname);
    END LOOP;

    -- Drop policies
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I;',
            r.policyname,
            r.schemaname,
            r.tablename);
    END LOOP;

    -- Disable RLS on all tables
    FOR r IN (SELECT tablename 
              FROM pg_tables 
              WHERE schemaname = 'public')
    LOOP
        EXECUTE format('ALTER TABLE IF EXISTS %I DISABLE ROW LEVEL SECURITY;', r.tablename);
    END LOOP;

    -- Drop all tables
    FOR r IN (SELECT tablename 
              FROM pg_tables 
              WHERE schemaname = 'public' 
              AND tablename != 'schema_migrations')
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I CASCADE;', r.tablename);
    END LOOP;
END $$; 