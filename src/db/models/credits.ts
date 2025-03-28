import { defineModel } from '@supabase/mcp';

export const UserCredits = defineModel({
  name: 'user_credits',
  schema: {
    user_id: 'string',
    credit_balance: 'number',
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

export const CreditLogs = defineModel({
  name: 'credit_logs',
  schema: {
    id: 'uuid',
    user_id: 'string',
    action_type: 'enum:preview,vectorize',
    credits_used: 'number',
    timestamp: 'timestamp',
    created_at: 'timestamp'
  },
  relations: {
    user: {
      type: 'belongsTo',
      model: 'users',
      foreignKey: 'user_id'
    }
  }
}); 