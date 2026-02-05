"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChartSpline,
  Book,
  LucideBookUser,
  BookUser,
  Users,
  Calendar,
  Paperclip,
  Sheet,
} from "lucide-react";
import Link from "next/link";
const nav = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: ChartSpline,
  },
  {
    label: "Students",
    href: "/dashboard/students",
    icon: Users,
  },
  {
    label: "Courses",
    href: "/dashboard/courses",
    icon: Book,
  },
  {
    label: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    label: "Gradebook",
    href: "/dashboard/gradebook",
    icon: Sheet,
  },
];

interface SidebarProps extends React.ComponentProps<"aside"> {}
export function Sidebar({}: SidebarProps) {
  const path = usePathname();
  return (
    <aside className="shrink-0 w-[18rem] h-screen py-4 px-2 border-r">
      <nav>
        <ul>
          {nav.map((l) => (
            <li
              key={l.label}
              className={cn(
                "pl-2 pr-4 py-2 rounded",
                path === l.href && "bg-muted",
              )}
            >
              <Link
                href={l.href}
                className="flex items-center justify-between"
              >
                {l.label}
                {<l.icon className="size-4" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
