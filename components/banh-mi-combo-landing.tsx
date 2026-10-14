'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
  Flame,
  ShoppingBag,
  Sparkles,
  X,
  ArrowRight,
  Clock,
  ShieldCheck,
  Percent,
} from 'lucide-react'

// ExitIntentModal – lazy loaded, chỉ parse JS khi user có ý định thoát
const ExitIntentModal = dynamic(
  () => import('./exit-intent-modal').then(m => ({ default: m.ExitIntentModal })),
  { ssr: false }
)

interface BanhMiComboLandingProps {
  /** Path to the combo banner image (default: /banner_combo.webp) */
  bannerSrc?: string
  /** Starting price of the combo in VND string/number */
  comboStartingPrice?: string
  /** Voucher code provided in the exit-intent popup */
  freeshipCode?: string
  /** Callback when user clicks any CTA button */
  onOrderClick?: () => void
  /** Callback when user clicks 'Xem Bảng Đại Gia' button */
  onOpenLeaderboard?: () => void
}

/**
 * Helper to check if a specific cookie exists in document.cookie
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const c = cookies[i].trim()
    if (c.startsWith(name + '=')) {
      return decodeURIComponent(c.substring(name.length + 1))
    }
  }
  return null
}

export function BanhMiComboLanding({
  bannerSrc = '/banner_combo.webp',
  comboStartingPrice = '19.000đ',
  freeshipCode = 'FREESHIPCOMBO',
  onOrderClick,
  onOpenLeaderboard,
}: BanhMiComboLandingProps) {
  // ── State 1: Sticky Top Bar visibility
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [isStickyDismissed, setIsStickyDismissed] = useState(false)

  // ── State 2: Exit-Intent Modal visibility (deferred load)
  const [showExitModal, setShowExitModal] = useState(false)

  // Smooth scroll or trigger order action
  const handleScrollToMenu = useCallback(() => {
    if (onOrderClick) {
      onOrderClick()
    } else {
      const menuEl = document.getElementById('menu')
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 600, behavior: 'smooth' })
      }
    }
  }, [onOrderClick])

  // ────────────────────────────────────────────────────────────
  // FEATURE 2: Sticky Top Bar on Scroll (> 300px)
  // Debounced với requestAnimationFrame để tránh block main thread
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    let rafId: number | null = null

    const handleScroll = () => {
      // Dùng RAF thay vì chạy setState trực tiếp trong scroll handler
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        setShowStickyBar(window.scrollY > 300)
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  // ────────────────────────────────────────────────────────────
  // FEATURE 3: Exit-Intent Trigger – defer setup 2s sau khi mount
  // Không setup ngay để tránh block main thread khi trang đang load
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const setup = () => {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 || (e.relatedTarget === null && e.clientY <= 10)) {
          const hasOrderCookie = getCookie('has_order')
          if (hasOrderCookie) return

          const hasTriggeredInSession = sessionStorage.getItem('has_shown_exit_intent')
          if (hasTriggeredInSession) return

          sessionStorage.setItem('has_shown_exit_intent', 'true')
          setShowExitModal(true)
        }
      }

      document.addEventListener('mouseleave', handleMouseLeave)
      return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }

    // Delay 2s để không block main thread lúc trang vừa load
    let cleanup: (() => void) | undefined
    timer = setTimeout(() => {
      cleanup = setup()
    }, 2000)

    return () => {
      clearTimeout(timer)
      cleanup?.()
    }
  }, [])

  const handleClaimVoucherAndOrder = useCallback(() => {
    setShowExitModal(false)
    handleScrollToMenu()
  }, [handleScrollToMenu])

  return (
    <>
      {/* ────────────────────────────────────────────────────────
          FEATURE 2: STICKY TOP NOTIFICATION BAR (Scroll-triggered)
          ──────────────────────────────────────────────────────── */}
      <aside
        aria-label="Khuyến mãi nhanh"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out transform ${
          showStickyBar && !isStickyDismissed
            ? 'translate-y-0 opacity-100 shadow-md'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white px-3 py-2 sm:py-2.5">
          <div className="container mx-auto flex items-center justify-between gap-2 max-w-6xl">
            {/* Promo Text with Pulsing Fire Icon */}
            <div className="flex items-center gap-2 min-w-0 text-xs sm:text-sm font-semibold truncate">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 shrink-0">
                <Flame className="w-4 h-4 text-amber-300 animate-pulse fill-amber-300" />
              </span>
              <span className="truncate">
                <span className="font-extrabold text-amber-200">Đừng bỏ lỡ:</span> Combo Bánh Mì + Nước chỉ từ{' '}
                <span className="font-extrabold underline decoration-amber-300">{comboStartingPrice}</span>!
              </span>
            </div>

            {/* Small Action Button & Close */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleScrollToMenu}
                className="bg-white text-orange-700 hover:bg-amber-100 font-extrabold text-xs px-3 py-1.5 rounded-full transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1"
              >
                <span>Mua Ngay</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => setIsStickyDismissed(true)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                title="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────
          FEATURE 1: HERO SECTION BANNER (Top Section)
          ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-background border-b border-border/60">
        {/* Background ambient glow spots */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-6 sm:py-10 lg:py-12 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Column: Headlines, Value Props & Main CTA */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-center lg:text-left">
              {/* Promo Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                <span>COMBO SIÊU TIẾT KIỆM • BÁN CHẠY NHẤT</span>
              </div>

              {/* Main Headline - H1 duy nhất của trang, chứa từ khoá SEO chính */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.15]">
                Combo <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600">Bánh Mì Chả Cá Hieudeptrai</span> Giòn Rụm + Nước Mát Lạnh
              </h1>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Bánh mì nướng nóng hổi ngập tràn nhân chả cá, trứng ốp laa kết hợp hoàn hảo cùng ly cà phê gia lai đậm đà hoặc trà mát lạnh sảng khoái.
              </p>

              {/* Highlights Feature Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-foreground/80 font-medium">
                <span className="flex items-center gap-1.5 bg-background/80 border border-border px-3 py-1.5 rounded-xl shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  Giao tận nơi
                </span>
                <span className="flex items-center gap-1.5 bg-background/80 border border-border px-3 py-1.5 rounded-xl shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  100% Tươi ngon
                </span>
                <span className="flex items-center gap-1.5 bg-background/80 border border-border px-3 py-1.5 rounded-xl shadow-2xs">
                  <Percent className="w-3.5 h-3.5 text-rose-500" />
                  Tiết kiệm
                </span>
              </div>

              {/* PROMINENT CALL TO ACTION (CTA) BUTTONS */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={handleScrollToMenu}
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-black text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
                >
                  {/* Shimmer sweep animation */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out" />
                  
                  <ShoppingBag className="w-5 h-5 text-white transition-transform group-hover:rotate-12" />
                  <span className="tracking-wide">ĐẶT COMBO NGAY</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>

                {/* 👑 Xem Bảng Đại Gia Gold CTA Button */}
                <button
                  type="button"
                  onClick={onOpenLeaderboard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600 text-amber-950 font-black text-base shadow-lg shadow-amber-400/20 hover:shadow-amber-400/35 hover:scale-[1.03] active:scale-[0.98] border border-amber-300/60 transition-all duration-200 cursor-pointer"
                >
                  <span className="text-lg">👑</span>
                  <span>Xem Bảng Đại Gia</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Banner Image Card (Full Aspect Ratio 1376:768, No Cropping) */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto w-full group">
                {/* Decorative glowing card frame */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-2xl sm:rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition duration-500" />

                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/30 bg-card shadow-2xl">
                  {/* Aspect Ratio 1376/768 matches exact dimensions of banner_combo.webp */}
                  <div className="relative w-full aspect-[1376/768] bg-muted/20">
                    <Image
                      src={bannerSrc}
                      alt="Bánh mì chả cá Hieudeptrai nóng giòn thơm ngon"
                      fill
                      priority
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-102"
                    />
                  </div>

                  {/* Floating Price Tag on top of image */}
                  <div className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 bg-slate-900/90 backdrop-blur-md border border-amber-500/40 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                      🔥
                    </div>
                    <div>
                      <div className="text-[9px] sm:text-[10px] text-amber-300 font-semibold uppercase tracking-wider">Giá ưu đãi</div>
                      <div className="text-xs sm:text-sm font-black text-white leading-none mt-0.5">
                        Từ {comboStartingPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          FEATURE 3: EXIT-INTENT MODAL – lazy loaded chunk
          Chỉ render khi user có ý định thoát, không parse JS sớm
          ──────────────────────────────────────────────────────── */}
      {showExitModal && (
        <ExitIntentModal
          freeshipCode={freeshipCode}
          onClose={() => setShowExitModal(false)}
          onClaim={handleClaimVoucherAndOrder}
        />
      )}
    </>
  )
}
export default BanhMiComboLanding
