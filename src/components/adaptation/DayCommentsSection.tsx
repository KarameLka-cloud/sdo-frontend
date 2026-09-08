import { JSX, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/shadcn/collapsible";

function DayCommentsSection({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Collapsible className="group/collapsible mt-4">
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-9 w-full justify-between rounded-lg bg-muted/60 px-3 font-semibold text-foreground hover:bg-muted"
        >
          Комментарии
          <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-4 pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default DayCommentsSection;
