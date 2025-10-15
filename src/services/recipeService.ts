import { supabase, Recipe, Ingredient, RecipeIngredient } from '../lib/supabase';

export interface RecipeWithIngredients extends Recipe {
  recipe_ingredients: (RecipeIngredient & { ingredients: Ingredient })[];
}

export interface RecipeFilters {
  difficulty?: string[];
  maxTime?: number;
  minTime?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  cuisines?: string[];
  searchQuery?: string;
}

export class RecipeService {
  static async getAllRecipes(): Promise<RecipeWithIngredients[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          *,
          ingredients (*)
        )
      `)
      .order('name');

    if (error) throw error;
    return data as RecipeWithIngredients[];
  }

  static async getRecipeById(id: string): Promise<RecipeWithIngredients | null> {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          *,
          ingredients (*)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as RecipeWithIngredients | null;
  }

  static async getRecipesByIngredients(ingredientNames: string[]): Promise<RecipeWithIngredients[]> {
    const normalizedNames = ingredientNames.map(name => name.toLowerCase().trim());

    const { data: ingredients, error: ingError } = await supabase
      .from('ingredients')
      .select('id, name')
      .in('name', normalizedNames);

    if (ingError) throw ingError;
    if (!ingredients || ingredients.length === 0) return [];

    const ingredientIds = ingredients.map(ing => ing.id);

    const { data: recipeIngredients, error: recipeIngError } = await supabase
      .from('recipe_ingredients')
      .select('recipe_id')
      .in('ingredient_id', ingredientIds);

    if (recipeIngError) throw recipeIngError;
    if (!recipeIngredients || recipeIngredients.length === 0) return [];

    const recipeIdCounts = recipeIngredients.reduce((acc, ri) => {
      acc[ri.recipe_id] = (acc[ri.recipe_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const rankedRecipeIds = Object.entries(recipeIdCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => id);

    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          *,
          ingredients (*)
        )
      `)
      .in('id', rankedRecipeIds);

    if (recipesError) throw recipesError;

    const sortedRecipes = rankedRecipeIds
      .map(id => recipes?.find(r => r.id === id))
      .filter(Boolean) as RecipeWithIngredients[];

    return sortedRecipes;
  }

  static async filterRecipes(
    recipes: RecipeWithIngredients[],
    filters: RecipeFilters
  ): Promise<RecipeWithIngredients[]> {
    return recipes.filter(recipe => {
      if (filters.difficulty && filters.difficulty.length > 0) {
        if (!filters.difficulty.includes(recipe.difficulty)) return false;
      }

      if (filters.maxTime && recipe.total_time > filters.maxTime) return false;
      if (filters.minTime && recipe.total_time < filters.minTime) return false;

      if (filters.isVegetarian && !recipe.is_vegetarian) return false;
      if (filters.isVegan && !recipe.is_vegan) return false;
      if (filters.isGlutenFree && !recipe.is_gluten_free) return false;
      if (filters.isDairyFree && !recipe.is_dairy_free) return false;

      if (filters.cuisines && filters.cuisines.length > 0) {
        if (!filters.cuisines.includes(recipe.cuisine)) return false;
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const nameMatch = recipe.name.toLowerCase().includes(query);
        const descMatch = recipe.description.toLowerCase().includes(query);
        const cuisineMatch = recipe.cuisine.toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !cuisineMatch) return false;
      }

      return true;
    });
  }

  static async getAllIngredients(): Promise<Ingredient[]> {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  static calculateMatchPercentage(recipe: RecipeWithIngredients, selectedIngredients: string[]): number {
    if (!recipe.recipe_ingredients || recipe.recipe_ingredients.length === 0) return 0;

    const recipeIngredientNames = recipe.recipe_ingredients
      .map(ri => ri.ingredients?.name.toLowerCase())
      .filter(Boolean);

    const selectedLower = selectedIngredients.map(ing => ing.toLowerCase());

    const matchCount = recipeIngredientNames.filter(name =>
      selectedLower.some(selected =>
        name?.includes(selected) || selected.includes(name || '')
      )
    ).length;

    return Math.round((matchCount / recipeIngredientNames.length) * 100);
  }

  static getMissingIngredients(recipe: RecipeWithIngredients, selectedIngredients: string[]): Ingredient[] {
    if (!recipe.recipe_ingredients) return [];

    const selectedLower = selectedIngredients.map(ing => ing.toLowerCase());

    return recipe.recipe_ingredients
      .filter(ri => {
        const ingredientName = ri.ingredients?.name.toLowerCase();
        return !selectedLower.some(selected =>
          ingredientName?.includes(selected) || selected.includes(ingredientName || '')
        );
      })
      .map(ri => ri.ingredients)
      .filter(Boolean) as Ingredient[];
  }

  static async rateRecipe(recipeId: string, userId: string, rating: number, review?: string): Promise<void> {
    const { error } = await supabase
      .from('user_ratings')
      .upsert({
        recipe_id: recipeId,
        user_id: userId,
        rating,
        review
      });

    if (error) throw error;
  }

  static async toggleFavorite(recipeId: string, userId: string): Promise<boolean> {
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('recipe_id', recipeId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_favorites')
        .delete()
        .eq('id', existing.id);
      return false;
    } else {
      await supabase
        .from('user_favorites')
        .insert({
          recipe_id: recipeId,
          user_id: userId
        });
      return true;
    }
  }

  static async getUserFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('recipe_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data.map(f => f.recipe_id);
  }

  static async getUserRatings(userId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('user_ratings')
      .select('recipe_id, rating')
      .eq('user_id', userId);

    if (error) throw error;

    const ratings: Record<string, number> = {};
    data.forEach(r => {
      ratings[r.recipe_id] = r.rating;
    });
    return ratings;
  }

  static getRecommendations(
    allRecipes: RecipeWithIngredients[],
    favoriteRecipeIds: string[],
    userRatings: Record<string, number>
  ): RecipeWithIngredients[] {
    if (favoriteRecipeIds.length === 0 && Object.keys(userRatings).length === 0) {
      return allRecipes
        .sort((a, b) => (b.average_rating * b.rating_count) - (a.average_rating * a.rating_count))
        .slice(0, 6);
    }

    const favoriteRecipes = allRecipes.filter(r => favoriteRecipeIds.includes(r.id));
    const highlyRatedRecipes = allRecipes.filter(r => userRatings[r.id] >= 4);

    const preferredRecipes = [...favoriteRecipes, ...highlyRatedRecipes];

    const cuisineScores: Record<string, number> = {};
    const difficultyScores: Record<string, number> = {};

    preferredRecipes.forEach(recipe => {
      cuisineScores[recipe.cuisine] = (cuisineScores[recipe.cuisine] || 0) + 1;
      difficultyScores[recipe.difficulty] = (difficultyScores[recipe.difficulty] || 0) + 1;
    });

    const recommendations = allRecipes
      .filter(recipe => !favoriteRecipeIds.includes(recipe.id))
      .map(recipe => {
        let score = recipe.average_rating * 10;

        if (cuisineScores[recipe.cuisine]) {
          score += cuisineScores[recipe.cuisine] * 20;
        }

        if (difficultyScores[recipe.difficulty]) {
          score += difficultyScores[recipe.difficulty] * 10;
        }

        return { recipe, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.recipe);

    return recommendations;
  }
}
