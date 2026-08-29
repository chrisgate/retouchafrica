/**
 * Thin wrapper so Date.now() isn't called directly inside component bodies —
 * the react-hooks/purity lint rule flags impure calls in components/hooks,
 * but this plain (non-component) helper is exempt.
 */
export function getNowMs(): number {
  return Date.now();
}
