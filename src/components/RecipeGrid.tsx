import { RecipeWithIngredients } from '../services/recipeService';
import { RecipeCard } from './RecipeCard';

interface Props {
  recipes: RecipeWithIngredients[];
  selectedIngredients: string[];
  onRecipeClick: (recipe: RecipeWithIngredients) => void;
  favoriteIds: string[];
  onToggleFavorite: (recipeId: string) => void;
  searchMode: 'browse' | 'ingredients';
}

export function RecipeGrid({
  recipes,
  selectedIngredients,
  onRecipeClick,
  favoriteIds,
  onToggleFavorite,
  searchMode
}: Props) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-12 max-w-md mx-auto">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No recipes found</h3>
          <p className="text-slate-600">
            {searchMode === 'ingredients'
              ? 'Try adding different ingredients or adjusting your filters'
              : 'Try adjusting your filters to see more recipes'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {searchMode === 'ingredients' && selectedIngredients.length > 0
            ? 'Matching Recipes'
            : 'All Recipes'}
        </h2>
        <p className="text-sm text-slate-600">
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            selectedIngredients={selectedIngredients}
            onClick={() => onRecipeClick(recipe)}
            isFavorite={favoriteIds.includes(recipe.id)}
            onToggleFavorite={onToggleFavorite}
            showMatchPercentage={searchMode === 'ingredients' && selectedIngredients.length > 0}
          />
        ))}
      </div>
    </div>
  );
}
