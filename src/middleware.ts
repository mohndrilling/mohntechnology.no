import { defineMiddleware } from 'astro:middleware';

/** Hostnames that should serve the Salmoscan product site at the domain root. */
const SALMOSCAN_HOSTS = new Set(['salmoscan.no', 'www.salmoscan.no', 'salmoscan.localhost']);

/**
 * Rewrite salmoscan.no requests onto /salmoscan/* so one deploy can serve
 * mohntechnology.no (company) and salmoscan.no (product) from the same repo.
 * Localhost keeps path-based URLs: / and /salmoscan/.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const host = context.url.hostname.toLowerCase();
	if (!SALMOSCAN_HOSTS.has(host)) {
		return next();
	}

	const { pathname } = context.url;
	if (pathname === '/salmoscan' || pathname.startsWith('/salmoscan/')) {
		return next();
	}

	const suffix = pathname === '/' ? '/' : pathname;
	return context.rewrite(new URL(`/salmoscan${suffix}${context.url.search}`, context.url));
});
