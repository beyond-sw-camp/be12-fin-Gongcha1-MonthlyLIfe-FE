<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import { useProductStore } from '../../store/useProductStore'

// Swiper 관련
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const router = useRouter()
const route = useRoute()
const saleStore = useSaleStore()
const productStore = useProductStore()

const currentPage = ref(route.query.page ? Number(route.query.page) : 0)
const pageSize = 20

const prevEl = ref(null)
const nextEl = ref(null)

function onSwiper(swiper) {
  swiper.params.navigation.prevEl = prevEl.value
  swiper.params.navigation.nextEl = nextEl.value
  swiper.navigation.init()
  swiper.navigation.update()
}

function goToDetail(sale) {
  router.push(`/sale/detail/${sale.categoryIdx}/${sale.idx}`)
}

function getMinPrice(sale) {
  return sale.priceList?.reduce((min, p) => (p.price < min.price ? p : min), sale.priceList[0])
}

const saleContent = computed(() => saleStore.saleList.content || [])

function loadData(page) {
  saleStore.fetchAllSales(page, pageSize)
}

watch(currentPage, (page) => {
  router.replace({ query: { page } })
  loadData(page)
}, { immediate: true })

onMounted(() => {
  productStore.fetchProductList()
})
</script>

<template>
  <div class="container py-5 position-relative">
    <h4 class="fw-bold mb-4">
      NEW! 신상품 라인업
    </h4>

    <!-- 커스텀 네비게이션 버튼 -->
    <div class="swiper-nav-btn prev" ref="prevEl">
      <font-awesome-icon :icon="['fas', 'angle-left']" />
    </div>
    <div class="swiper-nav-btn next" ref="nextEl">
      <font-awesome-icon :icon="['fas', 'angle-right']" />
    </div>

    <swiper
      :modules="[Navigation]"
      :slides-per-view="4"
      :space-between="30"
      :navigation="{ prevEl: prevEl, nextEl: nextEl }"
      @swiper="onSwiper"
    >
      <swiper-slide
        v-for="sale in saleContent"
        :key="sale.idx"
        @click="goToDetail(sale)"
        style="cursor:pointer"
      >
        <div class="text-center">
          <img
            :src="productStore.products.find(p => p.code === sale.productList[0]?.productCode)?.productImages?.[0]?.productImgUrl || '/assets/images/placeholder.png'"
            alt="제품 이미지"
            class="mx-auto"
            style="width: 160px; height: 160px; object-fit: cover;"
          />
          <div class="mt-3">
            <small class="text-muted fw-bold">
              {{
                productStore.products.find(p => p.code === sale.productList[0]?.productCode)
                  ?.manufacturer || '브랜드 미정'
              }}
            </small>
            <div class="fw-bold mt-1">
              {{ sale.name }}
            </div>
            <div v-if="getMinPrice(sale)" class="text-dark fw-bold mt-2">
              {{ getMinPrice(sale).price.toLocaleString() }}<span class="text-muted">원</span>
            </div>
            <div class="mt-2">
              <span class="badge bg-lime text-dark px-2">NEW</span>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <div v-if="saleContent.length === 0" class="text-center text-muted py-5">
      등록된 상품이 없습니다.
    </div>
  </div>
</template>

<style scoped>
.badge.bg-lime {
  background-color: #d8e360;
  font-size: 0.75rem;
}

.swiper-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.swiper {
  position: relative; /* 버튼 표시 보장 */
}
.swiper-nav-btn.prev {
  left: 12px;
}

.swiper-nav-btn.next {
  right: 12px;
}
</style>
