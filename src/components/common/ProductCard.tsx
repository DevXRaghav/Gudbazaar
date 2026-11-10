import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Plus, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.variants[0]?.weight || product.weight, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div className="group relative flex flex-col bg-[#FFFFFF] rounded-xl border border-[#E9DDC9]/80 overflow-hidden hover:border-[#47752F]/40 hover:shadow-lg transition-all duration-300">
      
      {/* Product Image Container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-4/3 w-full bg-[#FFF9EF] overflow-hidden"
      >
        <img
          src={product.primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount & Bestseller tag: unboxed minimal clean text or small corner tag */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discountPercentage > 0 && (
            <span className="text-[11px] font-bold text-[#FFFFFF] bg-[#E99A19] px-2 py-0.5 rounded-sm tracking-wide">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="text-[11px] font-semibold text-[#FFFFFF] bg-[#47752F] px-2 py-0.5 rounded-sm tracking-wide">
              Bestseller
            </span>
          )}
        </div>

        {/* Quick View Floating Action */}
        <button
          onClick={handleQuickView}
          className="absolute right-2.5 bottom-2.5 p-2 bg-white/90 hover:bg-white text-[#4A2415] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          aria-label={`Quick view ${product.name}`}
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Weight Metadata: Clean unboxed text with typographic separator */}
          <div className="flex items-center gap-1.5 text-xs text-[#4A2415]/70 mb-1">
            <span className="font-medium text-[#47752F]">{product.category}</span>
            <span aria-hidden="true" className="text-[#E9DDC9]">·</span>
            <span>{product.weight}</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-[#47752F] transition-colors">
            <h3 className="text-base font-bold text-[#4A2415] line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="mt-1 text-xs text-[#4A2415]/75 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[#E9DDC9]/50 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#4A2415] tabular-nums">
                ₹{product.price}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-[#4A2415]/40 line-through tabular-nums">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-[#4A2415]/70 mt-0.5">
                <span className="text-[#E99A19]">★</span>
                <span className="font-semibold text-[#4A2415]">{product.rating}</span>
                <span>({product.reviewCount})</span>
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-semibold transition-all ${
              added
                ? 'bg-[#47752F] text-white shadow-sm'
                : 'bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF] hover:shadow-md'
            } active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
