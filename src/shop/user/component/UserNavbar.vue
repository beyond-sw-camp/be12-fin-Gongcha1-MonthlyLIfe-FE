<script setup>

</script>

<template>
  <div class="ms-4" >
    <div class="border" style="border-color: #777777">

    <div class="sidebar-title bg-black ">
      <p class="m-0 text-white"><strong>마이페이지</strong></p>
    </div>
    <div class="sidebar">

      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/user/subscription" class="nav-link" style="font-size: 13px;">내 구독 보기</router-link>
        </li>
        <!-- <li class="nav-item">
          <router-link to="/user/delivery" class="nav-link" style="font-size: 13px;">배송정보 확인</router-link>
        </li> -->
        <li class="nav-item">
          <router-link to="/user/detail" class="nav-link" style="font-size: 13px;">개인정보확인/수정</router-link>
        </li>
      </ul>
    </div>

    </div>
  </div>
</template>

<style scoped>
.sidebar {
  background-color: #eeeeee;
  width: 10rem;
  height: 80em;
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
}

</style>