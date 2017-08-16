<template>
  <button
    @click="click($event)"
    :type="type"
    :class="[
      disabled ? baseStyle.buttonDisabled : baseStyle.button,
      colorClass, sizeClass
    ]"
    :disabled="disabled"
  >
    <icon :name="icon" />
    <slot></slot>
  </button>
</template>

<script>
import Icon from 'atoms/icon/font-base.vue';

export default {
  components: {
    Icon
  },
  props: {
    type: {
      type: String,
      default: () => 'button'
    },
    icon: {
      type: String,
      default: () => 'font-awesome'
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    color: {
      type: String,
      default: () => 'primary'
    },
    size: {
      type: Number,
      default: () => 16
    }
  },
  computed: {
    colorClass: function(){
      if(this.disabled){
        return this.baseStyle[this.color+'Disabled'];
      }else{
        return this.baseStyle[this.color];
      }
    },
    sizeClass: function(){
      return this.baseStyle['size'+this.size];
    }
  },
  methods: {
    click: function(e){
      if(this.disabled){
        e.preventDefault();
        return;
      }
      this.$emit('click', e);
    }
  }
}
</script>

<style lang="scss" module="baseStyle">
@import "css/_settings.scss";

.button {
  border: none;
  display: inline-block;
  box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.5);
  border-radius: 2px;
  border: none;
  outline: none;
  &:active {
    box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
  }
  &Disabled {
    @extend .button;
    border: none;
    box-shadow: 0 0 0 0px rgba(0,0,0,1);
    &:active {
      box-shadow: 0 0 0 0px rgba(0,0,0,1);
    }
  }
}

.size12 {
  font-size: 12px;
  height: floor(12px * 1.8);
  min-width: floor(12px * 1.8);
  padding: 0 4px;
  margin: 4px;
}

.size16 {
  font-size: 16px;
  height: floor(16px * 1.8);
  min-width: floor(16px * 1.8);
  padding: 0 6px;
  margin: 6px;
}

$darkenRatio: 8%;
$lightenRatio: 10%;

.accent {
  color: $primaryColorText;
  background-color: $accentColor;
  &:active {
    background-color: darken($accentColor, $darkenRatio);
  }
  // &:active {
  //   background-color: lighten($accentColor, $lightenRatio);
  //   background-color: darken($accentColor, $darkenRatio);
  // }
  &Disabled {
    @extend .accent;
    color: darken($primaryColorText, 40%);
    &:active {
      background-color: $accentColor;
      color: darken($primaryColorText, 40%);
    }
  }
}

.primary {
  color: $primaryColorText;
  background-color: $primaryColor;
  &:hover {
    //background-color: darken($primaryColor, $darkenRatio);
  }
  &:active {
    background-color: lighten($primaryColor, $lightenRatio);
    background-color: darken($primaryColor, $darkenRatio);
  }
  &Disabled {
    @extend .primary;
    color: darken($primaryColorText, 40%);
    &:hover {
      //background-color: $primaryColor;
      //color: darken($primaryColorText, 40%);
    }
  }
}

.primaryDark {
  color: $primaryColorText;
  background-color: $primaryColorDark;
  &:hover {
    background-color: darken($primaryColorDark, $darkenRatio);
  }
  &:active {
    background-color: lighten($primaryColorDark, $lightenRatio);
  }
  &Disabled {
    @extend .primaryDark;
    color: darken($primaryColorText, 40%);
    &:hover {
      background-color: $primaryColorDark;
      color: darken($primaryColorText, 40%);
    }
  }
}

.primaryLight {
  color: $primaryColorText;
  background-color: $primaryColorLight;
  &:hover {
    background-color: darken($primaryColorLight, $darkenRatio);
    transition: background-color .3s;
  }
  &:active {
    background-color: lighten($primaryColorLight, $lightenRatio);
  }
  &Disabled {
    @extend .primaryLight;
    color: darken($primaryColorText, 40%);
    &:hover {
      background-color: $primaryColorLight;
      color: darken($primaryColorText, 40%);
    }
  }
}
</style>
