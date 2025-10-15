import { useState } from 'react';
import { Filter } from 'lucide-react';
import { RecipeFilters as Filters, RecipeWithIngredients } from '../services/recipeService';

interface Props {
  onFilterChange: (filters: Filters) => void;
  currentFilters: Filters;
  allRecipes: RecipeWithIngredients[];
}

export function RecipeFilters({ onFilterChange, currentFilters, allRecipes }: Props) {
  const [showFilters, setShowFilters] = useState(false);

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const cuisines = [...new Set(allRecipes.map(r => r.cuisine))].sort();
  const timeRanges = [
    { label: 'Under 15 min', max: 15 },
    { label: '15-30 min', min: 15, max: 30 },
    { label: '30-60 min', min: 30, max: 60 },
    { label: 'Over 60 min', min: 60 }
  ];

  const handleDifficultyToggle = (difficulty: string) => {
    const current = currentFilters.difficulty || [];
    const updated = current.includes(difficulty)
      ? current.filter(d => d !== difficulty)
      : [...current, difficulty];
    onFilterChange({ ...currentFilters, difficulty: updated.length ? updated : undefined });
  };

  const handleCuisineToggle = (cuisine: string) => {
    const current = currentFilters.cuisines || [];
    const updated = current.includes(cuisine)
      ? current.filter(c => c !== cuisine)
      : [...current, cuisine];
    onFilterChange({ ...currentFilters, cuisines: updated.length ? updated : undefined });
  };

  const handleTimeRange = (min?: number, max?: number) => {
    onFilterChange({ ...currentFilters, minTime: min, maxTime: max });
  };

  const handleDietaryToggle = (type: 'isVegetarian' | 'isVegan' | 'isGlutenFree' | 'isDairyFree') => {
    onFilterChange({ ...currentFilters, [type]: !currentFilters[type] });
  };

  const handleClearAll = () => {
    onFilterChange({});
  };

  const activeFilterCount = [
    currentFilters.difficulty?.length || 0,
    currentFilters.cuisines?.length || 0,
    currentFilters.minTime || currentFilters.maxTime ? 1 : 0,
    currentFilters.isVegetarian ? 1 : 0,
    currentFilters.isVegan ? 1 : 0,
    currentFilters.isGlutenFree ? 1 : 0,
    currentFilters.isDairyFree ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            {showFilters ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Dietary Preferences</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleDietaryToggle('isVegetarian')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentFilters.isVegetarian
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Vegetarian
              </button>
              <button
                onClick={() => handleDietaryToggle('isVegan')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentFilters.isVegan
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Vegan
              </button>
              <button
                onClick={() => handleDietaryToggle('isGlutenFree')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentFilters.isGlutenFree
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Gluten-Free
              </button>
              <button
                onClick={() => handleDietaryToggle('isDairyFree')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentFilters.isDairyFree
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Dairy-Free
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Difficulty</h3>
            <div className="flex flex-wrap gap-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => handleDifficultyToggle(difficulty)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentFilters.difficulty?.includes(difficulty)
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Cooking Time</h3>
            <div className="flex flex-wrap gap-2">
              {timeRanges.map((range, idx) => {
                const isActive =
                  (range.min === currentFilters.minTime || (!range.min && !currentFilters.minTime)) &&
                  (range.max === currentFilters.maxTime || (!range.max && !currentFilters.maxTime));

                return (
                  <button
                    key={idx}
                    onClick={() => handleTimeRange(range.min, range.max)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Cuisine</h3>
            <div className="flex flex-wrap gap-2">
              {cuisines.map(cuisine => (
                <button
                  key={cuisine}
                  onClick={() => handleCuisineToggle(cuisine)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentFilters.cuisines?.includes(cuisine)
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
