<template>
  <div :class="$style.container">
    <div :class="$style.skCubeGrid">
      <div :class="[$style.skCube, $style.skCube1]"></div>
      <div :class="[$style.skCube, $style.skCube2]"></div>
      <div :class="[$style.skCube, $style.skCube3]"></div>
      <div :class="[$style.skCube, $style.skCube4]"></div>
      <div :class="[$style.skCube, $style.skCube5]"></div>
      <div :class="[$style.skCube, $style.skCube6]"></div>
      <div :class="[$style.skCube, $style.skCube7]"></div>
      <div :class="[$style.skCube, $style.skCube8]"></div>
      <div :class="[$style.skCube, $style.skCube9]"></div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import "css/_settings.scss";
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.skCubeGrid {
  width: 50px;
  height: 50px;
}

.skCubeGrid .skCube {
  width: 33%;
  height: 33%;
  background-color: white;
  float: left;
          animation: skCubeGridScaleDelay 1.3s infinite ease-in-out; 
}
.skCubeGrid .skCube1 { animation-delay: 0.2s; }
.skCubeGrid .skCube2 { animation-delay: 0.3s; }
.skCubeGrid .skCube3 { animation-delay: 0.4s; }
.skCubeGrid .skCube4 { animation-delay: 0.1s; }
.skCubeGrid .skCube5 { animation-delay: 0.2s; }
.skCubeGrid .skCube6 { animation-delay: 0.3s; }
.skCubeGrid .skCube7 { animation-delay: 0s; }
.skCubeGrid .skCube8 { animation-delay: 0.1s; }
.skCubeGrid .skCube9 { animation-delay: 0.2s; }

@-webkit-keyframes skCubeGridScaleDelay {
  0%, 70%, 100% {
    transform: scale3D(1, 1, 1);
  } 35% {
    transform: scale3D(0, 0, 1); 
  }
}

@keyframes skCubeGridScaleDelay {
  0%, 70%, 100% {
    transform: scale3D(1, 1, 1);
  } 35% {
    transform: scale3D(0, 0, 1);
  } 
}

</style>
