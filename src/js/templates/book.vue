<template>
  <div class="page">
    <common-header
      :back=true
      :name="$store.state.book.name"
      :class="$data.showHeader ? $style.header : $style.headerHidden"
    />
    <div :class="$style.main" ref="imageArea" @click="e => click(e)">
      <template v-for="img in $data.images">
        <img :src="img.src" :style="getImageStyle(img)"/>
      </template>
    </div>
    <div :class="getStatusBarClass()">
      <template v-for="(stat, idx) in $store.state.book.imageStatuses">
        <div :class="getLoadStatClass(stat, idx)" @click="setCurrentPage(idx)"></div>
      </template>
    </div>
  </div>
</template>

<script>
import CommonHeader from 'organisms/header.vue';
import VertDiv from 'atoms/block/vertical-divider.vue';
import ListButton from 'atoms/button/iconfont-base.vue';
import { mapState } from 'vuex';
import $ from 'jquery';

export default {
  components: {
    CommonHeader,
    VertDiv,
    ListButton,
  },
  props: ['id', 'type'],
  methods: {
    dblclick(pos){
      return;
      if(this.$data[pos+'Flip']){
        this.$data[pos+'Flip'] = null;
      }else{
        this.$data[pos+'Flip'] = this.$style.flipImage;
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
      if(idx <= this.$data.currentPage){
        return this.$style.current;
      }
      if(stat == 2){
        return this.$style.loaded;
      }
      return this.$style.loading;
    },
    fetchData: function() {
      this.$store.dispatch('book/files', {
        id: this.id,
        type: this.type,
        page: this.$data.currentPage
      });
    },
    fileCountLoaded() {
      this.$store.dispatch('book/startLoadImages', {
        id: this.id,
        type: this.type,
        offset: this.$data.currentPage
      });
    },
    saturation(page){
      return Math.max(Math.min(page, this.fileCount - 1), 0);
    },
    setCurrentPage(page){
      console.log('setCurrentPage: ' + page);
      this.$data.currentPage =  this.saturation(page);
      this.pageUpdate();
    },
    prev(){
      let delta = 2;
      const nextBase = this.saturation(this.$data.currentPage - 2);
      this.$store.dispatch('book/startLoadImages', {
        id: this.id,
        type: this.type,
        offset: nextBase
      });
      const img1 = this.$store.state.book.images[nextBase];
      const img2 = this.$store.state.book.images[nextBase + 1];
      if(img1.width > img1.height || img2.width > img2.height){
        delta = 1;
      }
      this.setCurrentPage(this.$data.currentPage - delta);
    },
    next(){
      let delta = 2;
      if(this.$data.spread){
        delta = 1;
      }
      this.setCurrentPage(this.$data.currentPage + delta);
      this.$store.dispatch('book/startLoadImages', {
        id: this.id,
        type: this.type,
        offset: this.$data.currentPage
      });
    },
    onePage(){
      this.setCurrentPage(this.$data.currentPage + 1);
      this.$store.dispatch('book/startLoadImages', {
        id: this.id,
        type: this.type,
        offset: this.$data.currentPage
      });
    },
    toggleFirst(){
      this.$data.leftFirst = !this.$data.leftFirst;
    },
    pageUpdate(){
      this.$data.leftFlip = this.$data.rightFlip = false;
      this.$data.images = [];
      this.$data.spread = false;
      this.setImage();
    },
    leftAction(){
      if(this.$data.leftFirst){
        this.prev();
      }else{
        this.next();
      }
    },
    rightAction(){
      if(this.$data.leftFirst){
        this.next();
      }else{
        this.prev();
      }
    },
    centerTopAction(){
      this.toggleFirst();
    },
    centerMiddleAction(){
      this.$data.showHeader = !this.$data.showHeader;
    },
    centerBottomAction(){
      this.onePage();
    },
    click(e) {
      const wWidth = $(window).width();
      const wHeight = $(window).height();
      if(e.clientX < wWidth/3){
        this.leftAction();
      }else if(wWidth*2/3 < e.clientX){
        this.rightAction();
      }else if(e.clientY < wHeight/3){
        this.centerTopAction();
      }else if(wHeight/3 <= e.clientY && e.clientY < wHeight*2/3){
        this.centerMiddleAction();
      }else if(wHeight*2/3 <= e.clientY){
        this.centerBottomAction();
      }
    },
    keyup(e) {
      e.preventDefault();
      switch(e.keyCode){
        case 37://left
          this.leftAction();
          break;
        case 39://right
          this.rightAction();
          break;
        case 38://up
          this.centerTopAction();
          break;
        case 40://down
          this.centerBottomAction();
          break;
        case 32://space
          this.centerMiddleAction();
        default:
          console.log('keyCode: ' + e.keyCode);
          return;
      }
    },
    getImageStyle(img){
      const $imageArea = $(this.$refs.imageArea);
      let wWidth = $imageArea.width() / 2.0;
      if(this.$data.spread){
        wWidth = $imageArea.width();
      }
      const wHeight = $imageArea.height();
      if( img.width / img.height > wWidth / wHeight ){
        return {
          backgroundColor: 'white',
          width: wWidth + 'px',
          height: wWidth * img.height / img.width + 'px'
        };
      }else{
        return {
          backgroundColor: 'white',
          width: wHeight * img.width / img.height + 'px',
          height: wHeight + 'px',
        };
      }
    },
    setImage() {
      const url = window.URL || window.webkitURL;
      const book = this.$store.state.book;
      const page = this.$data.currentPage;
      const images = [];
      if(book.images[page]) {
        const img = book.images[page];
        if( img.width > img.height ){
          this.$data.spread = true;
        }
        images.push(img);
      }else{
        return;
      }
      if(book.images[page+1] && page+1 < this.fileCount) {
        const img = book.images[page+1];
        if( img.width > img.height ){
          this.$data.spread = true;
        }
        images.push(img);
      }
      if(this.$data.spread){
        images.splice(1);
      }
      if(!this.$data.leftFirst){
        images.reverse();
      }
      this.$data.images = images;
    },
    mousemove(e) {
      if(e.clientY < 44) {
        this.$data.showHeader = true;
      }else{
        this.$data.showHeader = false;
      }
    }
  },
  data() {
    return {
      currentPage: +(this.$route.query.page)||0,
      leftFirst: false,
      showHeader: false,
      leftFlip: null,
      rightFlip: null,
      spread: false,
      images: []
    };
  },
  computed: mapState({
    fileCount: s => s.book.fileCount,
    loaded: s => s.book.loaded,
    statuses: s => s.book.imageStatuses
  }),
  watch: {
    'fileCount': 'fileCountLoaded',
    'loaded': 'setImage'
  },
  created: function() {
    this.fetchData();
    window.addEventListener('keyup', this.keyup.bind(this));
    window.addEventListener('mousemove', this.mousemove.bind(this));
  },
  mounted: function() {
    console.log(this.$route);
    console.log(this.$router);
  },
  beforeDestroy: function() {
    window.removeEventListener('keyup', this.keyup.bind(this));
    window.removeEventListener('mousemove', this.mousemove.bind(this));
    this.$store.dispatch('book/stopLoadImages', {
      id: this.id,
      type: this.type,
    });
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
  height: calc(100vh - 4px);
  justify-content: center;
  align-content: flex-start;
  background-color: #F0F0F0;
}

.loadStatus {
  display: flex;
  width: 100vw;
  height: 4px;
  position: absolute;
  bottom: 0;
  > * {
    flex-grow: 1;
  }
  transition: height .3s;
  &:hover {
    height: 16px;
  }
  &Reverse {
    @extend .loadStatus;
    flex-direction: row-reverse;
  }
}

.current {
  cursor: col-resize;
  background-color: $accentColor;
}

.loaded {
  cursor: col-resize;
  background-color: $primaryColorDark;
}

.loading {
  cursor: col-resize;
  background-color: $primaryColorLight;
}

.flipImage {
  transform: scale(-1, -1);
}
</style>
