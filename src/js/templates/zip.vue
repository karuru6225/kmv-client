<template>
  <div class="page">
    <common-header
      :back=true
      :name="$store.state.zip.name"
      :class="$data.headerClass"
    />
    <div :class="getStatusBarClass()">
      <template v-for="(stat, idx) in $store.state.zip.imageStatuses">
        <div :class="getLoadStatClass(stat, idx)"></div>
      </template>
    </div>
    <div :class="$style.main" v-if="!$data.leftFirst" ref="imageArea">
      <div>
        <img ref="rightImage"
          @dblclick="dblclick('right')"
          @click="next()"
          :class="$data.rightFlip"
        />
      </div>
      <div>
        <img ref="leftImage"
          @dblclick="dblclick('left')"
          @click="prev()"
          :class="$data.leftFlip"
        />
      </div>
    </div>
    <div :class="$style.main" v-if="$data.leftFirst" ref="imageArea">
      <div>
        <img ref="leftImage"
          @dblclick="dblclick('left')"
          @click="prev()"
          :class="$data.leftFlip"
        />
      </div>
      <div>
        <img ref="rightImage"
          @dblclick="dblclick('right')"
          @click="next()"
          :class="$data.rightFlip"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CommonHeader from 'organisms/header.vue';
import VertDiv from 'atoms/block/vertical-divider.vue';
import ListButton from 'atoms/button/iconfont-base.vue';
import { mapState } from 'vuex';

export default {
  components: {
    CommonHeader,
    VertDiv,
    ListButton,
  },
  props: ['id', 'page'],
  methods: {
    dblclick(pos){
      return;
      if(this.$data[pos+'Flip']){
        this.$data[pos+'Flip'] = null;
      }else{
        this.$data[pos+'Flip'] = this.$style.flipImage;;
      }
    },
    getStatusBarClass(){
      if(this.$data.leftFirst){
        return this.$style.loadStatus;
      }else{
        return this.$style.loadStatusReverse;
      }
    },
    getLoadStatClass(stat, idx) {
      if(idx == this.$data.currentPage){
        return this.$style.current;
      }
      if(stat == 2){
        return this.$style.loaded;
      }
      return this.$style.loading;
    },
    toggleSearch(){
    },
    parentDir: function(e){
      e.preventDefault();
      this.$router.push(PublicPath + 'directory/' + this.$store.state.zip.parentId);
      this.$store.dispatch('zip/stopLoadImages');
    },
    logout: function(e) {
      e.preventDefault();
      this.$store.dispatch('auth/logout');
    },
    fetchData: function() {
      this.$store.dispatch('zip/files', {
        id: this.id||'',
        page: this.$data.currentPage
      });
    },
    fileCountLoaded() {
      this.$store.dispatch('zip/startLoadImages', {offset: this.$data.currentPage});
    },
    saturation(page){
      return Math.max(Math.min(page, this.fileCount - 1), 0);
    },
    prev(){
      this.$data.currentPage =  this.saturation(this.$data.currentPage - 2);
      this.pageUpdate();
    },
    next(){
      this.$data.currentPage =  this.saturation(this.$data.currentPage + 2);
      this.pageUpdate();
    },
    onePage(){
      this.$data.currentPage =  this.saturation(this.$data.currentPage - 1);
      this.pageUpdate();
    },
    pageUpdate(){
      this.$data.shown = [false, false];
      this.$store.dispatch('zip/startLoadImages', {offset: this.$data.currentPage});
      if(this.$refs.leftImage){
        this.$refs.leftImage.src = '';
      }
      if(this.$refs.rightImage){
        this.$refs.rightImage.src = '';
      }
      this.$data.leftFlip = this.$data.rightFlip = false;
      this.setImage();
    },
    keyup(e) {
      e.preventDefault();
      switch(e.keyCode){
        case 37://left
          this.next();
          break;
        case 39://right
          this.prev();
          break;
        case 38://up
          this.$data.leftFirst = !this.$data.leftFirst;
          break;
        case 40://down
          this.onePage();
          break;
        default:
          return;
      }
    },
    setImage() {
      const url = window.URL || window.webkitURL;
      const zip = this.$store.state.zip;
      const page = this.$data.currentPage;
      if(zip.images[page] && !this.$data.shown[0]) {
        const leftBlob = zip.images[page];
        console.log(this.$refs.leftImage);
        this.$refs.leftImage.src = url.createObjectURL(leftBlob);
        this.$data.shown[0] = true;
      }
      if(zip.images[page+1] && !this.$data.shown[1] && page+1 < this.fileCount) {
        const rightBlob = zip.images[page+1];
        console.log(this.$refs.rightImage);
        this.$refs.rightImage.src = url.createObjectURL(rightBlob);
        this.$data.shown[1] = true;
      }

    },
    mousemove(e) {
      if(e.clientY < 44) {
        this.$data.headerClass = this.$style.header;
      }else{
        this.$data.headerClass = this.$style.headerHidden;
      }
    }
  },
  data() {
    return {
      shown: [false, false],
      currentPage: +(this.page||0),
      leftFirst: false,
      headerClass: this.$style.headerHidden,
      leftFlip: null,
      rightFlip: null,
    };
  },
  computed: mapState({
    fileCount: s => s.zip.fileCount,
    loaded: s => s.zip.loaded,
    statuses: s => s.zip.imageStatuses
  }),
  watch: {
    'fileCount': 'fileCountLoaded',
    'loaded': 'setImage'
  },
  created: function() {
    this.fetchData();
    console.log('created');
    window.addEventListener('keyup', this.keyup.bind(this));
    window.addEventListener('mousemove', this.mousemove.bind(this));
  },
  destroyed: function() {
    console.log('destroyed');
    window.removeEventListener('keyup', this.keyup.bind(this));
    window.removeEventListener('mousemove', this.mousemove.bind(this));
    this.$store.dispatch('zip/stopLoadImages');
  }
}

</script>
<style lang="scss" module>
@import "css/_settings.scss";

.header {
  margin-top: 0px;
  transition: margin-top .3s;
  &Hidden {
    @extend .header;
    margin-top: -44px;
  }
}

.main {
  display: flex;
  margin: 0 auto;
  height: calc(100vh - 2px);
  justify-content: center;
  > * {
    flex-basis: 0px;
    flex-grow: 1;
    height: 100%;
    &:first-child {
      text-align: right;
    }
  }
}

.loadStatus {
  display: flex;
  width: 100vw;
  height: 2px;
  > * {
    flex-grow: 1;
  }
  &Reverse {
    @extend .loadStatus;
    flex-direction: row-reverse;
  }
}

.current {
  background-color: cyan;
}

.loaded {
  background-color: green;
}

.loading {
  background-color: red;
}

.flipImage {
  transform: scale(-1, -1);
}
</style>
