import pathToRegexp from 'path-to-regexp';
import Dummy from '../containers/dummy';
import Movie from '../containers/movie';

export const extComponentMap = {
  dir: {
    exts: ['directory'],
  },
  book: {
    exts: ['zip', 'pdf'],
    component: Dummy
  },
  movie: {
    exts: ['m3u8'],
    component: Movie
  },
  any: {
    exts: ['*'],
    component: Dummy
  }
};

export function getUrlFromFile(type, id) {
  const map = extComponentMap;
  const keys = Object.keys(extComponentMap);
  const safeId = id && id !== 'undefined' ? id : '';
  let url = false;
  for (let i = 0; i < keys.length; i += 1) {
    const app = keys[i];
    const match = map[app].exts.reduce((acc, current) => {
      const regexp = pathToRegexp(current);
      if (regexp.test(type)) {
        return true;
      }
      return acc;
    }, false);
    if (match && url === false) {
      url = `/${type}/${safeId}`;
    }
  }
  return url;
}
