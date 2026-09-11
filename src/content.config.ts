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
		productTechnical: z.string(),
		productPerformanceTitle: z.string(),
		productPerformance: z.array(z.string()),
		productSpecsTitle: z.string(),
		productSpecs: z.array(productSpecSchema),
		productBenefitsTitle: z.string(),
		productBenefits: z.array(z.string()),
		productHistoryCta: z.string(),
		productSlideshow: z.array(productSlideshowSlideSchema).min(1),
		navFeatures: z.string(),
		navProduct: z.string(),
		navContact: z.string(),
		navHistory: z.string(),
		navFaq: z.string(),
		faqTitle: z.string(),
		faqLead: z.string().optional(),
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

const mediaPlaceholderSchema = z.object({
	kind: z.enum(['image', 'video']).default('image'),
	/** Set when the real file exists under /public, e.g. /media/company/hero/ops.mp4 */
	src: z.string().optional(),
	label: z.string(),
	need: z.string(),
	message: z.string(),
});

const companyProductSchema = z.object({
	title: z.string(),
	description: z.string(),
	edge: z.string().optional(),
	applicationsTitle: z.string(),
	applications: z.array(z.string()).min(1),
	proofLine: z.string().optional(),
	infoCta: z.string(),
	infoHref: z.string(),
	infoExternal: z.boolean().optional(),
	portalCta: z.string(),
	portalHref: z.string(),
	portalExternal: z.boolean().optional(),
	demoCta: z.string().optional(),
	demoHref: z.string().optional(),
	media: mediaPlaceholderSchema,
});

const companyProofSchema = z.object({
	value: z.string(),
	label: z.string(),
});

const companyProjectSchema = z.object({
	tag: z.string(),
	title: z.string(),
	place: z.string(),
	problem: z.string(),
	result: z.string(),
	media: mediaPlaceholderSchema,
});

const companyProblemItemSchema = z.object({
	title: z.string(),
	body: z.string(),
});

const companyOpenItemSchema = z.object({
	title: z.string(),
	body: z.string(),
	cta: z.string(),
	href: z.string(),
});

const company = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/company',
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	}),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		navProducts: z.string(),
		navProjects: z.string(),
		navAbout: z.string(),
		navContact: z.string(),
		navSalmoscan: z.string(),
		navCta: z.string(),
		hero: z.object({
			brand: z.string(),
			title: z.string(),
			lead: z.string(),
			ctaPrimary: z.string(),
			ctaSecondary: z.string(),
			media: mediaPlaceholderSchema,
		}),
		problemTitle: z.string(),
		problemLead: z.string(),
		problemItems: z.array(companyProblemItemSchema).min(1),
		productsTitle: z.string(),
		productsLead: z.string(),
		products: z.array(companyProductSchema).min(1),
		proof: z.array(companyProofSchema).min(1),
		projectsTitle: z.string(),
		projectsLead: z.string(),
		projects: z.array(companyProjectSchema).min(1),
		aboutTitle: z.string(),
		aboutLead: z.string(),
		aboutBody: z.string(),
		openTitle: z.string(),
		openLead: z.string(),
		openItems: z.array(companyOpenItemSchema).min(1),
		contactTitle: z.string(),
		contactLead: z.string(),
		contactEmail: z.string(),
		contactInterestLabel: z.string(),
		contactInterests: z.array(z.string()).min(1),
		addressLines: z.array(z.string()).min(1),
		footerBrand: z.string(),
		footerTagline: z.string(),
		footerCopy: z.string(),
	}),
});

export const collections = {
	pages,
	history,
	company,
};
