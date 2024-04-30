import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fsshylqdzfplnqrumnqs.supabase.co";
const supabaseKey: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzc2h5bHFkemZwbG5xcnVtbnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0NTU5ODQsImV4cCI6MjAzMDAzMTk4NH0.c7vluPhx_yCzVPVsV4IYh3TX_Yaa1Moyi5YC_RPVAno";
export const supabase = createClient(supabaseUrl, supabaseKey);
