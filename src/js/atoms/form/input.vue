<template>
  <div>
    <input v-if="type == 'text'"
      :class="$style.input" :name="name"
      type="text" v-model="value"/>
    <input v-if="type == 'password'"
      :class="$style.input" :name="name"
      type="password" v-model="value"/>
  </div>
</template>

<script>

export default {
  props: ['type', 'name'],
  data() {
    return {
      value: ''
    };
  }
}
</script>

<style lang="scss" module>
@import "css/_settings.scss";

.input {
  height: 28px;
  border: solid 1px $dividerColor;
  border-radius: 2px;
  box-sizing: border-box;
  width: 100%;
  font-size: 14px;
}

</style>
