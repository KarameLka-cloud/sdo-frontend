import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils";

interface ResourceBackLinkProps {
  to: string;
  label: string;
  className?: string;
}

function ResourceBackLink({ to, label, className }: ResourceBackLinkProps) {
  return (
    <Button variant="ghost" className={cn("w-fit -ml-2", className)} asChild>
      <Link to={to}>
        <ArrowLeftIcon />
        {label}
      </Link>
    </Button>
  );
}

export default ResourceBackLink;
