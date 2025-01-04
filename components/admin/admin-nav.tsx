"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin/products",
    label: "Products",
  },
  {
    href: "/admin/banner",
    label: "Banner",
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4 mb-8 border-b">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}