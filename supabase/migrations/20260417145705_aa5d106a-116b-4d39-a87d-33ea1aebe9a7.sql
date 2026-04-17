create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'lobby-cleanup-hourly',
  '0 * * * *',
  $$select net.http_post(
    url:='https://gkglmxjpdlvzlhronrjj.supabase.co/functions/v1/lobby-cleanup',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrZ2xteGpwZGx2emxocm9ucmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzQ4MzMsImV4cCI6MjA5MDgxMDgzM30.coWaeQzjVnA2wkG0_J8fiePfGYFAwtr0S_YPzhTYW_c"}'::jsonb,
    body:='{}'::jsonb
  );$$
);