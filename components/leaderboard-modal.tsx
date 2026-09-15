'use client'

import { useEffect, useState } from 'react'
import { X, Trophy, Crown, Sparkles, RefreshCw, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export interface CustomerLeaderboardItem {
  customer_name: string
  total_spent: number
  order_count: number
}

interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [customers, setCustomers] = useState<CustomerLeaderboardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      // Query completed orders from PostgreSQL public.orders table
      const { data, error } = await supabase
        .from('orders')
        .select('customer_name, total, status')
        .eq('status', 'completed')
        .neq('customer_name', 'Hiếu')
        .neq('customer_name', 'Hieu')

      if (error) {
        console.error('Lỗi khi lấy danh sách đại gia:', error)
        return
      }

      if (!data) {
        setCustomers([])
        return
      }

      // Group by customer_name and calculate total spend & order count
      const map = new Map<string, { total_spent: number; order_count: number }>()
      for (const order of data) {
        const name = order.customer_name?.trim() || 'Khách vãng lai'
        const current = map.get(name) || { total_spent: 0, order_count: 0 }
        map.set(name, {
          total_spent: current.total_spent + Number(order.total || 0),
          order_count: current.order_count + 1,
        })
      }

      // Convert to array and sort descending by total_spent
      const sorted = Array.from(map.entries())
        .map(([name, stat]) => ({
          customer_name: name,
          total_spent: stat.total_spent,
          order_count: stat.order_count,
        }))
        .sort((a, b) => b.total_spent - a.total_spent)

      setCustomers(sorted)
    } catch (err) {
      console.error('Lỗi khi tải bảng đại gia:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard()
    }
  }, [isOpen])

  if (!isOpen) return null

  // Format currency helper
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
  }

  // Filter list by search term
  const filteredCustomers = customers.filter((c) =>
    c.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Top titles and styling
  const getBadgeInfo = (index: number) => {
    switch (index) {
      case 0:
        return {
          rankBadge: '🥇',
          title: 'Đại Gia Bánh Mì',
          bg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-400/50',
          avatarBg: 'bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 font-black ring-2 ring-amber-400',
          textColor: 'text-amber-600 dark:text-amber-400 font-black',
        }
      case 1:
        return {
          rankBadge: '🥈',
          title: 'Tay Chơi Thứ Thiệt',
          bg: 'bg-gradient-to-r from-slate-200/50 to-slate-100/30 dark:from-slate-800/40 dark:to-slate-900/20 border-slate-300 dark:border-slate-700',
          avatarBg: 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900 font-bold',
          textColor: 'text-slate-700 dark:text-slate-300 font-bold',
        }
      case 2:
        return {
          rankBadge: '🥉',
          title: 'Thần Ăn Vặt',
          bg: 'bg-gradient-to-r from-orange-500/15 to-amber-600/10 border-orange-400/40',
          avatarBg: 'bg-gradient-to-br from-orange-400 to-amber-600 text-white font-bold',
          textColor: 'text-orange-700 dark:text-orange-300 font-bold',
        }
      default:
        return {
          rankBadge: `#${index + 1}`,
          title: 'Hội Viên Thân Thiết',
          bg: 'bg-card border-border/60 hover:bg-muted/40',
          avatarBg: 'bg-muted text-muted-foreground font-semibold',
          textColor: 'text-foreground font-semibold',
        }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-xl bg-card border-2 border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 text-white relative shrink-0 shadow-md">
          {/* Close button X */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
              👑
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-amber-100 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
                Vinh Danh Văn Phòng
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                BẢNG ĐẠI GIA BÁNH MÌ
              </h2>
            </div>
          </div>
        </div>

        {/* Search & Stats Filter bar */}
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm tên đại gia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          <button
            type="button"
            onClick={fetchLeaderboard}
            disabled={loading}
            className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 flex items-center gap-1 text-xs font-semibold"
            title="Làm mới"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>

        {/* Customer List Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
        <small className='text-[14px] mt-2 block text-red-500'>🥲🥲🥲Ae cho bé xin lũi này do web thiết kế sau nên ko đủ full data bánh mì các tháng trước đó 🥲🥲🥲</small>
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-sm font-semibold">Đang tính toán tổng chi tiêu của các đại gia...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <div className="text-4xl">🥪</div>
              <p className="text-base font-bold text-foreground">
                {searchTerm ? 'Không tìm thấy đại gia nào tên này!' : 'Chưa có dữ liệu chốt đơn'}
              </p>
              <p className="text-xs">
                {searchTerm ? 'Thử tìm tên khác xem sao anh em nhé' : 'Đặt combo ngay để trở thành Đại Gia số 1!'}
              </p>
            </div>
          ) : (
            filteredCustomers.map((customer, index) => {
              const badge = getBadgeInfo(index)

              return (
                <div
                  key={customer.customer_name}
                  className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 shadow-2xs ${badge.bg}`}
                >
                  {/* Rank badge / medal */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg font-black shrink-0">
                    {badge.rankBadge}
                  </div>

                  {/* Avatar */}
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-sm sm:text-base shrink-0 shadow-xs ${badge.avatarBg}`}>
                    {customer.customer_name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + Title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm sm:text-base font-extrabold text-foreground truncate">
                        {customer.customer_name}
                      </p>
                      {index === 0 && <Crown className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500 animate-bounce" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="font-semibold text-amber-600 dark:text-amber-400">{badge.title}</span>
                      <span>•</span>
                      <span>{customer.order_count} đơn hàng</span>
                    </div>
                  </div>

                  {/* Total Money */}
                  <div className="text-right shrink-0">
                    <p className={`text-sm sm:text-base font-black ${badge.textColor}`}>
                      {formatMoney(customer.total_spent)}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">Tổng tiền ủng hộ</p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/40 text-center text-xs text-muted-foreground font-medium shrink-0">
          🔥 Dữ liệu được cập nhật tự động từ hệ thống chốt đơn.
        </div>

      </div>
    </div>
  )
}
