<template>
  <div class="page">
    <common-header
       :parentId="$store.state.dir.current.parentId"
       :name="$store.state.dir.current.name"
    >
      <vert-div :class="$style.divider"/>
        <list-button color="primary" icon='search' @click="toggleSearch"></list-button>
      <vert-div :class="$style.divider"/>
      <div :class="$style.listButtons">
        <list-button color="primary" icon='list'> </list-button>
        <list-button color="primary" icon='th-large'> </list-button>
      </div>
    </common-header>
    <file-list :files="$store.state.dir.files" />
  </div>
</template>

<script>
import CommonHeader from 'organisms/header.vue';
import VertDiv from 'atoms/block/vertical-divider.vue';
import ListButton from 'atoms/button/iconfont-base.vue';
import FileList from 'organisms/file-list.vue';

export default {
  components: {
    CommonHeader,
    VertDiv,
    ListButton,
    FileList
  },
  props: ['id'],
  methods: {
    toggleSearch(){
    },
    parentDir: function(e){
      e.preventDefault();
      this.$router.push(PublicPath + 'directory/' + this.$store.state.dir.current.parentId);
    },
    logout: function(e) {
      e.preventDefault();
      this.$store.dispatch('auth/logout');
    },
    fetchData: function() {
      this.$store.dispatch('dir/dir', {
        id: this.id||''
      });
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  created: function() {
    this.fetchData();
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
