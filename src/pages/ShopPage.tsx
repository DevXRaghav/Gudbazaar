import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ArrowUpDown, ShieldCheck, AlertCircle, Package } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCategory, Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { SEOHead } from '../components/seo/SEOHead';
import { auditInputSecurity, SECURITY_RULES } from '../utils/security';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialPackaging = (searchParams.get('packaging') as 'All' | 'Packet' | 'Jar') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedPackaging, setSelectedPackaging] = useState<'All' | 'Packet' | 'Jar'>(initialPackaging);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [searchSecurityError, setSearchSecurityError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync state if URL query params change
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat) setSelectedCategory(urlCat);

    const urlPack = searchParams.get('packaging') as 'All' | 'Packet' | 'Jar';
    if (urlPack) setSelectedPackaging(urlPack);

    const urlQ = searchParams.get('q');
    if (urlQ !== null) setSearchQuery(urlQ);
  }, [searchParams]);

  const categoriesList: ProductCategory[] = [
    'All',
    'Raw Gud',
    'Gud Cubes',
    'Pure Desi Khand',
    'Pure Organic Shakkar',
  ];

  const handleSearchChange = (val: string) => {
    if (val.length > SECURITY_RULES.MAX_SEARCH_LENGTH) {
      setSearchSecurityError(`Security Notice: Search query limited to ${SECURITY_RULES.MAX_SEARCH_LENGTH} characters.`);
      return;
    }

    const secAudit = auditInputSecurity(val, 'Search Query');
    if (!secAudit.isSafe) {
      setSearchSecurityError(secAudit.errorMessage || 'Invalid characters in search query.');
      return;
    }

    setSearchSecurityError(null);
    setSearchQuery(val);
    if (val.trim()) {
      searchParams.set('q', val.trim());
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Packaging Subcategory match ('Packet' vs 'Jar')
      if (selectedPackaging !== 'All' && product.packagingType !== selectedPackaging) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q);
        const matchesOrigin = product.harvestOrigin?.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesPack = product.packagingType.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesOrigin && !matchesCat && !matchesPack) {
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
      // Default: featured
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
  }, [selectedCategory, selectedPackaging, searchQuery, inStockOnly, sortBy]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handlePackagingSelect = (packaging: 'All' | 'Packet' | 'Jar') => {
    setSelectedPackaging(packaging);
    if (packaging === 'All') {
      searchParams.delete('packaging');
    } else {
      searchParams.set('packaging', packaging);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedPackaging('All');
    setSearchQuery('');
    setSearchSecurityError(null);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'All' || selectedPackaging !== 'All' || searchQuery.trim().length > 0 || inStockOnly;

  return (
    <div className="bg-[#FFF9EF] dark:bg-[#120A06] min-h-screen py-8 sm:py-12 transition-colors duration-200">
      <SEOHead
        title="Shop 100% Organic Jaggery, Cubes, Khand & Shakkar | Gudbazaar"
        description="Browse authentic organic jaggery from the roots of Uttar Pradesh. Available in 500g & 1000g Packets and Airtight Jars."
        canonicalPath="/shop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#4A2415]/70 dark:text-[#D8C7B8]/70 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#47752F] dark:text-[#6BB545] font-semibold">Shop All</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#4A2415] dark:text-[#F5EBE1] font-semibold">{selectedCategory}</span>
              </>
            )}
            {selectedPackaging !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#47752F] dark:text-[#6BB545] font-semibold">{selectedPackaging === 'Packet' ? 'Airtight Packets' : 'Airtight Jars'}</span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF3E8] dark:bg-[#6BB545]/15 text-[#47752F] dark:text-[#6BB545] text-[11px] font-bold uppercase tracking-wider mb-2 border border-[#47752F]/20 dark:border-[#6BB545]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Roots of Uttar Pradesh · Govt. of India Recognized</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4A2415] dark:text-[#F5EBE1] tracking-tight">
                Pure Organic & Fresh Collection
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#4A2415]/80 dark:text-[#D8C7B8] max-w-2xl leading-relaxed">
                100% Organic & freshly prepared in Western UP. Choose between <strong>Airtight Packets</strong> and <strong>Reusable Jars</strong> in <strong>500g and 1000g</strong> pack sizes. Always keep away from moisture!
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label htmlFor="sort-select" className="text-xs font-semibold text-[#4A2415] dark:text-[#F5EBE1] flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#47752F] dark:text-[#6BB545]" />
                <span>Sort by:</span>
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white dark:bg-[#261810] border border-[#E9DDC9] dark:border-[#42291C] rounded-lg px-3 py-1.5 text-xs text-[#4A2415] dark:text-[#F5EBE1] focus:outline-none focus:border-[#47752F] dark:focus:border-[#6BB545] font-medium cursor-pointer"
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
        <div className="bg-white dark:bg-[#1C110B] rounded-xl border border-[#E9DDC9] dark:border-[#3B2519] p-4 sm:p-5 mb-8 shadow-xs transition-colors">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A2415]/50 dark:text-[#D8C7B8]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by product name, packet or jar, origin..."
                maxLength={SECURITY_RULES.MAX_SEARCH_LENGTH}
                className="w-full pl-9 pr-8 py-2 bg-[#FFF9EF] dark:bg-[#261810] border border-[#E9DDC9] dark:border-[#42291C] rounded-lg text-xs text-[#4A2415] dark:text-[#F5EBE1] focus:outline-none focus:border-[#47752F] dark:focus:border-[#6BB545]"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4A2415]/50 dark:text-[#D8C7B8]/50 hover:text-[#4A2415] dark:hover:text-[#F5EBE1]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* In-Stock Toggle & Reset */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[#4A2415] dark:text-[#F5EBE1] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#47752F] dark:accent-[#6BB545] rounded w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-[#47752F] dark:text-[#6BB545] hover:text-[#4A2415] dark:hover:text-[#F5EBE1] underline flex items-center gap-1 touch-manipulation"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

          </div>

          {searchSecurityError && (
            <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchSecurityError}</span>
            </div>
          )}

          {/* Category Tabs */}
          <div className="mt-4 pt-3 border-t border-[#E9DDC9]/50 dark:border-[#3B2519] flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categoriesList.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors touch-manipulation ${
                  selectedCategory === category
                    ? 'bg-[#4A2415] dark:bg-[#F5AA28] text-[#FFF9EF] dark:text-[#120A06] shadow-xs'
                    : 'bg-[#FFF9EF] dark:bg-[#261810] text-[#4A2415] dark:text-[#F5EBE1] hover:bg-[#E9DDC9]/50 dark:hover:bg-[#322016] border border-[#E9DDC9]/60 dark:border-[#3B2519]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Subcategory: Packaging Option (Packets / Jar) */}
          <div className="mt-3 pt-3 border-t border-[#E9DDC9]/30 dark:border-[#3B2519]/70 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#47752F] dark:text-[#6BB545] flex items-center gap-1 mr-1">
              <Package className="w-3.5 h-3.5" />
              <span>Packaging Type:</span>
            </span>

            <button
              type="button"
              onClick={() => handlePackagingSelect('All')}
              className={`px-3 py-1 text-xs rounded-md transition-colors touch-manipulation ${
                selectedPackaging === 'All'
                  ? 'bg-[#47752F] dark:bg-[#6BB545] text-white dark:text-[#120A06] font-semibold'
                  : 'bg-[#FFF9EF] dark:bg-[#261810] text-[#4A2415]/80 dark:text-[#D8C7B8] hover:bg-[#E9DDC9]/40 dark:hover:bg-[#322016] border border-[#E9DDC9] dark:border-[#3B2519]'
              }`}
            >
              All Packaging
            </button>

            <button
              type="button"
              onClick={() => handlePackagingSelect('Packet')}
              className={`px-3 py-1 text-xs rounded-md transition-colors touch-manipulation ${
                selectedPackaging === 'Packet'
                  ? 'bg-[#47752F] dark:bg-[#6BB545] text-white dark:text-[#120A06] font-semibold'
                  : 'bg-[#FFF9EF] dark:bg-[#261810] text-[#4A2415]/80 dark:text-[#D8C7B8] hover:bg-[#E9DDC9]/40 dark:hover:bg-[#322016] border border-[#E9DDC9] dark:border-[#3B2519]'
              }`}
            >
              Airtight Packets
            </button>

            <button
              type="button"
              onClick={() => handlePackagingSelect('Jar')}
              className={`px-3 py-1 text-xs rounded-md transition-colors touch-manipulation ${
                selectedPackaging === 'Jar'
                  ? 'bg-[#47752F] dark:bg-[#6BB545] text-white dark:text-[#120A06] font-semibold'
                  : 'bg-[#FFF9EF] dark:bg-[#261810] text-[#4A2415]/80 dark:text-[#D8C7B8] hover:bg-[#E9DDC9]/40 dark:hover:bg-[#322016] border border-[#E9DDC9] dark:border-[#3B2519]'
              }`}
            >
              Airtight Jars
            </button>
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-[#1C110B] rounded-2xl border border-[#E9DDC9] dark:border-[#3B2519] p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FFF9EF] dark:bg-[#261810] border border-[#E9DDC9] dark:border-[#3B2519] text-[#47752F] dark:text-[#6BB545] flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 opacity-60" />
            </div>
            <h2 className="text-lg font-bold text-[#4A2415] dark:text-[#F5EBE1]">No products match your criteria</h2>
            <p className="text-xs text-[#4A2415]/70 dark:text-[#D8C7B8]/70 mt-1">
              Try resetting your packaging or category filters to view all fresh organic options.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-5 px-5 py-2.5 bg-[#4A2415] dark:bg-[#6BB545] hover:bg-[#47752F] dark:hover:bg-[#5aa038] text-[#FFF9EF] dark:text-[#120A06] text-xs font-semibold rounded-lg transition-colors touch-manipulation"
            >
              Show All Products
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

        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />

      </div>
    </div>
  );
};
