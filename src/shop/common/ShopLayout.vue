<script setup>

import Navbar from "./component/Navbar.vue";
import Footer from "./component/Footer.vue";
</script>

<template>

  <Navbar></Navbar>

  <div style="height: 150px;"></div>
  <div style="display: flex; margin: 0 auto; max-width: 1280px">
    <router-view></router-view>
  </div>
  
  <Footer></Footer>
</template>

<style scoped>

</style>