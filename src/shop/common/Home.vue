<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../../store/useCategoryStore'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import '@splidejs/vue-splide/css'
import Recommend from './Recommend.vue'
import NewArrival from './NewArrival.vue'
import BestSales from '../common/BestSales.vue'
import Weather from './Weather.vue'


const router = useRouter()
const store = useCategoryStore()

onMounted(() => {
  store.fetchCategoryList()
})

const visibleCategories = computed(() =>
  store.categories.filter(c => !!c.iconUrl)
)

const banners = ref([
  { title: 'Aircon', subtitle: '지금이 에어컨 구매타임!<br>역시즌 초특가', img: '/assets/images/aircon.png', link: '/sale/9?detail=33' },
  { title: 'Cooker', subtitle: '깨끗하게!<br>최대 30% 할인', img: 'https://rentalcdn.lghellovision.net/uploads/product/hOSzhPoQFm.png', link: '/sale/5?detail=18' },
  { title: 'Stove', subtitle: '신선하게!<br>한정 수량 특가', img: 'https://rentalcdn.lghellovision.net/uploads/product/J6DSh7anMa.png', link: '/sale/4?detail=14' }
])

function goTo(path) {
  router.push(path)
}

function goToCategory(idx) {
  router.push(`/sale/${idx}`)
}
</script>

<template>
  <div class="home-wrapper">
    <div class="container">
      <!-- 1) 배너 섹션 -->
      <section class="home-main-banner bg-light px-5 py-2">
        <Splide :options="{
          type: 'loop',
          perPage: 1,
          arrows: true,
          pagination: true,
          autoplay: true,
          interval: 4000,
          pauseOnHover: true
        }" class="h-100">
          <SplideSlide v-for="(b, i) in banners" :key="i" class="h-100" @click="goTo(b.link)">
            <div class="slider-content d-flex justify-content-between align-items-center ms-5">
              <div>
                <h1 class="display-4 fw-bold">{{ b.title }}</h1>
                <p class="lead" v-html="b.subtitle"></p>
                <button class="btn btn-dark mt-3">바로가기 →</button>
              </div>
              <img :src="b.img" alt="" class="home-banner-image me-2" />
            </div>
          </SplideSlide>
        </Splide>
      </section>
    </div>

    <!-- 2) 제품 카테고리 -->
    <div class="container">
      <div class="home-cate">
        <section class="w-100 py-5 border-top">
          <div class="d-flex justify-content-around flex-wrap text-center">
            <div v-for="item in visibleCategories" :key="item.idx" class="home-category-item"
              @click="goToCategory(item.idx)">
              <img :src="item.iconUrl" class="home-category-icon" />
              <div class="small fw-semibold">{{ item.name }}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
  <div>
    <Recommend class="home-main-banner"></Recommend>
  </div>
  <div class="container py-5">
    <NewArrival />
  </div>
  <div class="container py-5">
    <BestSales />
  </div>
  <div>
    <Weather class=""></Weather>
  </div>




</template>

<style scoped>
.home-main-banner {
  max-width: 1140px;
  margin: 0 auto;
  height: 350px;
  overflow: hidden;
}

.home-main-banner-best {
  height: 500px;
}

/* Splide full-height */
:deep(.splide),
:deep(.splide__track),
:deep(.splide__list),
:deep(.splide__slide) {
  height: 100%;
}

.slider-content {
  height: 100%;
  padding: 0 2rem;
  box-sizing: border-box;
}

.home-banner-image {
  height: 100%;
  width: auto;
  object-fit: contain;
}

.home-cate {
  background-color: #fff;
  padding: 2rem 0;
}

:deep(.splide__arrow) {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  border-radius: 50%;
}

:deep(.splide__pagination__page) {
  width: 0.75rem;
  height: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
}

:deep(.splide__pagination__page.is-active) {
  background: #333;
}

.home-category-item {
  width: 160px;
  height: 200px;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.home-category-item:hover {
  transform: translateY(-6px);
}

.home-category-icon {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.home-category-item .small {
  font-size: 1.05rem;
  font-weight: 600;
  color: #212529;
}
</style>
