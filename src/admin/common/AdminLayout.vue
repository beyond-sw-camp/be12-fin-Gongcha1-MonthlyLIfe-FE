<script setup>
import AdminNavbar from "./component/AdminNavbar.vue";
import AdminHeader from "./component/AdminHeader.vue";
</script>

<template>
  <div class="layout-container d-flex flex-column min-vh-100">
    <!-- ✅ 헤더: 전체 화면 위로 빼기 -->
    <AdminHeader />

    <div class="d-flex flex-grow-1">
      <!-- 사이드바 -->
      <AdminNavbar />

      <!-- 메인 컨텐츠 -->
      <div class="flex-grow-1 d-flex flex-column">
        <router-view class="flex-grow-1" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  margin: 0;
  padding: 0;
}
</style>
