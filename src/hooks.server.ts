
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Content Security Policy (CSP)
	// We allow 'unsafe-inline' for styles and scripts due to Svelte's hydration and style injection mechanisms strictly for this audit.
	// ideally, we would use nonces/hashes.
	// Connect-src allows our API and WebSocket domains.
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline'",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data:",
		"font-src 'self'",
		"connect-src 'self' https://api.bank.example.com wss://ws.bank.example.com",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'none'",
		"block-all-mixed-content",
		"upgrade-insecure-requests"
	].join('; ');

	response.headers.set('Content-Security-Policy', csp);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-XSS-Protection', '1; mode=block');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	return response;
};
