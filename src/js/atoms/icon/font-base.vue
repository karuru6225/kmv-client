<template>
  <i :class="`fa fa-${name}`"/>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'font-awesome'
    }
  }
}
</script>
