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
  color: $secondaryTextColor;
  &:hover {
    background-color: $primaryColor;
    transition: background-color .3s;
    color: $primaryColorLight;
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
