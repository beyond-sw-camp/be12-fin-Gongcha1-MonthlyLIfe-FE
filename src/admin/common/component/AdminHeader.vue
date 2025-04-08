<script setup>

</script>

<template>
  <nav class="custom-nav bg-white border-bottom w-100 admin-header">
    <div class="container-fluid d-flex justify-content-between align-items-center h-100 px-3">
      <!-- 왼쪽: 로고 / 이름 -->
      <ul class="nav mb-0 flex-nowrap text-nowrap">
        <li class="nav-item">
          <router-link to="/admin" class="nav-link text-dark fw-semibold custom-nav-link">
            Monthly Life Admin
          </router-link>
        </li>
      </ul>

      <!-- 오른쪽: 유저 정보 / 알림 등 추가 가능 -->
      <div class="d-flex align-items-center gap-3">
        <span class="text-muted small">admin</span>
        <!-- 알림 아이콘이나 프로필 아이콘 자리 -->
      </div>
    </div>
  </nav>
</template>

<style scoped>
.admin-header {
  height: 48px; /* ✅ 높이 최적화 */
  background-color: #ffffff;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); /* 살짝 그림자 */
}

.custom-nav-link {
  font-size: 14px;
  padding: 0;
  line-height: 1;
}
</style>
