import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { faqItems } from "@/constants/faq"
import { Circle } from "lucide-react"

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto relative">
                    <h1 className="text-4xl font-bold text-navy-900 text-center mb-16">
                        Frequently Asked Questions
                    </h1>
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={`item-${item.id}`}
                                className="bg-white rounded-lg px-6"
                            >
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center gap-4 text-left">
                                        <Circle className="h-2 w-2 flex-shrink-0 fill-[#000066]" />
                                        <span>{item.question}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pl-6">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}