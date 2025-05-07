<!-- src/components/BestSales.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'

// Swiper 관련
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation }           from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const router     = useRouter()
const saleStore  = useSaleStore()

// 네비 버튼 ref
const prevEl = ref(null)
const nextEl = ref(null)

// Swiper 인스턴스 초기화
const onSwiper = (swiper) => {
  swiper.params.navigation.prevEl = prevEl.value
  swiper.params.navigation.nextEl = nextEl.value
  swiper.navigation.init()
  swiper.navigation.update()
}

// 마운트 시 store에서 전체 Best 5개 로드
onMounted(async () => {
  await saleStore.fetchAllBestSales(5)
})

// store에 저장된 전체 Best
const top5 = computed(() => saleStore.allBestSales)

// 상세 페이지 이동
const goDetail = (sale) => {
  router.push(`/sale/detail/${sale.categoryIdx}/${sale.saleIdx}`)
}

// 등급 배지 색상
const conditionColorClass = (cond) => {
  switch (cond) {
    case 'S급': return 'bg-success'
    case 'A급': return 'bg-primary'
    case 'B급': return 'bg-warning text-dark'
    case 'C급': return 'bg-danger'
    default:    return 'bg-secondary'
  }
}
</script>

<template>
  <div class="best-banner py-5">
    <h4 class="fw-bold mb-4">🔥 Best 상품 Top 5</h4>
    <div class="product-slide-area">
      <!-- 커스텀 네비 버튼 -->
      <div ref="prevEl" class="swiper-nav-btn prev">
        <font-awesome-icon :icon="['fas','angle-left']" />
      </div>
      <Swiper
        :modules="[Navigation]"
        :slides-per-view="'auto'"
        :space-between="28"
        :navigation="{ prevEl, nextEl }"
        @swiper="onSwiper"
      >
        <SwiperSlide
          v-for="(sale, i) in top5"
          :key="sale.saleIdx"
          class="custom-slide"
          @click="goDetail(sale)"
          style="cursor: pointer;"
        >
          <div class="product-card">
            <em class="slide-num">{{ String(i + 1).padStart(2, '0') }}</em>
            <div class="img-wrap">
              <img
                :src="sale.imageUrl || '/assets/images/placeholder.png'"
                alt="상품 이미지"
              />
              <div class="info-overlay">
                <em>{{ sale.manufacturer }}</em>
                <p>{{ sale.name }}</p>
                <span
                  v-if="sale.conditionName"
                  class="badge ms-2"
                  :class="conditionColorClass(sale.conditionName)"
                >
                  {{ sale.conditionName }}
                </span>
                <strong>
                  {{ sale.price.toLocaleString() }}<span>원</span>
                </strong>
                <div class="monthly">
                  월 {{ sale.period }}개월
                </div>
                <div class="subscribe-count text-end mt-1">
                  구독 {{ sale.subscribeCount }}
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div ref="nextEl" class="swiper-nav-btn next">
        <font-awesome-icon :icon="['fas','angle-right']" />
      </div>

      <!-- 로딩/빈 화면 표시 -->
      <div v-if="!top5.length" class="text-center text-muted p-4">
        불러오는 중...
      </div>
    </div>
  </div>
</template>


<style scoped>
.custom-slide {
  width: 280px !important;
  flex-shrink: 0;
}

.best-banner {
  padding: 2rem;
  min-height: 500px;
}

.product-slide-area {
  position: relative;
  overflow: hidden;
}

.product-card {
  position: relative;
  background: #fff;
  text-align: left;
  width: 280px;
  max-width: 100%;
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
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 0.7rem;
  font-size: 14px;
  z-index: 4;
}

.info-overlay em {
  display: block;
  font-weight: bold;
  margin-bottom: 0.2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}

.info-overlay p {
  margin: 0.2rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}

.info-overlay strong {
  display: block;
  font-size: 16px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}

.info-overlay .monthly {
  font-size: 13px;
  color: #ccc;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

/* 네비게이션 버튼 스타일 */
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
