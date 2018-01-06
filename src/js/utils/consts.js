export const extComponentMap = {
  directory: {
    path: 'directory',
  },
  zip: {
    path: 'book',
  },
  pdf: {
    path: 'book',
  },
  m3u8: {
    path: 'movie',
  },
  any: {
    path: 'any',
  },
};

export function getUrlFromFile(file) {
  const map = extComponentMap;
  let url = `/${map.any.path}/${file.type}/${file.id}`;
  if (file.type === 'directory') {
    url = `/dir/${file.id}`;
  } else if (map[file.type]) {
    const setting = map[file.type];
    if (setting) {
      url = `/${setting.path}/${file.type}/${file.id}`;
    }
  }
  return url;
}
