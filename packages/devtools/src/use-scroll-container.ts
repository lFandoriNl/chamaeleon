import {
  DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export function useScrollContainer(deps: DependencyList[]) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const prevInnerDivHeightRef = useRef<number | null>(null);

  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    if (!outerRef.current || !innerRef.current) return;

    const outerDivHeight = outerRef.current.clientHeight;
    const innerDivHeight = innerRef.current.clientHeight;
    const outerDivScrollTop = outerRef.current.scrollTop;

    if (
      prevInnerDivHeightRef.current &&
      prevInnerDivHeightRef.current < outerDivHeight
    ) {
      outerRef.current.scrollTo({
        top: innerDivHeight - outerDivHeight,
        left: 0,
        behavior: 'instant',
      });
    }

    if (
      !prevInnerDivHeightRef.current ||
      outerDivScrollTop === prevInnerDivHeightRef.current - outerDivHeight
    ) {
      outerRef.current.scrollTo({
        top: innerDivHeight - outerDivHeight,
        left: 0,
        behavior: 'instant',
      });
    } else {
      setCanScrollDown(true);
    }

    prevInnerDivHeightRef.current = innerDivHeight;
  }, deps);

  const scrollToDown = useCallback(() => {
    if (!outerRef.current || !innerRef.current) return;

    const outerDivHeight = outerRef.current.clientHeight;
    const innerDivHeight = innerRef.current.clientHeight;

    outerRef.current.scrollTo({
      top: innerDivHeight - outerDivHeight,
      left: 0,
      behavior: 'smooth',
    });

    setCanScrollDown(false);
  }, []);

  return {
    outerRef,
    innerRef,
    canScrollDown,
    scrollToDown,
  };
}
