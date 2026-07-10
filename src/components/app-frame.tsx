"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type AppFrameProps = {
  children: ReactNode;
};

export function AppFrame({ children }: AppFrameProps) {
  const pathname = usePathname();
  const isCrmArea = pathname.startsWith("/crm");

  useEffect(() => {
    document.body.classList.toggle("crmMode", isCrmArea);
    return () => {
      document.body.classList.remove("crmMode");
    };
  }, [isCrmArea]);

  if (isCrmArea) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
