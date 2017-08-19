<template>
  <div class="page">
    <loading v-if="$store.state.book.loading" />
    <common-header
      :back=true
      :file="$store.state.file.current"
      :class="$data.showUIs ? $style.header : $style.headerHidden"
    />
    <div :class="$style.body">
      <bookmarks
        :class="$style.bookmark"
        :lists="$store.state.bookmark.lists"
      />
      <div :class="$style.imageArea" ref="imageArea" @click="e => click(e)" @mousemove="mousemove" :style="$data.imageAreaStyle">
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
  </div>
</template>

<script>
import CommonHeader from 'organisms/header.vue';
import VertDiv from 'atoms/block/vertical-divider.vue';
import ListButton from 'atoms/button/iconfont-base.vue';
import Bookmarks from 'organisms/bookmarks.vue';
import { mapState } from 'vuex';
import $ from 'jquery';
import Loading from 'atoms/panel/loading.vue';

export default {
  components: {
    CommonHeader,
    VertDiv,
    ListButton,
    Bookmarks,
    Loading,
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
      const classes = [];
      if(this.$data.leftFirst){
        classes.push(this.$style.loadStatus);
      }else{
        classes.push(this.$style.loadStatusReverse);
      }
      if(this.$data.showUIs){
        classes.push(this.$style.loadStatusActive);
      }
      return classes;
    },
    getLoadStatClass(stat, idx) {
      if(idx <= this.currentPage){
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
        page: +(this.$route.query.page)||0
      });
      this.$store.dispatch('bookmark/lists');
      this.$store.dispatch('file/select', this.id);
    },
    fileCountLoaded() {
      this.$store.dispatch('book/startLoadImages', {
        id: this.id,
        type: this.type,
      });
    },
    setCurrentPage(page){
      const prevCurrent = this.currentPage;
      this.$store.commit('book/setCurrentPage', page);
      this.pageUpdate();
      if(page > this.currentPage && prevCurrent == (this.fileCount - 1) ){
        if(this.$store.state.bookmark.playing != -1){
          this.$store.commit('bookmark/next');
        }
      }
    },
    prev(){
      this.setCurrentPage(this.currentPage - 2);
    },
    next(){
      this.setCurrentPage(this.currentPage + 2);
    },
    onePage(){
      this.setCurrentPage(this.currentPage + 1);
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
      this.$data.showUIs = !this.$data.showUIs;
    },
    centerBottomAction(){
      this.onePage();
    },
    getArea(e) {
      const $imageArea = $(this.$refs.imageArea);
      const offset = $imageArea.offset();
      const iaWidth = $imageArea.width();
      const iaHeight = $imageArea.height();
      const clickX = e.clientX - offset.left;
      const clickY = e.clientY - offset.top;
      
      let x = 0;
      let y = 0;
      if(clickX < iaWidth / 4){
        x = 0;
      }else if(iaWidth / 4 <= clickX && clickX <= iaWidth*3/4){
        x = 1;
      }else if(iaWidth*3/4 <  clickX){
        x = 2;
      }
      if(clickY < iaHeight / 4){
        y = 0;
      }else if(iaHeight / 4 <= clickY && clickY <= iaHeight*3/4){
        y = 1;
      }else if(iaHeight*3/4 < clickY){
        y = 2;
      }
      return {x, y};
    },
    click(e) {
      const {x, y} = this.getArea(e);
      if(x == 0){
        this.leftAction();
      }else if(x == 1){
        if(y == 0){
          this.centerTopAction();
        }else if(y == 1){
          this.centerMiddleAction();
        }else if(y == 2){
          this.centerBottomAction();
        }
      }else if(x == 2){
        this.rightAction();
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
          break;
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
      const page = this.currentPage;
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
      /*
      if(e.clientY < 44) {
        this.$data.showUIs = true;
      }else{
        this.$data.showUIs = false;
      }//*/
      const {x, y} = this.getArea(e);

      let cursor = "";

      if(y == 0){
        cursor += "n";
      }else if(y == 2){
        cursor += "s";
      }

      if(x == 0){
        cursor += "w";
      }else if(x == 2){
        cursor += "e";
      }
      if(cursor == ""){
        cursor = "move";
      }else{
        cursor = cursor + '-resize';
      }
      this.$set(this.$data, 'imageAreaStyle', { cursor });
    }
  },
  data() {
    return {
      leftFirst: false,
      showUIs: false,
      leftFlip: null,
      rightFlip: null,
      spread: false,
      images: [],
      imageAreaStyle: {}
    };
  },
  computed: mapState({
    fileCount: s => s.book.fileCount,
    currentPage: s => s.book.currentPage,
    loaded: s => s.book.loaded,
    statuses: s => s.book.imageStatuses
  }),
  watch: {
    '$route': function(){
      this.fetchData();
    },
    'fileCount': 'fileCountLoaded',
    'loaded': 'setImage'
  },
  created: function() {
    this.fetchData();
    window.addEventListener('keyup', this.keyup.bind(this));
  },
  mounted: function() {
    console.log(this.$route);
    console.log(this.$router);
  },
  beforeDestroy: function() {
    window.removeEventListener('keyup', this.keyup.bind(this));
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
  position: fixed;
  &Hidden {
    @extend .header;
    margin-top: -44px;
  }
}

$seekBarHeight: 4px;
.imageArea {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0 auto;
  height: calc(100vh - $seekBarHeight);
  justify-content: center;
  align-items: center;
  background-color: #F0F0F0;
}

.loadStatus {
  display: flex;
  width: 100vw;
  height: $seekBarHeight;
  position: absolute;
  bottom: 0;
  left: 0;
  > * {
    flex-grow: 1;
  }
  transition: height .3s, bottom .3s;
  &Active,
  &Hover {
    height: 16px;
  }
  &Active {
    bottom: 8px;
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

.body {
  display: flex;
  align-items: stretch;
  width: 100vw;
  height: 100vh;
}

</style>
