import { ChefHat } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2 rounded-xl shadow-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                SmartRecipe
              </h1>
              <p className="text-xs text-slate-500">Find recipes from your ingredients</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <p className="font-semibold text-slate-900">25+</p>
              <p className="text-xs text-slate-500">Recipes</p>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center">
              <p className="font-semibold text-slate-900">8</p>
              <p className="text-xs text-slate-500">Cuisines</p>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center">
              <p className="font-semibold text-slate-900">Smart</p>
              <p className="text-xs text-slate-500">Matching</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
