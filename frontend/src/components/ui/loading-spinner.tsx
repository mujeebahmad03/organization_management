import { UI_CONSTANTS } from "@/lib/constants";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = "md",
  className = "",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: UI_CONSTANTS.LOADING_SPINNER_SIZE.SM,
    md: UI_CONSTANTS.LOADING_SPINNER_SIZE.MD,
    lg: UI_CONSTANTS.LOADING_SPINNER_SIZE.LG,
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 ${UI_CONSTANTS.LOADING_SPINNER_COLOR} ${sizeClasses[size]} ${className}`} />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      {spinner}
    </div>
  );
}

