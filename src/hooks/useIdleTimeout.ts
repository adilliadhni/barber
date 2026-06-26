import { useEffect, useRef } from 'react';

interface UseIdleTimeoutProps {
  onTimeout: () => void;
  timeoutMs?: number; // defaults to 15 minutes (900000 ms)
  enabled: boolean;
}

export function useIdleTimeout({ onTimeout, timeoutMs = 900000, enabled }: UseIdleTimeoutProps) {
  const timeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (timeoutIdRef.current) {
        window.clearTimeout(timeoutIdRef.current);
      }
      return;
    }

    const resetTimer = () => {
      if (timeoutIdRef.current) {
        window.clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = window.setTimeout(() => {
        onTimeout();
      }, timeoutMs);
    };

    // Events to watch for activity
    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'click', 'touchstart'];

    // Initialize timer
    resetTimer();

    // Attach event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup on unmount
    return () => {
      if (timeoutIdRef.current) {
        window.clearTimeout(timeoutIdRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [onTimeout, timeoutMs, enabled]);
}
