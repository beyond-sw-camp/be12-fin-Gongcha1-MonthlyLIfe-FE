<script setup>

import Navbar from "./component/Navbar.vue";
import Footer from "./component/Footer.vue";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>


<template>
  <div class="user-layout">
    <Navbar />

    <main class="main-content">
      <router-view />
    </main>
    <div class="position-fixed bottom-0 end-0 p-3 d-flex flex-column align-items-center gap-2">
      <button class="btn btn-outline-secondary rounded-circle">💬</button>
      <button class="btn btn-dark rounded-circle"  @click="scrollToTop">TOP</button>
    </div>


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
  padding-top: 150px;
  /* 상단 네비 높이 고려 */
  margin: 0 auto;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>