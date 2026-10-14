'use client'

import { Copy, Check, Sparkles, X, Gift } from 'lucide-react'
import { useState } from 'react'

interface ExitIntentModalProps {
  freeshipCode: string
  onClose: () => void
  onClaim: () => void
}

export function ExitIntentModal({ freeshipCode, onClose, onClaim }: ExitIntentModalProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(freeshipCode)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2500)
    }
  }

  const handleClaimAndOrder = () => {
    handleCopyCode()
    onClaim()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-md bg-card border-2 border-orange-500/30 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header with Gradient */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-md">
            🎁
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            Khoan đã! Tặng bạn mã freeship cho Combo Bánh mì + Nước nè!
          </h2>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Đừng bỏ lỡ bữa ăn ngon miệng hôm nay! Áp dụng ngay mã ưu đãi để nhận{' '}
            <strong className="text-foreground">Freeship 100%</strong> cho đơn hàng Combo của bạn.
          </p>

          {/* Voucher Code Box */}
          <div className="flex items-center justify-between gap-2 p-3 bg-muted/60 border-2 border-dashed border-orange-500/40 rounded-2xl">
            <div className="flex items-center gap-2 pl-2">
              <Gift className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="font-mono font-black text-base sm:text-lg text-orange-600 dark:text-orange-400 tracking-wider">
                {freeshipCode}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Đã chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleClaimAndOrder}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-black text-sm sm:text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Nhận Mã Ngay & Đặt Hàng</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground font-medium py-1 transition-colors"
            >
              Không, cảm ơn • Tôi muốn xem tiếp
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
