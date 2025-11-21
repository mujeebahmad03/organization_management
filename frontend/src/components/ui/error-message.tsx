import { Card, CardContent } from "./card";

interface ErrorMessageProps {
  message: string;
  title?: string;
  className?: string;
}

export function ErrorMessage({
  message,
  title = "Error",
  className = "",
}: ErrorMessageProps) {
  return (
    <Card className={className}>
      <CardContent className="py-12 text-center">
        <p className="text-destructive">
          {title}: {message}
        </p>
      </CardContent>
    </Card>
  );
}
