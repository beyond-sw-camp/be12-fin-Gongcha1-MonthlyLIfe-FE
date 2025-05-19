<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import { useCategoryStore } from '../../store/useCategoryStore'
import { useSaleStore } from '../../store/useSaleStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const categoryStore = useCategoryStore()
const saleStore = useSaleStore()

const prevEl = ref(null)
const nextEl = ref(null)

// 허용된 카테고리 인덱스
const allowedIdx = [12, 16, 17,  29, 34, 25, 38, 44, 45]

// 필터링된 카테고리
const categories = computed(() =>
  categoryStore.categories.filter(c => allowedIdx.includes(c.idx))
)

const selectedCategoryIdx = ref(null)

onMounted(async () => {
  await categoryStore.fetchCategoryList()

  const first = categories.value[0]
  if (first) {
    selectedCategoryIdx.value = first.idx
    await saleStore.fetchCategoryBestSummaries(first.idx, 10)
    await saleStore.fetchCategoryBestSummaries(first.idx, 10)
  }
})

watch(selectedCategoryIdx, async idx => {
  if (idx !== null) {
    await saleStore.fetchCategoryBestSummaries(idx, 10)
    await saleStore.fetchCategoryBestSummaries(idx, 10)
  }
})
const bestSales = computed(() => {
  return saleStore.categorySummaries[selectedCategoryIdx.value] || []
})

const goDetail = (sale) => {
  router.push(`/sale/detail/${sale.categoryIdx}/${sale.saleIdx}`)
}
// 조건 배지용
const conditionColorClass = (cond) => {
  switch (cond) {
    case 'S급': return 'bg-success'
    case 'A급': return 'bg-primary'
    case 'B급': return 'bg-warning text-dark'
    case 'C급': return 'bg-danger'
    default: return 'bg-secondary'
  }
}
</script>

<template>
  <div class="best-banner">

    <div class="best-layout">
      <ul class="category-buttons">
        <div class="best-header">
          <div class="best-text">
            <h4>Best</h4>
            <p>지금 가장 인기 있는 건 뭘까?</p>
          </div>
        </div>


        <li v-for="cat in categories" :key="cat.idx">
          <button :class="{ active: cat.idx === selectedCategoryIdx }" @click="selectedCategoryIdx = cat.idx">
            {{ cat.name }}
          </button>
        </li>
      </ul>

      <div class="product-slide-area">
        <div v-if="bestSales.length === 0" class="text-center text-muted p-4">
          해당 카테고리에 상품이 없습니다.
        </div>
        <div v-else>
          <div ref="prevEl" class="swiper-nav-btn prev">
            <font-awesome-icon :icon="['fas', 'angle-left']" />
          </div>
          <Swiper :modules="[Navigation]" :navigation="{ nextEl, prevEl }" :slides-per-view="'auto'" :space-between="28"
            :observer="true" :observe-parents="true">
            <SwiperSlide v-for="(sale, i) in bestSales" :key="sale.saleIdx" class="custom-slide">
              <div class="product-card" @click="goDetail(sale)">
                <em class="slide-num">{{ String(i + 1).padStart(2, '0') }}</em>
                <div class="img-wrap">
                  <img :src="sale.imageUrl || '/assets/images/placeholder.png'" alt="상품 이미지" />
                  <div class="info-overlay">
                    <!-- 1. 제조사/이름 -->
                    <div class="info-top">
                      <em>{{ sale.manufacturer }}</em>
                      <p>{{ sale.name }}</p>
                    </div>

                    <!-- 2. 등급 배지 -->
                    <div class="info-middle">
                      <span v-if="sale.conditionName" class="badge ms-2"
                        :class="conditionColorClass(sale.conditionName)">
                        {{ sale.conditionName }}
                      </span>
                    </div>

                    <!-- 3. 가격/기간 -->
                    <div class="info-bottom">
                      <strong>{{ sale.price.toLocaleString() }}<span>원</span></strong>
                      <div class="monthly">
                        월 <span>{{ sale.period }}</span>개월
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          </Swiper>
          <div ref="nextEl" class="swiper-nav-btn next">
            <font-awesome-icon :icon="['fas', 'angle-right']" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-slide {
  width: 270px !important;
  flex-shrink: 0;
}

.best-banner {
  padding: 2rem;
  min-height: 600px;
}

.best-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* 헤더: 제목 + 카테고리 */
.best-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* 이미지와 같은 폰트 스타일 */
.best-text h4 {
  margin: 0;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 3rem;
  font-weight: 300;
  color: #111;
  line-height: 1.1;
}

.best-text p {
  margin: 0.3rem 0 0;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 1.125rem;
  /* 18px */
  font-weight: 400;
  color: #666;
  line-height: 1.4;
}



.category-buttons {
  flex: 2;
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-width: 500px;
}

.category-buttons button {
  padding: 0.5rem 1.2rem;
  border-radius: 9999px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s, color 0.2s;
}

.category-buttons button.active {
  background: #000;
  color: #fff;
}

.product-slide-area {
  flex: 5;
  overflow: hidden;
  position: relative;
}

.product-card {
  position: relative;
  background: #fff;
  text-align: left;
  cursor: pointer;
  width: 280px;
  /* max-width: 100%; */
  box-sizing: border-box;
}

.product-card .slide-num {
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  padding: 0.3rem 0.5rem;
  font-weight: bold;
  font-size: 14px;
  z-index: 2;
}

.img-wrap {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 355px;
}

.img-wrap img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

.info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  /* 고정 높이 설정 */
  height: 140px;      /* 필요에 따라 조정 */
  padding: 0.7rem;

  /* flex 로 3구역 사이 여백 고르게 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 14px;
}

.info-top {
  /* 제조사/이름 위쪽 정렬, 줄 넘침 방지 */
}
.info-top em {
  display: block;
  font-weight: bold;
  margin-bottom: 0.2rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.info-top p {
  margin: 0;
  font-size: 14px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;      /* 2줄까지 */
  -webkit-box-orient: vertical;
}

.info-middle {
  /* 가운데 정렬 */
  display: flex;
  justify-content: flex-start; /* 필요에 따라 center 로도 가능 */
}
.info-middle .badge {
  font-size: 0.85rem;
}

.info-bottom {
  /* 가격/기간을 하단에 붙여줌 */
}
.info-bottom strong {
  display: block;
  font-size: 16px;
  margin-bottom: 0.2rem;
}
.info-bottom .monthly {
  font-size: 13px;
  color: #ccc;
}


/* ——— 새 네비게이션 버튼 스타일 ——— */
.swiper-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;

  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.swiper-nav-btn.prev {
  left: 8px;
}

.swiper-nav-btn.next {
  right: 8px;
}

.swiper-nav-btn font-awesome-icon {
  font-size: 18px;
  width: 18px;
  height: 18px;
}
</style>
