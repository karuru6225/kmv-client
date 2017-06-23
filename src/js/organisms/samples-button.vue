<script>
import IconButton from 'atoms/button/iconfont-base.vue';

export default {
  components: {
    IconButton,
  },
  render: function(createElement){
    let rows = [];
    let buttons = [];
    const colors = ['primaryDark', 'primary', 'primaryLight', 'accent'];
    const sizes = [16, 12];
    sizes.forEach( size => {
      colors.forEach( color => {
        buttons.push(
          createElement('div', [
            createElement(`icon-button`, {
              attrs: {
                size, color,
              }
            }, 'ボタン'),
            createElement(`icon-button`, {
              attrs: {
                size, color,
                disabled: true
              }
            }, 'ボタン'),
          ])
        );
      });
      rows.push(createElement('div', {attrs:{'class':this.$style.buttons}}, buttons));
      buttons = [];
    });
    return createElement('div', rows);
  }
}
</script>

<style lang="scss" module>
.buttons {
  display: flex;
  > * {
    width: 120px;
    height: 120px;
    box-sizing: border-box;
    padding: 8px;
    text-align: center;
  }
}
</style>

