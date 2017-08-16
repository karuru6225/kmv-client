<template>
  <div :class="$style.containerWrapper">
    <div :class="$style.containerHeader">
      <span :class="$style.containerHeaderName">
        &nbsp;Playlists
      </span>
      <secondary-link
       :class="$style.containerHeaderButton"
        @click="toggleBookmark"
      >
        <icon name="bookmark" v-if="!$store.state.bookmark.show" />
        <icon name="close" v-if="$store.state.bookmark.show" />
      </secondary-link>
    </div>
    <div :class="getContainerClass()">
      <div :class="$style.list">
        <template v-for="list in lists">
          <div
            :class="getListClass(list.id)"
            @click="click($event, list.id)">
            <span :class="$style.listItemName">
              {{list.name}}
            </span>
            <secondary-link
              @click="togglePlay($event, list.id)"
              :class="$style.listItemButton"
            >
              <icon name="play" v-if="$store.state.bookmark.playing != list.id" />
              <icon name="stop" v-if="$store.state.bookmark.playing == list.id" />
            </secondary-link>
            <secondary-link
              @click="showBookmark($event, list.id)"
              :class="$style.listItemButton"
            >
              <icon name="list" />
            </secondary-link>
          </div>
        </template>
      </div>
      <div :class="$style.controller">
        <!--<secondary-link
          @click="prev"
          :class="$style.controllerButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="fast-backward" />
        </secondary-link>
        <secondary-link
          @click="seekBefore"
          :class="$style.controllerButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="backward" />
        </secondary-link>
        <secondary-link
          @click="oneBefore"
          :class="$style.controllerButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="step-backward" />
        </secondary-link>
        <secondary-link
          @click="oneAfter"
          :class="$style.controllerButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="step-forward" />
        </secondary-link>
        <secondary-link
          @click="seekAfter"
          :class="$style.controllerButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="forward" />
        </secondary-link>-->
        <secondary-link
          @click="next"
          :class="$style.controllerButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="fast-forward" />
        </secondary-link>
        <hori-div
          :class="$style.divider"
          v-if="$store.state.bookmark.playing != -1"
        />
        <secondary-link
          @click="toggleRandom"
          :class="$style.controllerButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="random" v-if="$store.state.bookmark.random"/>
          <icon name="list-ol"  v-if="!$store.state.bookmark.random"/>
        </secondary-link>
      </div>
    </div>
  </div>
</template>

<script>
import SecondaryLink from 'atoms/text/link-secondary16-regular.vue';
import Icon from 'atoms/icon/font-base.vue';
import HoriDiv from 'atoms/block/horizontal-divider.vue';

export default {
  components: {
    Icon,
    SecondaryLink,
    HoriDiv,
  },
  props: ['lists'],
  methods: {
    toggleBookmark: function(e){
      e.preventDefault();
      this.$store.commit('bookmark/toggle');
    },
    toggleRandom: function(e){
      e.preventDefault();
      this.$store.commit('bookmark/toggleRandom');
    },
    prev: function(e){
      e.preventDefault();
    },
    seekBefore: function(e){
      e.preventDefault();
    },
    oneBefore: function(e){
      e.preventDefault();
    },
    togglePlay: function(e, id){
      e.preventDefault();
      e.stopPropagation();
      this.$store.dispatch('bookmark/togglePlay', id);
    },
    oneAfter: function(e){
      e.preventDefault();
    },
    seekAfter: function(e){
      e.preventDefault();
    },
    next: function(e){
      e.preventDefault();
      this.$store.commit('bookmark/next');
    },
    click: function(e, id){
      e.preventDefault();
      const b = this.$store.state.bookmark;
      if(b.selected && b.selected.id == id){
        this.$store.dispatch('bookmark/unselect');
        return;
      }
      this.$store.dispatch('bookmark/select', id);
    },
    showBookmark: function(e, id){
      e.preventDefault();
      e.stopPropagation();
      this.$router.push(PublicPath + 'bookmark/' + id);
    },
    getContainerClass: function(){
      const classes = [this.$style.container];
      if(this.$store.state.bookmark.show){
        classes.push(this.$style.containerShown);
      }
      return classes;
    },
    getListClass: function(id){
      const b = this.$store.state.bookmark;
      if(b.selected && b.selected.id == id){
        return [this.$style.listItem, this.$style.listItemActive];
      }
      return [this.$style.listItem];
    }
  }
}
</script>

<style lang="scss" module>
@import "css/_settings.scss";

$controllerWidth: 32px;
.container {
  overflow-x: hidden;
  display: flex;
  border-right: solid 1px $dividerColor;
  transition: width .3s;
  width: $controllerWidth;
  flex-shrink: 1;
  flex-grow: 1;
  &Shown {
    width: $bookmarkWidth + $controllerWidth;
  }
  &Wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    flex-shrink: 0;
  }
  &Header {
    border-right: solid 1px $dividerColor;
    border-bottom: solid 1px $dividerColor;
    line-height: $controllerWidth;
    display: flex;
    &Name {
      flex-basis: 0;
      flex-grow: 1;
      flex-shrink: 1;
      width: 0;
      overflow: hidden;
    }
    &Button {
      flex-basis: $controllerWidth;
      flex-shrink: 0;
      flex-grow: 0;
      text-align: center;
    }
  }
}

.list {
  width: 0;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  overflow-x: hidden;
  position: relative;
  border-right: solid 1px $dividerColor;
  &Item {
    display: flex;
    padding-left: 4px;
    line-height: 32px;
    cursor: pointer;
    &:hover {
      transition: background-color .3s;
      background-color: $primaryColorLight;
    }
    &Active {
      background-color: rgba( $primaryColorLight, .3);
    }
    &Name {
      flex-shrink: 1;
      flex-grow: 1;
    }
    &Button {
      flex-basis: 32px;
      flex-shrink: 0;
      flex-grow: 0;
      text-align: center;
    }
  }
}

$controllerButtonSize: $controllerWidth;
.controller {
  flex-basis: $controllerWidth;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  &Button {
    line-height: $controllerButtonSize;
    flex-basis: $controllerButtonSize;
    flex-shrink: 0;
    flex-grow: 0;
    text-align: center;
  }
}

.divider {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 9px;
  padding: 0;
  width: $controllerButtonSize;
  height: 9px;
  box-sizing: border-box;
}


</style>

