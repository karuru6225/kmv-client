<template>
  <tr :class="$style.container" @click="click">
    <td :class="$style.name"> <icon :name="getIconName()" /> <span>{{ file.name }}</span> </td>
    <td :class="$style.mtime"> <span>{{ formatDate(file.mtime) }}</span> </td>
    <td :class="$style.size"> <span>{{ getSize(file) }}</span> </td>
  </tr>
</template>

<script>
import Icon from 'atoms/icon/font-base.vue';
import moment from 'moment';
import {extComponentMap as map} from 'utils/consts.js';

export default {
  components: {
    Icon
  },
  props: ['file'],
  methods: {
    click(){
      let url = `${PublicPath}${map['any']}/${this.file.type}/${this.file.id}`;
      if(this.file.type == 'directory'){
        url = `${PublicPath}directory/${this.file.id}`;
      }else{
        const setting = map[this.file.type];
        if(setting){
          url = `${PublicPath}${setting.path}/${this.file.type}/${this.file.id}`;
        }
      }
      this.$router.push(url);
    },
    getSize(file) {
      if(file.type == 'directory'){
        return '-';
      }
      return file.size.toLocaleString();
    },
    formatDate(mtime){
      return moment(mtime).utcOffset(9).format('YYYY/MM/DD HH:mm:ss.SSS');
    },
    getIconName(){
      switch(this.file.type){
        case 'directory':
          return 'folder-o';
        case 'zip':
        case 'rar':
          return 'file-archive-o';
        case 'png':
        case 'gif':
        case 'jpg':
        case 'jpeg':
          return 'file-image-o';
        case 'm3u8':
        case 'mp4':
          return 'file-video-o';
        default:
          return 'file';
      }
    }
  }
}

</script>

<style lang="scss" module>
@import "css/_settings.scss";

.container {
  height: 30px;
  align-items: center;
  &:hover {
    transition: background-color .3s;
    background-color: $primaryColorLight;
  }
  cursor: pointer;
  > * {
    box-sizing: border-box;
    padding-left: 4px;
    padding-right: 4px;
    white-space: nowrap;
  }
}

.name {
  padding-left: 12px;
}

.size {
  text-align: right;
}
</style>

