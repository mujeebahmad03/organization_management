import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { FiX } from "react-icons/fi";

interface FormModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function FormModal({ title, isOpen, onClose, children }: FormModalProps) {
  if (!isOpen) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <FiX className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

