<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import { useProductStore } from '../../store/useProductStore'

const router = useRouter()
const saleStore = useSaleStore()
const productStore = useProductStore()

// 페이지네이션 상태
const currentPage = ref(0)
const pageSize = 6

// 상세 페이지 이동
function goToDetail(sale) {
  router.push(`/sale/detail/${sale.categoryIdx}/${sale.idx}`)
}

// 최소 가격 계산
function getMinPrice(sale) {
  return sale.priceList?.reduce((min, p) => p.price < min.price ? p : min, sale.priceList[0])
}

// 배지 색 클래스
function conditionColorClass(cond) {
  switch (cond) {
    case 'S급': return 'bg-success'
    case 'A급': return 'bg-primary'
    case 'B급': return 'bg-warning text-dark'
    case 'C급': return 'bg-danger'
    default:    return 'bg-secondary'
  }
}

// 스토어 데이터
const saleContent = computed(() => saleStore.saleList.content || [])
const totalPages  = computed(() => saleStore.saleList.totalPages || 0)

// 페이지 바뀔 때마다 전체 상품 조회
watch(currentPage, (page) => {
  saleStore.fetchAllSales(page, pageSize)
}, { immediate: true })

// 상품 정보 미리 로드
onMounted(() => {
  productStore.fetchProductList()
})
</script>

<template>
  <div class="container py-5">
    <h4 class="fw-bold mb-3">모든 상품을 한눈에</h4>

    <div v-if="saleContent.length" class="row g-4">
      <div
        v-for="sale in saleContent"
        :key="sale.idx"
        class="col-md-4"
        @click="goToDetail(sale)"
        style="cursor:pointer"
      >
        <div class="card h-100 shadow-sm">
          <div class="d-flex flex-nowrap justify-content-center gap-2 flex-wrap p-2">
            <img
              v-for="(prod, i) in sale.productList"
              :key="i"
              :src="productStore.products.find(p => p.code === prod.productCode)?.productImages?.[0]?.productImgUrl || '/assets/images/placeholder.png'"
              class="img-thumbnail"
              style="width:120px; height:120px; object-fit:cover;"
            />
          </div>
          <div class="card-body text-center">
            <h6 class="card-title fw-bold d-flex justify-content-center align-items-center">
              {{ sale.name }}
              <span
                v-if="productStore.products.find(p => p.code === sale.productList[0]?.productCode)?.condition"
                class="badge ms-2"
                :class="conditionColorClass(productStore.products.find(p => p.code === sale.productList[0]?.productCode).condition)"
              >
                {{ productStore.products.find(p => p.code === sale.productList[0]?.productCode).condition }}
              </span>
            </h6>
            <p class="text-muted text-nowrap">{{ sale.description }}</p>
            <p v-if="getMinPrice(sale)" class="fw-bold mt-2 text-nowrap">
              월 {{ getMinPrice(sale).price.toLocaleString() }}원 /
              {{ getMinPrice(sale).period }}개월
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted py-5">
      등록된 상품이 없습니다.
    </div>

    <div class="text-center mt-4" v-if="totalPages > 1">
      <button
        v-for="n in totalPages"
        :key="n"
        class="btn btn-outline-secondary mx-1"
        :class="{ 'btn-dark': n - 1 === currentPage }"
        @click="currentPage = n - 1"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 기존 스타일 그대로 사용 */
</style>
