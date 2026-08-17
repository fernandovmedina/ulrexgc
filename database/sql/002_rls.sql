create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists(select 1 from profiles where id = auth.uid() and role = 'admin') $$;

do $$ declare table_name text; begin
  foreach table_name in array array['profiles','clients','leads','opportunities','activities','quotes','quote_items','products','invoices','invoice_items','calendar_events','team_members','settings']
  loop
    execute format('alter table %I enable row level security', table_name);
    execute format('create policy admin_all on %I for all to authenticated using (public.is_admin()) with check (public.is_admin())', table_name);
    execute format('grant all on %I to authenticated', table_name);
  end loop;
end $$;

create policy anonymous_lead_intake on leads for insert to anon with check (
  status = 'new' and assigned_to is null and source = 'website'
);
grant insert on leads to anon;
