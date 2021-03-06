<template>
  <div class="page">
    <common-header
      :back=true
      :file="$store.state.file.current"
      :class="$style.header"
    >
      <vert-div />
      <i-button :size="28" :class="$data.sizeButtonClass" @click="toggleSize"/>
    </common-header>
    <div :class="$style.body">
      <bookmarks
        :class="$style.bookmark"
        :lists="$store.state.bookmark.lists"
      />
      <div :class="$style.mainArea">
        <video ref="video" :class="$data.videoClass" @click="togglePlay"/>
        <div :class="$style.seekContainer"
          @click="e => clickSeekbar(e)" ref="seekbar"
          @mousemove="updateHoverTime"
          @mouseout="hideHoverTime"
        >
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
        <div v-if="false">
          <div><span style="display:inline-block;width:4em;">pan :</span><input type="range" ref="fPan" min="-1" max="1" step="0.1" @change="updateFilter" value="0"/><span>{{$data.fPanV}}</span></div>
          <template v-for="(freq, idx) in $data.freqs">
            <div><span style="display:inline-block;width:4em;">{{freq}} :</span><input type="range" ref="fGain" min="-5" max="5" step="0.1" @change="updateFilter" value="0"/><span>{{$data.fGain[idx]}}</span></div>
          </template>
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
    toggleSize() {
      const len = sizeIds.length;
      this.$data.videoSizeIdx = (this.$data.videoSizeIdx + 1) % len;
      this.$data.videoClass = this.getVideoClass(this.$data.videoSizeIdx);
      this.$data.sizeButtonClass = this.getSizeButtonClass(this.$data.videoSizeIdx);
    },
    play() {
      this.$refs.video.play();
      this.$data.pauseInWaiting = false;
    },
    pause(inWaiting) {
      this.$data.pauseInWaiting = true;
      this.$refs.video.pause();
    },
    togglePlay() {
      const v = this.$refs.video;
      if(v && v.paused){
        this.play();
      }else{
        this.pause();
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
      }
      if(process.env.NODE_ENV == 'production'){
        this.$data.source = ApiEntry + `file/${this.$props.id}/direct?open`;
      }else{
        this.$data.source = ApiEntry + `file/${this.$props.id}/direct?open&token=${this.$store.state.auth.token}`;
      }
      const hls = new Hls({
        maxBufferLength: 600
      });
      hls.on('hlsError', () => {
        console.log('recovering');
        hls.recoverMediaError();
      });
      hls.loadSource(this.$data.source);
      hls.attachMedia(this.$refs.video);
      this.$data.hls = hls;
      this.setVolume(this.$data.volume);

      this.$store.dispatch('movie/meta', {
        id: this.id||''
      });
      this.$store.dispatch('bookmark/lists');
      this.$store.dispatch('file/select', this.id);

      if(this.$store.state.bookmark.playing){
        this.$refs.video.play();
      }

      const ac = new AudioContext();
      const v = this.$refs.video;
      const as = new MediaElementAudioSourceNode(ac, {
        mediaElement: v
      });
      this.$data.fPan = ac.createStereoPanner();
      this.$data.filter = [];
      let cNode = as;
      this.$data.freqs.forEach( freq => {
        const f = ac.createBiquadFilter();
        f.type = 'peaking';
        f.frequency.value = freq;
        f.Q.value = 1.4;
        cNode.connect(f);
        cNode = f;
        this.$data.filter.push(f);
      });
      // this.updateFilter();
      cNode.connect(this.$data.fPan);
      this.$data.fPan.connect(ac.destination);
    },
    updateFilter: function() {
      let gains = [];
      this.$data.freqs.forEach( (freq, idx) => {
        gains[idx] = parseFloat(this.$refs.fGain[idx].value);
        this.$data.filter[idx].gain.value = gains[idx];
      });
      this.$data.fGain = gains;
      this.$data.fPan.pan.value = this.$data.fPanV = parseFloat(this.$refs.fPan.value);
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
      const seekTime = this.getSeekTime(e.clientX);
      this.$data.hoverTime = this.formatTime(seekTime);
    },
    hideHoverTime: function(){
      this.$data.hoverTime = '';
    },
    clickSeekbar: function(e){
      this.seek(this.getSeekTime(e.clientX));
    },
    seek: function(time){
      this.pause(true);
      this.$refs.video.currentTime = time;
      this.$data.currentTime = time;
    },
    getSeekTime: function(x){
      const v = this.$refs.video;
      const $seekbar = $(this.$refs.seekbar);
      return v.duration * (x -$seekbar.offset().left) / $seekbar.width();
    },
    keydown(e) {
      const v = this.$refs.video;
      switch(e.keyCode){
        case 37:// left
          this.seek(Math.max(0, v.currentTime - 10));
          break;
        case 39:// right
          this.seek(Math.min(v.duration, v.currentTime + 10));
          break;
        case 38:// up
          this.setVolume(v.volume + 0.05);
          break;
        case 40:// down
          this.setVolume(v.volume - 0.05);
          break;
        case 13:// Enter
          break;
        case 32:// space
          this.togglePlay();
          break;
        default:
          console.log(e.keyCode);
      }
    }
  },
  data() {
    const initialIdx = 0;
    return {
      source: '',
      videoSizeIdx: initialIdx,
      sizeButtonClass: this.getSizeButtonClass(initialIdx),
      videoClass: this.getVideoClass(initialIdx),
      buffered: [],
      currentTime: 0,
      duration: 1,
      volume: 0.2,
      hls: null,
      hoverTime: '',
      filter: [],
      fPan: null,
      fPanV: 0,
      fGain: [],
      pauseInWaiting: false,
      freqs: [
        32, 64, 128, 256, 512,
        1024, 2048, 4096, 8192, 16384
      ]
    };
  },
  watch: {
    '$route': 'fetchData',
  },
  created: function(){
    window.addEventListener('keydown', this.keydown);
    window.addEventListener('mouseup', this.volumeMouseup);
    window.addEventListener('mousemove', this.volumeMousemove);
  },
  mounted: function() {
    this.$refs.video.addEventListener('ended', () => {
      if(this.$store.state.bookmark.playing){
        this.$store.commit('bookmark/next');
      }
    });
    this.$refs.video.addEventListener('timeupdate', () => {
      this.updateSeek();
    });
    this.$refs.video.addEventListener('waiting', () => {
      this.pause(true);
    });
    this.$refs.video.addEventListener('durationchange', () => {
      this.updateSeek();
    });
    this.$refs.video.addEventListener('canplay', () => {
      if(this.$data.pauseInWaiting) {
        this.play();
      }
    });
    this.fetchData();
  },
  activated: function(){
    console.log('book activated');
  },
  deactivated: function(){
    console.log('book deactivated');
  },
  beforeDestroy: function() {
    console.log('movie beforeDestroy');
    this.$data.hls.destroy();
    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('mouseup', this.volumeMouseup);
    window.removeEventListener('mousemove', this.volumeMousemove);
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
  height: calc(100vh - 44px);
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

</style>
