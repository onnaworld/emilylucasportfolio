// Tiny cross-component signal so a case-study modal (mounted at the
// App root, over Landing's "background" route) can tell Landing's
// Lenis instance to pause. Plain overflow:hidden on <body>/<html>
// doesn't stop Lenis — it scrolls document.documentElement directly
// via JS in its own rAF loop, which native overflow rules don't block.
const target = new EventTarget();

export function lockPageScroll() {
  target.dispatchEvent(new Event("lock"));
}

export function unlockPageScroll() {
  target.dispatchEvent(new Event("unlock"));
}

// cb(isLocked) — call the returned cleanup function to unsubscribe.
export function onPageScrollLockChange(cb) {
  const lock = () => cb(true);
  const unlock = () => cb(false);
  target.addEventListener("lock", lock);
  target.addEventListener("unlock", unlock);
  return () => {
    target.removeEventListener("lock", lock);
    target.removeEventListener("unlock", unlock);
  };
}
