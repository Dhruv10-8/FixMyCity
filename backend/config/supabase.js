const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv')

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is missing in .env file");
}

// Client for interacting with Supabase Storage (using Anon Key)
const supabase = createClient(supabaseUrl, supabaseAnonKey);
module.exports = supabase

console.log('Supabase client initialized for Storage.');