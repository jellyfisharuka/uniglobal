import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import FeaturesSection from "@/components/home/feature-section"
import AchievementsSection from "@/components/home/achievements-section"
import Footer from "@/components/footer"
import MapSection from "@/components/home/map-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="container max-w-6xl mx-auto px-4 flex flex-col min-h-screen">
        <header className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
            <Link href='/' className="flex items-center ">
              <Image src='/logo.svg' width={50} height={50} alt="Logo" />
              {/* <span className="text-xl mt-3 font-medium">
                UniGlobal

              </span> */}
            </Link>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16">
              <div className="flex gap-8 md:gap-16">
                <Link href="/dashboard/chats" className="text-[#000066] text-lg font-medium border-b border-[#000066]">
                  Чаты
                </Link>
                <Link href="/dashboard/faq" className="text-[#000066] text-lg font-medium border-b border-[#000066]">
                  FAQ
                </Link>
              </div>
              <Button asChild className="bg-[#000066] text-white px-10 rounded-lg w-full md:w-auto">
                <Link href='/login'>
                  Войти
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center py-10 md:py-0">
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-12 md:gap-0">
            <div className="w-full md:w-[60%] order-1">
              <h1 className="text-[#000066] text-3xl md:text-4xl font-bold leading-tight">
                ДОСТИГАЙ НОВОГО УРОВНЯ: УЧИСЬ ЗА ГРАНИЦЕЙ С НАШЕЙ ПОМОЩЬЮ
              </h1>
              <p className="mt-6 md:mt-8 text-md md:text-lg text-gray-700 leading-relaxed">
                Не упустите свою возможность учиться за границей: наш бот подскажет каждый шаг, от выбора вуза до подачи документов.
              </p>
              <div className="mt-8 md:mt-12 flex flex-col items-center sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-[#000066] text-white px-6 md:px-10 py-5 rounded-lg text-md w-full sm:w-auto"
                >
                  <Link href='/dashboard/chats'>
                    НАЧАТЬ СЕЙЧАС
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="px-6 md:px-10 py-5 text-md border-2 rounded-lg w-full sm:w-auto"
                >
                  <Link href='#features'>
                    ПОДРОБНЕЕ
                  </Link>
                </Button>
              </div>
            </div>

            <div className="w-full md:w-[50%] order-2">
              <div className="relative w-full rounded-lg aspect-square md:aspect-auto md:h-[600px] lg:h-[700px]">
                <Image
                  fill
                  src="/hero-image.jpeg"
                  alt="Chat Interface"
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <FeaturesSection />
        <AchievementsSection />
        <MapSection />
      </div>
      <Footer />
    </div>
  )
}