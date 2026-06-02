'use client'

import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react'

export interface CartItem {
  id: string
  slug: string
  title: string
  price: number
  image: string | null
  technique: string
  format: string
  quantity: number
  stock: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM';       item: CartItem }
  | { type: 'REMOVE_ITEM';    id: string }
  | { type: 'INCREMENT_ITEM'; id: string }
  | { type: 'DECREMENT_ITEM'; id: string }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'HYDRATE';        items: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.item.id)
      if (existing) {
        // Déjà dans le panier — on incrémente si stock dispo
        if (existing.quantity >= existing.stock) {
          return { ...state, isOpen: true }
        }
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }], isOpen: true }
    }
    case 'INCREMENT_ITEM':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id && i.quantity < i.stock
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      }
    case 'DECREMENT_ITEM':
      return {
        ...state,
        items: state.items
          .map((i) => i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i)
          .filter((i) => i.quantity > 0),
      }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'HYDRATE':
      return { ...state, items: action.items }
    default:
      return state
  }
}

interface CartContextValue extends CartState {
  addItem:       (item: CartItem) => void
  removeItem:    (id: string) => void
  incrementItem: (id: string) => void
  decrementItem: (id: string) => void
  clearCart:     () => void
  openCart:      () => void
  closeCart:     () => void
  total:         number
  count:         number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('otto-cart')
      if (saved) dispatch({ type: 'HYDRATE', items: JSON.parse(saved) })
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem('otto-cart', JSON.stringify(state.items)) } catch {}
  }, [state.items, hydrated])

  const addItem       = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM',       item }), [])
  const removeItem    = useCallback((id: string)     => dispatch({ type: 'REMOVE_ITEM',    id }), [])
  const incrementItem = useCallback((id: string)     => dispatch({ type: 'INCREMENT_ITEM', id }), [])
  const decrementItem = useCallback((id: string)     => dispatch({ type: 'DECREMENT_ITEM', id }), [])
  const clearCart     = useCallback(()               => dispatch({ type: 'CLEAR_CART' }), [])
  const openCart      = useCallback(()               => dispatch({ type: 'OPEN_CART' }), [])
  const closeCart     = useCallback(()               => dispatch({ type: 'CLOSE_CART' }), [])

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, incrementItem, decrementItem, clearCart, openCart, closeCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
