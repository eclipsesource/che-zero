import { useCallback, useState } from 'react';

/**
 * Defines a state with an initial value that won't trigger React dependency changes even if a new value is set.
 * This is useful if you need a value persisted in the state of a component but don't want hooks like useCallback
 * to be triggered when the value is changed.
 *
 * As a consequence, a getter instead of the value itself is returned because the getter can stay the same even with the value changing.
 * @param value the state's initial value
 * @returns a tuple [getter, setter] for the state value. These functions will never change during the lifetime of a component using this hook.
 *          Consequently, using them as dependencies for other hooks (e.g. useEffect, useCallback) will never notify them of a dependency change.
 */
export const useStateWithoutNotifications = <T>(
  value: T
): [() => T, (newValue: T) => void] => {
  const [wrapper] = useState({ value });
  const getValue = useCallback(() => wrapper.value, [wrapper]);
  const setValue = useCallback((newValue: T) => (wrapper.value = newValue), [
    wrapper,
  ]);
  return [getValue, setValue];
};