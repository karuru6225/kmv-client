<template>
  <div :class="$style.container" ref="container">
    <table :class="$style.fileList">
      <thead>
        <tr>
          <th :class="[$style.theadTh, $style.name]" @click="sortFiles('name')" ref="name">
            <span>名前</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="asc && sort == 'name'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="!asc && sort == 'name'" />
          </th>
          <th :class="$style.theadTh" @click="sortFiles('mtime')" ref="mtime">
            <span>変更日</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="asc && sort == 'mtime'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="!asc && sort == 'mtime'" />
          </th>
          <th :class="$style.theadTh" @click="sortFiles('size')" ref="size">
            <span>サイズ</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="asc && sort == 'size'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="!asc && sort == 'size'" />
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(file, idx) in $data.sortedFiles">
          <file
            :key="idx"
            :file="file"
            :class="getFileClass(idx, file.id)"
            @click="$emit('select',file)"
          />
        </template>
      </tbody>
    </table>
    <table :class="$style.fixedHeader">
      <thead>
        <tr>
          <th :class="[$style.theadTh, $style.name]" @click="sortFiles('name')" ref="nameFixed">
            <span>名前</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="asc && sort == 'name'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="!asc && sort == 'name'" />
          </th>
          <th :class="$style.theadTh" @click="sortFiles('mtime')" ref="mtimeFixed">
            <span>変更日</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="asc && sort == 'mtime'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="!asc && sort == 'mtime'" />
          </th>
          <th :class="$style.theadTh" @click="sortFiles('size')" ref="sizeFixed">
            <span>サイズ</span>
            <icon name="sort-amount-asc" :class="$style.sortIcon" v-if="asc && sort == 'size'" />
            <icon name="sort-amount-desc" :class="$style.sortIcon" v-if="!asc && sort == 'size'" />
          </th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
import Icon from 'atoms/icon/font-base.vue';
import File from 'molecules/file.vue';
import naturalCompare from 'natural-compare';
import $ from 'jquery';

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
    getFileClass(idx, id){
      const classes = [];
      if(id == this.highlight){
        classes.push(this.$style.highlight);
      }
      return classes;
    },
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
    },
    resize(){
      const cols = [ 'name', 'mtime', 'size' ];
      cols.forEach( c => {
        $(this.$refs[c+'Fixed']).width( $(this.$refs[c]).width() );
      });
    }
  },
  data(){
    const sort = this.$props.sort;
    const order = this.$props.asc ? 1 : -1;
    const sortedFiles = this.getSortedArray(sort, order);
    return {
      sortCol: sort,
      order: order,
      sortedFiles,
    };
  },
  watch: {
    files: function(files){
      this.$data.sortedFiles = this.getSortedArray(this.$data.sortCol, this.$data.order);
      this.$nextTick(function(){
        this.resize();
      });
    }
  },
  mounted: function() {
    $(window).on('resize', this.resize.bind(this) );
    this.resize();
  },
  beforeDestroy: function() {
    $(window).off('resize', this.resize.bind(this) );
  }
}

</script>
<style lang="scss" module>
@import "css/_settings.scss";

.container {
  max-height: calc(#{'100vh - ' + $headerHeight});
  overflow: scroll;
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
  background-color: $bgColor;
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

.fixedHeader {
  position: fixed;
  top: $headerHeight;
  table-layout: fixed;
  border-collapse: collapse;
}
</style>
