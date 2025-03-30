'use client'

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarNavItemProps {
    href: string;
    icon: string;
    label: string;
    external?: boolean;
}

export function SidebarNavItem({ href, icon, label, external }: SidebarNavItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href;
    const LinkWrapper = external ?
        (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
            <a {...props} target="_blank" rel="noopener noreferrer" />
        : Link;

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <LinkWrapper
                        href={href}
                        className={cn(
                            "relative w-10 h-10 flex items-center justify-center",
                            isActive && "after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-[#000066]"
                        )}
                    >
                        <Image
                            src={icon}
                            alt={label}
                            width={24}
                            height={24}
                            className={cn(
                                "transition-opacity",
                                isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
                            )}
                        />
                    </LinkWrapper>
                </TooltipTrigger>
                <TooltipContent
                    side="right"
                    className="bg-gray-900 text-white border-0 text-xs px-2 py-1"
                >
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}