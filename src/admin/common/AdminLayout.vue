<script setup>
import AdminNavbar from "./component/AdminNavbar.vue";
import AdminFooter from "./component/AdminFooter.vue";
</script>

<template>
  <div class="d-flex min-vh-100 gap-0">
    <!-- 왼쪽 사이드바 -->
    <AdminNavbar />

    <!-- 오른쪽 콘텐츠 영역 -->
      <router-view class="flex-grow-1" />
      <AdminFooter />
    </div>
</template>


<style scoped>
/* 필요 시 추가적인 스타일 가능 */
</style>
