<template>
  <div :class="$style.colors">
    <div :class="$style.primaryColorDark">
      primaryColorDark
    </div>
    <div :class="$style.primaryColor">
      primaryColor
    </div>
    <div :class="$style.primaryColorLight">
      primaryColorLight
    </div>
    <div :class="$style.accentColor">
      accentColor
    </div>
    <div :class="$style.primaryColorText">
      primaryColorText
    </div>
    <div :class="$style.primaryTextColor">
      primaryTextColor
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div :class="$style.secondaryTextColor">
      secondaryTextColor
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div :class="$style.dividerColor">
      dividerColor
    </div>
  </div>
</template>

<style lang="scss" module>
@import "../../css/_settings.scss";

.colors {
  $colorsBoxSize: 120px;
  display: flex;
  .primaryColorDark {
    background-color: $primaryColorDark;
    display: inline-block;
    width: $colorsBoxSize;
    height: $colorsBoxSize;
    color: $primaryColorText;
    &:after {
      content: "#{$primaryColorDark}";
    }
  }
  .primaryColor {
    background-color: $primaryColor;
    display: inline-block;
    width: $colorsBoxSize;
    height: $colorsBoxSize;
    color: $primaryColorText;
    &:after {
      content: "#{$primaryColor}";
    }
  }
  .primaryColorLight {
    background-color: $primaryColorLight;
    display: inline-block;
    width: $colorsBoxSize;
    height: $colorsBoxSize;
    color: $primaryColorText;
    &:after {
      content: "#{$primaryColorLight}";
    }
  }
  .primaryColorText {
    background-color: $primaryColorText;
    display: inline-block;
    width: $colorsBoxSize;
    height: $colorsBoxSize;
    color: $primaryColorDark;
    &:after {
      content: "#{$primaryColorText}";
    }
  }
  .dividerColor {
    background-color: $dividerColor;
    display: inline-block;
    width: $colorsBoxSize;
    height: $colorsBoxSize;
    &:after {
      content: "#{$dividerColor}";
    }
  }
  .accentColor {
    background-color: $accentColor;
    display: inline-block;
    width: $colorsBoxSize;
    height: $colorsBoxSize;
    color: $primaryColorText;
    &:after {
      content: "#{$accentColor}";
    }
  }

  .primaryTextColor {
    display: inline-block;
    width: $colorsBoxSize;
    height: $colorsBoxSize;
    color: $primaryTextColor;
    white-space: nowrap;
    *:nth-child(1) {
      background-color: $primaryColorDark;
      &:after {
        content: "#{$primaryTextColor}";
      }
    }
    *:nth-child(2) {
      background-color: $primaryColor;
      &:after {
        content: "#{$primaryTextColor}";
      }
    }
    *:nth-child(3) {
      background-color: $primaryColorLight;
      &:after {
        content: "#{$primaryTextColor}";
      }
    }
    *:nth-child(4) {
      background-color: $accentColor;
      &:after {
        content: "#{$primaryTextColor}";
      }
    }
  }
  .secondaryTextColor {
    color: $secondaryTextColor;
    display: inline-block;
    width: $colorsBoxSize;
    height: $colorsBoxSize;
    white-space: nowrap;
    *:nth-child(1) {
      background-color: $primaryColorDark;
      &:after {
        content: "#{$secondaryTextColor}";
      }
    }
    *:nth-child(2) {
      background-color: $primaryColor;
      &:after {
        content: "#{$secondaryTextColor}";
      }
    }
    *:nth-child(3) {
      background-color: $primaryColorLight;
      &:after {
        content: "#{$secondaryTextColor}";
      }
    }
    *:nth-child(4) {
      background-color: $accentColor;
      &:after {
        content: "#{$secondaryTextColor}";
      }
    }
  }
}
</style>
