<script>
export default {
  created(){
    switch(this.$route.params.ext){
      case 'mp4':
        location.replace(`${ApiEntry}file/${this.$route.params.id}/direct?open`);
        break;
      default:
        location.replace(`${ApiEntry}file/${this.$route.params.id}/direct`);
    }
  },
}
</script>
