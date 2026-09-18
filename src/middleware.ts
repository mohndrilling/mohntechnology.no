import { defineMiddleware } from 'astro:middleware';

/** Hostnames that should serve the Salmoscan product experience. */
const SALMOSCAN_HOSTS = new Set(['salmoscan.no', 'www.salmoscan.no', 'salmoscan.localhost']);

/**
 * salmoscan.no serves the company Salmoscan product page.
 * History remains under /salmoscan/…/history for now.
 * Localhost /salmoscan/ redirects via pages to /products/salmoscan/.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const host = context.url.hostname.toLowerCase();
	if (!SALMOSCAN_HOSTS.has(host)) {
		return next();
	}

	const { pathname } = context.url;
	const search = context.url.search;

	if (pathname === '/salmoscan' || pathname.startsWith('/salmoscan/')) {
		return next();
	}

	if (pathname === '/' || pathname === '') {
		return context.rewrite(new URL(`/products/salmoscan/${search}`, context.url));
	}
	if (pathname === '/no' || pathname === '/no/') {
		return context.rewrite(new URL(`/no/produkter/salmoscan/${search}`, context.url));
	}
	if (pathname === '/history' || pathname === '/history/') {
		return context.rewrite(new URL(`/salmoscan/history/${search}`, context.url));
	}
	if (pathname === '/no/history' || pathname === '/no/history/') {
		return context.rewrite(new URL(`/salmoscan/no/history/${search}`, context.url));
	}

	return context.rewrite(new URL(`/products/salmoscan/${search}`, context.url));
});
