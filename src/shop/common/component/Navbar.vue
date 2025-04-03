<template>
  <header class="w-100">
    <!-- 최상단 검정 헤더 -->
    <div class="bg-dark text-white py-1 px-3 d-flex justify-content-end small">
      <div class="me-3">헬로+</div>
      <div class="me-3">고객지원</div>
      <div class="me-3">마이헬로 ▼</div>
      <div><font-awesome-icon :icon="['far', 'magnifying-glass']" /></div>
    </div>

    <!-- 로고 및 메인 메뉴 -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center text-danger fw-bold" href="/">
          Hello rental
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li v-for="menu in menus" :key="menu" class="nav-item">
              <a class="nav-link" href="#">{{ menu }}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
const menus = [
  '전체렌탈상품', 'BEST', '0원 특가',
  '이벤트/혜택', '구매가이드', '사업자/B2B', '할인카드'
]
</script>

<style scoped>
.navbar-brand {
  font-size: 1.2rem;
}
</style>
