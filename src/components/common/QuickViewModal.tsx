import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(
    product.variants[0]?.weight || product.weight
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const activeVariant =
    product.variants.find((v) => v.weight === selectedWeight) || product.variants[0];

  const handleAdd = () => {
    addToCart(product, selectedWeight, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#4A2415]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E9DDC9] overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-white/90 text-[#4A2415] hover:bg-[#FFF9EF] shadow-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media */}
        <div className="w-full md:w-1/2 bg-[#FFF9EF] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#E9DDC9]">
          <div className="relative aspect-4/3 md:aspect-square w-full rounded-xl overflow-hidden shadow-inner">
            <img
              src={product.primaryImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#47752F] font-semibold uppercase tracking-wider">
              <span>{product.category}</span>
              <span className="text-[#E9DDC9]">·</span>
              <span className="text-[#4A2415]/60 normal-case font-normal">{product.harvestOrigin}</span>
            </div>

            <h2 className="mt-1 text-xl font-bold text-[#4A2415] leading-snug">
              {product.name}
            </h2>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#4A2415] tabular-nums">
                ₹{activeVariant?.price || product.price}
              </span>
              {(activeVariant?.mrp || product.mrp) > (activeVariant?.price || product.price) && (
                <span className="text-sm text-[#4A2415]/40 line-through tabular-nums">
                  ₹{activeVariant?.mrp || product.mrp}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-xs font-semibold text-[#E99A19] bg-[#FFF9EF] px-2 py-0.5 rounded border border-[#E99A19]/30">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-[#4A2415]/80">
              {product.shortDescription}
            </p>

            {/* Pack Size / Variant Selector */}
            {product.variants.length > 1 && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-[#4A2415] mb-2">
                  Select Pack Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.sku}
                      type="button"
                      onClick={() => setSelectedWeight(variant.weight)}
                      className={`text-xs py-1.5 px-3 rounded-md border font-medium transition-all ${
                        selectedWeight === variant.weight
                          ? 'border-[#47752F] bg-[#47752F] text-white shadow-sm'
                          : 'border-[#E9DDC9] bg-[#FFF9EF] text-[#4A2415] hover:border-[#47752F]'
                      }`}
                    >
                      {variant.weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-semibold text-[#4A2415]">Qty:</span>
              <div className="flex items-center border border-[#E9DDC9] rounded-lg bg-[#FFF9EF]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-sm font-semibold text-[#4A2415] hover:bg-[#E9DDC9]/50 rounded-l-lg"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold tabular-nums text-[#4A2415]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2.5 py-1 text-sm font-semibold text-[#4A2415] hover:bg-[#E9DDC9]/50 rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-[#E9DDC9] flex flex-col gap-2.5">
            <button
              onClick={handleAdd}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                added
                  ? 'bg-[#47752F] text-white'
                  : 'bg-[#4A2415] hover:bg-[#47752F] text-[#FFF9EF]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag — ₹{(activeVariant?.price || product.price) * quantity}</span>
                </>
              )}
            </button>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="text-center text-xs font-medium text-[#47752F] hover:text-[#4A2415] flex items-center justify-center gap-1 py-1"
            >
              <span>View Full Product Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
