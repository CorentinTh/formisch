import type { Path } from '@formisch/core/preact';
import { ReadonlySignal, useSignal } from '@preact/signals';

function isEqual(a: Path, b: Path): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function usePathSignal<TPath extends Path>(
  path: TPath
): ReadonlySignal<TPath> {
  const signal = useSignal(path);
  if (!isEqual(signal.value, path)) {
    signal.value = path;
  }
  return signal;
}
