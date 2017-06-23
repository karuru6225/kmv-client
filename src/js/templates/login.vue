<template>
  <div :class="$style.page">
    <form :class="$style.formbox" @submit="submit">
      <form-input name="username" type="text" ref="name"/>
      <form-input name="password" type="password" ref="pass"/>
      <list-button type="submit" color="primary" icon="sign-in">ログイン</list-button>
    </form>
  </div>
</template>

<script>
import Icon from 'atoms/icon/font-base.vue';
import Samples from 'organisms/samples.vue';
import ListButton from 'atoms/button/iconfont-base.vue';
import FormInput from 'atoms/form/input.vue';
import {mapState, mapActions} from 'vuex';

export default {
  components: {
    Icon,
    Samples,
    ListButton,
    FormInput
  },
  methods: {
    submit(e) {
      e.preventDefault();
      this.$store.dispatch('auth/login', {
        username: this.$refs.name.value,
        password: this.$refs.pass.value
      });
    }
  },
}

</script>
<style lang="scss" module>
@import "css/_settings.scss";

.page {
  width: 100%;
  height: 100%;
  position: absolute;
}

.formbox {
  display: inline-block;
  text-align: center;
  padding: 16px;
  background-color: #F7F7F7;
  border: solid 1px $dividerColor;
  border-radius: 2px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  > * {
    width: 150px;
    margin: 0 auto;
    margin-bottom: 8px;
  }
}


</style>
