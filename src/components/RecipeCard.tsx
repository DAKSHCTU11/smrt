import { Clock, ChefHat, Star, Heart } from 'lucide-react';
import { RecipeWithIngredients } from '../services/recipeService';
import { RecipeService } from '../services/recipeService';

interface Props {
  recipe: RecipeWithIngredients;
  selectedIngredients: string[];
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
  showMatchPercentage?: boolean;
}

export function RecipeCard({
  recipe,
  selectedIngredients,
  onClick,
  isFavorite,
  onToggleFavorite,
  showMatchPercentage
}: Props) {
  const matchPercentage = showMatchPercentage
    ? RecipeService.calculateMatchPercentage(recipe, selectedIngredients)
    : 0;

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-amber-100 text-amber-700',
    Hard: 'bg-red-100 text-red-700'
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(recipe.id);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-slate-100 hover:border-orange-200"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image_url}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'
            }`}
          />
        </button>

        {showMatchPercentage && matchPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {matchPercentage}% Match
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
            {recipe.name}
          </h3>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">{recipe.description}</p>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
            {recipe.cuisine}
          </span>
          {recipe.is_vegetarian && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
              Vegetarian
            </span>
          )}
          {recipe.is_vegan && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
              Vegan
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.total_time} min</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className={`w-4 h-4 ${recipe.average_rating > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{recipe.average_rating > 0 ? recipe.average_rating.toFixed(1) : 'New'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
