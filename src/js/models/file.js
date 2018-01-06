import randomString from 'randomstring';
import moment from 'moment';

/* eslint no-mixed-operators: 0 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default class {
  constructor({
    id, name, keyword, mtime, size, type, parentId
  } = {
      id: `id-${randomString.generate(8)}`,
      name: `name-${randomString.generate(8)}`,
      keyword: `keyword-${randomString.generate(8)}`,
      mtime: Date.now() - randomInt(0, 365 * 24 * 60 * 60 * 1000),
      type: 'dirctory',
      size: randomInt(1, 2048 * 1024 * 1024),
      parentId: ''
    }) {
    this.id = id;
    this.name = name;
    this.keyword = keyword;
    this.mtime = moment(mtime).valueOf();
    this.type = type;
    this.size = size;
    this.parentId = parentId;
  }
}
