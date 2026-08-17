insert into auth.users (id, email, encrypted_password) values
  ('00000000-0000-0000-0000-000000000001', 'admin@ulrexgc.com', 'LOCAL_DEVELOPMENT_ONLY');
insert into profiles (id, email, full_name, role) values
  ('00000000-0000-0000-0000-000000000001', 'admin@ulrexgc.com', 'Ulrex Admin', 'admin');

insert into leads (service_line, project_details, property_type, property_address, timeline, budget, first_name, last_name, email, phone, preferred_contact, status, source, language, created_at) values
  ('residential_remodeling_additions', 'Kitchen layout update and finish planning.', 'residential', 'San Antonio, TX', '1_3_months', '50k_100k', 'Demo', 'Homeowner', 'demo.homeowner@example.test', '(210) 555-0101', 'email', 'new', 'website', 'en', now() - interval '1 day'),
  ('commercial_construction', 'Tenant improvement planning for an operating retail space.', 'commercial', 'San Antonio, TX', '3_6_months', '100k_250k', 'Demo', 'Property Manager', 'demo.manager@example.test', '(210) 555-0102', 'phone', 'qualified', 'referral', 'en', now() - interval '8 days'),
  ('roofing_exterior_restoration', 'Evaluación de daños exteriores después de una tormenta.', 'residential', 'New Braunfels, TX', 'asap', '10k_25k', 'Cliente', 'Demostración', 'cliente.demo@example.test', '(210) 555-0103', 'phone', 'contacted', 'website', 'es', now() - interval '3 days');

insert into settings (id, business_name, email, phone, address, service_area, currency, tax_rate, quote_prefix, invoice_prefix, quote_validity_days) values
  ('workspace-settings', 'Ulrex General Contracting', 'info@ulrexgc.com', '+1 (210) 956-7200', 'San Antonio, Texas', 'San Antonio metro, nearby Hill Country, and the I-35 corridor', 'USD', 8.25, 'Q-', 'INV-', 30);
