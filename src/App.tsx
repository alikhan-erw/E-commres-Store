import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { CategoryPills } from './components/CategoryPills.tsx';
import { ProductGrid } from './components/ProductGrid.tsx';
import { PromoBanner } from './components/PromoBanner.tsx';
import { BrandIntro } from './components/BrandIntro.tsx';
import { Testimonials } from './components/Testimonials.tsx';
import { Newsletter } from './components/Newsletter.tsx';
import { Footer } from './components/Footer.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderConfirmationModal } from './components/OrderConfirmationModal.tsx';
import { CustomerAuthModal } from './components/CustomerAuthModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { ToastContainer } from './components/Toast.tsx';
import { AboutPage } from './components/AboutPage.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { CollectionsPage } from './components/CollectionsPage.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';

const AppContent: React.FC = () => {
  const { activePage } = useStore();

  return (
    <div className="min-h-screen bg-[#050706] text-white flex flex-col selection:bg-[#35F582] selection:text-black">
      {/* Top Header */}
      <Header />

      {/* Main Content routing */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <Hero />
            <CategoryPills />
            <ProductGrid
              title="Curated Masterpieces"
              subtitle="Precision-engineered luxury essentials. Stocked locally and shipped across Pakistan & worldwide."
            />
            <PromoBanner />
            <BrandIntro />
            <Testimonials />
            <Newsletter />
          </>
        )}

        {activePage === 'shop' && (
          <div className="pt-20">
            <CategoryPills />
            <ProductGrid
              title="Complete Inventory"
              subtitle="Explore all available footwear, technical apparel, luggage, timepieces, and accessories in PKR."
            />
          </div>
        )}

        {activePage === 'collections' && <CollectionsPage />}

        {activePage === 'about' && <AboutPage />}

        {activePage === 'contact' && <ContactPage />}

        {activePage === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <CustomerAuthModal />
      <SearchModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
