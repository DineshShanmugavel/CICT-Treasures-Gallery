/**
 * Where the museum is running. `IS_WEB` is false in the Capacitor app — both in its build
 * (`--mode mobile`, so web-only code such as the visitor analytics is dropped from the app
 * entirely) and, as a second guard, whenever Capacitor reports a native platform.
 */
export const IS_NATIVE_BUILD = import.meta.env.MODE === 'mobile';

export const IS_WEB = !IS_NATIVE_BUILD && !(typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.());
