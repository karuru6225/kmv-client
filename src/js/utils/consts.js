import pathToRegexp from 'path-to-regexp';
import Book from '../containers/book';
import Movie from '../containers/movie';
import Dummy from '../containers/dummy';

export const imageBufferLength = 20;
export const  BOOK_NO_CACHE = '0';
export const  BOOK_LOADING = '1';
export const  BOOK_CACHED = '2';

export const KEY_LEFT = 37;
export const KEY_RIGHT= 39;
export const KEY_UP = 38;
export const KEY_DOWN = 40;
export const KEY_SPACE = 32;

export const extComponentMap = [
  {
    key: 'dir',
    exts: ['directory'],
  },
  {
    key: 'book',
    exts: ['zip', 'pdf'],
    component: Book
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
