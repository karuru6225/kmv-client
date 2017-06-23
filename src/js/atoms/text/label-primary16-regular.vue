<template>
  <span :class="[$style.label]">
    <slot></slot>
  </span>
</template>

<style lang="scss" module>
@import "../../../css/_settings.scss";

.label {
  font-size: 16px;
  font-weight: normal;
  color: $primaryColorText;
}

</style>
