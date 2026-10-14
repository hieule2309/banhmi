'use client'

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { CartItem, MenuItem, Topping } from './types'

interface CartContextType {
  items: CartItem[]
  addItem: (menuItem: MenuItem, toppings: Topping[], notes?: string) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Dùng useCallback để các function không bị tạo mới mỗi render
  // -> tránh re-render toàn bộ consumers của CartContext
  const addItem = useCallback((menuItem: MenuItem, toppings: Topping[], notes?: string) => {
    setItems((prev) => [
      ...prev,
      {
        menuItem,
        quantity: 1,
        selectedToppings: toppings,
        notes,
      },
    ])
  }, [])

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((_, i) => i !== index))
      return
    }
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // useMemo để computed values không recalc khi render không liên quan
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => {
        const itemPrice =
          item.menuItem.price +
          item.selectedToppings.reduce((t, topping) => t + topping.price, 0)
        return sum + itemPrice * item.quantity
      }, 0),
    [items]
  )

  // useMemo cho context value để tránh tạo object mới mỗi render
  // -> chỉ re-render consumers khi items thực sự thay đổi
  const contextValue = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice]
  )

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
