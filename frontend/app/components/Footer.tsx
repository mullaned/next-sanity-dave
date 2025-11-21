import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 relative">
      <div className="container py-10 px-2 sm:px-6">
        <div className="flex items-center justify-center">
          <Image src="/images/logo.png" alt="logo" width={150} height={150} />
        </div>
        <div className="flex items-center justify-center mt-6">
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
              <Link href="/wfh" className="hover:underline">
                WFH
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container py-5 px-2 sm:px-6 border-t border-gray-200">
        <div className="flex">
          <p>© {new Date().getFullYear()} WAW Farm. All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}
