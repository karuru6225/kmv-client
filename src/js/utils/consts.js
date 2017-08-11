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

export function getUrlFromFile(file){
  const map = extComponentMap;
  let url = `${PublicPath}${map['any'].path}/${file.type}/${file.id}`;
  if(file.type == 'directory'){
    url = `${PublicPath}directory/${file.id}`;
  }else if(map[file.type]){
    const setting = map[file.type];
    if(setting){
      url = `${PublicPath}${setting.path}/${file.type}/${file.id}`;
    }
  }
  return url;
}
