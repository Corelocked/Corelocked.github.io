export const islandBounds = { x: 35, z: 33, diagonal: 59 };
export const courtyardRadius = 7;
export const arrivalPosition = { x: 0, z: 25 };

export const destinations = [
  { id: 'about', name: 'About me', label: 'About me', icon: 'cabin', color: '#dbab76', x: 11, z: -8, description: 'My experience and education.' },
  { id: 'projects', name: 'My work', label: 'Projects', icon: 'workshop', color: '#96c58a', x: -11, z: -8, description: 'Web, mobile, and other projects I’ve worked on.' },
  { id: 'certificates', name: 'Achievements', label: 'Achievements', icon: 'trophy', color: '#e9c66e', x: 0, z: -16, description: 'Awards, certificates, and featured work.' },
  { id: 'skills', name: 'What I use', label: 'Skills', icon: 'pickaxe', color: '#9ebcc6', x: -12, z: 5, description: 'My tools and technologies.' },
  { id: 'resume', name: 'My resume', label: 'Resume', icon: 'book', color: '#b5a0cc', x: 12, z: 5, description: 'Read or download my resume.' },
  { id: 'contact', name: 'Let’s talk', label: 'Contact', icon: 'mail', color: '#dfad90', x: 6, z: 14, description: 'Get in touch with me.' },
  { id: 'arcade', name: 'Games', label: 'Mini-games', icon: 'game', color: '#ada9db', x: -9, z: 14, description: 'A few games to try.' },
  { id: 'github', name: 'My GitHub', label: 'GitHub activity', icon: 'code', color: '#92bb71', x: 18, z: -1, description: 'My coding activity and repositories.' },
].map(station => ({ ...station, modelX: station.x, modelZ: station.z, x: station.x * 1.6, z: station.z * 1.6, yaw: Math.atan2(-station.x, -station.z) }));

// Station fronts use local +Z; rotate their entrances toward the island's origin.
export function destinationPoint(station, x = 0, z = 8) {
  const cosine = Math.cos(station.yaw), sine = Math.sin(station.yaw);
  return { x: station.x + x * cosine + z * sine, z: station.z - x * sine + z * cosine };
}

export function isWorldPath(x, z) {
  if (Math.hypot(x, z) < courtyardRadius || (Math.abs(x) < 2 && z >= 0 && z <= 29)) return true;
  return destinations.some(station => {
    const fraction = Math.max(0, Math.min(1, (x * station.x + z * station.z) / (station.x ** 2 + station.z ** 2)));
    return Math.hypot(x - fraction * station.x, z - fraction * station.z) < 1.8;
  });
}

export const destinationPath = (id) => ['projects', 'contact', 'support'].includes(id) ? `/${id}` : `/#${id}`;

export function sectionFromLocation(pathname, hash) {
  if (pathname === '/') return hash.replace('#', '') === 'home' ? '' : hash.replace('#', '');
  if (pathname === '/cedric-joshua-palapuz') return 'about';
  if (/^\/projects\/[^/]+\/info\/?$/.test(pathname)) return 'project';
  return pathname.replace(/^\/|\/$/g, '');
}

export function canWalk(x, z, obstacles) {
  if (Math.abs(x) > islandBounds.x - 1 || Math.abs(z) > islandBounds.z - 1 || Math.abs(x) + Math.abs(z) > islandBounds.diagonal - 2) return false;
  return !obstacles.some(box => {
    const cosine = Math.cos(box.yaw || 0), sine = Math.sin(box.yaw || 0);
    const dx = x - box.x, dz = z - box.z;
    const localX = dx * cosine - dz * sine, localZ = dx * sine + dz * cosine;
    return Math.abs(localX) < box.w / 2 + 0.3 && Math.abs(localZ) < box.d / 2 + 0.3;
  });
}
