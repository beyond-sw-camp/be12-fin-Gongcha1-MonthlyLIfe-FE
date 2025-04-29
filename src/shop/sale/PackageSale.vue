<!-- src/views/PackageSale.vue -->
<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import { useProductStore } from '../../store/useProductStore'

const router = useRouter()
const saleStore = useSaleStore()
const productStore = useProductStore()

// 페이징
const currentPage = ref(0)
const pageSize = 6

// 패키지 특가 데이터
const packageContent = computed(() => saleStore.packageList.content || [])
const totalPages = computed(() => saleStore.packageList.totalPages || 0)

// 상세 페이지 이동
function goToDetail(pkg) {
  router.push(`/sale/detail/${pkg.categoryIdx}/${pkg.saleIdx}`)
}

// 최소 가격·기간 계산 (Sale.vue와 동일)
function getMinPrice(sale) {
  return sale.priceList?.reduce(
    (min, p) => (p.price < min.price ? p : min),
    sale.priceList[0]
  )
}

// 등급 배지 색 클래스
function conditionColorClass(cond) {
  switch (cond) {
    case 'S급': return 'bg-success'
    case 'A급': return 'bg-primary'
    case 'B급': return 'bg-warning text-dark'
    case 'C급': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

// 마운트 시 상품과 패키지 데이터 로드
onMounted(() => {
  productStore.fetchProductList()
})
watch(currentPage, page => {
  saleStore.fetchPackageSales(page, pageSize)
}, { immediate: true })
</script>

<template>
   <div container-fluid p-0>
    <section class="banner-section">
      <img src="https://rentalcdn.lghellovision.net/uploads/category/l2nml1EqiU.jpg" alt="배너 이미지"
        class="banner-image" />
      <div class="text-area">
        <div class="text02"><strong>더 알뜰하게, 더 편리하게</strong></div>
      </div>
    </section>
  </div>
  <div class="container py-5">
    <h4 class="fw-bold mb-4">🎁 패키지 특가 상품</h4>


    <div v-if="packageContent.length" class="row g-4">
      <div v-for="pkg in packageContent" :key="pkg.saleIdx" class="col-md-4" @click="goToDetail(pkg)"
        style="cursor:pointer">
        <div class="card h-100 shadow-sm">
          <!-- 이미지 래퍼: Sale.vue와 동일하게 -->
          <div class="d-flex flex-nowrap justify-content-center gap-2 flex-wrap p-2">
            <img v-for="(prod, i) in pkg.productList" :key="i"
              :src="productStore.products.find(p => p.code === prod.productCode)?.productImages?.[0]?.productImgUrl || '/assets/images/placeholder.png'"
              class="img-thumbnail" style="width:120px; height:120px; object-fit:cover;" />
          </div>
          <!-- 이하 동일 -->
          <div class="card-body text-center">
            <h6 class="card-title fw-bold d-flex justify-content-center align-items-center">
              {{ pkg.name }}
              <span v-if="productStore.products.find(p => p.code === pkg.productList[0]?.productCode)?.condition"
                class="badge ms-2"
                :class="conditionColorClass(productStore.products.find(p => p.code === pkg.productList[0]?.productCode).condition)">
                {{productStore.products.find(p => p.code === pkg.productList[0]?.productCode).condition}}
              </span>
            </h6>
            <p class="text-muted text-nowrap">{{ pkg.description }}</p>
            <p v-if="getMinPrice(pkg)" class="fw-bold mt-2 text-nowrap">
              월 {{ getMinPrice(pkg).price.toLocaleString() }}원 /
              {{ getMinPrice(pkg).period }}개월
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted py-5">
      등록된 상품이 없습니다.
    </div>

    <!-- 페이징도 동일 -->
    <div class="text-center mt-4" v-if="totalPages > 1">
      <button v-for="n in totalPages" :key="n" class="btn btn-outline-secondary mx-1"
        :class="{ 'btn-dark': n - 1 === currentPage }" @click="currentPage = n - 1">
        {{ n }}
      </button>
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