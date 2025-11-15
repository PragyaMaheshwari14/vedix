"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#FFF5EB] z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg transform rotate-45" />
              <span className="text-xl font-bold">Minerva</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">

            <Link href="#" className="text-sm hover:text-gray-600">Pages</Link>
            <Link href="#about" className="text-sm hover:text-gray-600">About Us</Link>
            <Link href="#services" className="text-sm hover:text-gray-600">Services</Link>
            <Link href="#works" className="text-sm hover:text-gray-600">Works</Link>
            <Link href="#pricing" className="text-sm hover:text-gray-600">Pricing</Link>
            <Link href="#faq" className="text-sm hover:text-gray-600">Faq</Link>
            <Link href="#blog" className="text-sm hover:text-gray-600">Blog</Link>
            <Link href="#contact" className="text-sm hover:text-gray-600">Contact Us</Link>

            {status === "authenticated" ? (
              <>
                <div className="text-sm text-gray-700">
                  {session.user?.name ?? session.user?.email}
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-full text-sm hover:bg-red-50 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="px-4 py-2 border border-black rounded-full text-sm hover:bg-black hover:text-white transition"
              >
                Login With Google
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-sm hover:text-gray-600">Pages</Link>
              <Link href="#about" className="text-sm hover:text-gray-600">About Us</Link>
              <Link href="#services" className="text-sm hover:text-gray-600">Services</Link>
              <Link href="#works" className="text-sm hover:text-gray-600">Works</Link>
              <Link href="#pricing" className="text-sm hover:text-gray-600">Pricing</Link>
              <Link href="#faq" className="text-sm hover:text-gray-600">Faq</Link>
              <Link href="#blog" className="text-sm hover:text-gray-600">Blog</Link>
              <Link href="#contact" className="text-sm hover:text-gray-600">Contact Us</Link>

              {status === "authenticated" ? (
                <>
                  <div className="text-sm text-gray-700">{session.user?.name}</div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-full text-sm hover:bg-red-50 transition w-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signIn("google", { callbackUrl: "/dashboard" });
                  }}
                  className="px-4 py-2 border border-black rounded-full text-sm hover:bg-black hover:text-white transition w-full"
                >
                  Login With Google
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
