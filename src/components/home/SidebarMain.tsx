import React, { JSX } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/shadcn/sidebar";
import { Separator } from "@/components/ui/shadcn/separator";
import BreadcrumbComponent from "@/components/ui/custom/BreadcrumbComponent";

function SidebarMain({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" />
          <BreadcrumbComponent />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
    </SidebarInset>
  );
}

export default SidebarMain;
