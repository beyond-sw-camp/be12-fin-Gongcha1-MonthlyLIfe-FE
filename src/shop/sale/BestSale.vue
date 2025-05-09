<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import { useProductStore } from '../../store/useProductStore'

const router = useRouter()
const saleStore = useSaleStore()
const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProductList()
  saleStore.fetchBestSales(5)
})

const bestSales = computed(() => saleStore.bestSales)

const goDetail = (sale) => {
  router.push(`/sale/detail/${sale.categoryIdx}/${sale.saleIdx}`)
}
// 최소 가격·기간 계산
const getMinPrice = (sale) => {
  return sale.priceList?.reduce(
    (min, p) => (p.price < min.price ? p : min),
    sale.priceList[0]
  )
}
// 상태 배지 색
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
  <section class="banner-section">
      <img
        src="https://rentalcdn.lghellovision.net/uploads/category/l2nml1EqiU.jpg"
        alt="배너 이미지"
        class="banner-image"
      />
      <div class="text-area">
        <div class="text02"><strong>지금 가장 인기 있는 렌탈 TOP5</strong></div>
      </div>
    </section>
  <div class="container py-5">
    <h4 class="fw-bold mb-4">🔥 Best 상품 Top 5</h4>

    <div v-if="!bestSales.length" class="text-center text-muted">
      불러오는 중...
    </div>

    <div v-else class="row g-4">
      <div
        v-for="sale in bestSales"
        :key="sale.saleIdx"
        class="col-md-4"
        @click="goDetail(sale)"
        style="cursor: pointer"
      >
        <div class="card h-100 shadow-sm">
          <!-- 이미지 영역 -->
          <div class="d-flex flex-wrap justify-content-center gap-2 p-2">
            <img
              v-for="(prod, i) in sale.productList"
              :key="i"
              :src="
                productStore.products.find(p => p.code === prod.productCode)
                  ?.productImages?.[0]?.productImgUrl
                || '/assets/images/placeholder.png'
              "
              class="img-thumbnail"
              style="width:120px; height:120px; object-fit:cover;"
            />
          </div>

          <div class="card-body text-center">
            <!-- 제목 + 등급 배지 -->
            <h6 class="card-title fw-bold d-flex justify-content-center align-items-center">
              {{ sale.name }}
              <span
                v-if="productStore.products.find(p => p.code === sale.productList[0]?.productCode)?.condition"
                class="badge ms-2"
                :class="conditionColorClass(
                  productStore.products.find(p => p.code === sale.productList[0]?.productCode).condition
                )"
              >
                {{
                  productStore.products.find(p => p.code === sale.productList[0]?.productCode)
                    .condition
                }}
              </span>
            </h6>

            <!-- 설명 -->
            <p class="text-muted text-truncate">{{ sale.description }}</p>

            <!-- 최소 가격·기간 -->
            <p
              v-if="getMinPrice(sale)"
              class="fw-bold mt-2 text-nowrap"
            >
              월 {{ getMinPrice(sale).price.toLocaleString() }}원 /
              {{ getMinPrice(sale).period }}개월
            </p>

            <!-- 구독 수 -->
            <p class="text-secondary">구독 수: {{ sale.subscribeCount }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-section {
  position: relative;
  height: 300px;
  background-color: #c4c9c3;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.text-area {
  position: absolute;
  top: 50%;
  left: 30px;
  transform: translateY(-50%);
  color: #000;
}

.text02 {
  font-size: 2rem;
  font-weight: bold;
}
/* 기본 트랜지션 설정 */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 1;
}

/* 호버 시 살짝 커지면서 떠오르는 효과 */
.card:hover {
  transform: scale(1.03) translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  z-index: 2;
}
</style>
