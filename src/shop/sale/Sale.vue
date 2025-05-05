<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import { useProductStore } from '../../store/useProductStore'

const router = useRouter()
const route = useRoute()
const saleStore = useSaleStore()
const productStore = useProductStore()

// 초기 페이지 & 사이즈
const currentPage = ref(route.query.page ? Number(route.query.page) : 0)
const pageSize = 6

// 검색어는 이제 `keyword` 파라미터로
const keyword = computed(() => route.query.keyword || '')

// 상세 페이지 이동
const goToDetail = (sale) => {
  router.push(`/sale/detail/${sale.categoryIdx}/${sale.idx}`)
}

// 최소 가격 계산
const getMinPrice = (sale) => {
  return sale.priceList?.reduce((min, p) => (p.price < min.price ? p : min), sale.priceList[0])
}

// 등급 배지 색 클래스
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

// 데이터 불러오기 공통
function loadData(page, kw) {
  if (kw) {
    saleStore.fetchSalesByKeyword(page, pageSize, kw)
  } else {
    saleStore.fetchAllSales(page, pageSize)
  }
}

// 페이지 또는 검색어 변경 시 URL과 데이터를 함께 갱신
watch([currentPage, keyword], ([page, kw]) => {
  router.replace({
    query: {
      ...(kw ? { keyword: kw } : {}),
      ...(page ? { page: page } : {})
    }
  })
  loadData(page, kw)
}, { immediate: true })

// 페이지 버튼 클릭 핸들러
function goPage(page) {
  currentPage.value = page
}

// 미리 상품 리스트 로드
onMounted(() => {
  productStore.fetchProductList()
})
</script>

<template>
  <!-- <div class="container-fluid p-0"> -->
    <section class="banner-section">
      <img
        src="https://rentalcdn.lghellovision.net/uploads/category/l2nml1EqiU.jpg"
        alt="배너 이미지"
        class="banner-image"
      />
      <div class="text-area">
        <div class="text02"><strong>원하는 모든 제품, 렌탈로 쉽게</strong></div>
      </div>
    </section>

    <div class="container py-5">
      <h4 class="fw-bold mb-3">
        {{ keyword ? `"${keyword}" 검색 결과` : '모든 상품을 한눈에' }}
      </h4>

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
                :src="
                  productStore.products.find(p => p.code === prod.productCode)
                    ?.productImages?.[0]?.productImgUrl ||
                  '/assets/images/placeholder.png'
                "
                class="img-thumbnail"
                style="width:120px; height:120px; object-fit:cover;"
              />
            </div>
            <div class="card-body text-center">
              <h6 class="card-title fw-bold d-flex justify-content-center align-items-center">
                {{ sale.name }}
                <span
                  v-if="
                    productStore.products.find(p => p.code === sale.productList[0]?.productCode)
                      ?.condition
                  "
                  class="badge ms-2"
                  :class="
                    conditionColorClass(
                      productStore.products.find(p => p.code === sale.productList[0]?.productCode)
                        .condition
                    )
                  "
                >
                  {{
                    productStore.products.find(p => p.code === sale.productList[0]?.productCode)
                      .condition
                  }}
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
          @click="goPage(n - 1)"
        >
          {{ n }}
        </button>
      </div>
    </div>
  <!-- </div> -->
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
