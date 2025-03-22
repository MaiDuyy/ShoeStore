import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        title,
        description,
        variant,
      },
    ]);

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      );
    }, 3000);
  }, []);

  return { toast, toasts };
}; 