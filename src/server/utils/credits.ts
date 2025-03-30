import { supabase } from '../../lib/supabase';

export async function checkAndDeductCredits(
  userId: string,
  amount: number,
  description: string
): Promise<boolean> {
  try {
    // Start a transaction
    const { data: credit, error: creditError } = await supabase
      .from('user_credits')
      .select('credit_balance, free_previews')
      .eq('user_id', userId)
      .single();

    if (creditError || !credit) {
      console.error('Error checking credits:', creditError);
      return false;
    }

    // Check if user has enough credits
    if (credit.credit_balance < amount) {
      return false;
    }

    // Deduct credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credit_balance: credit.credit_balance - amount })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return false;
    }

    // Record transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'vectorize',
        credits_amount: amount,
        status: 'completed',
        description
      });

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // Rollback credit deduction
      await supabase
        .from('user_credits')
        .update({ credit_balance: credit.credit_balance })
        .eq('user_id', userId);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in checkAndDeductCredits:', error);
    return false;
  }
}

export async function addCredits(
  userId: string,
  amount: number,
  description: string
): Promise<boolean> {
  try {
    // Start a transaction
    const { data: credit, error: creditError } = await supabase
      .from('user_credits')
      .select('credit_balance')
      .eq('user_id', userId)
      .single();

    if (creditError && creditError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking credits:', creditError);
      return false;
    }

    const currentAmount = credit?.credit_balance || 0;

    // Add credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .upsert({
        user_id: userId,
        credit_balance: currentAmount + amount
      });

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return false;
    }

    // Record transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'purchase',
        credits_amount: amount,
        status: 'completed',
        description
      });

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // Rollback credit addition
      await supabase
        .from('user_credits')
        .update({ credit_balance: currentAmount })
        .eq('user_id', userId);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addCredits:', error);
    return false;
  }
} 