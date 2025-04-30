<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import { useCategoryStore } from '../../store/useCategoryStore'
import { useProductStore } from '../../store/useProductStore'
import { useSaleStore } from '../../store/useSaleStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const categoryStore = useCategoryStore()
const productStore = useProductStore()
const saleStore = useSaleStore()

const prevEl = ref(null)
const nextEl = ref(null)

// 허용된 카테고리 인덱스
const allowedIdx = [4, 5, 7, 9, 12, 16, 25, 29, 34, 38]

// 필터링된 카테고리
const categories = computed(() =>
  categoryStore.categories.filter(c => allowedIdx.includes(c.idx))
)

const selectedCategoryIdx = ref(null)

onMounted(async () => {
  await categoryStore.fetchCategoryList()
  await productStore.fetchProductList()

  const first = categories.value[0]
  if (first) {
    selectedCategoryIdx.value = first.idx
    await saleStore.fetchCategoryBestSales(first.idx, 10)
  }
})

watch(selectedCategoryIdx, async idx => {
  if (idx !== null) {
    await saleStore.fetchCategoryBestSales(idx, 10)
  }
})

const bestSales = computed(() => saleStore.bestSales)

function goDetail(sale) {
  router.push(`/sale/detail/${sale.categoryIdx}/${sale.saleIdx}`)
}

function getMinPrice(sale) {
  return sale.priceList?.reduce(
    (min, p) => (p.price < min.price ? p : min),
    sale.priceList[0]
  )
}
</script>

<template>
  <div class="best-banner">
    <h4>Best</h4>
    <p>지금 가장 인기 있는 건 뭘까?</p>
    <div class="best-layout">
      <ul class="category-buttons">
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
          <div ref="prevEl" class="swiper-button-prev swiper-nav-button prev me"> <font-awesome-icon :icon="['fas', 'angle-left']" /></div>
          <Swiper
            :modules="[Navigation]"
            :navigation="{ nextEl, prevEl }"
            :slides-per-view="'auto'"
            :space-between="28"
            :observer="true"
            :observe-parents="true"
          >
            <SwiperSlide v-for="(sale, i) in bestSales" :key="sale.idx" class="custom-slide">
              <div class="product-card" @click="goDetail(sale)">
                <em class="slide-num">{{ String(i + 1).padStart(2, '0') }}</em>
                <div class="img-wrap">
                  <img :src="productStore.products
                    .find(p => p.code === sale.productList[0]?.productCode)
                    ?.productImages?.[0]?.productImgUrl || '/assets/images/placeholder.png'" alt="상품 이미지" />
                  <div class="info-overlay">
                    <em>
                      {{
                        productStore.products
                          .find(p => p.code === sale.productList[0]?.productCode)
                          ?.manufacturer
                      }}
                    </em>
                    <p>{{ sale.name }}</p>
                    <strong>
                      {{ getMinPrice(sale).price.toLocaleString() }}<span>원</span>
                    </strong>
                    <div class="monthly">
                      월 <span>{{ getMinPrice(sale).price.toLocaleString() }}</span>원
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
          <div ref="nextEl" class="swiper-button-next swiper-nav-button next">
            <font-awesome-icon :icon="['fas', 'angle-right']" />
          </div>
        </div>
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
}

.best-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}
.swiper-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
  padding: 0;
}

.category-buttons {
  flex: 1;
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-width: 800px;
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
  flex: 3;
  overflow: hidden;
  position: relative;
}

.swiper-button-prev.prev {
  left: 8px;
}

.swiper-button-next.next {
  right: 8px;
}

.swiper-button-prev.prev::after {
  content: none;
  font-size: 18px;
  color: #fff;
}

.swiper-button-next.next::after {
  content: none;
  font-size: 18px;
  color: #fff;
}

.product-card {
  position: relative;
  background: #fff;
  text-align: left;
  cursor: pointer;
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
  height: 300px;
}

.img-wrap img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

.info-overlay {
  z-index: 4;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 0.7rem;
  font-size: 14px;
}

.info-overlay em {
  display: block;
  font-weight: bold;
  margin-bottom: 0.2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}

.info-overlay p {
  font-size: 14px;
  margin: 0.2rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}

.info-overlay strong {
  font-size: 16px;
  display: block;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}

.info-overlay .monthly {
  font-size: 13px;
  color: #ccc;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}
/* FontAwesome 아이콘 크기 조정 */
.swiper-nav-button font-awesome-icon {
  font-size: 10px; /* ✅ 아이콘 크기 */
  width: 18px;
  height: 18px;
}
</style>
