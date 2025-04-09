<script setup>

import Navbar from "./component/Navbar.vue";
import Footer from "./component/Footer.vue";
</script>


<template>
  <div class="user-layout">
    <Navbar />

    <main class="main-content">
      <router-view />
    </main>



    <Footer />
  </div>
</template>

<style scoped>
.user-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  text-align: center;
  flex: 1;
  padding-top: 150px; /* 상단 네비 높이 고려 */
  margin: 0 auto;
}
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

</style>