import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { projects } from '../data/projects';

const SITE_URL = 'https://corelocked.github.io';
const PROFILE_URL = `${SITE_URL}/cedric-joshua-palapuz`;
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PROGRAMMING_LANGUAGES = ['JavaScript', 'Python', 'Kotlin', 'Rust', 'Java', 'PHP', 'HTML', 'CSS', 'XML'];
const DEFAULT_IMAGE = `${SITE_URL}/preview.png`;
const DEFAULT_TITLE = 'Cedric Joshua Palapuz | Full-Stack Web Developer Portfolio';
const DEFAULT_DESCRIPTION =
  'Portfolio of Cedric Joshua Palapuz featuring full-stack web applications built with React, Next.js, Node.js, Firebase, and Supabase.';
const DEFAULT_KEYWORDS =
  'Cedric Joshua Palapuz, Cedric Joshua, Cedric Palapuz, full-stack web developer, web developer portfolio, React developer, Next.js, Node.js';

function ensureMetaTag(attr, key) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  return tag;
}

function setMeta(attr, key, value) {
  const existing = document.querySelector(`meta[${attr}="${key}"]`);

  if (!value) {
    if (existing) {
      existing.remove();
    }
    return;
  }

  const tag = existing || ensureMetaTag(attr, key);
  tag.setAttribute('content', value);
}

function resolveMediaUrl(path) {
  if (!path || path === '#') return null;

  try {
    return new URL(path, SITE_URL).href;
  } catch (error) {
    return null;
  }
}

