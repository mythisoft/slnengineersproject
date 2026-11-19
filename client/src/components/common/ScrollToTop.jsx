import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Compute fixed header height plus breathing room so anchor targets sit cleanly below the navbar.
 */
function getHeaderOffset() {
  const header = document.querySelector('header');
  if (!header) return 110;
  const topBar = header.querySelector('.header-top-bar');
  const mainNav = header.querySelector('.header-main-nav');
  const topH = topBar && window.getComputedStyle(topBar).display !== 'none' ? topBar.offsetHeight : 0;
  const navH = mainNav ? mainNav.offsetHeight : 68;
  return topH + navH + 16;
}

/**
 * Scroll smoothly to an anchor target while ensuring scroll-reveal elements are immediately visible.
 */
function scrollToHashElement(targetHash) {
  if (!targetHash) return false;
  const id = targetHash.startsWith('#') ? targetHash.slice(1) : targetHash;
  if (!id) return false;
  const targetElement = document.getElementById(id);
  if (!targetElement) return false;

  targetElement.classList.add('is-revealed');
  const targetY = targetElement.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({
    top: Math.max(0, targetY),
    behavior: 'smooth',
  });
  return true;
}

/**
 * ScrollToTop component
 * Automatically scrolls window to top (0, 0) on every route navigation,
 * or smoothly to an in-page anchor (#id) when a hash target is specified.
 */
export default function ScrollToTop() {
  const { pathname, search, hash, key } = useLocation();

  // Scroll to hash anchor or top whenever route or location key changes
  useEffect(() => {
    if (hash) {
      let settleTimer;
      const frame = requestAnimationFrame(() => {
        if (!scrollToHashElement(hash)) {
          settleTimer = setTimeout(() => scrollToHashElement(hash), 80);
        }
      });
      return () => {
        cancelAnimationFrame(frame);
        if (settleTimer) clearTimeout(settleTimer);
      };
    }

    // Instantly jump to top of document when no hash is targeted
    const htmlEl = document.documentElement;
    const originalBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';

    window.scrollTo(0, 0);
    htmlEl.scrollTop = 0;
    if (document.body) {
      document.body.scrollTop = 0;
    }

    requestAnimationFrame(() => {
      htmlEl.style.scrollBehavior = originalBehavior;
    });
  }, [pathname, search, hash, key]);

  // Handle clicking a link pointing to the current page (top-of-page or same-page hash)
  useEffect(() => {
    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const targetUrl = new URL(anchor.href, window.location.origin);
      const currentPath = window.location.pathname;

      if (targetUrl.pathname === currentPath && targetUrl.hash) {
        requestAnimationFrame(() => scrollToHashElement(targetUrl.hash));
        return;
      }

      if (
        href === currentPath ||
        href === `${currentPath}/` ||
        (currentPath === '/' && href === '/')
      ) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  return null;
}
