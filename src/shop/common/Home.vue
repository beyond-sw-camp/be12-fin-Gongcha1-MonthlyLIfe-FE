<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = [
  { idx: 1, name: 'TV', icon: '/src/assets/images/tv.png' },
  { idx: 2, name: '에어컨', icon: '/src/assets/images/aircon.png' },
  { idx: 3, name: '로봇청소기', icon: '/src/assets/images/robot.png' },
  { idx: 4, name: '공기청정기', icon: '/src/assets/images/aircleaner.png' },
  { idx: 5, name: '안마의자', icon: '/src/assets/images/chair.png' },
  { idx: 6, name: '의류관리기', icon: '/src/assets/images/styler.png' },
]

const goToCategory = (idx) => {
  router.push(`/sale/${idx}`)
}
</script>

<template>
  <div class>
    <!-- 메인 배너 -->
    <section class="d-flex justify-content-between align-items-center px-5 py-5 bg-light w-100">
      <div>
        <h1 class="display-4 fw-bold">Aircon</h1>
        <p class="lead">지금이 에어컨 구매타임!<br />역시즌 초특가</p>
        <button class="btn btn-dark mt-3">바로가기 →</button>
      </div>
      <img src="/src/assets/images/aircon.png" alt="Aircon" class="banner-image" />
    </section>

    <!-- 제품 아이콘 리스트 -->
    <section class="w-100 py-5 border-top">
      <div class="d-flex justify-content-around flex-wrap text-center">
        <div v-for="item in categories" :key="item.name" class="mb-4 px-3" @click="goToCategory(item.idx)"
          style="cursor: pointer">
          <img :src="item.icon" alt="icon" class="mb-2 category-icon" />
          <div class="small fw-semibold">{{ item.name }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.category-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
}
</style>