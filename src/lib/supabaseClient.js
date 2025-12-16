
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export const getCardRating = async (cardId) => {
  const { data, error } = await supabase
    .from('card_ratings')
    .select('rating')
    .eq('card_id', cardId);

  if (error) return { count: 0, average: 0 };

  const count = data.length;
  const total = data.reduce((acc, curr) => acc + curr.rating, 0);
  const average = count > 0 ? (total / count).toFixed(1) : 0;

  return { count, average };
};

export const addRating = async (cardId, userId, rating) => {
  const { data, error } = await supabase
    .from('card_ratings')
    .upsert(
      { card_id: cardId, user_id: userId, rating },
      { onConflict: 'card_id, user_id' }
    )
    .select();

  return { data, error };
};
