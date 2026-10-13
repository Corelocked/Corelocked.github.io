export const destinations = [
  { id: 'about', name: 'About me', label: 'About me', icon: 'cabin', color: '#dbab76', x: 11, z: -8, description: 'My experience and education.' },
  { id: 'projects', name: 'My work', label: 'Projects', icon: 'workshop', color: '#96c58a', x: -11, z: -8, description: 'Web, mobile, and other projects I’ve worked on.' },
  { id: 'certificates', name: 'Achievements', label: 'Achievements', icon: 'trophy', color: '#e9c66e', x: 0, z: -16, description: 'Awards, certificates, and featured work.' },
  { id: 'skills', name: 'What I use', label: 'Skills', icon: 'pickaxe', color: '#9ebcc6', x: -12, z: 5, description: 'My tools and technologies.' },
  { id: 'resume', name: 'My resume', label: 'Resume', icon: 'book', color: '#b5a0cc', x: 12, z: 5, description: 'Read or download my resume.' },
  { id: 'contact', name: 'Let’s talk', label: 'Contact', icon: 'mail', color: '#dfad90', x: 6, z: 14, description: 'Get in touch with me.' },
  { id: 'arcade', name: 'Games', label: 'Mini-games', icon: 'game', color: '#ada9db', x: -9, z: 14, description: 'A few games to try.' },
  { id: 'github', name: 'My GitHub', label: 'GitHub activity', icon: 'workshop', color: '#92bb71', x: 18, z: -1, description: 'My coding activity and repositories.' },
];

export const destinationPath = (id) => ['projects', 'contact', 'support'].includes(id) ? `/${id}` : `/#${id}`;

export function sectionFromLocation(pathname, hash) {
  if (pathname === '/') return hash.replace('#', '') === 'home' ? '' : hash.replace('#', '');
  if (pathname === '/cedric-joshua-palapuz') return 'about';
  if (/^\/projects\/[^/]+\/info\/?$/.test(pathname)) return 'project';
  return pathname.replace(/^\/|\/$/g, '');
}

export function canWalk(x, z, obstacles) {
  if (Math.abs(x) > 22 || Math.abs(z) > 21 || Math.abs(x) + Math.abs(z) > 37) return false;
  return !obstacles.some((box) => x > box.x - box.w / 2 - 0.3 && x < box.x + box.w / 2 + 0.3
    && z > box.z - box.d / 2 - 0.3 && z < box.z + box.d / 2 + 0.3);
}
