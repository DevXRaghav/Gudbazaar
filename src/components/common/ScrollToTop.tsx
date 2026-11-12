import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures the page resets scroll position ONLY when a genuine page navigation
 * occurs (i.e. pathname changes from /shop to /product/xyz), without triggering on search query
 * changes (?category=...), tab switches, state updates, modal openings, or input focus.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef<string>(pathname);

  useEffect(() => {
    // Only scroll to top if the actual route path changed
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }
  }, [pathname]);

  return null;
};
