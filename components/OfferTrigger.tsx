// components/OfferTrigger.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'

type Offer = {
  id: string
  link: string
  cashback: number
  cashbackCurrency: string
}

export function OfferTrigger({ eventId }: { eventId: string }) {
  const [offer, setOffer] = useState<Offer | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    let timerId: NodeJS.Timeout
    let interacted = false

    function onUserInteract() {
      interacted = true
    }
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
          setIsOpen(true)
        } catch (e) {
          console.error('Не удалось получить оффер', e)
        }
      }
    }, 10_000)

    return () => {
      clearTimeout(timerId)
      window.removeEventListener('scroll', onUserInteract)
      window.removeEventListener('mousemove', onUserInteract)
    }
  }, [eventId])

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 max-w-sm p-6 bg-white rounded-2xl shadow-lg -translate-x-1/2 -translate-y-1/2">
        {offer && (
          <a
            href={offer.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="block"
          >
            <Image
              src="/banner3.gif"
              alt="Реклама"
              width={300}
              height={250}
              priority
            />
          </a>
        )}
        <div className="mt-6 text-right">
          <Dialog.Close asChild>
            <Button variant="outline">Close</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

