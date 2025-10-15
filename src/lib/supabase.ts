import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  image_url: string;
  instructions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  average_rating: number;
  rating_count: number;
  created_at: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  common_substitutes: string[];
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  is_optional: boolean;
  ingredients?: Ingredient;
}

export interface UserPreference {
  id: string;
  user_id: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  excluded_ingredients: string[];
  favorite_cuisines: string[];
}

export interface UserRating {
  id: string;
  recipe_id: string;
  user_id: string;
  rating: number;
  review?: string;
  created_at: string;
}

export interface UserFavorite {
  id: string;
  recipe_id: string;
  user_id: string;
  created_at: string;
}
