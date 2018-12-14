<template>
  <div id="app">
    <Home/>
  </div>
</template>

<script>
  import Home from "./components/Home";

  export default {
    components: {Home}
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Open+Sans&subset=cyrillic');

  #app {
    font-family: 'Open Sans', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #141414;
  }
</style>
