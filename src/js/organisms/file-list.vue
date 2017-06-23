<template>
  <div :class="$style.container">
    <table :class="$style.fileList">
      <thead>
        <tr>
          <th :class="[$style.theadTh, $style.name]" @click="sortFiles('name')">
            <span>名前</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="$data.asc == 1 && $data.sortCol == 'name'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="$data.asc == -1 && $data.sortCol == 'name'" />
          </th>
          <th :class="$style.theadTh" @click="sortFiles('mtime')">
            <span>変更日</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="$data.asc == 1 && $data.sortCol == 'mtime'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="$data.asc == -1 && $data.sortCol == 'mtime'" />
          </th>
          <th :class="$style.theadTh" @click="sortFiles('size')">
            <span>サイズ</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="$data.asc == 1 && $data.sortCol == 'size'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="$data.asc == -1 && $data.sortCol == 'size'" />
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="file in $data.sortedFiles">
          <file :file="file" />
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import Icon from 'atoms/icon/font-base.vue';
import File from 'molecules/file.vue';
import naturalCompare from 'natural-compare';

export default {
  components: {
    File,
    Icon
  },
  props: {
    files: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    sortFiles(type){
      let compFunc = null;
      if(this.$data.sortCol == type){
        this.$data.asc *= -1;
      }else{
        this.$data.asc = 1;
      }
      this.$data.sortCol = type;
      switch(type){
        case 'name':
          compFunc = (a, b) => naturalCompare(a.name, b.name);
          break;
        case 'mtime':
          compFunc = (a, b) => {
            if( !(a.mtime instanceof Date) ){
              return 1;
            }
            if( !(b.mtime instanceof Date) ){
              return -1;
            }
            return a.mtime.getTime() - b.mtime.getTime();
          };
          break;
        case 'size':
          compFunc = (a, b) => {
            /*if(a.type == 'directory' && b.type == 'directory'){
              return naturalCompare(a.name, b.name);
            }
            if(a.type == 'directory'){
              return -1;
            }
            if(b.type == 'directory'){
              return -1;
            }*/
            return a.size - b.size
          }
          break;
      }
      if(!compFunc) return;
      this.$data.sortedFiles = this.files.slice().sort( (a, b) => {
        return this.$data.asc * compFunc(a, b);
      });
    },
  },
  data(){
    return {
      sortCol: 'name',
      asc: 1,
      sortedFiles: this.files.slice()
    }
  },
  watch: {
    files: function(files){
      this.$data.sortedFiles = files.slice();
      console.log(this.$data.sortedFiles);
    }
  }
}

</script>
<style lang="scss" module>
@import "css/_settings.scss";

.container {
  //padding: 16px;
}

.fileList {
  border-collapse: collapse;
  width: 100%;
}

.theadTh {
  text-align: left;
  font-weight: normal;
  height: 32px;
  box-sizing: border-box;
  border-bottom: solid 1px $dividerColor;
  white-space: nowrap;
  > * {
    display: inline-block;
    padding-top: 2px;
    padding-left: 4px;
  }
  position: relative;
}

.name {
  > * {
    padding-left: 12px;
  }
  width: 100%;
}

.sortIcon {
}
</style>
