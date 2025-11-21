import { Spinner } from "@/components/ui/spinner";

export const Loader = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated spinner container */}
        <div className="relative">
          {/* Outer pulse ring */}
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />

          {/* Main spinner */}
          <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Spinner className="size-8 text-primary" />
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Loading</h2>
          <p className="text-sm text-muted-foreground">
            Please wait a moment...
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-1.5">
          <div className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <div className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <div className="size-2 animate-bounce rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
};
