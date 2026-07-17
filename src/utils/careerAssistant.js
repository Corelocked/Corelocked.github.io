const CAREER = {
  summary: 'Cedric Joshua Palapuz is a Computer Science student, Web Developer at Mega Cat Studios, and Lead Developer focused on practical full-stack products.',
  education: 'He is pursuing a BS in Computer Science at CIIT College of Arts and Technology, specializing in Web and Mobile Development, with graduation expected in October 2027.',
  experience: [
    'Web Developer at Mega Cat Studios (April 2026-present), maintaining Shopify storefronts and improving technical SEO',
    'Lead Developer for Pitaka (March 2026-present), launching a Philippine-focused finance app on web and mobile',
    'Technical Lead for Lakbay, E-TALA, BlogShark, and the award-winning InnSight assistant',
    'Work Immersion Intern at PNRI, where he encoded 1,000+ records within 40 hours'
  ],
  roleEvidence: {
    frontend: 'Frontend or junior full-stack roles are his strongest fit: he uses React, Next.js, JavaScript, HTML, and CSS, with shipped evidence in Pitaka, BlogShark, TaskFlow, and this portfolio.',
    backend: 'He fits junior backend or full-stack roles through Node.js, Express, Laravel, Firebase, Supabase, SQLite, SQL, and backend leadership on Lakbay and BlogShark.',
    mobile: 'He fits mobile internships and junior roles through Kotlin, Expo, Flutter, Firebase, Lakbay, E-TALA, and the mobile version of Pitaka.',
    qa: 'He has a QA-focused resume and practical quality work, but the public portfolio currently shows stronger evidence for development roles than a dedicated QA role.',
    data: 'He has a Data Engineer resume plus Python, SQL, Power BI, Jupyter, and data-handling experience, but his strongest shipped evidence is currently full-stack development.'
  }
};

const includesAny = (text, terms) => terms.some((term) => text.includes(term));

const reply = (text, intent, topic = intent, references = []) => ({ text, intent, topic, references });

const STOP_WORDS = new Set(['about', 'and', 'are', 'can', 'cedric', 'does', 'for', 'from', 'have', 'his', 'how', 'is', 'me', 'of', 'on', 'tell', 'that', 'the', 'this', 'to', 'uses', 'what', 'when', 'where', 'which', 'who', 'why', 'with']);
const REFERENCES = {
  about: [{ href: '/#about', label: 'About & experience' }],
  skills: [{ href: '/#skills', label: 'Skills' }],
  projects: [{ href: '/projects', label: 'All projects' }],
  certificates: [{ href: '/#certificates', label: 'Certificates & awards' }],
  profile: [{ href: '/cedric-joshua-palapuz', label: 'Cedric’s profile' }],
  contact: [{ href: '/contact', label: 'Contact' }]
};

