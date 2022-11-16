<template>
  <div id="app" class="fillcontain">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
html,body,#app{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  font-family: "Microsoft YaHei";
}
</style>
