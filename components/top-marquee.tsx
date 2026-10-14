'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface TopCustomer {
  customer_name: string
  total_spent: number
  order_count: number
}

interface TopMarqueeProps {
  /** Refresh interval in ms (default 30s) */
  refreshInterval?: number
}

export function TopMarquee({ refreshInterval = 30000 }: TopMarqueeProps) {
  const [top3, setTop3] = useState<TopCustomer[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTop3 = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('customer_name, total, status')
        .eq('status', 'completed')
        .neq('customer_name', 'Hiếu')

      if (error || !data || data.length === 0) {
        setTop3([])
        return
      }

      // Group by customer_name and sum total spent
      const customerMap = new Map<string, { total_spent: number; order_count: number }>()
      for (const order of data) {
        const name = order.customer_name?.trim() || 'Khách vãng lai'
        const current = customerMap.get(name) || { total_spent: 0, order_count: 0 }
        customerMap.set(name, {
          total_spent: current.total_spent + Number(order.total || 0),
          order_count: current.order_count + 1,
        })
      }

      const sorted = Array.from(customerMap.entries())
        .map(([name, stat]) => ({
          customer_name: name,
          total_spent: stat.total_spent,
          order_count: stat.order_count,
        }))
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 3)

      setTop3(sorted)
    } catch (err) {
      console.error('Lỗi kết nối database:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTop3()
    const interval = setInterval(fetchTop3, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  // Format currency helper (VND)
  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('vi-VN').format(amount) + 'đ'

  const medals = ['🥇', '🥈', '🥉']

  const marqueeText = loading
    ? '🏆 BẢNG PHONG THẦN: Đang tải danh sách đại gia... ⏳'
    : top3.length === 0
      ? '🏆 BẢNG PHONG THẦN: Chưa có đại gia nào chốt đơn! Hãy là người đầu tiên bứt phá top nào anh em! 🔥'
      : `🏆 BẢNG PHONG THẦN: ${top3
          .map((c, idx) => `${medals[idx] || '🎖️'} ${c.customer_name} (${formatMoney(c.total_spent)})`)
          .join(' | ')} - Đặt ngay để đua top nào anh em! 🔥`

  return (
    // CSS animation được định nghĩa trong globals.css (không dùng inline <style>)
    <div className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-orange-950 font-bold text-xs sm:text-sm py-2 px-4 overflow-hidden border-b border-orange-500/30 shadow-xs relative z-50 select-none">
      <div className="flex w-max">
        <div className="animate-marquee flex items-center space-x-12 pr-12">
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
        <div className="animate-marquee flex items-center space-x-12 pr-12" aria-hidden="true">
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>
    </div>
  )
}
