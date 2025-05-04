<template>
  <div id="app">

  </div>
</template>
<script>
export default {
  onLaunch: function() {
    console.log('App Launch');
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  }
}
</script>


<style lang="scss">
/*每个页面公共css */
@import './static/css/style.css';

.bgf {
  background: #FFF;
}

.flc {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flc-inline {
  display: inline-flex;
  align-items: center;
}

.g5 {
  color: $g5;
}

.fz12 {
  font-size: $fz12;
}
</style>