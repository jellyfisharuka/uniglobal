import Image from "next/image";
import { SidebarNavItem } from "./sidebar-nav-item";
import Link from "next/link";

const topNavItems = [
    {
        href: "/dashboard/chats",
        icon: "/icons/1.png",
        label: "Чаты"
    },
    {
        href: "/dashboard/letters",
        icon: "/icons/2.png",
        label: "Письма"
    },
    {
        href: "/dashboard/faq",
        icon: "/icons/3.png",
        label: "FAQ"
    }
]

const bottomNavItems = [
    {
        href: "/dashboard/profile",
        icon: "/icons/4.png",
        label: "Профиль"
    },
    {
        href: "https://wa.me/+77777777777",
        icon: "/icons/5.png",
        label: "Поддержка",
        external: true
    },
    {
        href: "/logout",
        icon: "/icons/6.png",
        label: "Выйти"
    }
]

export function Sidebar() {
    return (
        <aside className="fixed inset-y-0 left-0 w-16 bg-[#F1F1F1] border-r flex flex-col items-center">
            <Link href="/" className="h-16 w-full flex items-center justify-center border-b">
                <div className="relative w-10 h-10 rounded-full  flex items-center justify-center">
                    <Image src='/logo.svg' alt="Logo" fill />
                </div>
            </Link>

            <div className="flex-1 w-full flex flex-col">
                <nav className="pt-6 flex flex-col items-center gap-6">
                    {topNavItems.map((item) => (
                        <SidebarNavItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                        />
                    ))}
                </nav>

                <nav className="mt-auto pb-6 flex flex-col items-center gap-6">
                    {bottomNavItems.map((item) => (
                        <SidebarNavItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            external={item.external}
                        />
                    ))}
                </nav>
            </div>
        </aside>
    )
}