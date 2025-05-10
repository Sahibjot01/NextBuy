"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { JSX } from "react";
export function DashboardNav({
  allLinks,
}: {
  allLinks: { label: string; path: string; icon: JSX.Element }[];
}) {
  const pathName = usePathname();

  return (
    <nav className="py-2 overflow-auto mb-4">
      <ul className="flex gap-6 text-xs font-semibold ">
        <AnimatePresence>
          {allLinks.map((link) => {
            return (
              <motion.li whileTap={{ scale: 0.95 }} key={link.path}>
                <Link
                  className={cn(
                    "flex flex-col gap-1 relative items-center h[3px] ",
                    pathName == link.path && "text-primary"
                  )}
                  href={link.path}
                >
                  {link.icon}
                  {link.label}
                  {pathName === link.path ? (
                    <motion.div
                      className="h-[3px] w-full rounded-full bg-primary absolute z-0 left-0 -bottom-1 "
                      layoutId="underline"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 49,
                      }}
                    />
                  ) : null}
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
