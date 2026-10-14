'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useTransition } from 'react'
import { CartProvider } from '@/lib/cart-context'
import { Header } from '@/components/header'
import { BanhMiComboLanding } from '@/components/banh-mi-combo-landing'
import { UtensilsCrossed, Trophy, Search } from 'lucide-react'
import type { MenuItem, Topping } from '@/lib/types'
import type { BuyNowItem } from '@/components/checkout-dialog'

// ── Above-the-fold: static imports (critical for LCP/FCP)
// TopMarquee & Header & BanhMiComboLanding đều hiển thị ngay màn hình đầu

// ── Below-the-fold: dynamic imports (tách chunk, giảm TBT)
const MenuSection = dynamic(
  () => import('@/components/menu-section').then(m => ({ default: m.MenuSection })),
  { ssr: false, loading: () => <TabContentSkeleton /> }
)

const GoldenBoard = dynamic(
  () => import('@/components/golden-board').then(m => ({ default: m.GoldenBoard })),
  { ssr: false, loading: () => <TabContentSkeleton /> }
)

const DebtSearchSection = dynamic(
  () => import('@/components/debt-search-section').then(m => ({ default: m.DebtSearchSection })),
  { ssr: false, loading: () => <TabContentSkeleton /> }
)

// Modals/Sidebars – không render đến khi user trigger
const CartSidebar = dynamic(
  () => import('@/components/cart-sidebar').then(m => ({ default: m.CartSidebar })),
  { ssr: false }
)

const CheckoutDialog = dynamic(
  () => import('@/components/checkout-dialog').then(m => ({ default: m.CheckoutDialog })),
  { ssr: false }
)

const LeaderboardModal = dynamic(
  () => import('@/components/leaderboard-modal').then(m => ({ default: m.LeaderboardModal })),
  { ssr: false }
)

// ChatBot – floating widget, không cần render sớm
const ChatBot = dynamic(
  () => import('@/components/chatbot').then(m => ({ default: m.ChatBot })),
  { ssr: false }
)

// Footer – cuối trang
const Footer = dynamic(
  () => import('@/components/footer').then(m => ({ default: m.Footer })),
  { ssr: false }
)

const TopMarquee = dynamic(
  () => import('@/components/top-marquee').then(m => ({ default: m.TopMarquee })),
  { ssr: false }
)

// ── Tab definitions (static, không gây re-render)
type Tab = 'menu' | 'golden' | 'debt'

const TABS: { id: Tab; label: string; icon: React.ReactNode; emoji: string }[] = [
  { id: 'menu',   label: 'Thực Đơn',  icon: <UtensilsCrossed className="w-4 h-4" />, emoji: '🥖' },
  { id: 'golden', label: 'Bảng Vàng', icon: <Trophy className="w-4 h-4" />,          emoji: '🏆' },
  { id: 'debt',   label: 'Công Nợ',   icon: <Search className="w-4 h-4" />,          emoji: '🔍' },
]

// ── Skeleton placeholder cho tab content khi loading
function TabContentSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

function BanhMiApp() {
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [buyNowItem, setBuyNowItem] = useState<BuyNowItem | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('menu')

  // useTransition để không block UI khi chuyển tab (giảm TBT)
  const [, startTransition] = useTransition()

  const handleTabChange = useCallback((tab: Tab) => {
    startTransition(() => {
      setActiveTab(tab)
    })
  }, [])

  const handleCheckout = useCallback(() => {
    setBuyNowItem(null)
    setCartOpen(false)
    setCheckoutOpen(true)
  }, [])

  const handleBuyNow = useCallback((item: MenuItem, toppings: Topping[], notes?: string) => {
    setBuyNowItem({ menuItem: item, selectedToppings: toppings, notes })
    setCartOpen(false)
    setCheckoutOpen(true)
  }, [])

  const handleCloseCheckout = useCallback(() => {
    setCheckoutOpen(false)
    setBuyNowItem(null)
  }, [])

  const handleOrderClick = useCallback(() => {
    handleTabChange('menu')
    const menuEl = document.getElementById('menu')
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' })
    }
  }, [handleTabChange])

  const handleOpenCart = useCallback(() => setCartOpen(true), [])
  const handleCloseCart = useCallback(() => setCartOpen(false), [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 🏆 Marquee – lazy loaded sau khi hydrate */}
      <TopMarquee />

      <Header onCartClick={handleOpenCart} />

      <main className="flex-1">
        {/* Above-the-fold: static import, render ngay */}
        <BanhMiComboLanding
          bannerSrc="/banner_combo.webp"
          comboStartingPrice="19.000đ"
          freeshipCode="FREESHIPCOMBO"
          onOrderClick={handleOrderClick}
          onOpenLeaderboard={() => setLeaderboardOpen(true)}
        />

        {/* ── Tab Bar ── */}
        <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="container mx-auto px-4 py-2.5">
            <nav
              className="flex items-center gap-1 bg-muted/60 rounded-xl p-1 w-fit mx-auto shadow-inner"
              aria-label="Điều hướng chính"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    aria-selected={isActive}
                    className={[
                      'relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 outline-none select-none whitespace-nowrap',
                      isActive
                        ? 'bg-background text-primary shadow-sm ring-1 ring-border/40'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    ].join(' ')}
                  >
                    <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                      {isActive
                        ? <span className="text-sm leading-none">{tab.emoji}</span>
                        : tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* ── Tab Content – dynamic, lazy loaded ── */}
        <div>
          {activeTab === 'menu'   && <MenuSection onBuyNow={handleBuyNow} />}
          {activeTab === 'golden' && <GoldenBoard />}
          {activeTab === 'debt'   && <DebtSearchSection />}
        </div>
      </main>

      {/* Footer – lazy loaded, cuối trang */}
      <Footer />

      {/* Chatbot floating – chỉ render sau khi page load xong */}
      <ChatBot />

      {/* Modals / Drawers – chỉ mount khi cần */}
      {cartOpen && (
        <CartSidebar
          open={cartOpen}
          onClose={handleCloseCart}
          onCheckout={handleCheckout}
        />
      )}

      {checkoutOpen && (
        <CheckoutDialog
          open={checkoutOpen}
          onClose={handleCloseCheckout}
          buyNowItem={buyNowItem}
        />
      )}

      {leaderboardOpen && (
        <LeaderboardModal
          isOpen={leaderboardOpen}
          onClose={() => setLeaderboardOpen(false)}
        />
      )}
    </div>
  )
}

export default function Home() {
  return (
    <CartProvider>
      <BanhMiApp />
    </CartProvider>
  )
}
