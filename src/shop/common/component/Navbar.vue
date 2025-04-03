<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const menus = [
  '전체렌탈상품', 'BEST', '0원 특가',
  '이벤트/혜택', '구매가이드', '사업자/B2B', '할인카드'
]

const goToCart = () => {
  router.push('/cart')
}
</script>

<template>
  <header class="w-100">
    <div class="bg-dark text-white py-1">
      <div class="container d-flex justify-content-between align-items-center ">
        <!-- 왼쪽: 로고 -->
        <a href="/" class="text-danger fw-bold fs-5 logo">월정액 인생</a>
        <!-- 오른쪽: 메뉴 아이템 -->
        <div class="d-flex align-items-center small flex-nowrap text-nowrap">
          <div class="me-3">헬로+</div>
          <div class="me-3">고객지원</div>
          <div class="me-3">마이헬로</div>
          <font-awesome-icon icon="magnifying-glass" class="text-danger me-2 py-1" />
          <font-awesome-icon
            :icon="['fas', 'cart-shopping']"
            class="ms-2"
            @click="goToCart"
            style="cursor: pointer;"
          />
        </div>
      </div>
    </div>
    <nav class="custom-nav bg-white border-bottom w-100">
      <div class="container d-flex justify-content-between align-items-center py-3 ">
        <!-- 메뉴 리스트 -->
        <ul class="nav flex-row mb-0 flex-nowrap text-nowrap">
          <li v-for="menu in menus" :key="menu" class="nav-item">
            <a href="#" class="nav-link text-dark fw-semibold custom-nav-link">
              {{ menu }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  <!-- 로고 + 메뉴 -->
</header>

</template>




<style scoped>
/* html, body {
  margin: 0;
  padding: 0;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
} */

</style>