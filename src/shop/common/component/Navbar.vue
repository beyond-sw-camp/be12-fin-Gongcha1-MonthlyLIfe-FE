<script setup>
const menus = [
  '전체렌탈상품', 'BEST', '0원 특가',
  '이벤트/혜택', '구매가이드', '사업자/B2B', '할인카드'
]
</script>

<template>
  <header class="w-100">
  <!-- 검정 헤더 -->
  <div class="bg-dark text-white py-1 w-100">
    <div class="d-flex justify-content-end small px-4">
      <div class="me-3">헬로+</div>
      <div class="me-3">고객지원</div>
      <div class="me-3">마이헬로</div>
      <font-awesome-icon icon="magnifying-glass" class="text-white me-2 py-1" />
    </div>
  </div>

  <!-- 로고 + 메뉴 -->
  <nav class="bg-white border-bottom w-100">
    <div class="d-flex justify-content-between align-items-center py-3 px-4">
      <a href="/" class="text-danger fw-bold fs-5">월정액 인생</a>

      <div class="d-flex gap-4 flex-wrap">
        <div v-for="menu in menus" :key="menu" class="text-dark small fw-semibold cursor-pointer">
          {{ menu }}
        </div>
      </div>
    </div>
  </nav>
</header>

</template>




<style scoped>
.navbar-brand {
  font-size: 1.2rem;
}

</style>
