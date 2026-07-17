import { getCareerAssistantReply } from './careerAssistant';

const projects = [
  {
    title: 'Pitaka', slug: 'pitaka', tagline: 'a finance app.', description: 'Finance tracking.',
    impact: 'Led its web launch.', roles: ['Frontend'], technologies: ['React', 'Firebase'],
    category: ['Website'], featured: true, highlights: ['Realtime sync']
  },
  {
    title: 'BlogShark', slug: 'blogshark', tagline: 'a blogging platform.', description: 'Blogging.',
    impact: 'Built the full stack.', roles: ['Tech Lead'], technologies: ['Laravel', 'SQLite'],
    category: ['Website'], featured: true, highlights: ['Role-based access']
  }
];

const skills = [{ skills: [{ name: 'React' }, { name: 'Firebase' }] }];
const ask = (question, context = {}) => getCareerAssistantReply(question, context, projects, skills);

test('compares two named projects using portfolio evidence', () => {
  const answer = ask('Compare Pitaka and BlogShark');
  expect(answer.text).toEqual(expect.stringContaining('Pitaka'));
  expect(answer.text).toEqual(expect.stringContaining('BlogShark'));
  expect(answer.intent).toBe('projects');
  expect(answer.references).toEqual(expect.arrayContaining([
    expect.objectContaining({ href: '/projects/pitaka/info' }),
    expect.objectContaining({ href: '/projects/blogshark/info' })
  ]));
});

test('assesses role fit without overstating evidence', () => {
  const answer = ask('Would Cedric be a good fit for a frontend role?');
  expect(answer.text).toEqual(expect.stringContaining('strongest fit'));
  expect(answer.text).toEqual(expect.stringContaining('validate the exact fit'));
  expect(answer.intent).toBe('role');
});

test('recommends project evidence for the previously discussed role', () => {
  const answer = ask('Which projects prove that fit?', { lastIntent: 'role', lastTopic: 'frontend' });
  expect(answer.text).toEqual(expect.stringContaining('Pitaka and BlogShark'));
});

test('uses the last project for a conversational follow-up', () => {
  const answer = ask('Tell me more', { lastIntent: 'projects', lastTopic: 'Pitaka' });
  expect(answer.text).toEqual(expect.stringContaining('Realtime sync'));
  expect(answer.topic).toBe('Pitaka');
});

test('keeps private information out of scope', () => {
  expect(ask('What is Cedric’s salary?').intent).toBe('policy');
});

test('searches rendered website content when no built-in intent matches', () => {
  const answer = getCareerAssistantReply(
    'Which responsive web design certification does Cedric have?',
    {},
    projects,
    skills,
    'Certificates FreeCodeCamp Responsive Web Design certification completed by Cedric.'
  );
  expect(answer.intent).toBe('site');
  expect(answer.text).toEqual(expect.stringContaining('Responsive Web Design'));
  expect(answer.references).toEqual(expect.arrayContaining([{ href: '/', label: 'Portfolio' }]));
});

test('keeps short technical terms searchable', () => {
  const answer = getCareerAssistantReply(
    'Which C# certificate does Cedric have?',
    {},
    projects,
    skills,
    [{ text: 'Dometrain — C# Fundamentals', href: '/#certificates', label: 'Certificates' }]
  );
  expect(answer.text).toEqual(expect.stringContaining('C# Fundamentals'));
  expect(answer.references).toEqual(expect.arrayContaining([{ href: '/#certificates', label: 'Certificates' }]));
});
