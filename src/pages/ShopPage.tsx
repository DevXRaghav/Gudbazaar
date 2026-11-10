import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCategory, Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { SEOHead } from '../components/seo/SEOHead';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync state if URL query params change
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat) setSelectedCategory(urlCat);

    const urlQ = searchParams.get('q');
    if (urlQ !== null) setSearchQuery(urlQ);
  }, [searchParams]);

  const categoriesList: ProductCategory[] = [
    'All',
    'Jaggery Blocks',
    'Jaggery Powder',
    'Jaggery Cubes',
    'Liquid Jaggery',
    'Jaggery Specialities',
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q);
        const matchesOrigin = product.harvestOrigin?.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesOrigin && !matchesCat) {
          return false;
        }
      }
      // Stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured (bestsellers first)
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
  }, [selectedCategory, searchQuery, inStockOnly, sortBy]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'All' || searchQuery.trim().length > 0 || inStockOnly;

  return (
    <div className="bg-[#FFF9EF] min-h-screen py-8 sm:py-12">
      <SEOHead
        title="Shop All Pure Jaggery Products | Gudbazaar"
        description="Browse our curated catalogue of authentic Indian jaggery blocks, powder, portioned cubes, and liquid kakvi. 100% natural and chemical free."
        canonicalPath="/shop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#4A2415]/60 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#47752F] font-semibold">Shop All</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#4A2415] font-semibold">{selectedCategory}</span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4A2415] tracking-tight">
                Pure Jaggery Collection
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#4A2415]/75">
                Thoughtfully crafted in small batches from fresh sugarcane juice. Showing {filteredProducts.length} items.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label htmlFor="sort-select" className="text-xs font-semibold text-[#4A2415] flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#47752F]" />
                <span>Sort by:</span>
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#E9DDC9] rounded-lg px-3 py-1.5 text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F] font-medium"
              >
                <option value="featured">Featured / Bestsellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-xl border border-[#E9DDC9] p-4 sm:p-5 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A2415]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) {
                    searchParams.set('q', e.target.value);
                  } else {
                    searchParams.delete('q');
                  }
                  setSearchParams(searchParams);
                }}
                placeholder="Search jaggery by name, type, origin..."
                className="w-full pl-9 pr-8 py-2 bg-[#FFF9EF] border border-[#E9DDC9] rounded-lg text-xs text-[#4A2415] focus:outline-none focus:border-[#47752F]"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    searchParams.delete('q');
                    setSearchParams(searchParams);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4A2415]/50 hover:text-[#4A2415]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* In-Stock Toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[#4A2415] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#47752F] rounded w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-[#47752F] hover:text-[#4A2415] underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

          </div>

          {/* Category Tabs: Functional Buttons (Permitted by Zero-Pill Section 1A) */}
          <div className="mt-4 pt-3 border-t border-[#E9DDC9]/50 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categoriesList.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#4A2415] text-[#FFF9EF] shadow-xs'
                    : 'bg-[#FFF9EF] text-[#4A2415] hover:bg-[#E9DDC9]/50 border border-[#E9DDC9]/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E9DDC9] p-12 text-center my-8">
            <div className="w-12 h-12 rounded-full bg-[#FFF9EF] text-[#47752F] flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#4A2415]">No products found matching your filters</h3>
            <p className="text-xs text-[#4A2415]/70 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords or resetting category filters to see all available jaggery items.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-5 px-5 py-2.5 bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] text-xs font-semibold rounded-lg transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
