<template>
  <i :class="$style.icon"
    :style="{
      backgroundImage: `url(${url})`,
      backgroundSize: `${width}px ${height}px`,
      width: width + 'px',
      height: height + 'px',
    }"/>
</template>

<script>

export default {
  props: {
    url: {
      type: String,
      default: () => ''
    },
    width: {
      type: Number,
      default: () => null
    },
    height: {
      type: Number,
      default: () => null
    }
  }
}
</script>

<style lang="scss" module>
@import "css/_settings.scss";

.icon {
  background-position: center center;
  background-repeat: no-repeat;
  display: inline-block;
}
</style>
