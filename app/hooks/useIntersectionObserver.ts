import { useEffect, useRef } from "react";

type UseIntersectionObserverOptions = {
  enabled?: boolean;
  onIntersect: () => void;
  rootMargin?: string;
  threshold?: number;
};

export function useIntersectionObserver({
  enabled = true,
  onIntersect,
  rootMargin = "200px 0px",
  threshold = 0,
}: UseIntersectionObserverOptions) {
  const targetRef = useRef<HTMLDivElement>(null);
  const onIntersectRef = useRef(onIntersect);
  const isSupported =
    typeof window !== "undefined" &&
    typeof window.IntersectionObserver === "function";

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const target = targetRef.current;

    if (!enabled || !isSupported || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        observer.disconnect();
        onIntersectRef.current();
      },
      { rootMargin, threshold },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [enabled, isSupported, rootMargin, threshold]);

  return { isSupported, targetRef };
}
