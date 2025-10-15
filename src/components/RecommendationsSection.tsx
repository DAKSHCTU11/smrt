import { Sparkles } from 'lucide-react';
import { RecipeWithIngredients } from '../services/recipeService';
import { RecipeService } from '../services/recipeService';
import { RecipeCard } from './RecipeCard';

interface Props {
  allRecipes: RecipeWithIngredients[];
  favoriteIds: string[];
  userRatings: Record<string, number>;
  onRecipeClick: (recipe: RecipeWithIngredients) => void;
  onToggleFavorite: (recipeId: string) => void;
}

export function RecommendationsSection({
  allRecipes,
  favoriteIds,
  userRatings,
  onRecipeClick,
  onToggleFavorite
}: Props) {
  const recommendations = RecipeService.getRecommendations(allRecipes, favoriteIds, userRatings);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recommended For You</h2>
          <p className="text-sm text-slate-600">Based on your favorites and ratings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            selectedIngredients={[]}
            onClick={() => onRecipeClick(recipe)}
            isFavorite={favoriteIds.includes(recipe.id)}
            onToggleFavorite={onToggleFavorite}
            showMatchPercentage={false}
          />
        ))}
      </div>
    </div>
  );
}
