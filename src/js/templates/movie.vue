<template>
  <div class="page">
    <common-header
      :back=true
      :file="$store.state.file.current"
      :class="$data.headerClass"
    >
      <vert-div />
      <i-button :size="28" :class="$data.sizeButtonClass" @click="toggleSize"/>
    </common-header>
    <div :class="$style.body">
      <bookmarks
        :class="$style.bookmark"
        :lists="$store.state.bookmark.lists"
      />
      <div :class="$style.mainArea" @wheel="changeVolume" @mousemove="mousemove">
        <video ref="video" :class="$data.videoClass" @click="togglePlay"/>
        <div :class="$style.seekContainer" @click="e => seek(e)" ref="seekbar" @mousemove="updateHoverTime" @mouseout="hideHoverTime">
          <template v-for="loaded in $data.buffered">
            <div :class="$style.seekLoaded" :style="{
              left: (loaded.start*100) + '%',
              width: (loaded.end - loaded.start)*100 + '%'
            }"/>
          </template>
          <div :class="$style.seekPlayed" :style="{
            width: ($data.currentTime / $data.duration)*100 + '%'
          }"/>
        </div>
        <div :class="$style.controller">
          <span>{{formatTime($data.currentTime)}} / {{formatTime($data.duration)}}</span>
          <div :class="$style.volumeContaer" ref="volume"
            @click="volumeClick"
            @mousedown="volumeMousedown"
          >
            <div :class="$style.volumeBody" :style="{
              width: ($data.volume * 100) + '%'
            }">
              <div :class="$style.volumeText">
                vol: {{Math.round($data.volume*100)}}%
              </div>
            </div>
          </div>
          <span>{{$data.hoverTime}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonHeader from 'organisms/header.vue';
import VertDiv from 'atoms/block/vertical-divider.vue';
import IButton from 'atoms/button/img-base.vue';
import Bookmarks from 'organisms/bookmarks.vue';
import { mapState } from 'vuex';
import Hls from 'hls.js';
import $ from 'jquery';

const sizeIds = [
  '1024',
  '800',
  '640',
  'Real',
  'Full',
];

let seekTimer;
let volumeThrottle=0;
let volumeStartX;

export default {
  components: {
    CommonHeader,
    VertDiv,
    IButton,
    Bookmarks,
  },
  props: ['id', 'type'],
  methods: {
    formatTime(s) {
      const _s = Math.round(s);
      let fh = '';
      let fm = '';
      let fs = '';
      fm = ('0' + Math.floor( (_s % 3600) / 60 ) + ':').substr(-3);
      fs = ('0' + (_s % 60)).substr(-2);
      if(_s >= 3600){
        fh = ('0' + Math.floor(_s / 3600) + ':').substr(-3);
      }
      return fh + fm + fs;
    },
    mousemove(e) {
      if(e.clientY < 44) {
        this.$data.headerClass = this.$style.header;
      }else{
        this.$data.headerClass = this.$style.headerHidden;
      }
    },
    toggleSize() {
      const len = sizeIds.length;
      this.$data.videoSizeIdx = (this.$data.videoSizeIdx + 1) % len;
      this.$data.videoClass = this.getVideoClass(this.$data.videoSizeIdx);
      this.$data.sizeButtonClass = this.getSizeButtonClass(this.$data.videoSizeIdx);
    },
    togglePlay() {
      const v = this.$refs.video;
      if(v.paused){
        v.play();
      }else{
        v.pause();
      }
    },
    changeVolume(e) {
      if(Date.now() - volumeThrottle > 250){
        const v = this.$refs.video;
        if(e.deltaY > 0) {
          this.setVolume(v.volume + 0.1);
        }else{
          this.setVolume(v.volume - 0.1);
        }
        volumeThrottle = Date.now();
      }
    },
    volumeClick: function(e){
      const $vol = $(this.$refs.volume);
      this.setVolume(e.offsetX / $vol.width());
    },
    volumeMousedown: function(e){
      volumeStartX = true;
    },
    volumeMousemove: function(e){
      if(volumeStartX){
        const $vol = $(this.$refs.volume);
        this.setVolume( (e.clientX - $vol.offset().left) / $vol.width() );
      }
    },
    volumeMouseup: function(e){
      if(volumeStartX){
        const $vol = $(this.$refs.volume);
        const offset = $vol.offset();
        if(offset){
          this.setVolume( (e.clientX - offset.left) / $vol.width() );
        }
      }
      volumeStartX = false;
    },
    setVolume(vol){
      const v = this.$refs.video;
      const steps = 100;
      v.volume = Math.max(0, Math.min(steps, Math.round(vol*steps))) / steps;
      this.$data.volume = v.volume;
    },
    getSizeButtonClass(idx) {
      const sizeButtonClasses = sizeIds.map(suffix => {
        return this.$style['sizeButton' + suffix];
      });
      return [
        this.$style.sizeButton,
        sizeButtonClasses[ idx ]
      ];
    },
    getVideoClass(idx) {
      const videoClasses = sizeIds.map(suffix => {
        return this.$style['video' + suffix];
      });
      return [
        this.$style.video,
        videoClasses[idx]
      ];
    },
    fetchData: function() {
      console.log('fetchData in movie');
      if(this.$data.hls){
        this.$data.hls.destroy();
        this.$data.hls = null;
        clearInterval(seekTimer);
      }
      this.$data.source = ApiEntry + `file/${this.$props.id}/direct?open&token=${this.$store.state.auth.token}`;
      const hls = new Hls();
      hls.loadSource(this.$data.source);
      hls.attachMedia(this.$refs.video);
      this.$data.hls = hls;
      this.setVolume(this.$data.volume);
      seekTimer = setInterval(this.updateSeek.bind(this), 500);

      this.$store.dispatch('movie/meta', {
        id: this.id||''
      });
      this.$store.dispatch('bookmark/lists');
      this.$store.dispatch('file/select', this.id);

      if(this.$store.state.bookmark.playing){
        this.$refs.video.play();
      }
    },
    updateSeek: function() {
      const v = this.$refs.video;
      const newBuffered = [];
      for(let i = 0; i < v.buffered.length; i++){
        newBuffered.push({
          start: v.buffered.start(i) / v.duration,
          end: v.buffered.end(i) / v.duration,
        });
      }
      this.$data.buffered = newBuffered;
      this.$data.currentTime = v.currentTime || 0;
      this.$data.duration = v.duration;
    },
    updateHoverTime: function(e){
      const v = this.$refs.video;
      const $seekbar = $(this.$refs.seekbar);
      const seekTime = v.duration * e.clientX / $seekbar.width();
      this.$data.hoverTime = this.formatTime(seekTime);
    },
    hideHoverTime: function(){
      this.$data.hoverTime = '';
    },
    seek: function(e){
      const v = this.$refs.video;
      const $seekbar = $(this.$refs.seekbar);
      console.log($seekbar.offset().left);
      const seekTime = v.duration * (e.clientX -$seekbar.offset().left) / $seekbar.width();
      v.currentTime = seekTime;
      this.$data.currentTime = seekTime;
    },
  },
  data() {
    const initialIdx = 0;
    return {
      headerClass: this.$style.headerHidden,
      source: '',
      videoSizeIdx: initialIdx,
      sizeButtonClass: this.getSizeButtonClass(initialIdx),
      videoClass: this.getVideoClass(initialIdx),
      buffered: [],
      currentTime: 0,
      duration: 1,
      volume: 0.2,
      hls: null,
      hoverTime: ''
    };
  },
  watch: {
    '$route': 'fetchData',
  },
  mounted: function() {
    this.$refs.video.addEventListener('ended', () => {
      if(this.$store.state.bookmark.playing){
        this.$store.commit('bookmark/next');
      }
    });
    window.addEventListener('mouseup', this.volumeMouseup.bind(this));
    window.addEventListener('mousemove', this.volumeMousemove.bind(this));
    this.fetchData();
  },
  beforeDestroy: function() {
    this.$data.hls.destroy();
    clearInterval(seekTimer);
    window.removeEventListener('mouseup', this.volumeMouseup.bind(this));
    window.removeEventListener('mousemove', this.volumeMousemove.bind(this));
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

.sizeButton {
  width: 28px;
  height: 28px;
  &640 {
    background-image: url(img/screen-size-0640.png);
  }
  &800 {
    background-image: url(img/screen-size-0800.png);
  }
  &1024 {
    background-image: url(img/screen-size-1024.png);
  }
  &Real {
    background-image: url(img/screen-size-real.png);
  }
  &Full {
    background-image: url(img/screen-size-full.png);
  }
}

.mainArea {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-grow: 1;
  flex-shrink: 1;
}

$seekHeight: 4px;
$controllerHeight: 16px;
.video {
  max-height: calc(#{'100vh - ' + ($seekHeight + $controllerHeight) });
  align-self: center;
  &640 {
    width: 640px;
  }
  &800 {
    width: 800px;
  }
  &1024 {
    width: 1024px;
  }
  &Real {
  }
  &Full {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
  }
}

.seek {
  &Container {
    height: $seekHeight;
    position: relative;
    width: 100%;
    cursor: col-resize;
    background-color: $primaryColorLight;
    transition: height 1s;
    &:hover {
      transition: height .2s;
      height: 16px;
    }
  }
  &Played {
    height: 100%;
    background-color: $accentColor;
    position: absolute;
  }
  &Loaded {
    height: 100%;
    background-color: $primaryColorDark;
    position: absolute;
  }
}

.controller {
  display: flex;
  > * {
    margin-left: 8px;
    line-height: 24px;
  }
}

.volume {
  &Contaer {
    margin: 2px 0;
    margin-left: 8px;
    line-height: 20px;
    cursor: default;
    background-color: $primaryColorLight;
    width: 75px;
  }
  &Body {
    box-sizing: border-box;
    overflow: visible;
    white-space: nowrap;
    background-color: $primaryColor;
  }
  &Text {
    padding-left: 4px;
  }
}

.body {
  display: flex;
  align-items: stretch;
}

.bookmark {
}

</style>
