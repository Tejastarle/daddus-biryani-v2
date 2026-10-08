/**
 * Conversion tracking.
 *
 * Every important action calls track(). If Google Analytics is connected the
 * event goes there; if not, nothing breaks and the event is logged in the
 * browser console during development.
 *
 * To connect GA4: add NEXT_PUBLIC_GA_ID=G-XXXXXXX to .env.local (and to your
 * hosting environment variables). No other change is needed.
 */

export type ConversionEvent =
  | 'whatsapp_click'
  | 'call_click'
  | 'menu_download'
  | 'menu_view'
  | 'directions_click'
  | 'tasting_enquiry'
  | 'bulk_enquiry'
  | 'lead_submitted'
  | 'style_view';

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: ConversionEvent, detail: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', event, detail);
    window.dataLayer?.push({ event, ...detail });
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info('[track]', event, detail);
    }
  } catch {
    /* tracking must never break the page */
  }
}

/** Spread onto a link or button to record the click. */
export function trackOn(event: ConversionEvent, detail: Record<string, string | number> = {}) {
  return { onClick: () => track(event, detail) };
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
