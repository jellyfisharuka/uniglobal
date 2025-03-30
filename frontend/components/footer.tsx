import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#0A1E3D] text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-16">
                    <div className="flex items-center gap-3">
                        <Image src='/logo-white.svg' width={35} height={35} alt="Logo" />
                        <span className="text-xl font-bold">Uni Global</span>
                    </div>

                    <nav className="flex gap-16">
                        <Link
                            href="/overview"
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            OVERVIEW
                        </Link>
                        <Link
                            href="#features"
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            FEATURES
                        </Link>
                        <Link
                            href="/help"
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            HELP
                        </Link>
                    </nav>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
                    <div className="text-sm text-white/70">
                        © {new Date().getFullYear()}. ALL RIGHTS RESERVED.
                    </div>
                    <div className="flex gap-8 text-sm">
                        <Link
                            href="/terms"
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            TERMS
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            PRIVACY
                        </Link>
                        <Link
                            href="/cookies"
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            COOKIES
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}