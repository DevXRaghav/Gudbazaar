import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Plus, Minus, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { HERO_IMAGE } from '../../data/products';
import { SECURITY_RULES } from '../../utils/security';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  enableQtySelector?: boolean;
  enableWeightSelector?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  enableQtySelector = false,
  enableWeightSelector = false,
}) => {
  const { items, addToCart, updateQuantity } = useCart();
  const [added, setAdded] = React.useState(false);

  const defaultWeight = product.variants[0]?.weight || product.weight;
  const [selectedWeight, setSelectedWeight] = React.useState(defaultWeight);

  const activeVariant =
    product.variants.find((v) => v.weight === selectedWeight) || product.variants[0];
  const activeWeight = enableWeightSelector
    ? activeVariant?.weight || product.weight
    : defaultWeight;

  const displayPrice = enableWeightSelector
    ? activeVariant?.price ?? product.price
    : product.price;
  const displayMrp = enableWeightSelector
    ? activeVariant?.mrp ?? product.mrp
    : product.mrp;
  const displayDiscount =
    displayMrp > displayPrice
      ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100)
      : product.discountPercentage;
  const isVariantInStock =
    product.inStock && (enableWeightSelector ? activeVariant?.inStock ?? true : true);

  const cartItemId =`${product.id}-${activeWeight}`;
  const cartItem = items.find((item) => item.id === cartItemId);
  const currentQty = cartItem?.quantity || 0;
  const totalProductQtyInCart = items
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isVariantInStock) return;
    if (enableQtySelector) {
      addToCart(product, activeWeight, 1, { openDrawer: false });
      return;
    }
    addToCart(product, activeWeight, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(cartItemId, Math.min(SECURITY_RULES.MAX_QUANTITY_PER_ITEM, currentQty + 1));
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(cartItemId, currentQty - 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div className="group relative flex flex-col bg-[#FFFFFF] rounded-xl border border-[#E9DDC9]/80 overflow-hidden hover:border-[#47752F]/50 hover:shadow-lg transition-all duration-300">
     
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
          onError={(e) => {
            e.currentTarget.src = HERO_IMAGE;
          }}
        />

        {/* Discount, Bestseller & Packaging Tag */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide text-white ${
            product.packagingType ==='Jar' ?'bg-[#4A2415]' : 'bg-[#47752F]'
          }`}>
            {product.packagingType ==='Jar' ?'Airtight Jar' : 'Airtight Packet'}
          </span>
          {displayDiscount > 0 && (
            <span className="text-[10px] font-bold text-[#FFFFFF] bg-[#E99A19] px-2 py-0.5 rounded-sm tracking-wide">
              {displayDiscount}% OFF
            </span>
          )}
        </div>

        {/* Quick View Floating Action */}
        <button
          onClick={handleQuickView}
          className="absolute right-2.5 bottom-2.5 p-2 bg-white/90 hover:bg-white text-[#4A2415] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 touch-manipulation"
          aria-label={`Quick view ${product.name}`}
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white transition-colors">
        <div>
          {/* Category & Weight Metadata: Clean unboxed text with typographic separator */}
          <div className="flex items-center gap-1.5 text-xs text-[#4A2415]/70 mb-1">
            <span className="font-semibold text-[#47752F]">{product.category}</span>
            <span aria-hidden="true" className="text-[#E9DDC9]">·</span>
            <span className="font-semibold text-[#4A2415]">{product.packagingType}</span>
            {!enableWeightSelector && (
              <>
                <span aria-hidden="true" className="text-[#E9DDC9]">·</span>
                <span>500g / 1000g</span>
              </>
            )}
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

        <div className="mt-3">
          {/* Weight Selector */}
          {enableWeightSelector && product.variants.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-semibold text-[#4A2415]/70">
                  Pack Weight
                </span>
                {totalProductQtyInCart > 0 && (
                  <span className="text-[10px] font-semibold text-[#47752F] tabular-nums">
                    {totalProductQtyInCart} in bag
                  </span>
                )}
              </div>
              <div
                className="grid grid-cols-2 gap-1.5"
                role="radiogroup"
                aria-label={`Select pack weight for ${product.name}`}
              >
                {product.variants.map((variant) => {
                  const isSelected = activeWeight === variant.weight;
                  const variantQty =
                    items.find((i) => i.id ===`${product.id}-${variant.weight}`)?.quantity || 0;
                  return (
                    <button
                      key={variant.sku}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedWeight(variant.weight);
                      }}
                      className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer touch-manipulation ${
                        isSelected
                          ?'border-[#47752F] bg-[#EBF3E8] text-[#47752F]'
                          : 'border-[#E9DDC9] bg-[#FFF9EF]/60 text-[#4A2415]/80 hover:border-[#47752F]/50'
                      }`}
                    >
                      <span>{variant.weight}</span>
                      <span className="text-[10px] opacity-75 tabular-nums">· ₹{variant.price}</span>
                      {variantQty > 0 && (
                        <span className="ml-0.5 px-1 min-w-[16px] h-4 inline-flex items-center justify-center rounded-full bg-[#47752F] text-white text-[9px] font-bold tabular-nums">
                          {variantQty}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price & Action Row */}
          <div className="pt-3 border-t border-[#E9DDC9]/50 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-[#4A2415] tabular-nums">
                  ₹{displayPrice}
                </span>
                {displayMrp > displayPrice && (
                  <span className="text-xs text-[#4A2415]/40 line-through tabular-nums">
                    ₹{displayMrp}
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

            {enableQtySelector && currentQty > 0 ? (
              <div
                className="inline-flex items-center rounded-lg bg-[#47752F] text-white shadow-sm overflow-hidden shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="px-2.5 py-2 hover:bg-[#3d6826] transition-colors touch-manipulation active:scale-95 flex items-center justify-center cursor-pointer"
                  aria-label={`Decrease quantity of ${product.name} (${activeWeight})`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span
                  className="px-2 min-w-[26px] text-center text-xs font-bold tabular-nums select-none"
                  aria-live="polite"
                >
                  {currentQty}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={currentQty >= SECURITY_RULES.MAX_QUANTITY_PER_ITEM}
                  className="px-2.5 py-2 hover:bg-[#3d6826] disabled:opacity-50 transition-colors touch-manipulation active:scale-95 flex items-center justify-center cursor-pointer"
                  aria-label={`Increase quantity of ${product.name} (${activeWeight})`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!isVariantInStock}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-semibold transition-all touch-manipulation cursor-pointer ${
                  added
                    ?'bg-[#47752F] text-white shadow-sm'
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
