import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IngredientSearch } from './components/IngredientSearch';
import { RecipeFilters } from './components/RecipeFilters';
import { RecipeGrid } from './components/RecipeGrid';
import { RecipeDetail } from './components/RecipeDetail';
import { RecommendationsSection } from './components/RecommendationsSection';
import { RecipeService, RecipeWithIngredients, RecipeFilters as Filters } from './services/recipeService';
import { Ingredient } from './lib/supabase';
import { Loader2 } from 'lucide-react';

function App() {
  const [allRecipes, setAllRecipes] = useState<RecipeWithIngredients[]>([]);
  const [displayedRecipes, setDisplayedRecipes] = useState<RecipeWithIngredients[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithIngredients | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState<'browse' | 'ingredients'>('browse');
  const [userId] = useState(() => {
    const stored = localStorage.getItem('userId');
    if (stored) return stored;
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', newId);
    return newId;
  });
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [allRecipes, selectedIngredients, filters, searchMode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recipes, ingredients, favorites, ratings] = await Promise.all([
        RecipeService.getAllRecipes(),
        RecipeService.getAllIngredients(),
        RecipeService.getUserFavorites(userId),
        RecipeService.getUserRatings(userId)
      ]);
      setAllRecipes(recipes);
      setDisplayedRecipes(recipes);
      setAllIngredients(ingredients);
      setFavoriteIds(favorites);
      setUserRatings(ratings);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = async () => {
    let recipes = [...allRecipes];

    if (searchMode === 'ingredients' && selectedIngredients.length > 0) {
      const matchedRecipes = await RecipeService.getRecipesByIngredients(selectedIngredients);
      recipes = matchedRecipes;
    }

    const filtered = await RecipeService.filterRecipes(recipes, filters);
    setDisplayedRecipes(filtered);
  };

  const handleIngredientSelect = (ingredients: string[]) => {
    setSelectedIngredients(ingredients);
    if (ingredients.length > 0) {
      setSearchMode('ingredients');
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleRecipeClick = (recipe: RecipeWithIngredients) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseDetail = () => {
    setSelectedRecipe(null);
  };

  const handleToggleFavorite = async (recipeId: string) => {
    try {
      const isFavorite = await RecipeService.toggleFavorite(recipeId, userId);
      if (isFavorite) {
        setFavoriteIds([...favoriteIds, recipeId]);
      } else {
        setFavoriteIds(favoriteIds.filter(id => id !== recipeId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleRateRecipe = async (recipeId: string, rating: number, review?: string) => {
    try {
      await RecipeService.rateRecipe(recipeId, userId, rating, review);
      setUserRatings({ ...userRatings, [recipeId]: rating });
      loadData();
    } catch (error) {
      console.error('Error rating recipe:', error);
    }
  };

  const handleClearSearch = () => {
    setSelectedIngredients([]);
    setSearchMode('browse');
    setFilters({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <IngredientSearch
            allIngredients={allIngredients}
            selectedIngredients={selectedIngredients}
            onIngredientSelect={handleIngredientSelect}
          />
        </div>

        <div className="mb-8">
          <RecipeFilters
            onFilterChange={handleFilterChange}
            currentFilters={filters}
            allRecipes={allRecipes}
          />
        </div>

        {searchMode === 'ingredients' && selectedIngredients.length > 0 && (
          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">
                  Showing recipes with:{' '}
                  <span className="font-medium text-slate-900">
                    {selectedIngredients.join(', ')}
                  </span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {displayedRecipes.length} recipe{displayedRecipes.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <button
                onClick={handleClearSearch}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        <RecipeGrid
          recipes={displayedRecipes}
          selectedIngredients={selectedIngredients}
          onRecipeClick={handleRecipeClick}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          searchMode={searchMode}
        />

        {searchMode === 'browse' && (
          <div className="mt-16">
            <RecommendationsSection
              allRecipes={allRecipes}
              favoriteIds={favoriteIds}
              userRatings={userRatings}
              onRecipeClick={handleRecipeClick}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}
      </main>

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          selectedIngredients={selectedIngredients}
          onClose={handleCloseDetail}
          isFavorite={favoriteIds.includes(selectedRecipe.id)}
          onToggleFavorite={handleToggleFavorite}
          userRating={userRatings[selectedRecipe.id]}
          onRate={handleRateRecipe}
        />
      )}
    </div>
  );
}

export default App;
