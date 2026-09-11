import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const featuresSchema = z.object({
	icon: z.string(),
	title: z.string(),
	description: z.string(),
	image: z.string().optional(),
});

const productSpecSchema = z.object({
	label: z.string(),
	value: z.string(),
});

const productSlideshowSlideSchema = z.object({
	image: z.string(),
	alt: z.string().optional(),
});

const faqItemSchema = z.object({
	question: z.string(),
	answer: z.string(),
});

const faqTabSchema = z.object({
	label: z.string(),
	items: z.array(faqItemSchema).min(1),
});

const pages = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/pages',
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	}),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		hero: z.object({
			badge: z.string(),
			titleBefore: z.string(),
			titleHighlight: z.string(),
			lead: z.string(),
			ctaPrimary: z.string(),
			ctaSecondary: z.string(),
			image: z.string().optional(),
		}),
		featuresTitle: z.string(),
		featuresLead: z.string(),
		features: z.array(featuresSchema),
		productTitle: z.string(),
		productLead: z.string(),
		/** How the system works technically (vision, lighting, AI, throughput) */
		productTechnical: z.string(),
		productPerformanceTitle: z.string(),
		productPerformance: z.array(z.string()),
		productSpecsTitle: z.string(),
		productSpecs: z.array(productSpecSchema),
		productBenefitsTitle: z.string(),
		productBenefits: z.array(z.string()),
		/** CTA line linking to the History page */
		productHistoryCta: z.string(),
		/** Product section image carousel (paths under /public, e.g. /images/product/slideshow/…) */
		productSlideshow: z.array(productSlideshowSlideSchema).min(1),
		navFeatures: z.string(),
		navProduct: z.string(),
		navContact: z.string(),
		navHistory: z.string(),
		navFaq: z.string(),
		faqTitle: z.string(),
		faqLead: z.string().optional(),
		/** Q&A grouped by tab (each tab is one category) */
		faqTabs: z.array(faqTabSchema).min(1),
		navPortal: z.string(),
		contactTitle: z.string(),
		contactLead: z.string(),
		contactPortalText: z.string(),
		contactPortalLink: z.string(),
		portalUrl: z.string(),
		footerBrand: z.string(),
		footerTagline: z.string(),
		footerCopy: z.string(),
	}),
});

const history = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/history',
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	}),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
	}),
});

export const collections = {
	pages,
	history,
};
