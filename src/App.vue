<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
  display: flex;
  justify-content: center;
  /* justify-items: center; */
  /* align-items: center; */
  align-content: center;
  text-align: center;
}
</style>

<!-- 
  数据库设计：
  user 表
  字段：
  username
  password
  code
 -->
