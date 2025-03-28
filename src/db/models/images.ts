import { defineModel } from '@supabase/mcp';

export const Images = defineModel({
  name: 'images',
  schema: {
    id: 'uuid',
    user_id: 'string',
    path: 'string',
    original_name: 'string',
    mime_type: 'string',
    size: 'number',
    created_at: 'timestamp',
    updated_at: 'timestamp'
  },
  relations: {
    user: {
      type: 'belongsTo',
      model: 'users',
      foreignKey: 'user_id'
    }
  }
}); 