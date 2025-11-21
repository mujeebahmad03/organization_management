"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLayout, FiLayers, FiHome } from "react-icons/fi";
import { ROUTES } from "@/lib/constants";

const navigation = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: FiHome },
  { name: "Departments", href: ROUTES.DEPARTMENTS, icon: FiLayout },
  {
    name: "Sub-Departments",
    href: ROUTES.SUB_DEPARTMENTS,
    icon: FiLayers,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
