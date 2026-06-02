'use client'

import { useTransition } from 'react'
import { useCart } from '@/lib/cart'
import { createCartCheckoutSession } from '@/lib/actions'
import { formatPrice } from '@/lib/format'
import Image from 'next/image'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, incrementItem, decrementItem, clearCart, total, count } = useCart()
  const [pending, startTransition] = useTransition()

  function handleCheckout() {
    startTransition(async () => {
      try {
        await createCartCheckoutSession(items)
      } catch (e: any) {
        alert(e.message ?? 'Une erreur est survenue.')
      }
    })
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-otto-black border-l border-white/8 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/8">
          <div className="flex items-baseline gap-3">
            <p className="font-mono text-[11px] text-otto-chalk uppercase tracking-[0.25em]">Panier</p>
            {count > 0 && (
              <span className="font-mono text-[10px] text-otto-grey">
                {count} article{count > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="font-mono text-[10px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.2em] transition-colors">
            Fermer ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full pb-20">
              <p className="font-mono text-[10px] text-otto-grey/40 uppercase tracking-[0.2em] text-center">
                Votre panier est vide
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-white/5 pb-6">
                {/* Image */}
                <div className="relative w-20 h-24 bg-otto-charcoal shrink-0 overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 glow-dancer opacity-40" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-serif italic text-otto-chalk text-[15px] leading-tight mb-1 truncate">
                    {item.title}
                  </p>
                  <p className="font-mono text-otto-grey text-[9px] uppercase tracking-[0.15em] mb-1">{item.technique}</p>
                  <p className="font-mono text-otto-grey text-[9px] uppercase tracking-[0.15em] mb-3">{item.format}</p>

                  <div className="flex items-center justify-between">
                    {/* Contrôles quantité */}
                    <div className="flex items-center gap-0 border border-white/10">
                      <button
                        onClick={() => decrementItem(item.id)}
                        className="w-7 h-7 flex items-center justify-center font-mono text-[13px] text-otto-grey hover:text-otto-chalk hover:bg-white/5 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-mono text-[11px] text-otto-chalk">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementItem(item.id)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center font-mono text-[13px] text-otto-grey hover:text-otto-chalk hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-mono text-otto-white text-[13px]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="font-mono text-otto-grey/50 text-[9px]">
                          {formatPrice(item.price)} / ex.
                        </p>
                      )}
                    </div>
                  </div>

                  {item.quantity >= item.stock && item.stock > 1 && (
                    <p className="font-mono text-[8px] text-otto-grey/40 uppercase tracking-[0.1em] mt-1">
                      Stock maximum atteint
                    </p>
                  )}

                  <button
                    onClick={() => removeItem(item.id)}
                    className="font-mono text-[8px] text-otto-grey/30 hover:text-red-400 uppercase tracking-[0.1em] transition-colors mt-2"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-white/8 space-y-4">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[10px] text-otto-grey uppercase tracking-[0.2em]">Sous-total</p>
              <p className="font-mono text-otto-white text-[15px]">{formatPrice(total)}</p>
            </div>
            <p className="font-mono text-otto-grey/40 text-[9px] uppercase tracking-[0.12em]">
              Frais de livraison calculés au checkout
            </p>
            <button
              onClick={handleCheckout}
              disabled={pending}
              className="w-full font-mono text-[11px] uppercase tracking-[0.2em] border border-white/25 px-6 py-4 text-otto-chalk hover:bg-white/8 hover:border-white/40 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {pending ? 'Redirection…' : 'Procéder au paiement →'}
            </button>
            <button onClick={clearCart} className="w-full font-mono text-[9px] text-otto-grey/40 hover:text-otto-grey uppercase tracking-[0.15em] transition-colors py-1">
              Vider le panier
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
