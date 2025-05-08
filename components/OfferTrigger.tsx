'use client'

import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'

type Offer = {
  id: string
  title: string
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

    // слушаем скролл и движение мыши
    function onUserInteract() {
      interacted = true
    }
    window.addEventListener('scroll', onUserInteract, { once: true })
    window.addEventListener('mousemove', onUserInteract, { once: true })

    // ставим таймер на 10 секунд
    timerId = setTimeout(async () => {
      if (interacted) {
        // условия выполнены — запрашиваем оффер
        try {
          const res = await fetch(`/api/offers/interaction?eventId=${eventId}`)
          const data = await res.json()
          setOffer(data)
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
        <Dialog.Title className="text-xl font-bold mb-4">
          🎉 Специальное предложение!
        </Dialog.Title>
        {offer && (
          <div className="space-y-4">
            <p>{offer.title}</p>
            <a
              href={offer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Перейти и получить кешбэк {offer.cashback}
              {offer.cashbackCurrency}
            </a>
          </div>
        )}
        <div className="mt-6 text-right">
          <Dialog.Close asChild>
            <Button variant="outline">Закрыть</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
