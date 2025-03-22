import React from 'react';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";

const Toast = ({ title, description, variant = "default", onClose }) => {
  const variants = {
    default: "bg-white border-gray-200",
    destructive: "bg-red-50 border-red-200",
    success: "bg-green-50 border-green-200",
  };

  const titleColors = {
    default: "text-gray-900",
    destructive: "text-red-800",
    success: "text-green-800",
  };

  const descriptionColors = {
    default: "text-gray-500",
    destructive: "text-red-700",
    success: "text-green-700",
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 min-w-[300px] rounded-lg border p-4 shadow-lg",
        variants[variant]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && (
            <h3 className={cn("font-medium", titleColors[variant])}>
              {title}
            </h3>
          )}
          {description && (
            <p className={cn("mt-1 text-sm", descriptionColors[variant])}>
              {description}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className={cn(
            "rounded-md p-1 hover:bg-gray-100",
            variant === "destructive" && "hover:bg-red-100",
            variant === "success" && "hover:bg-green-100"
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast; 