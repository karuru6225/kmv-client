<template>
  <icon-base
    :url="url"
    :width=24
    :height=24
  />
</template>

<script>
import IconBase from './img-base.vue';

export default {
  components: {
    IconBase
  },
  props: {
    url: {
      type: String,
      required: true,
    },
  }
}
</script>
