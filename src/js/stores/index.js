import Vuex from 'vuex';

import dir from 'stores/dir.js';
import book from 'stores/book.js';
import movie from 'stores/movie.js';
import auth from 'stores/auth.js';
import bookmark from 'stores/bookmark.js';
import file from 'stores/file.js';

const store = new Vuex.Store({
  modules: {
    bookmark,
    dir,
    auth,
    book,
    movie,
    file
  }
});

export default store;
