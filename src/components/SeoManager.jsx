import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { projects } from './AllProjects';

const SITE_URL = 'https://corelocked.github.io';
const DEFAULT_IMAGE = `${SITE_URL}/preview.png`;
const DEFAULT_TITLE = 'Cedric Joshua Palapuz | Web & Mobile Developer Portfolio';
const DEFAULT_DESCRIPTION =
  'Portfolio of Cedric Joshua Palapuz featuring shipped web and mobile projects built with React, Next.js, Expo, Kotlin, Firebase, and Supabase.';

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
  const tag = ensureMetaTag(attr, key);
  tag.setAttribute('content', value);
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

function buildBaseJsonLd(url) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Cedric Joshua Palapuz Portfolio',
      url: SITE_URL,
      inLanguage: 'en'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Cedric Joshua Palapuz',
      url: SITE_URL,
      jobTitle: 'Web and Mobile Developer',
      sameAs: [
        'https://github.com/Corelocked',
        'https://www.linkedin.com/in/cedric-joshua-palapuz-85645524a/'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Current Page',
          item: url
        }
      ]
    }
  ];
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = normalizePath(pathname);
    const url = `${SITE_URL}${path}`;

    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESCRIPTION;
    let ogType = 'website';
    let robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    let jsonLd = buildBaseJsonLd(url);

    if (path === '/') {
      title = 'Cedric Joshua Palapuz | Web & Mobile Developer Portfolio';
      description =
        'Web and mobile developer portfolio featuring shipped projects, case studies, and production-ready app workflows.';
    } else if (path === '/projects') {
      title = 'Projects | Cedric Joshua Palapuz';
      description =
        'Browse shipped and featured web, mobile, desktop, and full-stack projects by Cedric Joshua Palapuz.';
      jsonLd = [
        ...buildBaseJsonLd(url),
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Projects',
          description,
          url
        }
      ];
    } else if (path === '/contact') {
      title = 'Contact | Cedric Joshua Palapuz';
      description = 'Get in touch with Cedric Joshua Palapuz for web and mobile app projects or collaboration.';
    } else if (path === '/support') {
      title = 'Support | Cedric Joshua Palapuz';
      description = 'Support Cedric Joshua Palapuz and the open, creative development projects in this portfolio.';
    } else {
      const projectMatch = path.match(/^\/projects\/([^/]+)(?:\/info|\/view)?$/);
      if (projectMatch) {
        const slug = projectMatch[1];
        const project = projects.find((item) => item.slug === slug);

        if (project) {
          title = `${project.title} | Cedric Joshua Palapuz`;
          description = project.tagline || project.description || DEFAULT_DESCRIPTION;
          ogType = 'article';

          if (path.endsWith('/view')) {
            robots = 'noindex, nofollow';
          }

          jsonLd = [
            ...buildBaseJsonLd(url),
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: project.title,
              description,
              applicationCategory: project.category?.[0] || 'DeveloperApplication',
              operatingSystem: project.category?.includes('Mobile App')
                ? 'Android'
                : project.category?.includes('Desktop App')
                  ? 'Windows'
                  : 'Web',
              author: {
                '@type': 'Person',
                name: 'Cedric Joshua Palapuz'
              },
              url,
              image: DEFAULT_IMAGE,
              codeRepository:
                project.githubLink && project.githubLink !== '#'
                  ? project.githubLink
                  : undefined,
              sameAs:
                project.website && project.website !== '#'
                  ? [project.website]
                  : project.liveDemo && project.liveDemo !== '#'
                    ? [project.liveDemo]
                    : undefined
            }
          ];
        }
      }
    }

    document.title = title;

    setCanonical(url);
    setMeta('name', 'description', description);
    setMeta('name', 'robots', robots);
    setMeta('property', 'og:locale', 'en_US');
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', 'Cedric Joshua Palapuz Portfolio');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', DEFAULT_IMAGE);
    setMeta('property', 'og:image:alt', 'Preview image for Cedric Joshua Palapuz portfolio');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', DEFAULT_IMAGE);

    setJsonLd(jsonLd);
  }, [pathname]);

  return null;
}
