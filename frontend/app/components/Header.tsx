import Image from 'next/image'
import Link from 'next/link'

export default async function Header() {
  return (
    <header className="fixed z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg">
      <div className="container py-6 px-2 sm:px-6">
        <div className="flex items-center gap-5">
          <Link className="flex items-center gap-2" href="/" aria-label="WAW Farm - Home">
            {/* <span className="text-lg sm:text-2xl pl-2 font-semibold">
              {settings?.title || 'Sanity + Next.js'}
            </span> */}
            <Image
              src="/images/logo-wide.png"
              alt="WAW Farm"
              width={100}
              height={60}
              style={{ height: 'auto' }}
            />
          </Link>

          <nav>
            <ul className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono pl-5">
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

          <Link
            href="https://airbnb.com/h/wawfarm"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto rounded-full flex gap-2 mr-6 items-center bg-waw-btn hover:bg-waw-btn-hov focus:bg-waw-btn-foc py-3 px-6 text-white transition-colors duration-200"
            aria-label="Book Now on Airbnb (opens in new tab)"
          >
            Book Now <span className="sr-only">(opens in new tab)</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
