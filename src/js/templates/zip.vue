<template>
  <div class="page">
    <common-header
      :back=true
      :name="$store.state.zip.name"
      :class="$data.headerClass"
    />
    <div :class="$style.main" ref="imageArea" @click="e => click(e)">
      <template v-for="img in $data.images">
        <img :src="img.src" :style="getImageStyle(img)"/>
      </template>
    </div>
    <div :class="getStatusBarClass()">
      <template v-for="(stat, idx) in $store.state.zip.imageStatuses">
        <div :class="getLoadStatClass(stat, idx)"></div>
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
  props: ['id', 'page'],
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
      if(idx == this.$data.currentPage){
        return this.$style.current;
      }
      if(stat == 2){
        return this.$style.loaded;
      }
      return this.$style.loading;
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
      let delta = 2;
      const nextBase = this.saturation(this.$data.currentPage - 2);
      this.$store.dispatch('zip/startLoadImages', {offset: nextBase});
      const img1 = this.$store.state.zip.images[nextBase];
      const img2 = this.$store.state.zip.images[nextBase + 1];
      if(img1.width > img1.height || img2.width > img2.height){
        delta = 1;
      }
      this.$data.currentPage =  this.saturation(this.$data.currentPage - delta);
      this.pageUpdate();
    },
    next(){
      let delta = 2;
      if(this.$data.spread){
        delta = 1;
      }
      this.$data.currentPage =  this.saturation(this.$data.currentPage + delta);
      this.$store.dispatch('zip/startLoadImages', {offset: this.$data.currentPage});
      this.pageUpdate();
    },
    onePage(){
      this.$data.currentPage =  this.saturation(this.$data.currentPage - 1);
      this.$store.dispatch('zip/startLoadImages', {offset: this.$data.currentPage});
      this.pageUpdate();
    },
    pageUpdate(){
      this.$data.leftFlip = this.$data.rightFlip = false;
      this.$data.images = [];
      this.$data.spread = false;
      this.setImage();
    },
    click(e) {
      const wWidth = $(window).width();
      if(wWidth/2 < e.clientX){
        if(this.$data.leftFirst){
          this.next();
        }else{
          this.prev();
        }
      }else{
        if(this.$data.leftFirst){
          this.prev();
        }else{
          this.next();
        }
      }
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
    getImageStyle(img){
      const $imageArea = $(this.$refs.imageArea);
      let wWidth = $imageArea.width() / 2.0;
      if(this.$data.spread){
        wWidth = $imageArea.width();
      }
      const wHeight = $imageArea.height();
      if( img.width / img.height > wWidth / wHeight ){
        return {
          width: wWidth + 'px',
          height: wWidth * img.height / img.width + 'px'
        };
      }else{
        return {
          width: wHeight * img.width / img.height + 'px',
          height: wHeight + 'px',
        };
      }
    },
    setImage() {
      const url = window.URL || window.webkitURL;
      const zip = this.$store.state.zip;
      const page = this.$data.currentPage;
      const images = [];
      if(zip.images[page]) {
        const img = zip.images[page];
        if( img.width > img.height ){
          this.$data.spread = true;
        }
        images.push(img);
      }else{
        return;
      }
      if(zip.images[page+1] && page+1 < this.fileCount) {
        const img = zip.images[page+1];
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
        this.$data.headerClass = this.$style.header;
      }else{
        this.$data.headerClass = this.$style.headerHidden;
      }
    }
  },
  data() {
    return {
      currentPage: +(this.page||0),
      leftFirst: false,
      headerClass: this.$style.headerHidden,
      leftFlip: null,
      rightFlip: null,
      spread: false,
      images: []
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
    window.addEventListener('keyup', this.keyup.bind(this));
    window.addEventListener('mousemove', this.mousemove.bind(this));
  },
  mounted: function() {
  },
  destroyed: function() {
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
  align-content: flex-start;
}

.loadStatus {
  display: flex;
  width: 100vw;
  height: 2px;
  position: absolute;
  bottom: 0;
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
