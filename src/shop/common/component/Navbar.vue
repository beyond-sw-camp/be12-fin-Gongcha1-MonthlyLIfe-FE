<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 로그인, 회원가입, 관리자 라우팅
const goLogin = () => {
  router.push("/auth/login");
};
const goSignup = () => {
  router.push("/auth/signup/identify");
};
const goAdmin = () => {
  router.push("/admin");
};

const goToCart = () => {
  router.push("/cart");
};

// 예시 메뉴 데이터
const menus = [
  "전체렌탈상품",
  "BEST",
  "패키지 특가",
  "이벤트/혜택",
  "구매가이드",
  "할인카드",
];
</script>

<template>
  <header class="w-100 text-nowrap">
    <!-- 상단 검정 바 -->
    <div class="py-1 bg-white border-bottom">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- 왼쪽: 로고 + 관리자 버튼 -->
        <div class="d-flex align-items-center">

          <button class="btn btn-sm btn-dark ms-3" @click="goAdmin">
            관리자
          </button>
        </div>

        <!-- 오른쪽: 메뉴 아이템 -->
        <div class="d-flex align-items-center small flex-nowrap text-nowrap">
          <div class="me-3">고객지원</div>

          <div class="me-3"><router-link to="/user/detail" class="nav-link" >마이페이지</router-link></div>
          
          <font-awesome-icon
            icon="magnifying-glass"
            class=" me-2 py-1"
          />
          <font-awesome-icon
            :icon="['fas', 'cart-shopping']"
            class="ms-2"
            @click="goToCart"
            style="cursor: pointer;"
          />
          <!-- 로그인 / 회원가입 버튼 -->
          <div class="ms-3">
            <button class="btn btn-sm btn-outline-dark me-1" @click="goLogin">
              로그인
            </button>
            <button class="btn btn-sm btn-outline-dark" @click="goSignup">
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 흰 바 (메뉴) -->
    <nav class="custom-nav bg-white border-bottom w-100">

      <div class="container d-flex justify-content-between align-items-center py-3">
        <!-- 메뉴 리스트 -->
        <div class="d-flex align-items-center">
          <router-link to="/" class="text-decoration-none">
            <div class="d-flex">
              <img src="/assets/ml_logo.png" style="width: 4rem">
              <h4 class="text-black m-3">월정액인생</h4>
            </div>
          </router-link>
        </div>
        <ul class="nav flex-row mb-0 flex-nowrap text-nowrap">
          <li v-for="menu in menus" :key="menu" class="nav-item">
            <a href="#" class="nav-link text-dark fw-semibold custom-nav-link">
              {{ menu }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>

</style>