const searchWebsite = (question, websiteSources, projects, skillCategories) => {
  const terms = [...new Set(question.match(/[a-z0-9+#.]{2,}/g) || [])].filter((term) => !STOP_WORDS.has(term));
  if (!terms.length) return { evidence: [], references: [] };

  const sources = [
    ...(Array.isArray(websiteSources) ? websiteSources : [{ text: websiteSources, href: '/', label: 'Portfolio' }]),
    { text: [CAREER.summary, CAREER.education, ...CAREER.experience, ...Object.values(CAREER.roleEvidence)].join('\n'), href: '/#about', label: 'About & experience' },
    { text: skillCategories.map(({ name, skills }) => `${name}: ${skills.map(({ name: skill }) => skill).join(', ')}`).join('\n'), href: '/#skills', label: 'Skills' },
    ...projects.map((project) => ({
      text: [project.title, project.tagline, project.description, project.impact, project.technologies?.join(', '), project.roles?.join(', '), project.highlights?.join('. ')].filter(Boolean).join('. '),
      href: `/projects/${project.slug}/info`,
      label: project.title
    }))
  ];

  const matches = sources.flatMap((source) => source.text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((text) => ({ ...source, text: text.replace(/\s+/g, ' ').trim() })))
    .filter(({ text }) => text.length >= 24 && text.length <= 280)
    .map((source) => ({ ...source, score: terms.reduce((score, term) => score + (source.text.toLowerCase().includes(term) ? 1 : 0), 0) }))
    .filter(({ score }) => score)
    .sort((a, b) => b.score - a.score || a.text.length - b.text.length)
    .filter(({ text }, index, results) => results.findIndex((result) => result.text === text) === index)
    .slice(0, 3);

  return {
    evidence: matches.map(({ text }) => text),
    references: matches.filter(({ href }, index) => matches.findIndex((match) => match.href === href) === index).map(({ href, label }) => ({ href, label }))
  };
};

const describeProject = (project) => {
  const highlights = project.highlights?.slice(0, 2).join('; ');
  return `${project.title} is ${project.tagline || project.description} Cedric worked as ${project.roles.join(' and ')} using ${project.technologies.join(', ')}.${project.impact ? ` ${project.impact}` : ''}${highlights ? ` Key evidence: ${highlights}.` : ''}`;
};

const findRole = (question) => {
  if (includesAny(question, ['front end', 'frontend', 'react', 'web developer', 'web development'])) return 'frontend';
  if (includesAny(question, ['back end', 'backend', 'server', 'api'])) return 'backend';
  if (includesAny(question, ['mobile', 'android', 'kotlin', 'expo', 'flutter'])) return 'mobile';
  if (includesAny(question, ['quality assurance', ' qa ', 'tester', 'testing'])) return 'qa';
  if (includesAny(question, ['data engineer', 'data analyst', 'analytics', 'power bi'])) return 'data';
  return null;
};

export const getCareerAssistantReply = (rawQuestion, context, projects, skillCategories, websiteSources = []) => {
  const question = ` ${rawQuestion.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ').replace(/\s+/g, ' ').trim()} `;
  const projectMatches = projects.filter((project) =>
    question.includes(` ${project.title.toLowerCase()} `) || question.includes(` ${project.slug.toLowerCase()} `)
  );
  const role = findRole(question);
  const asksForFit = includesAny(question, ['fit for', 'good fit', 'qualified', 'hire', 'hiring', 'best role', 'strongest role', 'what role', 'which role', 'apply for', 'career path']);
  const wantsMore = includesAny(question, ['tell me more', 'more detail', 'elaborate', 'expand', 'go deeper', 'what else', 'why is that', 'why?']);
  const isGreeting = /\b(hi|hello|hey|yo|good morning|good afternoon|good evening)\b/.test(question);
  const isThanks = /\b(thanks|thank you|appreciate it)\b/.test(question);

  if (includesAny(question, ['salary', 'income', 'birthday', 'birthdate', 'home address', 'password', 'relationship', 'family', 'religion', 'politics'])) {
    return reply('I only use information Cedric has made public on this website. Ask about his profile, skills, experience, projects, education, certificates, role fit, or contact details.', 'policy', 'privacy');
  }

  if (projectMatches.length > 1 || (question.includes(' compare ') && projectMatches.length)) {
    const compared = projectMatches.slice(0, 2);
    return reply(`${describeProject(compared[0])} By comparison, ${describeProject(compared[1])} The first is stronger evidence for ${compared[0].category.join(' and ').toLowerCase()} work; the second demonstrates ${compared[1].category.join(' and ').toLowerCase()} work.`, 'projects', compared.map(({ title }) => title).join('|'), compared.map(({ slug, title }) => ({ href: `/projects/${slug}/info`, label: title })));
  }

  if (projectMatches.length === 1) {
    return reply(describeProject(projectMatches[0]), 'projects', projectMatches[0].title, [{ href: `/projects/${projectMatches[0].slug}/info`, label: projectMatches[0].title }]);
  }

  if (wantsMore && context?.lastIntent === 'projects') {
    const lastProject = projects.find((project) => context.lastTopic?.split('|').includes(project.title));
    if (lastProject) return reply(describeProject(lastProject), 'projects', lastProject.title, [{ href: `/projects/${lastProject.slug}/info`, label: lastProject.title }]);
  }

  if (role && (asksForFit || includesAny(question, ['experience', 'strength', 'skills']))) {
    return reply(`${CAREER.roleEvidence[role]} I would validate the exact fit against the job description rather than claim experience that is not shown here.`, 'role', role, [...REFERENCES.skills, ...REFERENCES.projects]);
  }

  if (asksForFit) {
    return reply(`${CAREER.roleEvidence.frontend} Mobile development is also a credible secondary track. For the clearest application, lead with shipped work and choose the Web Developer, QA, or Data Engineer resume that matches the posting.`, 'role', 'frontend', [...REFERENCES.skills, ...REFERENCES.projects]);
  }

  if (includesAny(question, ['why cedric', 'why should', 'stand out', 'strong candidate', 'value', 'strength'])) {
    return reply('Cedric combines hands-on delivery with technical leadership: he has shipped web and mobile products, led several school teams, works professionally on Shopify and technical SEO, and can explain the product impact behind his code. His strongest evidence is Pitaka, BlogShark, Lakbay, and award-winning InnSight.', 'profile', 'strengths', [...REFERENCES.about, ...REFERENCES.projects]);
  }

  if (includesAny(question, ['experience', 'employment', 'work history', 'worked at', 'professional background'])) {
    return reply(`${CAREER.summary} His public experience includes: ${CAREER.experience.join('; ')}.`, 'experience', 'experience', REFERENCES.about);
  }

  if (includesAny(question, ['education', 'school', 'college', 'degree', 'graduate', 'graduation'])) {
    return reply(CAREER.education, 'experience', 'education', REFERENCES.about);
  }

  if (includesAny(question, ['award', 'achievement', 'recognition', 'winner'])) {
    return reply('InnSight won the Inabel Awards 2026 Internet of Things Innovation category. BlogShark was also featured on CIIT social media, and Cedric has repeatedly served as Technical Lead or Lead Developer across portfolio projects.', 'experience', 'achievements', [...REFERENCES.certificates, ...REFERENCES.projects]);
  }

  if (includesAny(question, ['leadership', 'lead developer', 'technical lead', 'team'])) {
    return reply('Cedric has served as Lead Developer for Pitaka and Technical Lead for Lakbay, E-TALA, BlogShark, and InnSight. That gives him evidence in technical direction, backend architecture, product delivery, and translating requirements into working software.', 'experience', 'leadership', [...REFERENCES.about, ...REFERENCES.projects]);
  }

  if (includesAny(question, ['skill', 'stack', 'technology', 'technologies', 'tools', 'know'])) {
    const skills = skillCategories.flatMap(({ skills: items }) => items.map(({ name }) => name));
    return reply(`Cedric's portfolio stack includes ${skills.join(', ')}. His strongest public evidence is in React-based frontend work, full-stack delivery, Firebase-backed products, and Kotlin or Expo mobile development.`, 'skills', role || 'stack', REFERENCES.skills);
  }

  if (includesAny(question, ['project', 'portfolio', 'built', 'shipped', 'featured'])) {
    if (context?.lastIntent === 'role') {
      const proof = {
        frontend: 'Pitaka and BlogShark provide the strongest frontend evidence, with TaskFlow as a smaller React example.',
        backend: 'BlogShark and Lakbay provide the strongest backend evidence through full-stack architecture, data modeling, and backend integration.',
        mobile: 'Lakbay, E-TALA, and the mobile port of Pitaka provide the strongest mobile evidence.',
        qa: 'The QA resume is the best starting point; the public project pages currently emphasize development evidence more than dedicated QA artifacts.',
        data: 'Pitaka and Lakbay show data-driven product work, while the Data Engineer resume contains the more role-specific evidence.'
      };
      return reply(proof[context.lastTopic] || 'Start with Pitaka for shipped product work, BlogShark for full-stack depth, Lakbay for technical leadership, and InnSight for applied AI and recognition.', 'projects', 'role-evidence', REFERENCES.projects);
    }
    const featured = projects.filter(({ featured }) => featured).map(({ title }) => title);
    return reply(`Featured work: ${featured.join(', ')}. For frontend or product delivery, start with Pitaka; for full-stack architecture, BlogShark; for mobile and backend leadership, Lakbay; for applied AI and recognition, InnSight.`, 'projects', 'featured', REFERENCES.projects);
  }

  if (includesAny(question, ['resume', 'cv'])) {
    return reply('Cedric keeps three targeted resumes: Web Developer, Quality Assurance, and Data Engineer. The Web Developer version best matches the strongest evidence currently visible in this portfolio. Open the Resume app to view or download them.', 'resume', role || 'resume', REFERENCES.profile);
  }

  if (includesAny(question, ['contact', 'email', 'reach', 'available', 'availability', 'internship', 'freelance', 'collaborate'])) {
    return reply('Cedric is open to internships, freelance work, and collaboration. Email cedricjoshua.palapuz@gmail.com or use the Contact app. A useful message should include the role or project, expected scope, stack, timeline, and how you found the portfolio.', 'contact', 'availability', REFERENCES.contact);
  }

  if (includesAny(question, ['who is cedric', 'about cedric']) || wantsMore) {
    return reply(`${CAREER.summary} ${CAREER.education} Ask me to assess a specific role, compare projects, or summarize his experience.`, 'profile', 'intro', REFERENCES.about);
  }

  if (isGreeting) return reply('Hi! Ask me anything about Cedric or this portfolio. I search the website for relevant information before I answer.', 'smalltalk', 'greeting');
  if (isThanks) return reply('You’re welcome. If you have a job description in mind, ask which of Cedric’s skills and projects best support it.', 'smalltalk', 'gratitude');

  const websiteResults = searchWebsite(question, websiteSources, projects, skillCategories);
  if (websiteResults.evidence.length) {
    return reply(`Here’s what I found across Cedric’s website: ${websiteResults.evidence.join(' ')}`, 'site', 'website-search', websiteResults.references);
  }

  return reply('I could not find that on Cedric’s website. Try asking about something shown in his profile, experience, projects, skills, certificates, contact details, or support pages.', 'clarify', 'unknown');
};
