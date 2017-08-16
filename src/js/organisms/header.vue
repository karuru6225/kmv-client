<template>
  <div :class="$style.headerContainer">
    <div :class="$style.header">
      <primary-link
        @click="parentDir"
        :class="$style.parentLink"
        v-if="!back"
      >
        <icon name="angle-left" /> ../
      </primary-link>
      <primary-link
        @click="backTo"
        :class="$style.parentLink"
        v-if="back"
      >
        <icon name="arrow-left" />
      </primary-link>
      <primary-link
        @click="home"
        :class="$style.homeLink"
      >
        <icon name="home" />
      </primary-link>
      <vert-div :class="$style.divider"/>
      <primary-label :class="$style.currentName">
        <list-button color="primary"
          v-show="!hideStar"
          :class="$style.currentNameStar"
          :icon="$store.state.bookmark.bookmarked ? 'star' : 'star-o'"
          :disabled="!$store.state.bookmark.selected || $store.state.dir.current.id == ''"
          @click="toggleStar"
        />
        <span :class="$style.currentNameText">
          {{file.name}}
        </span>
      </primary-label>
      <slot></slot>
      <vert-div :class="$style.divider"/>
      <primary-link
        @click="logout($event)"
        :class="$style.logout"
      >
        <icon name="sign-out" /> ログアウト
      </primary-link>
    </div>
  </div>
</template>

<script>
import VertDiv from 'atoms/block/vertical-divider.vue';
import PrimaryLink from 'atoms/text/link-primary16-regular.vue';
import Icon from 'atoms/icon/font-base.vue';
import PrimaryLabel from 'atoms/text/label-primary16-regular.vue';
import ListButton from 'atoms/button/iconfont-base.vue';
import { mapState } from 'vuex';

export default {
  components: {
    Icon,
    VertDiv,
    PrimaryLink,
    PrimaryLabel,
    ListButton,
  },
  props: ['back', 'file', 'hideStar'],
  methods: {
    toggleStar: function(){
      if(this.$store.state.bookmark.bookmarked){
        this.$store.dispatch('bookmark/remove', this.file.id);
        return;
      }
      this.$store.dispatch('bookmark/add', this.file.id);
    },
    backTo: function(e){
      e.preventDefault();
      this.$emit('changeDirectory');
      this.$router.go(-1);
    },
    parentDir: function(e){
      e.preventDefault();
      this.$emit('changeDirectory');
      this.$router.push(PublicPath + 'directory/' + this.file.parentId);
    },
    home: function(e){
      e.preventDefault();
      this.$emit('changeDirectory');
      this.$router.push(PublicPath);
    },
    logout: function(e) {
      e.preventDefault();
      this.$store.dispatch('auth/logout');
    }
  }
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
.homeLink,
.bookmark {
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &Star {
    margin-right: 0 !important;
  }
  &Text{
    margin-left: 6px;
  }
}

.logout {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 120px;
  white-space: nowrap;
  line-height: $headerHeight - 8px;
  box-sizing: border-box;
  margin: 4px 0;
  padding: 0 8px;
  text-align: center;
}

</style>
