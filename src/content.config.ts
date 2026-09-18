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
	need: z.string().optional().default(''),
	message: z.string().optional().default(''),
});

const companyProductSchema = z.object({
	slug: z.string(),
	title: z.string(),
	blurb: z.string(),
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

const productPageSchema = z.object({
	slug: z.string(),
	lang: z.enum(['en', 'no']),
	title: z.string(),
	description: z.string(),
	problemTitle: z.string(),
	problemLead: z.string(),
	/** Flat fields so Cursor Properties shows editable text (not JSON arrays). */
	problem1Title: z.string(),
	problem1Body: z.string(),
	problem2Title: z.string().optional(),
	problem2Body: z.string().optional(),
	problem3Title: z.string().optional(),
	problem3Body: z.string().optional(),
	problem4Title: z.string().optional(),
	problem4Body: z.string().optional(),
	solutionTitle: z.string(),
	solutionBody: z.string(),
	productTitle: z.string(),
	productLead: z.string(),
	edge: z.string().optional(),
	applicationsTitle: z.string(),
	application1: z.string(),
	application2: z.string().optional(),
	application3: z.string().optional(),
	application4: z.string().optional(),
	application5: z.string().optional(),
	application6: z.string().optional(),
	proofLine: z.string().optional(),
	infoCta: z.string().optional(),
	infoHref: z.string().optional(),
	infoExternal: z.boolean().optional(),
	portalCta: z.string(),
	portalHref: z.string(),
	portalExternal: z.boolean().optional(),
	contactCta: z.string(),
	contactHref: z.string(),
	mediaKind: z.enum(['image', 'video']).default('image'),
	mediaSrc: z.string().optional(),
	mediaLabel: z.string(),
	mediaNeed: z.string().optional().default(''),
	mediaMessage: z.string().optional().default(''),
	/** Optional deep-dive sections (e.g. Salmoscan presentation content). */
	metricsTitle: z.string().optional(),
	metric1Value: z.string().optional(),
	metric1Label: z.string().optional(),
	metric2Value: z.string().optional(),
	metric2Label: z.string().optional(),
	metric3Value: z.string().optional(),
	metric3Label: z.string().optional(),
	capabilitiesTitle: z.string().optional(),
	capability1Title: z.string().optional(),
	capability1Body: z.string().optional(),
	capability2Title: z.string().optional(),
	capability2Body: z.string().optional(),
	capability3Title: z.string().optional(),
	capability3Body: z.string().optional(),
	capability4Title: z.string().optional(),
	capability4Body: z.string().optional(),
	capability5Title: z.string().optional(),
	capability5Body: z.string().optional(),
	capability6Title: z.string().optional(),
	capability6Body: z.string().optional(),
	installTitle: z.string().optional(),
	installLead: z.string().optional(),
	install1: z.string().optional(),
	install2: z.string().optional(),
	install3: z.string().optional(),
	install4: z.string().optional(),
	portalTitle: z.string().optional(),
	portalLead: z.string().optional(),
	portalFeature1: z.string().optional(),
	portalFeature2: z.string().optional(),
	portalFeature3: z.string().optional(),
	portalFeature4: z.string().optional(),
	technicalTitle: z.string().optional(),
	technicalBody: z.string().optional(),
	specsTitle: z.string().optional(),
	spec1Label: z.string().optional(),
	spec1Value: z.string().optional(),
	spec2Label: z.string().optional(),
	spec2Value: z.string().optional(),
	spec3Label: z.string().optional(),
	spec3Value: z.string().optional(),
	spec4Label: z.string().optional(),
	spec4Value: z.string().optional(),
	benefitsTitle: z.string().optional(),
	benefit1: z.string().optional(),
	benefit2: z.string().optional(),
	benefit3: z.string().optional(),
	benefit4: z.string().optional(),
	benefit5: z.string().optional(),
	benefit6: z.string().optional(),
	historyCta: z.string().optional(),
	historyHref: z.string().optional(),
	faqTitle: z.string().optional(),
	faqLead: z.string().optional(),
	faq1Question: z.string().optional(),
	faq1Answer: z.string().optional(),
	faq2Question: z.string().optional(),
	faq2Answer: z.string().optional(),
	faq3Question: z.string().optional(),
	faq3Answer: z.string().optional(),
	faq4Question: z.string().optional(),
	faq4Answer: z.string().optional(),
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
		navDeliver: z.string(),
		navProjects: z.string(),
		navAbout: z.string(),
		navContact: z.string(),
		navSalmoscan: z.string(),
		navCta: z.string(),
		navProductsColumn: z.string(),
		deliverMarkets: z
			.array(
				z.object({
					title: z.string(),
					blurb: z.string(),
					product: z.string(),
					cta: z.string(),
					image: z.string().optional(),
					imageAlt: z.string().optional(),
					video: z.string().optional(),
				}),
			)
			.min(1),
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
		teamTitle: z.string(),
		teamLead: z.string(),
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
		footerNav: z
			.array(
				z.object({
					label: z.string(),
					href: z.string(),
				}),
			)
			.optional(),
		footerLegal: z
			.array(
				z.object({
					label: z.string(),
					href: z.string(),
				}),
			)
			.min(1),
		footerLinkedInUrl: z.string().optional(),
		footerLinkedInLabel: z.string(),
	}),
});

const products = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/products',
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	}),
	schema: productPageSchema,
});

const legal = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/legal',
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		updated: z.string(),
		draftNotice: z.string(),
	}),
});

const team = defineCollection({
	loader: glob({
		pattern: '*.md',
		base: './src/content/team',
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	}),
	schema: z.object({
		name: z.string(),
		roleEn: z.string(),
		roleNo: z.string(),
		email: z.string().optional(),
		linkedin: z.string().optional(),
		photo: z.string(),
		order: z.number(),
		active: z.boolean().default(true),
	}),
});

export const collections = {
	pages,
	history,
	company,
	products,
	legal,
	team,
};
