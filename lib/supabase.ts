import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vmzqgtstmtypihqzfryk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtenFndHN0bXR5cGlocXpmcnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyOTg2NjEsImV4cCI6MjA0MTg3NDY2MX0.YFPaADazz8hWfzJid5bxTYD2M4_X6KnxRco_VzLagtA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

