'use client'

import Image from 'next/image'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
// import { features } from '@/constants/features'
// import { Feature } from '@/types/animation'

import { Feature } from "@/types/animation";

export const features: Feature[] = [
  {
    id: 1,
    title: "Полный список документов",
    description: "Узнайте, какие документы и шаги необходимы для успешного поступления за границу. Мы подробно объясним все этапы, от подачи заявки до получения визы.",
    image: "/features/documents-icon.png",
    bgColor: "bg-[#0A1E3D]",
    imageSize: {
      width: 72,
      mdWidth: 72,
      imgWidth: 300
    },
    reverse: false
  },
  {
    id: 2,
    title: "Идеальная программа для вас",
    description: "Выберите страну, программу и тип визы, которые соответствуют вашим целям. Мы предложим варианты, основанные на ваших предпочтениях.",
    image: "/features/program-icon.png",
    bgColor: "bg-[#D9D9D9]",
    textColor: "text-gray-700",
    imageSize: {
      width: 72,
      mdWidth: 72,
      imgWidth: 300
    },
    reverse: true
  },
  {
    id: 3,
    title: "Персональный помощник",
    description: "Заполните несколько вопросов в диалоге с нашим ботом, и получите индивидуальные рекомендации по выбору программ, документов и виз.",
    image: "/features/assistant-icon.png",
    bgColor: "bg-[#006A67]",
    imageSize: {
      width: 72,
      mdWidth: 72,
      imgWidth: 300
    },
    reverse: false
  },
  {
    id: 4,
    title: "Письма",
    description: "Создавайте профессиональные мотивационные письма и резюме с помощью нашего простого интерфейса. Все для того, чтобы вы выделились среди других кандидатов.",
    image: "/features/letters-icon.png",
    bgColor: "bg-[#5B99A5]",
    imageSize: {
      width: 72,
      mdWidth: 72,
      imgWidth: 300
    },
    reverse: true
  }
]

gsap.registerPlugin(ScrollTrigger, Observer)

const FeatureCard = ({ feature }: { feature: Feature }) => (
  <div className={`flex flex-col justify-between ${feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center  ${feature.bgColor} rounded-3xl p-8 md:p-12 gap-8 min-h-[300px] md:min-h-[400px]`}>
    <div className="w-[100px] h-[100px] md:w-[300px] md:h-[300px] relative flex-shrink-0">
      <Image
        src={feature.image}
        alt={feature.title}
        width={300}
        height={300}
        className="object-contain"
      />
    </div>
    <div className={`flex flex-col max-w-md ${feature.textColor || 'text-white'}`}>
      <h3 className="text-2xl md:text-3xl mb-4">{feature.title}</h3>
      <p className="text-lg md:text-xl opacity-90 leading-relaxed">{feature.description}</p>
    </div>
  </div>
)

const FeaturesSection = () => {
  const containerRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.feature-card')

      gsap.set(cards.slice(1), {
        yPercent: 100,
        opacity: 0,
        scale: 1
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (cards.length - 1),
          start: 'center center',
          end: `+=${(cards.length - 1) * 100}%`
        }
      })

      cards.forEach((card, i) => {
        if (i === 0) return;

        tl.to(cards[i - 1], {
          yPercent: -10,
          scale: 0.95,
          ease: "power1.inOut"
        }).fromTo(card,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: "power1.inOut" },
          "<"
        )
      })
    }, containerRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <section id="features" className="py-20">
      <h2 className="text-3xl md:text-4xl text-center font-bold text-navy-900 mb-16">
        Функции сайта
      </h2>

      <div className="hidden md:block" ref={containerRef}>
        <div className="max-w-5xl mx-auto px-4">
          <div ref={cardsRef} className="relative grid">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="feature-card"
                style={{ gridArea: '1 / 1 / 2 / 2' }}
              >
                <FeatureCard feature={feature} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-8 px-4">
        {features.map(feature => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection