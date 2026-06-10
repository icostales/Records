const SUPABASE_URL =
'https://vyznlqkvedbnoehguwuq.supabase.co';

const SUPABASE_ANON_KEY =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5em5scWt2ZWRibm9laGd1d3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NzY2MzksImV4cCI6MjA5NTM1MjYzOX0.0awPFhM-E0KVi4LmwgErOvIl7yIL9RXAHGyzOGq7nco';

const supabaseClient =
supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);