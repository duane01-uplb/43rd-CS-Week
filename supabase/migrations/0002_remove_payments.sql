-- Payments feature descoped (see /agents/DECISIONS.md).
-- Reverts the payment-related parts of 0001_init.sql.
-- Run via: supabase db push

drop table if exists payments cascade;

alter table events drop column if exists is_paid;
alter table events drop column if exists fee_amount;
