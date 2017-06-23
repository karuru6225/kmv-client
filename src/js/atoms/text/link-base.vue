<template>
  <a
    :href="url"
    @click="click($event)"
    :class="[
      disabled ? baseStyle.linkDisabled : baseStyle.link,
      disabled ? $style.linkDisabled : $style.link
    ]"
  >
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '#'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods : {
    click: function(e){
      if(this.disabled){
        e.preventDefault();
        return;
      }
      this.$emit('click', e);
    }
  }
}
</script>
<style lang="scss" module="baseStyle">

.link {
  text-decoration: none;
  cursor: pointer;
  &Disabled {
    text-decoration: none;
    cursor: default;
  }
}

</style>
