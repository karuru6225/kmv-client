<template>
  <div class="page" :style="getInitialStyle()">
    <common-header
      :file="getHeaderFile()"
      :hideStar="type == 'bookmark'"
      :back="isHeaderBack()"
      @changeDirectory="changeDirectory"
    >
      <list-button color="primary" icon='refresh' @click="refresh" :disabled="!availableRefresh()"></list-button>
      <vert-div :class="$style.divider"/>
      <input-text type="text" ref="search" :class="$style.searchInput" v-show="$data.search" @keyup="filterList($event.target.value)" :defualtValue="$data.searchWord"/>
      <list-button color="primary" icon='search' @click="toggleSearch"></list-button>
      <vert-div :class="$style.divider"/>
      <div :class="$style.listButtons">
        <list-button color="primary" icon='list'> </list-button>
        <list-button color="primary" icon='th-large'> </list-button>
      </div>
    </common-header>
    <div :class="$style.body">
      <bookmarks
        :class="$style.bookmark"
        :lists="$store.state.bookmark.lists"
      />
      <file-list
        :files="$data.filteredList"
        :sort="$data.sort"
        :asc="$data.asc"
        :highlight="$store.state.dir.previousId"
        @changeOrder="changeOrder"
        @select="select"
      />
    </div>
  </div>
</template>

<script>
import CommonHeader from 'organisms/header.vue';
import VertDiv from 'atoms/block/vertical-divider.vue';
import ListButton from 'atoms/button/iconfont-base.vue';
import FileList from 'organisms/file-list.vue';
import InputText from 'atoms/form/input.vue';
import Bookmarks from 'organisms/bookmarks.vue';
import { mapState } from 'vuex';
import {getUrlFromFile} from 'utils/consts.js';
import store from 'stores/index.js';

export default {
  components: {
    CommonHeader,
    VertDiv,
    ListButton,
    FileList,
    InputText,
    Bookmarks,
  },
  props: ['id', 'type'],
  methods: {
    select: function(file){
      switch(this.type){
        case 'bookmark':
          this.$store.dispatch('bookmark/remove', file.id);
          break;
        case 'directory':
        default:
          let url = getUrlFromFile(file);
          this.$store.dispatch('file/select', file.id);
          this.$router.push(url);
          break;
        }
    },
    toggleSearch(){
      this.$data.search = !this.$data.search;
      if(!this.$data.search){
        this.$data.searchWord = '';
      }
      this.filterList(this.$data.searchWord);
    },
    filterList(word) {
      this.$data.searchWord = word;
      this.$router.replace({
        query: {
          sort: this.$data.sort,
          asc: this.$data.asc,
          search: word
        }
      });
      this.updateFiles();
    },
    changeDirectory: function(){
      this.$data.search = false;
      this.$data.searchWord = '';
    },
    refresh: function() {
      this.$store.dispatch('dir/refresh', { id: this.id });
    },
    availableRefresh: function(){
      return this.id && this.id != '' && this.type == 'directory';
    },
    getHeaderFile: function(){
      switch(this.type){
        case 'bookmark':
          return this.$store.state.bookmark.selected || {id:'', name:''};
        case 'directory':
        default:
          return this.$store.state.dir.current;
      }
    },
    isHeaderBack: function(){
      return this.type == 'bookmark';
    },
    fetchData: function(force) {
    },
    changeOrder(params){
      this.$router.replace({
        query: Object.assign({
          search: this.$data.searchWord
        }, params)
      });
      this.$data.sort = params.sort;
      this.$data.asc = params.asc;
      this.updateFiles();
    },
    updateFiles(){
      switch(this.type){
        case 'bookmark':
          this.$data.filteredList = this.bookmarkFiles.filter( item => {
            return item.name.indexOf( this.$data.searchWord ) != -1;
          });
        break;
        case 'directory':
        default:
          this.$data.filteredList = this.dirFiles.filter( item => {
            return item.name.indexOf( this.$data.searchWord ) != -1;
          });
        break;
      }
    },
    getInitialStyle(){
      if(!this.filteredList){
        switch(this.type){
          case 'bookmark':
            return {
              height: this.bookmarkFiles.length * 30 + 100 + 'px'
            }
          case 'directory':
          default:
            return {
              height: this.dirFiles.length * 30 + 100 + 'px'
            }
        }
      }
    },
    
  },
  data() {
    let search = false;
    let searchWord = '';
    if(this.$route.query.search){
      search = true;
      searchWord = this.$route.query.search;
    }
    let sort = 'name';
    let asc = true;
    if(this.$route.query.sort){
      sort = this.$route.query.sort;
      asc = this.$route.query.asc == 'true';
    }
    const data = {
      search,
      searchWord,
      sort,
      asc,
      filteredList: this.type == 'bookmark' ? this.bookmarkFiles : this.dirFiles
    };
    return data;
  },
  computed: mapState({
    dirFiles: s => s.dir.files,
    bookmarkFiles: s => {
      return s.bookmark.selected ? s.bookmark.selected.files : []
    }
  }),
  watch: {
    'dirFiles': 'updateFiles',
    'bookmarkFiles': 'updateFiles',
    'type': 'updateFiles'
  },
  beforeRouteEnter: function(route, redirect, next) {
    transitionRoute(route, null, next);
  },
  beforeRouteUpdate: function(to, from, next) {
    transitionRoute(to, from, next);
  },
  beforeRouteLeave: function(to, from, next) {
    store.commit('dir/previous', to.params.id);
    next();
  },
}

function transitionRoute(to, from, next){
  let promise = store.dispatch('bookmark/lists');
  if(to.params.type == 'bookmark'){
    promise = promise.then(_=>{
      return store.dispatch('bookmark/select', to.params.id);
    });
  }else{
    promise = promise.then(_=>{
      return store.dispatch('dir/dir', {
        id: to.params.id||''
      });
    }).then(_=>{
      return store.dispatch('file/select', to.params.id);
    });
    if(from){
      promise = promise.then(_=>{
        return store.commit('dir/previous', from.params.id);
      });
    }
  }
  promise.then(_=>{
    next();
  });
}

</script>
<style lang="scss" module>
@import "css/_settings.scss";

.header {
  position: fixed;
  height: $headerHeight;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background-color: $primaryColorDark;
  padding: 0 4px;
  &Container {
    height: $headerHeight;
    width: 100%;
  }
}

.divider {
  flex-grow: 0;
}

.parentLink,
.homeLink {
  flex-grow: 0;
  line-height: $headerHeight - 8px;
  width: $headerHeight - 8px;
  box-sizing: border-box;
  margin: 4px 0;
  text-align: center;
}

.homeLink {
  font-size: 20px;
  margin-left: 8px;
}

.currentName {
  line-height: $headerHeight;
  flex-grow: 1;
}

.searchInput {
}

.listButtons {
  flex-grow: 0;
  > *:nth-child(n+2) {
    margin-left: 0;
  }
}

.logout {
  flex-grow: 0;
  line-height: $headerHeight - 8px;
  box-sizing: border-box;
  margin: 4px 0;
  padding: 0 8px;
  text-align: center;
}

.body {
  display: flex;
  align-items: stretch;
}

.bookmark {
  height: calc(#{'100vh - ' + $headerHeight});
}

</style>
