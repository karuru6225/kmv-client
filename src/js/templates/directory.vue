<template>
  <div class="page" :style="getInitialStyle()">
    <common-header
       :parentId="$store.state.dir.current.parentId"
       :name="$store.state.dir.current.name"
       @changeDirectory="changeDirectory"
    >
      <list-button color="primary" icon='refresh' @click="refresh" :disabled="!id || id == ''"></list-button>
      <vert-div :class="$style.divider"/>
      <input-text type="text" ref="search" :class="$style.searchInput" v-show="$data.search" @keyup="filterList($event.target.value)" :defualtValue="$data.searchWord"/>
      <list-button color="primary" icon='search' @click="toggleSearch"></list-button>
      <vert-div :class="$style.divider"/>
      <div :class="$style.listButtons">
        <list-button color="primary" icon='list'> </list-button>
        <list-button color="primary" icon='th-large'> </list-button>
      </div>
    </common-header>
    <file-list
      :files="$data.filteredList"
      :sort="$data.sort"
      :asc="$data.asc"
      :highlight="$store.state.dir.previousId"
      @changeOrder="changeOrder"
    />
  </div>
</template>

<script>
import CommonHeader from 'organisms/header.vue';
import VertDiv from 'atoms/block/vertical-divider.vue';
import ListButton from 'atoms/button/iconfont-base.vue';
import FileList from 'organisms/file-list.vue';
import InputText from 'atoms/form/input.vue';
import { mapState } from 'vuex';

export default {
  components: {
    CommonHeader,
    VertDiv,
    ListButton,
    FileList,
    InputText
  },
  props: ['id'],
  methods: {
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
    fetchData: function(force) {
      if(this.$store.state.dir.current.id != this.$route.params.id || force){
        this.$store.dispatch('dir/dir', {
          id: this.id||''
        });
      }
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
      this.$data.filteredList = this.files.filter( item => {
        return item.name.indexOf( this.$data.searchWord ) != -1;
      });
    },
    getInitialStyle(){
      if(!this.filteredList){
        return {
          height: this.files.length * 30 + 100 + 'px'
        }
      }
    }
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
      filteredList: this.$props.files
    };
    return data;
  },
  computed: mapState({
    files: s => s.dir.files
  }),
  watch: {
    '$route': 'fetchData',
    'files': 'updateFiles'
  },
  created: function() {
    console.log('create');
    this.fetchData(true);
  },
  beforeRouteLeave: function(to, from, next) {
    this.$store.commit('dir/previous', to.params.id);
    next();
  },
  beforeRouteUpdate: function(to, from, next) {
    this.$store.commit('dir/previous', this.$store.state.dir.current.id);
    next();
  },
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

</style>
