import { defineConfig } from '@supabase/mcp';

export default defineConfig({
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseKey: process.env.VITE_SUPABASE_ANON_KEY,
  modelsDir: './src/db/models',
  migrationsDir: './src/db/migrations',
  autoMigrate: true,
  generateTypes: true,
  typesOutputDir: './src/db/types'
}); 