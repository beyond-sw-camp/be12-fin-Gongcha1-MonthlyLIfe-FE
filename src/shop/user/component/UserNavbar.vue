<script setup>

</script>

<template>
  <div class="border ms-4" style="border-color: #777777">
    <div class="sidebar-title bg-danger ">
      <p class="m-0 text-white"><strong>마이페이지</strong></p>
    </div>
    <div class="sidebar">

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
  </div>
</template>

<style scoped>
.sidebar {
  background-color: #eeeeee;
  width: 10rem;
  height: 30rem;
  left: 0;
  padding: 20px;
  color: white;
}

.sidebar-title {
  color: black;
  font-size: 1.2rem;
  padding: 1rem;
}

.nav-link {
  text-align: start;
  color: black;
  padding: 5px;
  border-radius: 5px;
}

</style>