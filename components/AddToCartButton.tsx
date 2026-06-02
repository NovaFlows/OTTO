'use client'

import { useCart } from '@/lib/cart'

export default function AddToCartButton({ oeuvre }: { oeuvre: any }) {
  const { addItem, items, openCart } = useCart()
  const cartItem = items.find((i) => i.id === oeuvre.id)
  const inCart   = !!cartItem
  const atMax    = inCart && cartItem!.quantity >= (oeuvre.stock ?? 1)

  function handleClick() {
    if (atMax) { openCart(); return }
    if (inCart) {
      addItem({
        id:        oeuvre.id,
        slug:      oeuvre.slug,
        title:     oeuvre.title,
        price:     oeuvre.price,
        image:     oeuvre.images?.[0] ?? null,
        technique: oeuvre.technique,
        format:    oeuvre.format,
        quantity:  1,
        stock:     oeuvre.stock ?? 1,
      })
      return
    }
    addItem({
      id:        oeuvre.id,
      slug:      oeuvre.slug,
      title:     oeuvre.title,
      price:     oeuvre.price,
      image:     oeuvre.images?.[0] ?? null,
      technique: oeuvre.technique,
      format:    oeuvre.format,
      quantity:  1,
      stock:     oeuvre.stock ?? 1,
    })
  }

  return (
    <button
      onClick={handleClick}
      className="font-mono text-[11px] text-otto-chalk uppercase tracking-[0.18em] border border-white/20 px-8 py-4 hover:bg-white/8 hover:border-white/35 transition-all duration-200 w-full text-center disabled:opacity-40"
      disabled={atMax}
    >
      {atMax
        ? 'Stock maximum dans le panier'
        : inCart
        ? `Ajouter à nouveau (${cartItem!.quantity} dans le panier) →`
        : '+ Ajouter au panier'}
    </button>
  )
}
