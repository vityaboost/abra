// components/OfferTrigger.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'

export type Offer = {
  id: string
  link: string
  cashback: number
  cashbackCurrency: string
}

interface OfferTriggerProps {
  /** Идентификатор страницы/события для API */
  eventId: string
  /** Режим рендера: modal (по умолчанию) или inline */
  mode?: 'modal' | 'inline'
  /** Путь до гифки */
  bannerSrc?: string
  /** Размеры баннера */
  width?: number
  height?: number
  /** URL, по которому должен вести баннер */
  bannerLink?: string
}

export function OfferTrigger({
  eventId,
  mode = 'modal',
  bannerSrc = '/banner3.gif',
  width = 300,
  height = 250,
  bannerLink = 'https://xametyst.com/hWSJCtH6',
}: OfferTriggerProps) {
  const [offer, setOffer] = useState<Offer | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    let timerId: NodeJS.Timeout
    let interacted = false

    const onUserInteract = () => (interacted = true)
    window.addEventListener('scroll', onUserInteract, { once: true })
    window.addEventListener('mousemove', onUserInteract, { once: true })

    timerId = setTimeout(async () => {
      if (interacted) {
        try {
          const res = await fetch(`/api/offers/interaction?eventId=${eventId}`)
          const data = await res.json()
          setOffer({
            id: data.id,
            link: data.link,
            cashback: data.cashback,
            cashbackCurrency: data.cashbackCurrency,
          })
          if (mode === 'modal') setIsOpen(true)
        } catch (e) {
          console.error('', e)
        }
      }
    }, 10_000)

    return () => {
      clearTimeout(timerId)
      window.removeEventListener('scroll', onUserInteract)
      window.removeEventListener('mousemove', onUserInteract)
    }
  }, [eventId, mode])

  if (!offer) return null

  const href = bannerLink ?? offer.link

  // --- INLINE MODE ---
  if (mode === 'inline') {
    return (
      <div className="w-full flex justify-center my-8">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Image
            src={bannerSrc}
            alt="Ad"
            width={width}
            height={height}
            priority
          />
        </a>
      </div>
    )
  }

  // --- MODAL MODE (по умолчанию) ---
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 max-w-sm p-6 bg-white rounded-2xl shadow-lg -translate-x-1/2 -translate-y-1/2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsOpen(false)}
          className="block"
        >
          <Image
            src={bannerSrc}
            alt="Ad"
            width={width}
            height={height}
            priority
          />
        </a>
        <div className="mt-6 text-right">
          <Dialog.Close asChild>
            <Button variant="outline">Close</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
