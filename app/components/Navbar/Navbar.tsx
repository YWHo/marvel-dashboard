"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/comic-issues", label: "Issues" },
  { href: "/comic-series", label: "Series" },
  { href: "/comic-creators", label: "Creators" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 z-50 h-12 w-full border-b-2 border-gray-500 bg-blue-900 px-4 py-1 text-white">
      <div className="flex h-full items-center justify-between">
        <div>
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={clsx(
              "rounded px-2 py-1 text-sm font-semibold transition-colors md:text-xl",
              pathname === "/"
                ? "bg-red-600 text-white shadow-sm"
                : "hover:bg-blue-800 hover:text-gray-200",
            )}
          >
            Home
          </Link>
        </div>

        <ul className="flex flex-1 justify-center gap-1 pl-2 md:gap-4 md:pl-4">
          {navigationItems.map(({ href, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "block rounded px-2 py-1 text-sm font-semibold transition-colors md:px-3 md:text-lg",
                    isActive
                      ? "bg-red-600 text-white shadow-sm"
                      : "hover:bg-blue-800 hover:text-gray-200",
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
