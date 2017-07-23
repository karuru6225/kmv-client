<template>
  <div class="page">
    <common-header
      :back=true
      :name="$store.state.movie.metadata.name"
      :class="$data.headerClass"
    >
      <vert-div />
      <i-button :size="28" :class="$data.sizeButtonClass" @click="toggleSize"/>
    </common-header>
    <div :class="$style.mainArea" @wheel="changeVolume">
      <video ref="video" :class="$data.videoClass" @click="togglePlay"/>
      <div :class="$style.seekContainer" @click="e => seek(e)" ref="seekbar">
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
        <span>vol: {{$data.volume}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import CommonHeader from 'organisms/header.vue';
import VertDiv from 'atoms/block/vertical-divider.vue';
import IButton from 'atoms/button/img-base.vue';
import { mapState } from 'vuex';
import Hls from 'hls.js';
import $ from 'jquery';

const sizeIds = [
  '1024',
  '800',
  '640',
  'Real',
];

let seekTimer;
let volumeThrottle=0;

export default {
  components: {
    CommonHeader,
    VertDiv,
    IButton,
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
      const v = this.$refs.video;
      if(Date.now() - volumeThrottle > 250){
        const prev = Math.round(v.volume * 10);
        if(e.deltaY > 0) {
          v.volume = Math.min(10, prev + 1) / 10;
        }else{
          v.volume = Math.max(0, prev - 1) / 10;
        }
        volumeThrottle = Date.now();
      }
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
      this.$store.dispatch('movie/meta', {
        id: this.id||''
      });
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
    seek: function(e){
      const v = this.$refs.video;
      const $seekbar = $(this.$refs.seekbar);
      const seekTime = v.duration * e.clientX / $seekbar.width();
      console.log(e);
      console.log(seekTime + '/' + v.duration);
      v.currentTime = seekTime;
      this.$data.currentTime = seekTime;
    }
  },
  data() {
    const initialIdx = 0;
    return {
      headerClass: this.$style.headerHidden,
      source: ApiEntry + `file/${this.$props.id}/direct?open&token=${this.$store.state.auth.token}`,
      //source: ApiEntry + `file/${this.$props.id}/direct?open`,
      videoSizeIdx: initialIdx,
      sizeButtonClass: this.getSizeButtonClass(initialIdx),
      videoClass: this.getVideoClass(initialIdx),
      buffered: [],
      currentTime: 0,
      duration: 1,
      volume: 1,
      hls: null
    };
  },
  computed: mapState({
  }),
  watch: {
  },
  created: function() {
    this.fetchData();
    window.addEventListener('mousemove', this.mousemove.bind(this));
  },
  mounted: function() {
    const hls = new Hls();
    hls.loadSource(this.$data.source);
    hls.attachMedia(this.$refs.video);
    this.$data.hls = hls;
    seekTimer = setInterval(this.updateSeek.bind(this), 500);
  },
  beforeDestroy: function() {
    window.removeEventListener('mousemove', this.mousemove.bind(this));
    this.$data.hls.destroy();
    clearInterval(seekTimer);
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
}

.mainArea {
  width: 100vw;
  height: 100vh;
}

$seekHeight: 4px;
$controllerHeight: 16px;
.video {
  max-width: 100vw;
  max-height: calc(#{'100vh - ' + ($seekHeight + $controllerHeight) });
  display: block;
  margin: 0 auto;
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
}

.seek {
  &Container {
    height: $seekHeight;
    position: relative;
    width: 100vw;
    cursor: col-resize;
    background-color: $primaryColorLight;
  }
  &Played {
    height: 100%;
    background-color: $accentColor;
    position: absolute;
  }
  &Loaded {
    background-color: $primaryColorDark;
    height: $seekHeight;
    position: absolute;
  }
}

.controller {
  display: flex;
}
</style>
