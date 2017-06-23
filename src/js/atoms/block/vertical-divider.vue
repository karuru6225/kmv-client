<template>
  <span :class="$style.verticalDivider">
    <span />
  </span>
</template>

<style lang="scss" module>
@import "css/_settings.scss";
.verticalDivider {
  height: 100%;
  padding: 4px;
  box-sizing: border-box;
  display: inline-block;
  > span {
    display: inline-block;
    height: 100%;
    width: 1px;
    background-color: $dividerColor;
  }
}
</style>
