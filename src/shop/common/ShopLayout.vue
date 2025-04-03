<script setup>

import Navbar from "./component/Navbar.vue";
import Footer from "./component/Footer.vue";
</script>

<template>
  <Navbar></Navbar>
  <div style="height: 120px;"></div>
  <router-view></router-view>
  
  <Footer></Footer>
</template>

<style scoped>

</style>