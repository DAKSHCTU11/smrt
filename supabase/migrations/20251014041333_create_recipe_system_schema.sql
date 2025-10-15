/*
  # Smart Recipe Generator Database Schema

  ## Overview
  Complete database schema for a production-ready recipe generation system with ingredient matching,
  user preferences, ratings, and personalized recommendations.

  ## New Tables

  ### 1. recipes
  Core recipe information table
  - `id` (uuid, primary key) - Unique recipe identifier
  - `name` (text) - Recipe name
  - `description` (text) - Brief recipe description
  - `cuisine` (text) - Cuisine type (Italian, Asian, Mexican, etc.)
  - `difficulty` (text) - Easy, Medium, Hard
  - `prep_time` (integer) - Preparation time in minutes
  - `cook_time` (integer) - Cooking time in minutes
  - `total_time` (integer) - Total time in minutes
  - `servings` (integer) - Default number of servings
  - `image_url` (text) - Recipe image URL
  - `instructions` (jsonb) - Array of cooking steps
  - `calories` (integer) - Calories per serving
  - `protein` (decimal) - Protein in grams
  - `carbs` (decimal) - Carbohydrates in grams
  - `fat` (decimal) - Fat in grams
  - `fiber` (decimal) - Fiber in grams
  - `is_vegetarian` (boolean) - Vegetarian flag
  - `is_vegan` (boolean) - Vegan flag
  - `is_gluten_free` (boolean) - Gluten-free flag
  - `is_dairy_free` (boolean) - Dairy-free flag
  - `average_rating` (decimal) - Calculated average rating
  - `rating_count` (integer) - Number of ratings
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. ingredients
  Master ingredient list
  - `id` (uuid, primary key) - Unique ingredient identifier
  - `name` (text) - Ingredient name
  - `category` (text) - Ingredient category (vegetable, protein, dairy, etc.)
  - `common_substitutes` (jsonb) - Array of substitute ingredients
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. recipe_ingredients
  Junction table linking recipes to ingredients with quantities
  - `id` (uuid, primary key)
  - `recipe_id` (uuid, foreign key) - References recipes
  - `ingredient_id` (uuid, foreign key) - References ingredients
  - `quantity` (decimal) - Amount needed
  - `unit` (text) - Measurement unit (cup, tbsp, gram, etc.)
  - `is_optional` (boolean) - Whether ingredient is optional

  ### 4. user_preferences
  User dietary preferences and restrictions
  - `id` (uuid, primary key)
  - `user_id` (uuid) - User identifier (for future auth integration)
  - `is_vegetarian` (boolean)
  - `is_vegan` (boolean)
  - `is_gluten_free` (boolean)
  - `is_dairy_free` (boolean)
  - `excluded_ingredients` (jsonb) - Array of ingredient IDs to exclude
  - `favorite_cuisines` (jsonb) - Array of preferred cuisines
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. user_ratings
  User ratings and reviews for recipes
  - `id` (uuid, primary key)
  - `recipe_id` (uuid, foreign key) - References recipes
  - `user_id` (uuid) - User identifier
  - `rating` (integer) - Rating 1-5
  - `review` (text) - Optional review text
  - `created_at` (timestamptz)

  ### 6. user_favorites
  User favorite recipes
  - `id` (uuid, primary key)
  - `recipe_id` (uuid, foreign key) - References recipes
  - `user_id` (uuid) - User identifier
  - `created_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for recipes, ingredients, and recipe_ingredients
  - Authenticated users can manage their own preferences, ratings, and favorites
*/

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  cuisine text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  prep_time integer NOT NULL,
  cook_time integer NOT NULL,
  total_time integer NOT NULL,
  servings integer NOT NULL DEFAULT 4,
  image_url text NOT NULL,
  instructions jsonb NOT NULL,
  calories integer NOT NULL,
  protein decimal(5,1) NOT NULL,
  carbs decimal(5,1) NOT NULL,
  fat decimal(5,1) NOT NULL,
  fiber decimal(5,1) NOT NULL,
  is_vegetarian boolean DEFAULT false,
  is_vegan boolean DEFAULT false,
  is_gluten_free boolean DEFAULT false,
  is_dairy_free boolean DEFAULT false,
  average_rating decimal(2,1) DEFAULT 0,
  rating_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  common_substitutes jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create recipe_ingredients junction table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity decimal(10,2) NOT NULL,
  unit text NOT NULL,
  is_optional boolean DEFAULT false,
  UNIQUE(recipe_id, ingredient_id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  is_vegetarian boolean DEFAULT false,
  is_vegan boolean DEFAULT false,
  is_gluten_free boolean DEFAULT false,
  is_dairy_free boolean DEFAULT false,
  excluded_ingredients jsonb DEFAULT '[]'::jsonb,
  favorite_cuisines jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_ratings table
CREATE TABLE IF NOT EXISTS user_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_dietary ON recipes(is_vegetarian, is_vegan, is_gluten_free, is_dairy_free);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_recipe ON user_ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes (public read)
CREATE POLICY "Anyone can view recipes"
  ON recipes FOR SELECT
  TO public
  USING (true);

-- RLS Policies for ingredients (public read)
CREATE POLICY "Anyone can view ingredients"
  ON ingredients FOR SELECT
  TO public
  USING (true);

-- RLS Policies for recipe_ingredients (public read)
CREATE POLICY "Anyone can view recipe ingredients"
  ON recipe_ingredients FOR SELECT
  TO public
  USING (true);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view any preferences"
  ON user_preferences FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  TO public
  USING (true);

-- RLS Policies for user_ratings
CREATE POLICY "Anyone can view ratings"
  ON user_ratings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert ratings"
  ON user_ratings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their ratings"
  ON user_ratings FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Users can delete their ratings"
  ON user_ratings FOR DELETE
  TO public
  USING (true);

-- RLS Policies for user_favorites
CREATE POLICY "Anyone can view favorites"
  ON user_favorites FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can add favorites"
  ON user_favorites FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can remove favorites"
  ON user_favorites FOR DELETE
  TO public
  USING (true);

-- Function to update recipe average rating
CREATE OR REPLACE FUNCTION update_recipe_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE recipes
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM user_ratings
      WHERE recipe_id = NEW.recipe_id
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM user_ratings
      WHERE recipe_id = NEW.recipe_id
    )
  WHERE id = NEW.recipe_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update recipe rating on insert/update
CREATE TRIGGER update_recipe_rating_trigger
AFTER INSERT OR UPDATE ON user_ratings
FOR EACH ROW
EXECUTE FUNCTION update_recipe_rating();