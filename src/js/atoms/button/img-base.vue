<template>
  <button
    @click="$emit('click')"
    :class="$style.button"
    :style="{
      backgroundPosition: 'center center',
      height: size + 'px',
    }">
    <slot/>
  </button>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
    }
  }
}
</script>

<style lang="scss" module>
@import "css/_settings.scss";

$darkenRatio: 8%;
$lightenRatio: 10%;

.button {
  border: none;
  display: inline-block;
  box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.5);
  border-radius: 2px;
  border: none;
  outline: none;
  &:active {
    box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
  }
  &Disabled {
    @extend .button;
    border: none;
    box-shadow: 0 0 0 0px rgba(0,0,0,1);
    &:active {
      box-shadow: 0 0 0 0px rgba(0,0,0,1);
    }
  }
  background-repeat: no-repeat;

  color: $primaryColorText;
  background-color: $primaryColor;
  &:hover {
    background-color: darken($primaryColor, $darkenRatio);
  }
  &:active {
    background-color: lighten($primaryColor, $lightenRatio);
  }
  &Disabled {
    @extend .button;
    color: darken($primaryColorText, 40%);
    &:hover {
      background-color: $primaryColor;
      color: darken($primaryColorText, 40%);
    }
  }
}
</style>
