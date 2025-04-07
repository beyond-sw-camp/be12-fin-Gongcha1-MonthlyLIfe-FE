<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = [
  { idx: 1, name: 'TV', icon: '/assets/images/tv.png' },
  { idx: 2, name: '에어컨', icon: '/assets/images/aircon_icon.png' },
  { idx: 3, name: '로봇청소기', icon: '/assets/images/robot.png' },
  { idx: 4, name: '공기청정기', icon: '/assets/images/aircleaner.png' },
  { idx: 5, name: '안마의자', icon: '/assets/images/chair.png' },
  { idx: 6, name: '의류관리기', icon: '/assets/images/styler.png' },
]

const goToCategory = (idx) => {
  router.push(`/sale/${idx}`)
}
</script>

<template>
  <div class="home-wrapper">
    <!-- 메인 배너 -->
    <section class="d-flex justify-content-between align-items-center px-5 py-5 bg-light w-100 home-main-banner">
      <div>
        <h1 class="display-4 fw-bold">Aircon</h1>
        <p class="lead">
          지금이 에어컨 구매타임!<br />
          역시즌 초특가
        </p>
        <button class="btn btn-dark mt-3">바로가기 →</button>
      </div>
      <img src="/assets/images/aircon.png" alt="Aircon" class="home-banner-image" />
    </section>

    <!-- 제품 카테고리 -->
    <div class="home-cate">
      <section class="w-100 py-5 border-top">
        <div class="d-flex justify-content-around flex-wrap text-center">
          <div
            v-for="item in categories"
            :key="item.name"
            class="mb-4 px-3 home-category-item"
            @click="goToCategory(item.idx)"
            style="cursor: pointer"
          >
            <img :src="item.icon" alt="icon" class="mb-2 home-category-icon" />
            <div class="small fw-semibold">{{ item.name }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* 전체 감싸는 래퍼 */
.home-wrapper {
  width: 100%;
}

/* 배너 이미지 */
.home-banner-image {
  max-width: 300px;
  height: auto;
}

/* 카테고리 영역 배경 및 패딩 */
.home-cate {
  background-color: #fff;
  padding: 2rem 0;
}

/* 카테고리 섹션 안의 전체 너비 제한 */
.home-cate section {
  max-width: 1140px; /* 부트스트랩 container-xl 기준 */
  margin: 0 auto;
}

/* 카테고리 아이템 */
.home-category-item {
  flex: 1 0 150px;
  max-width: 180px;
  text-align: center;
  transition: transform 0.2s ease-in-out;
  padding: 1rem 0;
}

.home-category-item:hover {
  transform: translateY(-6px);
}

/* 아이콘 이미지 */
.home-category-icon {
  width: 100%;
  max-width: 140px;
  height: auto;
  display: block;
  margin: 0 auto 1rem;
}

/* 텍스트 스타일 */
.home-category-item .small {
  font-size: 1.05rem;
  font-weight: 600;
  color: #212529;
}
</style>

