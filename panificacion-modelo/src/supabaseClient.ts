// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nklpcjstxefloiklvetm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rbHBjanN0eGVmbG9pa2x2ZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTU4ODUsImV4cCI6MjA2NjUzMTg4NX0.BJwz04XUoK16wDAFuB_Lvl5ujYZu8Yi8vKxdEWd1ZDM";
export const supabase = createClient(supabaseUrl, supabaseKey);
