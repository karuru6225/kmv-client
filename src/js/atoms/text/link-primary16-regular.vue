<script>
import LinkBase from './link-base.vue';

export default {
  mixins: [LinkBase]
}
</script>

<style lang="scss" module>
@import "../../../css/_settings.scss";

.link {
  font-size: 16px;
  font-weight: normal;
  color: $primaryColorText;
  &:hover {
    background-color: $primaryColorText;
    transition: background-color .3s;
    color: $primaryColor;
  }
  &Disabled {
    @extend .link;
    color: $primaryColorDark;
    &:hover {
      color: $primaryColorDark;
      background-color: inherit;
    }
  }
}
</style>
