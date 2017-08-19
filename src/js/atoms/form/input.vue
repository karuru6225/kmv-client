<template>
  <div>
    <input v-if="type == 'text'"
      :class="$style.input" :name="name"
      @keyup="$emit('keyup', $event)"
      type="text" v-model="value"/>
    <input v-if="type == 'password'"
      :class="$style.input" :name="name"
      @keyup="$emit('keyup', $event)"
      type="password" v-model="value"/>
  </div>
</template>

<script>

export default {
  props: ['type', 'name', 'defaultValue'],
  data(){
    return {
      value: this.defaultValue
    }
  },
  watch: {
    defaultValue: function(){
      console.log('watching defaultValue');
      this.$data.value = defaultValue;
    }
  },
  created: function(){
    this.$on('change', function(value){
      this.$data.value = value;
    });
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
