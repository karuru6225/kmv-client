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
        <list-button color="primary" icon='star-o'> </list-button>
        {{name}}
      </primary-label>
      <slot> </slot>
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
import Icon from 'atoms/icon/font-base.vue';
import VertDiv from 'atoms/block/vertical-divider.vue';
import PrimaryLink from 'atoms/text/link-primary16-regular.vue';
import PrimaryLabel from 'atoms/text/label-primary16-regular.vue';
import ListButton from 'atoms/button/iconfont-base.vue';

export default {
  components: {
    Icon,
    VertDiv,
    PrimaryLink,
    PrimaryLabel,
    ListButton,
  },
  props: ['id', 'parentId', 'name', 'back'],
  methods: {
    toggleSearch(){
    },
    backTo: function(e){
      e.preventDefault();
      this.$router.go(-1);
    },
    parentDir: function(e){
      e.preventDefault();
      this.$router.push(PublicPath + 'directory/' + this.parentId);
    },
    home: function(e){
      e.preventDefault();
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
.homeLink {
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
}

.logout {
  flex-grow: 0;
  line-height: $headerHeight - 8px;
  box-sizing: border-box;
  margin: 4px 0;
  padding: 0 8px;
  text-align: center;
}

</style>
