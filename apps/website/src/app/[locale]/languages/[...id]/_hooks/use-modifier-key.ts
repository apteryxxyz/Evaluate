/**
 * Gets the modifier key based on the operating system.
 */
export function useModifierKey() {
  const isMac =
    typeof window !== 'undefined' && window.navigator.platform === 'MacIntel';
  return isMac ? '⌘' : 'ctrl';
}
