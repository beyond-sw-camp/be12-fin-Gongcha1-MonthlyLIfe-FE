<template>
  <div class="d-flex min-vh-100">
    <!-- 🔹 사이드바 -->
    <nav class="sidebar d-flex flex-column p-3 text-white">
      <!-- 로고 + 관리자 -->
      <div class="mb-4">
        <div class="text-center">
          <img style="width: 4rem; height: 5rem" src="../../../../assets/images/profile.jpg">
        </div>
        <h5 class="fw-bold mt-2">관리자</h5>
      </div>


      <!-- 구분선 -->
      <hr class="text-secondary" />

      <!-- 메뉴 리스트 -->
      <ul class="nav nav-pills flex-column gap-2 text-start">
        <!-- 상품 재고 관리 -->
        <li>
          <router-link to="/admin" class="nav-link text-white" >
          <font-awesome-icon :icon="['fas', 'table-columns']" /> 관리자 대시보드
          </router-link>
        </li>
        <li>
          <a class="nav-link" href="#">
            <font-awesome-icon :icon="['fas', 'box-open']" /> 상품 재고 관리
          </a>
          <ul class="nav flex-column ms-4 small">
            <li>
              <router-link to="/admin/product" class="nav-link text-white-50" >- 상품 관리</router-link>
            </li>
            <li>
              <router-link to="/admin/subscription" class="nav-link text-white-50" >- 구독 관리</router-link>
            </li>
          </ul>
        </li>

        <!-- 구독관리 -->
        <li>
          <a class="nav-link" href="#">
            <font-awesome-icon :icon="['fas', 'clipboard-check']" /> 결제 관리
          </a>
          <ul class="nav flex-column ms-4 small">
            <li>
              <router-link to="/admin/sale" class="nav-link text-white-50" >- 결제 및 연체 관리</router-link>
            </li>
            <li>
              <router-link to="/admin/delivery" class="nav-link text-white-50" >- 배송 스케줄 관리</router-link>
            </li>
          </ul>
        </li>

        <!-- 사용자 관리 -->
        <li>
          <router-link to="/admin/user" class="nav-link text-white" >
            <font-awesome-icon :icon="['fas', 'user']" /> 사용자 관리
          </router-link>
        </li>

        <!-- 통계 리포트 -->
        <li>
          <router-link to="/admin/statistics" class="nav-link text-white" >
            <font-awesome-icon :icon="['fas', 'chart-simple']" /> 통계 리포트
          </router-link>
        </li>

        <!-- 홈페이지 관리 -->
        <li>
          <a class="nav-link" href="#">
            <font-awesome-icon :icon="['fas', 'globe']" /> 홈페이지 관리
          </a>
          <ul class="nav flex-column ms-4 small">
            <li><router-link to="/admin/sale/register" class="nav-link text-white-50" >- 판매 관리</router-link></li>
            <li><router-link to="/admin/category" class="nav-link text-white-50" >- 카테고리 관리</router-link></li>
            <li><a class="nav-link text-white-50" href="#">- FAQ 관리</a></li>
            <li><a class="nav-link text-white-50" href="#">- 공지사항 관리</a></li>
          </ul>
        </li>

        <!-- 상담 채팅 관리 -->
        <li>
          <a class="nav-link" href="#">
            <font-awesome-icon :icon="['fas', 'headset']" /> 상담 채팅 관리
          </a>
        </li>
      </ul>

      <!-- 구분선 -->
      <hr class="text-secondary mt-4" />
    </nav>

      <slot />
    </div>

</template>

<style scoped>
.sidebar {
  width: 240px;
  background-color: #1f1f1f;
}

.sidebar .nav-link {
  color: #ccc;
  font-weight: 500;
}

.sidebar .nav-link:hover,
.sidebar .nav-link.active {
  background-color: #343a40;
  color: #fff;
}

.sidebar ul.nav ul.nav .nav-link {
  padding-left: 1rem;
  font-size: 13px;
}

.sidebar ul.nav ul.nav .nav-link:hover {
  color: #ffffff;
}
</style>
<script setup lang="ts">
</script>