function getYoutubeId(url) {
  if (!url) return null;

  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function getVideoSchemaUrl(url) {
  if (!url || url === '#') return null;

  const youtubeId = getYoutubeId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  return null;
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setJsonLd(payload) {
  const scriptId = 'seo-route-jsonld';
  let script = document.getElementById(scriptId);
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

function normalizePath(pathname) {
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function buildBaseJsonLd(url, pageName = 'Current Page', parentPage = null) {
  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: 'Cedric Joshua Palapuz Portfolio',
      url: `${SITE_URL}/`,
      inLanguage: 'en',
      description: DEFAULT_DESCRIPTION,
      creator: { '@id': PERSON_ID }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Cedric Joshua Palapuz',
      givenName: 'Cedric Joshua',
      familyName: 'Palapuz',
      alternateName: ['Cedric Joshua', 'Cedric Palapuz'],
      url: PROFILE_URL,
      jobTitle: 'Full-Stack Web Developer',
      description: 'Philippines-based full-stack web and mobile developer building practical, production-ready applications.',
      knowsAbout: [
        'Full-stack web development',
        'Mobile development',
        'React',
        'Node.js',
        'Laravel',
        'Firebase',
        'Supabase',
        'Kotlin',
        'Shopify'
      ],
      mainEntityOfPage: PROFILE_URL,
      sameAs: [
        'https://github.com/Corelocked',
        'https://www.linkedin.com/in/cedric-joshua-palapuz-85645524a/'
      ]
    }
  ];

  if (url !== `${SITE_URL}/`) {
    const itemListElement = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`
      },
      ...(parentPage
        ? [{ '@type': 'ListItem', position: 2, name: parentPage.name, item: parentPage.url }]
        : []),
      {
        '@type': 'ListItem',
        position: parentPage ? 3 : 2,
        name: pageName,
        item: url
      }
    ];

    graph.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement
    });
  }

  return graph;
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = normalizePath(pathname);
    const url = `${SITE_URL}${path}`;
    let canonicalUrl = url;

    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESCRIPTION;
    let ogType = 'website';
    let image = DEFAULT_IMAGE;
    let imageAlt = 'Preview image for Cedric Joshua Palapuz portfolio';
    let imageWidth = '1200';
    let imageHeight = '630';
    let ogVideo = null;
    let keywords = DEFAULT_KEYWORDS;
    let robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    let jsonLd = buildBaseJsonLd(url);

    if (path === '/') {
      title = 'Cedric Joshua Palapuz | Full-Stack Web Developer Portfolio';
      description =
        'Full-stack web developer portfolio featuring shipped projects, case studies, and production-ready frontend and backend workflows.';
      keywords =
        'Cedric Joshua Palapuz portfolio, Cedric Joshua developer, Cedric Palapuz full-stack web developer, React developer Philippines';
      jsonLd = [
        ...buildBaseJsonLd(url),
        {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          '@id': `${SITE_URL}/#profile`,
          name: 'Cedric Joshua Palapuz Portfolio',
          url,
          description,
          isPartOf: { '@id': WEBSITE_ID },
          mainEntity: { '@id': PERSON_ID }
        }
      ];
    } else if (path === '/cedric-joshua-palapuz') {
      title = 'Cedric Joshua Palapuz | Full-Stack Web Developer Profile';
      description =
        'Official profile of Cedric Joshua Palapuz, a full-stack web developer focused on practical, production-ready applications.';
      keywords =
        'Cedric Joshua Palapuz, Cedric Joshua, Cedric Palapuz, official profile, full-stack web developer, React developer, portfolio';

      jsonLd = [
        ...buildBaseJsonLd(url, 'Developer Profile'),
        {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          '@id': `${PROFILE_URL}#profile`,
          name: 'Cedric Joshua Palapuz Developer Profile',
          url,
          description,
          isPartOf: { '@id': WEBSITE_ID },
          mainEntity: { '@id': PERSON_ID }
        }
      ];
    } else if (path === '/projects') {
      title = 'Projects | Cedric Joshua Palapuz';
      description =
        'Browse shipped and featured web, mobile, desktop, and full-stack projects by Cedric Joshua Palapuz.';
      jsonLd = [
        ...buildBaseJsonLd(url, 'Projects'),
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Projects',
          description,
          url,
          isPartOf: { '@id': WEBSITE_ID },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: projects.filter((project) => project.slug).length,
            itemListElement: projects
              .filter((project) => project.slug)
              .map((project, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'SoftwareApplication',
                  name: project.title,
                  description: project.tagline || project.description,
                  url: `${SITE_URL}/projects/${project.slug}/info`
                }
              }))
          }
        }
      ];
    } else if (path === '/contact') {
      title = 'Contact | Cedric Joshua Palapuz';
      description = 'Get in touch with Cedric Joshua Palapuz for full-stack web projects or collaboration.';
      jsonLd = buildBaseJsonLd(url, 'Contact');
    } else if (path === '/support') {
      title = 'Support | Cedric Joshua Palapuz';
      description = 'Support Cedric Joshua Palapuz and the open, creative development projects in this portfolio.';
      jsonLd = buildBaseJsonLd(url, 'Support');
    } else {
      const projectMatch = path.match(/^\/projects\/([^/]+)(?:\/info|\/view)?$/);
      if (projectMatch) {
        const slug = projectMatch[1];
        const project = projects.find((item) => item.slug === slug);

        if (project) {
          const projectInfoUrl = `${SITE_URL}/projects/${project.slug}/info`;
          const isDemoRoute = path === `/projects/${project.slug}` || path.endsWith('/view');
          canonicalUrl = projectInfoUrl;
          title = `${project.title} | Cedric Joshua Palapuz`;
          description = project.tagline || project.description || DEFAULT_DESCRIPTION;
          ogType = 'article';
          image = resolveMediaUrl(project.image) || DEFAULT_IMAGE;
          imageAlt = `${project.title} project preview image`;
          imageWidth = '1200';
          imageHeight = '630';
          ogVideo = getVideoSchemaUrl(project.liveDemo);

          if (isDemoRoute) {
            robots = 'noindex, follow';
          }

          jsonLd = [
            ...buildBaseJsonLd(projectInfoUrl, project.title, {
              name: 'Projects',
              url: `${SITE_URL}/projects`
            }),
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              '@id': `${projectInfoUrl}#software`,
              name: project.title,
              description,
              applicationCategory: project.eyebrow || project.category?.[0] || 'DeveloperApplication',
              operatingSystem: [
                project.category?.includes('Website') && 'Web',
                project.category?.includes('Mobile App') && 'Android',
                project.category?.includes('Desktop App') && 'Windows'
              ].filter(Boolean).join(', ') || 'Platform independent',
              creator: { '@id': PERSON_ID },
              mainEntityOfPage: projectInfoUrl,
              url: projectInfoUrl,
              image,
              copyrightYear: Number(project.year),
              keywords: [...(project.technologies || []), ...(project.category || []), ...(project.roles || [])].join(', '),
              featureList: project.highlights,
              sameAs: [project.website, project.liveDemo].filter((link) => link && link !== '#')
            },
            project.githubLink && project.githubLink !== '#' && {
              '@context': 'https://schema.org',
              '@type': 'SoftwareSourceCode',
              '@id': `${projectInfoUrl}#source`,
              name: `${project.title} source code`,
              description,
              codeRepository: project.githubLink,
              programmingLanguage: project.technologies?.filter((technology) => PROGRAMMING_LANGUAGES.includes(technology)),
              creator: { '@id': PERSON_ID },
              isPartOf: { '@id': `${projectInfoUrl}#software` }
            }
          ].filter(Boolean);
        } else {
          title = 'Project Not Found | Cedric Joshua Palapuz';
          description = 'The requested project could not be found.';
          robots = 'noindex, nofollow';
          jsonLd = [];
        }
      } else {
        title = 'Page Not Found | Cedric Joshua Palapuz';
        description = 'The requested page could not be found.';
        robots = 'noindex, nofollow';
        jsonLd = [];
      }
    }

    document.title = title;

    setCanonical(canonicalUrl);
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', robots);
    setMeta('name', 'googlebot', robots);
    setMeta('name', 'bingbot', robots);
    setMeta('name', 'creator', 'Cedric Joshua Palapuz');
    setMeta('name', 'application-name', 'Cedric Joshua Palapuz Portfolio');
    setMeta('property', 'og:locale', 'en_US');
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', 'Cedric Joshua Palapuz Portfolio');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:image:alt', imageAlt);
    setMeta('property', 'og:image:width', imageWidth);
    setMeta('property', 'og:image:height', imageHeight);
    setMeta('property', 'og:video', ogVideo);
    setMeta('property', 'article:author', ogType === 'article' ? PROFILE_URL : null);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'twitter:image:alt', imageAlt);

    setJsonLd(jsonLd);
  }, [pathname]);

  return null;
}
