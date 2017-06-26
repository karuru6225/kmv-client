<template>
  <div :class="$style.container">
    <table :class="$style.fileList">
      <thead>
        <tr>
          <th :class="[$style.theadTh, $style.name]" @click="sortFiles('name')">
            <span>名前</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="asc && sort == 'name'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="!asc && sort == 'name'" />
          </th>
          <th :class="$style.theadTh" @click="sortFiles('mtime')">
            <span>変更日</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="asc && sort == 'mtime'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="!asc && sort == 'mtime'" />
          </th>
          <th :class="$style.theadTh" @click="sortFiles('size')">
            <span>サイズ</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="asc && sort == 'size'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="!asc && sort == 'size'" />
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="file in $data.sortedFiles">
          <file :file="file" :class="file.id == highlight ? $style.highlight : ''"/>
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
    },
    sort: {
      type: String,
      default: () => 'name'
    },
    asc: {
      type: Boolean,
      default: () => true
    },
    highlight: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    sortFiles(type){
      if(this.$data.sortCol == type){
        this.$data.order *= -1;
      }else{
        this.$data.order = 1;
      }
      this.$data.sortCol = type;

      const params = {
        sort: type,
        asc: this.$data.order == 1
      };

      this.$emit('changeOrder', params);
      return;
    },
    getSortFunc(col, order){
      let compFunc = null;
      switch(col){
        case 'name':
          return (a, b) => order * naturalCompare(a.name, b.name);
          break;
        case 'mtime':
          return (a, b) => {
            if( !(a.mtime instanceof Date) ){
              return order;
            }
            if( !(b.mtime instanceof Date) ){
              return -1 * order;
            }
            return order * ( a.mtime.getTime() - b.mtime.getTime() );
          };
          break;
        case 'size':
          return (a, b) => {
            /*if(a.type == 'directory' && b.type == 'directory'){
              return naturalCompare(a.name, b.name);
            }
            if(a.type == 'directory'){
              return -1;
            }
            if(b.type == 'directory'){
              return -1;
            }*/
            return order * ( a.size - b.size )
          }
          break;
      }
    },
    getSortedArray(sort, order){
      return this.files.slice().sort( this.getSortFunc(sort, order) );
    }
  },
  data(){
    const sort = this.$props.sort;
    const order = this.$props.asc ? 1 : -1;
    return {
      sortCol: sort,
      order: order,
      sortedFiles: this.getSortedArray(sort, order)
    }
  },
  watch: {
    files: function(files){
      this.$data.sortedFiles = this.getSortedArray(this.$data.sortCol, this.$data.order);
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

.highlight {
  background-color: rgba( $primaryColorLight, .3);
}
</style>
