<template>
  <button
    @click="$emit('click')"
    :class="$style.button"
    :style="{
      background: `url(${url})`,
      backgroundSize: `${width}px ${height}px`,
      backgroundPosition: 'center center',
      width: width + 'px',
      height: height + 'px',
    }">
    {{text}}
  </button>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    text: {
      type: String,
      default: ''
    },
  }
}
</script>

<style module>
.button {
  border: none;
  display: inline-block;
}
</style>
