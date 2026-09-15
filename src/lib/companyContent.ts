import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export async function getCompanyHome(lang: 'en' | 'no'): Promise<CollectionEntry<'company'>> {
	const id = lang === 'no' ? 'no' : 'en';
	const direct = await getEntry('company', id);
	if (direct) return direct;

	const all = await getCollection('company');
	const fallback = all.find((entry) => entry.id === id || entry.id.endsWith(`/${id}`));
	if (fallback) return fallback;

	throw new Error(`Company home content not found for lang "${lang}" (tried id "${id}")`);
}
