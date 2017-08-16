<template>
  <span :class="$style.horizontalDivider">
    <span />
  </span>
</template>

<style lang="scss" module>
@import "css/_settings.scss";
.horizontalDivider {
  width: 100%;
  padding: 4px;
  box-sizing: border-box;
  > span {
    display: block;
    width: 100%;
    height: 1px;
    background-color: $dividerColor;
  }
}
</style>
