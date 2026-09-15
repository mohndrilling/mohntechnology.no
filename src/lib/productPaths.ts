export function productPath(lang: 'en' | 'no', slug: string) {
	const s = slug.toLowerCase();
	return lang === 'no' ? `/no/produkter/${s}/` : `/products/${s}/`;
}

export function productSlugFromName(name: string) {
	return name.trim().toLowerCase();
}
