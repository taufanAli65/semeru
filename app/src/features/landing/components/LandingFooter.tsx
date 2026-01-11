import Link from "next/link";

export const LandingFooter = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0d6e6e] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900 tracking-tight">SEMERU</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Semeru Ecosystem. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="#" className="hover:text-[#0d6e6e] transition-colors font-medium">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-[#0d6e6e] transition-colors font-medium">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}