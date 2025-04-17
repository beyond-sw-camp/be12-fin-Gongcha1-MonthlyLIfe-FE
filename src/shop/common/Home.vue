<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../../store/useCategoryStore'

const router = useRouter()
const store = useCategoryStore()

// 페이지 로딩 시 카테고리 목록 요청
onMounted(() => {
  store.fetchCategoryList()
})

// iconUrl이 있는 카테고리만 필터링
const visibleCategories = computed(() =>
  store.categories.filter(c => !!c.iconUrl)
)
// 최상위 카테고리 + 아이콘이 있는 것만 필터링
// const visibleCategories = computed(() =>
//   store.categories.filter(c => c.parentIdx === null && !!c.iconUrl)
// )

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
            v-for="item in visibleCategories"
            :key="item.idx"
            class="mb-4 px-3 home-category-item"
            @click="goToCategory(item.idx)"
            style="cursor: pointer"
          >
            <img :src="item.iconUrl" alt="icon" class="mb-2 home-category-icon" />
            <div class="small fw-semibold">{{ item.name }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-wrapper {
  width: 100%;
}

.home-banner-image {
  max-width: 300px;
  height: auto;
}

.home-cate {
  background-color: #fff;
  padding: 2rem 0;
}

.home-cate section {
  max-width: 1140px;
  margin: 0 auto;
}

.home-category-item {
  width: 160px;
  height: 200px;
  text-align: center;
  transition: transform 0.2s ease-in-out;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.home-category-item:hover {
  transform: translateY(-6px);
}

.home-category-icon {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  margin: 0 auto 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.home-category-item .small {
  font-size: 1.05rem;
  font-weight: 600;
  color: #212529;
}
</style>
