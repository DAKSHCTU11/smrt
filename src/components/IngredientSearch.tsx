import { useState, useRef, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { Ingredient } from '../lib/supabase';

interface Props {
  allIngredients: Ingredient[];
  selectedIngredients: string[];
  onIngredientSelect: (ingredients: string[]) => void;
}

export function IngredientSearch({ allIngredients, selectedIngredients, onIngredientSelect }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allIngredients
        .filter(ing =>
          ing.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedIngredients.includes(ing.name)
        )
        .slice(0, 10);
      setFilteredIngredients(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredIngredients([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allIngredients, selectedIngredients]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddIngredient = (ingredientName: string) => {
    if (!selectedIngredients.includes(ingredientName)) {
      onIngredientSelect([...selectedIngredients, ingredientName]);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveIngredient = (ingredientName: string) => {
    onIngredientSelect(selectedIngredients.filter(ing => ing !== ingredientName));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredIngredients.length > 0) {
      handleAddIngredient(filteredIngredients[0].name);
    }
  };

  const popularIngredients = ['chicken breast', 'tomatoes', 'eggs', 'rice', 'pasta', 'onion', 'garlic', 'cheese'];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">What ingredients do you have?</h2>
        <p className="text-sm text-slate-600">Add ingredients to find matching recipes</p>
      </div>

      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search ingredients (e.g., chicken, tomatoes, rice)..."
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>

        {showSuggestions && filteredIngredients.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
            {filteredIngredients.map((ingredient) => (
              <button
                key={ingredient.id}
                onClick={() => handleAddIngredient(ingredient.name)}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="text-slate-900 font-medium">{ingredient.name}</span>
                  <span className="text-xs text-slate-500 ml-2">({ingredient.category})</span>
                </div>
                <Plus className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedIngredients.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700">Selected Ingredients:</p>
            <button
              onClick={() => onIngredientSelect([])}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ingredient) => (
              <span
                key={ingredient}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm font-medium shadow-sm"
              >
                {ingredient}
                <button
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {selectedIngredients.length === 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-600 mb-2">Popular ingredients:</p>
          <div className="flex flex-wrap gap-2">
            {popularIngredients.map((ingredient) => (
              <button
                key={ingredient}
                onClick={() => handleAddIngredient(ingredient)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 rounded-lg text-sm font-medium transition-colors"
              >
                + {ingredient}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
