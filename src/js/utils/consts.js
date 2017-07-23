import Directory from 'templates/directory.vue';
import Book from 'templates/book.vue';
import Movie from 'templates/movie.vue';
import Download from 'templates/download.vue';

export const extComponentMap = {
  directory: {
    path: 'directory',
    component: Directory
  },
  zip: {
    path: 'book',
    component: Book
  },
  pdf: {
    path: 'book',
    component: Book
  },
  m3u8: {
    path: 'movie',
    component: Movie
  },
  any: {
    path: 'any',
    component: Download
  },
};
