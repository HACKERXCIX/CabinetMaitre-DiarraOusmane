// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cilgrnwuahufkyftyjnt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbGdybnd1YWh1Zmt5ZnR5am50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMzEyMTQsImV4cCI6MjA0ODkwNzIxNH0.6A2o9a6PR4spP-hAtUu3iIR2LWWwCEJTtR_AdHiDbsQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);