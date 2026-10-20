import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, Star, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import type { Product } from '../types/index.ts';
import { formatPKR, calculateDiscountPercentage } from '../utils/format.ts';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setActiveProductModal } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = product.originalPrice
    ? calculateDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'Standard';
    const defaultColor = product.colors[0] || { name: 'Default', hex: '#000000' };
    const success = addToCart(product, defaultSize, defaultColor, 1);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => setActiveProductModal(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-[#101512] rounded-2xl border border-[#252D28] hover:border-[#35F582]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(53,245,130,0.12)] hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full bg-[#050706] overflow-hidden">
        
        {/* Skeleton loader while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#161D19] animate-pulse" />
        )}

        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#35F582] text-black text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              NEW
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#101512]/90 border border-[#252D28] text-[#35F582] text-[10px] font-mono font-bold tracking-tight backdrop-blur-md">
              -{discountPercent}%
            </span>
          )}
          {product.stock <= 4 && product.stock > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-mono font-semibold backdrop-blur-md">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all z-10 ${
            isFavorited
              ? 'bg-[#35F582] text-black border-[#35F582]'
              : 'bg-[#050706]/70 text-white hover:text-[#35F582] border-[#252D28] hover:border-[#35F582]/60'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Floating Quick Action Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg ${
              product.stock === 0
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : justAdded
                ? 'bg-[#35F582] text-black'
                : 'bg-white text-black hover:bg-[#35F582] hover:text-black'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : product.stock === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveProductModal(product);
            }}
            className="p-2.5 rounded-xl bg-[#050706]/80 text-white hover:text-[#35F582] border border-[#252D28] hover:border-[#35F582]/60 backdrop-blur-md transition-all"
            aria-label="View product details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Card Information */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#A5ADA8] mb-1.5 font-mono">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-[#35F582]">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-semibold text-white">{product.rating}</span>
              <span className="text-[#A5ADA8] text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#35F582] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-[#A5ADA8] mt-0.5 line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing & Mobile Quick Add */}
        <div className="mt-4 pt-3 border-t border-[#252D28]/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-white">
                {formatPKR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#A5ADA8] line-through font-mono">
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Mobile visible Add to Cart icon */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`sm:hidden p-2.5 rounded-xl transition-all ${
              justAdded
                ? 'bg-[#35F582] text-black'
                : 'bg-[#161D19] border border-[#252D28] text-white active:bg-[#35F582] active:text-black'
            }`}
            aria-label="Quick add to cart"
          >
            {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4 text-[#35F582]" />}
          </button>
        </div>
      </div>
    </div>
  );
};
