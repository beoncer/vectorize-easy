import { supabase } from '../../lib/supabase';

export async function checkAndDeductCredits(
  userId: string,
  amount: number,
  description: string
): Promise<boolean> {
  try {
    // Start a transaction
    const { data: credit, error: creditError } = await supabase
      .from('credits')
      .select('amount')
      .eq('user_id', userId)
      .single();

    if (creditError || !credit) {
      console.error('Error checking credits:', creditError);
      return false;
    }

    if (credit.amount < amount) {
      return false;
    }

    // Deduct credits
    const { error: updateError } = await supabase
      .from('credits')
      .update({ amount: credit.amount - amount })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return false;
    }

    // Record transaction
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: -amount,
        type: 'usage',
        description
      });

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // Rollback credit deduction
      await supabase
        .from('credits')
        .update({ amount: credit.amount })
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
      .from('credits')
      .select('amount')
      .eq('user_id', userId)
      .single();

    if (creditError && creditError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking credits:', creditError);
      return false;
    }

    const currentAmount = credit?.amount || 0;

    // Add credits
    const { error: updateError } = await supabase
      .from('credits')
      .upsert({
        user_id: userId,
        amount: currentAmount + amount
      });

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return false;
    }

    // Record transaction
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount,
        type: 'purchase',
        description
      });

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // Rollback credit addition
      await supabase
        .from('credits')
        .update({ amount: currentAmount })
        .eq('user_id', userId);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addCredits:', error);
    return false;
  }
} 