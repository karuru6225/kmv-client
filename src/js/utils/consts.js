import pathToRegexp from 'path-to-regexp';
import Dummy from '../containers/dummy';
import Movie from '../containers/movie';

export const extComponentMap = [
  {
    key: 'dir',
    exts: ['directory'],
  },
  {
    key: 'book',
    exts: ['zip', 'pdf'],
    component: Dummy
  },
  {
    key: 'movie',
    exts: ['m3u8'],
    component: Movie
  },
  {
    key: 'any',
    exts: ['*'],
    component: Dummy
  }
];

export function getUrlFromFile(type, id) {
  const map = extComponentMap;
  const safeId = id && id !== 'undefined' ? id : '';
  let url = false;
  for (let i = 0; i < map.length; i += 1) {
    const match = map[i].exts.reduce((acc, current) => {
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

export const storage = localStorage;

export const storageKey = 'kmv-token';
