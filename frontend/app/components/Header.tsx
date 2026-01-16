'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            className="flex items-center gap-2 flex-shrink-0"
            href="/"
            aria-label="WAW Farm - Home"
          >
            <Image
              src="/images/logo-wide.png"
              alt="WAW Farm"
              width={100}
              height={60}
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center flex-1 justify-center">
            <ul className="flex items-center gap-6 lg:gap-8 text-base tracking-tight font-mono">
              <li>
                <Link href="/house" className="hover:underline">
                  House
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:underline">
                  Location
                </Link>
              </li>
              <li>
                <Link href="/work-from-home" className="hover:underline">
                  WFH
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop Book Now Button */}
          <Link
            href="https://airbnb.com/h/wawfarm"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex rounded-full gap-2 items-center bg-waw-btn hover:bg-waw-btn-hov focus:bg-waw-btn-foc py-2 px-5 lg:py-3 lg:px-6 text-white transition-colors duration-200 text-sm lg:text-base flex-shrink-0"
            aria-label="Book Now on Airbnb (opens in new tab)"
          >
            Book Now <span className="sr-only">(opens in new tab)</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
            >
              <title>{mobileMenuOpen ? 'Close menu' : 'Open menu'}</title>
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <nav className="py-4">
              <ul className="flex flex-col gap-4 text-base font-mono">
                <li>
                  <Link
                    href="/house"
                    className="block py-2 hover:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    House
                  </Link>
                </li>
                <li>
                  <Link
                    href="/location"
                    className="block py-2 hover:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Location
                  </Link>
                </li>
                <li>
                  <Link
                    href="/work-from-home"
                    className="block py-2 hover:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    WFH
                  </Link>
                </li>
                <li className="pt-2">
                  <Link
                    href="https://airbnb.com/h/wawfarm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-waw-btn hover:bg-waw-btn-hov focus:bg-waw-btn-foc py-3 px-6 text-white transition-colors duration-200"
                    aria-label="Book Now on Airbnb (opens in new tab)"
                  >
                    Book Now <span className="sr-only">(opens in new tab)</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
