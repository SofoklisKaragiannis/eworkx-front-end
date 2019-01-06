<template>
  <div id="app">
    <!--Include router-->
    <router-view></router-view>
    <notifications group="webshop" />
  </div>
</template>

<script>
export default {
  // initialise app
  name: 'app',
};
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
