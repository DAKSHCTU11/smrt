import { useState } from 'react';
import { X, Clock, ChefHat, Heart, Star, Users, Flame, ArrowRight } from 'lucide-react';
import { RecipeWithIngredients } from '../services/recipeService';
import { RecipeService } from '../services/recipeService';

interface Props {
  recipe: RecipeWithIngredients;
  selectedIngredients: string[];
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
  userRating?: number;
  onRate: (recipeId: string, rating: number, review?: string) => void;
}

export function RecipeDetail({
  recipe,
  selectedIngredients,
  onClose,
  isFavorite,
  onToggleFavorite,
  userRating,
  onRate
}: Props) {
  const [servings, setServings] = useState(recipe.servings);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');
  const [hoverRating, setHoverRating] = useState(0);

  const servingMultiplier = servings / recipe.servings;
  const missingIngredients = RecipeService.getMissingIngredients(recipe, selectedIngredients);

  const handleRating = (rating: number) => {
    onRate(recipe.id, rating);
  };

  const tabs = [
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'instructions', label: 'Instructions' },
    { id: 'nutrition', label: 'Nutrition' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-start justify-center">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden animate-fadeIn">
          <div className="relative h-80">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
            >
              <X className="w-5 h-5 text-slate-900" />
            </button>

            <button
              onClick={() => onToggleFavorite(recipe.id)}
              className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-900'
                }`}
              />
            </button>

            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{recipe.name}</h1>
              <p className="text-white/90 text-lg drop-shadow-lg">{recipe.description}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-slate-600 font-medium">Total Time</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{recipe.total_time} min</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <ChefHat className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-slate-600 font-medium">Difficulty</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{recipe.difficulty}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-slate-600 font-medium">Servings</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-6 h-6 bg-white rounded-md hover:bg-orange-100 transition-colors flex items-center justify-center text-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-slate-900">{servings}</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="w-6 h-6 bg-white rounded-md hover:bg-orange-100 transition-colors flex items-center justify-center text-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-slate-600 font-medium">Calories</span>
                </div>
                <p className="text-xl font-bold text-slate-900">
                  {Math.round(recipe.calories * servingMultiplier)}
                </p>
              </div>
            </div>

            <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Rate this recipe</span>
                {recipe.rating_count > 0 && (
                  <span className="text-xs text-slate-600">
                    {recipe.average_rating.toFixed(1)} ({recipe.rating_count} ratings)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || userRating || 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-b border-slate-200 mb-6">
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'ingredients' && (
              <div>
                {missingIngredients.length > 0 && selectedIngredients.length > 0 && (
                  <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-amber-900 mb-2">
                      Missing Ingredients ({missingIngredients.length})
                    </p>
                    <p className="text-xs text-amber-700">
                      You'll need: {missingIngredients.map(ing => ing.name).join(', ')}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  {recipe.recipe_ingredients?.map((ri) => {
                    const haveIngredient = selectedIngredients.some(selected =>
                      ri.ingredients?.name.toLowerCase().includes(selected.toLowerCase()) ||
                      selected.toLowerCase().includes(ri.ingredients?.name.toLowerCase() || '')
                    );

                    return (
                      <div
                        key={ri.id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          haveIngredient ? 'bg-green-50 border border-green-200' : 'bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {haveIngredient && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          <span className="font-medium text-slate-900">
                            {ri.ingredients?.name}
                          </span>
                          {ri.is_optional && (
                            <span className="text-xs text-slate-500 italic">(optional)</span>
                          )}
                        </div>
                        <span className="text-slate-600 font-medium">
                          {(ri.quantity * servingMultiplier).toFixed(1)} {ri.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {recipe.recipe_ingredients?.some(ri => ri.ingredients?.common_substitutes?.length > 0) && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-3">Possible Substitutions</p>
                    <div className="space-y-2 text-sm">
                      {recipe.recipe_ingredients
                        ?.filter(ri => ri.ingredients?.common_substitutes?.length > 0)
                        .map(ri => (
                          <div key={ri.id} className="flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-blue-900">{ri.ingredients?.name}</span>
                              <span className="text-blue-700"> → </span>
                              <span className="text-blue-700">
                                {(ri.ingredients?.common_substitutes as string[])?.join(', ')}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="space-y-4">
                {(recipe.instructions as string[]).map((instruction, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 flex-1 pt-1">{instruction}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Calories</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {Math.round(recipe.calories * servingMultiplier)}
                    </p>
                    <p className="text-xs text-slate-500">kcal per serving</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Protein</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {(recipe.protein * servingMultiplier).toFixed(1)}g
                    </p>
                    <p className="text-xs text-slate-500">per serving</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Carbs</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {(recipe.carbs * servingMultiplier).toFixed(1)}g
                    </p>
                    <p className="text-xs text-slate-500">per serving</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Fat</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {(recipe.fat * servingMultiplier).toFixed(1)}g
                    </p>
                    <p className="text-xs text-slate-500">per serving</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Fiber</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {(recipe.fiber * servingMultiplier).toFixed(1)}g
                    </p>
                    <p className="text-xs text-slate-500">per serving</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Dietary Information</p>
                  <div className="flex flex-wrap gap-2">
                    {recipe.is_vegetarian && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        Vegetarian
                      </span>
                    )}
                    {recipe.is_vegan && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        Vegan
                      </span>
                    )}
                    {recipe.is_gluten_free && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                        Gluten-Free
                      </span>
                    )}
                    {recipe.is_dairy_free && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                        Dairy-Free
                      </span>
                    )}
                    {!recipe.is_vegetarian && !recipe.is_vegan && !recipe.is_gluten_free && !recipe.is_dairy_free && (
                      <span className="text-sm text-slate-600">No specific dietary restrictions</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
