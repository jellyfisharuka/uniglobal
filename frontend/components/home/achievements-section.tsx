import Image from "next/image"
import { Card } from "@/components/ui/card"

const achievements = [
    {
        id: 1,
        title: "Успешных поступлений",
        number: "1200+",
        subtitle: "поступлений",
        image: "/achievements/admissions.png"
    },
    {
        id: 2,
        title: "Стран для обучения",
        number: "30+",
        subtitle: "стран",
        image: "/achievements/countries.png"
    },
    {
        id: 3,
        title: "Программ для выбора",
        number: "400+",
        subtitle: "программ",
        image: "/achievements/programs.png"
    },
    {
        id: 4,
        title: "Экономия на обучении",
        number: "$500,000+",
        subtitle: "экономия",
        image: "/achievements/savings.png"
    }
]

const AchievementsSection = () => {
    return (
        <section className="py-20">
            <div className="container max-w-5xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl text-center font-bold text-navy-900 mb-16">
                    Наши достижения
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {achievements.map((achievement) => (
                        <Card
                            key={achievement.id}
                            className="group relative overflow-hidden rounded-3xl transition-transform duration-300 hover:scale-105"
                        >
                            <div className="relative h-[400px] w-full">
                                <Image
                                    src={achievement.image}
                                    alt={achievement.title}
                                    fill
                                    className="object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
                                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                    <h3 className="text-2xl text-white font-medium">
                                        {achievement.title}
                                    </h3>
                                    <div>
                                        <p className="text-6xl font-bold text-white mb-3">
                                            {achievement.number}
                                        </p>
                                        <p className="text-lg text-white/90">
                                            {achievement.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AchievementsSection