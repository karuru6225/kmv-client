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
  &:active {
    background-color: $primaryColorText;
    transition: background-color .3s;
    color: $primaryColor;
  }
  &Disabled {
    @extend .link;
    color: $primaryColorDark;
    &:active {
      color: $primaryColorDark;
      background-color: inherit;
    }
  }
}
</style>
