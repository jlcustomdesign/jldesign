
/**
 * analytics.ts — Lightweight Google Analytics Event Tracking
 * 
 * Use these helpers to track important user actions.
 * Usage: trackEvent('contact_click', { location: 'hero' })
 */

export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
};

/**
 * Auto-initialize tracking for common elements
 */
export const initAutoTracking = () => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('button, a');
    
    if (!btn) return;

    // Track Phone Clicks
    if (btn.getAttribute('href')?.startsWith('tel:')) {
      trackEvent('phone_click', {
        number: btn.getAttribute('href'),
        text: (btn as HTMLElement).innerText.trim()
      });
    }

    // Track Email Clicks
    if (btn.getAttribute('href')?.startsWith('mailto:')) {
      trackEvent('email_click', {
        email: btn.getAttribute('href'),
        text: (btn as HTMLElement).innerText.trim()
      });
    }

    // Track Primary CTAs
    if (btn.classList.contains('cta-primary') || (btn as HTMLElement).innerText.toUpperCase().includes('CONTACT')) {
      trackEvent('cta_click', {
        label: (btn as HTMLElement).innerText.trim(),
        url: btn.getAttribute('href') || 'modal'
      });
    }
    
    // Track Portfolio Clicks
    if (btn.closest('.project-card')) {
        const card = btn.closest('.project-card');
        const projectName = (card?.querySelector('h3') as HTMLElement)?.innerText || 'Untitled';
        trackEvent('portfolio_view', {
            project: projectName
        });
    }
  });
};
