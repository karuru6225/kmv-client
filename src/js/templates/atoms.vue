<template>
  <div class="page">
    <div :class="$style.headerContainer">
      <div :class="$style.header">
        <primary-link
          @click="parentDirectory($event)"
          :class="$style.parentLink"
          :disabled="disabled"
        >
          <icon name="angle-left" /> ../
        </primary-link>
        <primary-link
          @click="homeDirectory($event)"
          :class="$style.homeLink"
        >
          <icon name="home" />
        </primary-link>
        <vert-div :class="$style.divider"/>
        <primary-label :class="$style.currentName">
          <list-button color="primary" icon='star-o'> </list-button>
          {{name}}
        </primary-label>
        <vert-div :class="$style.divider"/>
        <div :class="$style.listButtons">
          <list-button color="primary" icon='list'> </list-button>
          <list-button color="primary" icon='th-large'> </list-button>
        </div>
        <vert-div :class="$style.divider"/>
        <primary-link
          @click="logout($event)"
          :class="$style.logout"
        >
          <icon name="sign-out" /> ログアウト
        </primary-link>
      </div>
    </div>
    <samples />
  </div>
</template>

<script>
import Icon from 'atoms/icon/font-base.vue';
import VertDiv from 'atoms/block/vertical-divider.vue';
import PrimaryLink from 'atoms/text/link-primary16-regular.vue';
import PrimaryLabel from 'atoms/text/label-primary16-regular.vue';
import Samples from 'organisms/samples.vue';
import ListButton from 'atoms/button/iconfont-base.vue';
import {mapState, mapActions} from 'vuex';

export default {
  components: {
    Icon,
    VertDiv,
    PrimaryLink,
    PrimaryLabel,
    Samples,
    ListButton
  },
  computed: mapState({
    disabled: state => state.disabled,
    name: state => Math.floor(state.name*100)+''
  }),
  methods: {
    parentDirectory: function(e) {
      e.preventDefault();
      this.$store.commit('increment');
    },
    homeDirectory: function(e) {
      e.preventDefault();
    },
    logout: function(e) {
      e.preventDefault();
      this.$store.commit('setAvailable', !this.$store.state.disabled);
    }
  }
}

</script>
<style lang="scss" module>
@import "../../css/_settings.scss";

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

.listButtons {
  flex-grow: 0;
  > *:nth-child(n+2) {
    margin-left: 0;
  }
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
