import { SearchX } from "lucide-react";
import { ZaloButton } from "./ZaloButton";

export interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-cream/60 px-6 py-16 text-center">
      <SearchX className="mx-auto h-8 w-8 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      <ZaloButton className="mt-6" label="Nhắn tin với Thịnh Phát" />
    </div>
  );
}
