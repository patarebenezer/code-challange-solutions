import { useCallback, useState } from "react";
import type { Toast } from "@/types";

export function useToast() {
 const [toasts, setToasts] = useState<Toast[]>([]);

 const push = useCallback((type: Toast["type"], message: string) => {
  const id = crypto.randomUUID();
  setToasts((t) => [...t, { id, type, message }]);

  const removeToast = (t: Toast[]) => t.filter((x) => x.id !== id);
  setTimeout(() => setToasts(removeToast), 2500);
 }, []);

 return {
  toasts,
  success: (m: string) => push("success", m),
  error: (m: string) => push("error", m),
  info: (m: string) => push("info", m),
 };
}
