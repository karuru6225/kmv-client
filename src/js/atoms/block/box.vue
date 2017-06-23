<template>
  <div :class="$style.box">
    <slot>
      dummy content
    </slot>
  </div>
</template>

<style lang="scss" module>

.box {
  background-color: #FFFFFF;
  border-radius: 2px;
  border: none;
}
</style>
