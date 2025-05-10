import { auth } from "@/server/auth";
import { BarChart, Package, PenBoxIcon, Settings, Truck } from "lucide-react";
import { ReactNode } from "react";
import { DashboardNav } from "@/components/navigation/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const userLinks = [
    { label: "Orders", path: "/dashboard/orders", icon: <Truck size={16} /> },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={16} />,
    },
  ] as const;

  const adminLinks =
    session?.user.role === "admin"
      ? [
          {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={16} />,
          },
          {
            label: "Create Product",
            path: "/dashboard/add-product",
            icon: <PenBoxIcon size={16} />,
          },
          {
            label: "Products",
            path: "/dashboard/products",
            icon: <Package size={16} />,
          },
        ]
      : [];
  const allLinks = [...adminLinks, ...userLinks];
  return (
    <div>
      <DashboardNav allLinks={allLinks} />
      {children}
    </div>
  );
}
