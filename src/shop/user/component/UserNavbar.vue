<script setup>

</script>

<template>
  <div class="sidebar">
    <h2 class="sidebar-title">메뉴</h2>
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link to="/user/subscription" class="nav-link" style="font-size: 13px;">내 구독 보기</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/profile" class="nav-link" style="font-size: 13px;">배송정보 확인</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/user/detail" class="nav-link" style="font-size: 13px;">개인정보확인/수정</router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sidebar {
  width: 150px;
  height: 100vh; /* 전체 높이 */
  top: 150px;
  left: 0;
  background-color: #888888;
  padding: 20px;
  margin-left: 4em;
  color: white;
}

.sidebar-title {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.nav-link {
  color: white;
  padding: 10px;
  border-radius: 5px;
}

</style>