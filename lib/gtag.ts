// lib/gtag.ts
declare global {
    interface Window {
      dataLayer: unknown[];
      gtag?: (...args: any[]) => void;
    }
  }
  
  export const GA_ID = 'AW-743840970';
  
  function gtagEvent(action: string, params: Record<string, any>) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', action, params);
  }
  
  /**
   * Вызывается после успешной регистрации,
   * в Google Ads → Конверсии → ваш лейбл (например AW-743840970/AbCdEf123)
   */
  export function sendRegistrationConversion() {
    gtagEvent('conversion', {
      send_to: 'AW-743840970/x5-aCNr4jNAaEMq52OIC',
      value: 1.0,
      currency: 'USD',
    });
  }
  