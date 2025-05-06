<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const router = useRouter()
const saleStore = useSaleStore()
const prevEl = ref(null)
const nextEl = ref(null)

const newArrivals = computed(() => saleStore.newArrivals)

// 한 번만 호출
onMounted(() => {
  saleStore.fetchNewArrivals(10)
})
function onSwiper(swiper) {
  swiper.params.navigation.prevEl = prevEl.value
  swiper.params.navigation.nextEl = nextEl.value
  swiper.navigation.init()
  swiper.navigation.update()
}

function goToDetail(sale) {
  router.push(`/sale/detail/${sale.categoryIdx}/${sale.idx}`)
}

// 등급 배지 색
function conditionColorClass(cond) {
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
  <div class="container py-5 position-relative">
    <h4 class="fw-bold mb-4">NEW! 신상품 라인업</h4>

    <!-- 네비 버튼 -->
    <div ref="prevEl" class="swiper-nav-btn prev">
      <font-awesome-icon :icon="['fas', 'angle-left']" />
    </div>
    <div ref="nextEl" class="swiper-nav-btn next">
      <font-awesome-icon :icon="['fas', 'angle-right']" />
    </div>

    <Swiper :modules="[Navigation]" :slides-per-view="4" :space-between="30" :navigation="{ prevEl, nextEl }"
      @swiper="onSwiper">
      <SwiperSlide v-for="sale in newArrivals" :key="sale.idx" @click="goToDetail(sale)" style="cursor:pointer">
        <div class="text-center">
          <img :src="sale.imageUrl || '/assets/images/placeholder.png'" alt="제품 이미지" class="mx-auto"
            style="width:160px; height:160px; object-fit:cover;" />
          <div class="mt-3">
            <span v-if="sale.conditionName" class="badge ms-2" :class="conditionColorClass(sale.conditionName)">
              {{ sale.conditionName }}
            </span>
            <div class="fw-bold mt-1">{{ sale.name }}</div>
            <div class="text-dark fw-bold mt-2">
              {{ sale.price.toLocaleString() }}<span class="text-muted">원</span>
            </div>
            <div class="mt-1 text-sm">
              {{ sale.period }}개월
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <div v-if="!newArrivals.length" class="text-center text-muted py-5">
      등록된 상품이 없습니다.
    </div>
  </div>
</template>

<style scoped>
.badge {
  font-size: 0.75rem;
}

.swiper-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: white;
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
  left: 12px;
}

.swiper-nav-btn.next {
  right: 12px;
}
</style>
