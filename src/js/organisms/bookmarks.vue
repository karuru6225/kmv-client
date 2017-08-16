<template>
  <div :class="getContainerClass()">
    <div :class="$style.list">
      <div :class="$style.listHeader">
        <span :class="$style.listHeaderName">
          lists
        </span>
      </div>
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
      <div :class="$style.listFooter">
        <secondary-link
          @click="toggleRandom"
          :class="$style.listFooterButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="random" v-if="$store.state.bookmark.random"/>
          <icon name="list-ol"  v-if="!$store.state.bookmark.random"/>
        </secondary-link>
        <vert-div :class="$style.divider"/>
        <!--<secondary-link
          @click="prev"
          :class="$style.listFooterButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="fast-backward" />
        </secondary-link>-->
        <secondary-link
          @click="seekBefore"
          :class="$style.listFooterButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="backward" />
        </secondary-link>
        <secondary-link
          @click="oneBefore"
          :class="$style.listFooterButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="step-backward" />
        </secondary-link>
        <secondary-link
          @click="oneAfter"
          :class="$style.listFooterButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="step-forward" />
        </secondary-link>
        <secondary-link
          @click="seekAfter"
          :class="$style.listFooterButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="forward" />
        </secondary-link>
        <secondary-link
          @click="next"
          :class="$style.listFooterButton"
          v-if="$store.state.bookmark.playing != -1"
        >
          <icon name="fast-forward" />
        </secondary-link>
      </div>
    </div>
  </div>
</template>

<script>
import SecondaryLink from 'atoms/text/link-secondary16-regular.vue';
import Icon from 'atoms/icon/font-base.vue';
import VertDiv from 'atoms/block/vertical-divider.vue';

export default {
  components: {
    Icon,
    SecondaryLink,
    VertDiv,
  },
  props: ['lists'],
  methods: {
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

.container {
  width: 0;
  overflow-x: hidden;
  display: flex;
  border-right: solid 1px $dividerColor;
  transition: flex-basis .3s;
  flex-basis: 0;
  flex-shrink: 0;
  flex-grow: 0;
  &Shown {
    flex-basis: $bookmarkWidth;
  }
}

$footerButtonSize: 22px;
.list {
  width: 100%;
  position: relative;
  &Header {
    border-bottom: solid 1px $dividerColor;
    padding-left: 4px;
    line-height: 32px;
    display: flex;
    &Name {
      flex-grow: 1;
      flex-shrink: 1;
    }
    &Button {
      flex-basis: 32px;
      flex-shrink: 0;
      flex-grow: 0;
      text-align: center;
    }
  }
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
  &Footer {
    line-height: $footerButtonSize;
    display: flex;
    width: 100%;
    align-items: center;
    //justify-content: space-between;
    justify-content: space-around;
    position: absolute;
    bottom: 0;
    &Button {
      flex-basis: $footerButtonSize;
      flex-shrink: 0;
      flex-grow: 0;
      text-align: center;
    }
  }
}

.divider {
  flex-grow: 0;
  flex-shrink: 0;
  height: $footerButtonSize;
}


</style>

