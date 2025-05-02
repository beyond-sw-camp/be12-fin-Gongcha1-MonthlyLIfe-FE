<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '../../store/useCategoryStore'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import '@splidejs/vue-splide/css'
import Recommend from './Recommend.vue'
import NewArrival from './NewArrival.vue'
import BestSales from '../common/BestSales.vue'


const router = useRouter()
const store = useCategoryStore()

onMounted(() => {
  store.fetchCategoryList()
})

const visibleCategories = computed(() =>
  store.categories.filter(c => !!c.iconUrl)
)

const banners = ref([
  { title: 'Aircon', subtitle: '지금이 에어컨 구매타임!<br>역시즌 초특가',   img: '/assets/images/aircon.png',           link: '/sale/9?detail=33' },
  { title: 'Cooker', subtitle: '깨끗하게!<br>최대 30% 할인',       img: 'https://rentalcdn.lghellovision.net/uploads/product/hOSzhPoQFm.png', link: '/sale/5?detail=18' },
  { title: 'Stove', subtitle: '신선하게!<br>한정 수량 특가',         img: 'https://rentalcdn.lghellovision.net/uploads/product/J6DSh7anMa.png',   link: '/sale/4?detail=14' }
])

function goTo(path) {
  router.push(path)
}

function goToCategory(idx) {
  router.push(`/sale/${idx}`)
}


// 배너 스크립트

const summerSection = ref(null)

onMounted(() => {
  let alreadySnapped = false;
  let ticking = false; // ✅ 이거 빠져 있었음!

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = summerSection.value.getBoundingClientRect();
        const vh = window.innerHeight;

        // 스크롤 내려서 화면 70% 안에 들어왔으면 스냅
        if (rect.top < vh * 0.7 && !alreadySnapped && rect.bottom > 0) {
          summerSection.value.scrollIntoView({behavior: 'smooth'});
          alreadySnapped = true;
        }

        // 스크롤 위로 올라가서 화면에서 완전히 사라지면 초기화
        if (rect.top > vh) {
          alreadySnapped = false;
        }

        ticking = false;
      });

      ticking = true;
    }
  })
})
const sampleItems = [
  {
    title: 'BJ철구',
    desc: '아 행님들',
    img: 'https://i.namu.wiki/i/sCxmclPP1g_eC7klSqKNaSCNH0O2JDEA0GzNzq7YVhJMgr_ErFY5yehDJE971uYGpe4q6-fugm2NwojcG-Ezlw.webp',
  },
  {
    title: '야외 캠핑 쿨매트',
    desc: '뜨거운 텐트 바닥은 이제 그만!',
    img: 'https://i.namu.wiki/i/sCxmclPP1g_eC7klSqKNaSCNH0O2JDEA0GzNzq7YVhJMgr_ErFY5yehDJE971uYGpe4q6-fugm2NwojcG-Ezlw.webp',
  },
  {
    title: '서큘레이터',
    desc: '공기순환으로 에어컨 효율 UP!',
    img: 'https://i.namu.wiki/i/sCxmclPP1g_eC7klSqKNaSCNH0O2JDEA0GzNzq7YVhJMgr_ErFY5yehDJE971uYGpe4q6-fugm2NwojcG-Ezlw.webp',
  }
]


</script>

<template>
  <div class="home-wrapper">
    <div class="container">
      <!-- 1) 배너 섹션 -->
      <section class="home-main-banner bg-light px-5 py-5">
        <Splide
          :options="{
            type: 'loop',
            perPage: 1,
            arrows: true,
            pagination: true,
            autoplay: true,
            interval: 4000,
            pauseOnHover: true
          }"
          class="h-100"
        >
          <SplideSlide
            v-for="(b, i) in banners"
            :key="i"
            class="h-100"
            @click="goTo(b.link)"
          >
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
            <div
              v-for="item in visibleCategories"
              :key="item.idx"
              class="home-category-item"
              @click="goToCategory(item.idx)"
            >
              <img :src="item.iconUrl" class="home-category-icon" />
              <div class="small fw-semibold">{{ item.name }}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
  <Recommend class="home-main-banner"></Recommend>
  <NewArrival class="home-main-banner"></NewArrival>
  <BestSales class="home-main-banner"></BestSales>
  <section ref="summerSection" class="full-width-banner">
    <div class="banner-text">
      <h1>여름 특가</h1>
      <p>시원한 상품 만나보세요</p>
      <!-- 여기 ↓ -->

      <div class="summer-items">
        <div class="item-card" v-for="item in sampleItems" :key="item.title">
          <img :src="item.img" :alt="item.title"/>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <button class="buy-btn">보러가기 →</button>
        </div>
      </div>
    </div>
  </section>

  
</template>

<style scoped>

.summer-items {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.item-card {
  width: 250px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.item-card:hover {
  transform: translateY(-8px);
}

.item-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.item-card h3 {
  margin: 0.5rem 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.item-card p {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 1rem;
}

.buy-btn {
  padding: 0.5rem 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.buy-btn:hover {
  background-color: #0056b3;
}





.full-width-banner {
  margin-top: 20vh;
  margin-bottom: 1000px;
  width: 100vw;
  height: 100vh;
  background-image: url('../../../assets/images/summer.png');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}


.banner-text h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.banner-text p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}


.home-main-banner {
  max-width: 1140px;
  margin: 0 auto;
  height: 400px;      /* 배너 높이 고정 */
  overflow: hidden;
}
.home-main-banner-best{
  height: auto;
}
/* Splide 컨테이너 전체 높이를 차지하도록 */
:deep(.splide)             { height: 100%; }
:deep(.splide__track)     { height: 100%; }
:deep(.splide__list)      { height: 100%; }
:deep(.splide__slide)     { height: 100%; }

/* 실제 슬라이드 안의 콘텐츠 영역 */
.slider-content {
  height: 100%;
  padding: 0 2rem;  /* px-5 와 비슷한 좌우 여백 */
  box-sizing: border-box;
}

/* 이미지 비율 유지 */
.home-banner-image {
  height: 100%;
  width: auto;
  object-fit: contain;
}

/* Splide 화살표 / 페이징 (커스텀 예시) */
:deep(.splide__arrow) {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255,255,255,0.8);
  color: #333;
  border-radius: 50%;
}
:deep(.splide__pagination__page) {
  width: 0.75rem;
  height: 0.75rem;
  background: rgba(0,0,0,0.3);
}
:deep(.splide__pagination__page.is-active) {
  background: #333;
}

/* 카테고리 기존 스타일 유지 */
.home-cate {
  background-color: #fff;
  padding: 2rem 0;
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
  transition: transform 0.2s ease-in-out;
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
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.home-category-item .small {
  font-size: 1.05rem;
  font-weight: 600;
  color: #212529;
}
.slider-content {
  cursor: pointer;
}
</style>
