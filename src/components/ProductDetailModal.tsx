import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import type { Product } from '../types/index.ts';
import { formatPKR, calculateDiscountPercentage } from '../utils/format.ts';

interface ProductDetailContentProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ product, onClose }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    products,
    setIsCartOpen,
    setActiveProductModal,
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    product.colors[0] || { name: 'Standard', hex: '#000000' }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<'shipping' | 'details' | null>('shipping');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const discountPercent = product.originalPrice
    ? calculateDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    const success = addToCart(product, selectedSize, selectedColor, quantity);
    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  const handleBuyNow = () => {
    const success = addToCart(product, selectedSize, selectedColor, quantity);
    if (success) {
      onClose();
      setIsCartOpen(true);
    }
  };

  // Related products from same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#0e120f] border border-[#252D28] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#101512]/80 border border-[#252D28] text-[#A5ADA8] hover:text-white hover:border-[#35F582]/60 transition-all backdrop-blur-md"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            
            {/* LEFT: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-[#252D28]">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {discountPercent > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#101512]/90 border border-[#35F582]/40 text-[#35F582] text-xs font-mono font-bold backdrop-blur-sm">
                      Save {discountPercent}%
                    </span>
                  )}
                  {product.stock <= 4 && product.stock > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono">
                      Only {product.stock} left in stock
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all ${
                    isFavorited
                      ? 'bg-[#35F582] text-black border-[#35F582]'
                      : 'bg-black/60 text-white hover:text-[#35F582] border-white/10'
                  }`}
                  aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails row */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#35F582] shadow-[0_0_12px_rgba(53,245,130,0.4)]'
                          : 'border-[#252D28] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Details & Purchase Form */}
            <div className="flex flex-col justify-between space-y-6">
              
              <div>
                {/* Category & SKU */}
                <div className="flex items-center justify-between text-xs text-[#A5ADA8] font-mono mb-2">
                  <span className="text-[#35F582] font-semibold">{product.category}</span>
                  <span>SKU: {product.sku}</span>
                </div>

                {/* Title & Subtitle */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#A5ADA8] mt-1 font-medium">
                  {product.subtitle}
                </p>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#252D28]/60">
                  <div className="flex items-center gap-1 text-[#35F582]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white">{product.rating}</span>
                  <span className="text-xs text-[#A5ADA8]">({product.reviewCount} verified reviews)</span>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-white">
                    {formatPKR(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-[#A5ADA8] line-through font-mono">
                      {formatPKR(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-[#35F582] font-mono">Tax Included</span>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-[#A5ADA8] leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs text-[#A5ADA8] mb-2">
                      <span className="font-semibold text-white">Select Size / Fit:</span>
                      <span className="text-[#35F582] font-mono text-[11px]">{selectedSize}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedSize === size
                              ? 'bg-[#35F582] text-black shadow-[0_0_12px_rgba(53,245,130,0.3)]'
                              : 'bg-[#101512] text-white hover:bg-[#161D19] border border-[#252D28]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs text-[#A5ADA8] mb-2">
                      <span className="font-semibold text-white">Colorway:</span>
                      <span className="text-[#35F582] font-mono text-[11px]">{selectedColor.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {product.colors.map(color => {
                        const isChosen = selectedColor.name === color.name;
                        return (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                              isChosen
                                ? 'border-[#35F582] bg-[#161D19] text-white'
                                : 'border-[#252D28] bg-[#101512] text-[#A5ADA8] hover:border-white/20'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/20"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity & Stock Status */}
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-xs font-semibold text-white">Quantity:</span>
                  <div className="flex items-center bg-[#101512] border border-[#252D28] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-1.5 text-white hover:bg-[#161D19] text-sm disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-mono font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="px-3 py-1.5 text-white hover:bg-[#161D19] text-sm disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  
                  <span className="text-xs font-mono text-[#35F582]">
                    {product.stock > 0 ? `● ${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Purchase Action Buttons */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`py-3.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                      product.stock <= 0
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : addedSuccess
                        ? 'bg-[#35F582] text-black'
                        : 'bg-white hover:bg-[#35F582] text-black'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className="py-3.5 rounded-xl bg-[#35F582] hover:bg-[#2ed672] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(53,245,130,0.3)] disabled:opacity-50"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Informational Accordions */}
              <div className="border-t border-[#252D28] pt-4 space-y-2 text-xs">
                {/* Shipping Accordion */}
                <div className="rounded-xl bg-[#101512] border border-[#252D28] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')}
                    className="w-full p-3 flex items-center justify-between text-left font-semibold text-white hover:text-[#35F582]"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#35F582]" />
                      <span>Nationwide Delivery & Free Returns</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeAccordion === 'shipping' && (
                    <div className="p-3 pt-0 text-[#A5ADA8] space-y-1.5 border-t border-[#252D28]/60 bg-[#0c100e]">
                      <p>• <strong>Lahore & Karachi:</strong> Express 24-48 hour delivery via TCS / Leopards.</p>
                      <p>• <strong>Islamabad & Nationwide:</strong> 48-72 hours with end-to-end SMS tracking.</p>
                      <p>• <strong>Free Shipping:</strong> Automatically applied on orders over Rs. 10,000.</p>
                      <p>• <strong>Cash on Delivery (COD):</strong> Fully supported at doorstep.</p>
                    </div>
                  )}
                </div>

                {/* Technical Specs Accordion */}
                <div className="rounded-xl bg-[#101512] border border-[#252D28] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveAccordion(activeAccordion === 'details' ? null : 'details')}
                    className="w-full p-3 flex items-center justify-between text-left font-semibold text-white hover:text-[#35F582]"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#35F582]" />
                      <span>Specifications & Materials</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === 'details' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeAccordion === 'details' && (
                    <div className="p-3 pt-0 text-[#A5ADA8] space-y-1 border-t border-[#252D28]/60 bg-[#0c100e]">
                      {product.details.map((detail, idx) => (
                        <p key={idx}>• {detail}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#252D28]">
              <h3 className="text-base font-bold text-white mb-4">
                Recommended From {product.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setActiveProductModal(rel);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#101512] border border-[#252D28] hover:border-[#35F582]/60 cursor-pointer transition-all"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-14 h-14 object-cover rounded-lg bg-black"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{rel.name}</p>
                      <p className="text-xs font-mono font-semibold text-[#35F582] mt-0.5">
                        {formatPKR(rel.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export const ProductDetailModal: React.FC = () => {
  const { activeProductModal, setActiveProductModal } = useStore();

  if (!activeProductModal) return null;

  return (
    <ProductDetailContent
      product={activeProductModal}
      onClose={() => setActiveProductModal(null)}
    />
  );
};
