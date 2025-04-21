<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import { useProductStore } from '../../store/useProductStore'
import { useCategoryStore } from '../../store/useCategoryStore'
import SaleSearch from './SaleSearch.vue'

const route = useRoute()
const router = useRouter()
const saleStore = useSaleStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// 페이징 및 카테고리 상태
const currentPage = ref(0)
const pageSize = 3
const categoryIdx = ref(Number(route.params.categoryIdx))
const selectedDetailCategory = ref(null)

// 검색어 + 등급 필터 상태
const keyword = ref('')
const gradeFilter = ref(null)

// 검색 이벤트 핸들러
function onSearch({ keyword: kw, grade }) {
  keyword.value = kw
  gradeFilter.value = grade
  currentPage.value = 0
}

// 카테고리 하위(detail) 목록
const detailCategories = computed(() =>
  categoryStore.categories.filter(c => c.parentIdx === categoryIdx.value)
)

// 마운트 시 카테고리·상품 로드
onMounted(async () => {
  await categoryStore.fetchCategoryList()
  await productStore.fetchProductList()
})

// route 변경 시 parent category 초기화 및 재로딩
watch(
  () => route.params.categoryIdx,
  async newVal => {
    categoryIdx.value = Number(newVal)
    currentPage.value = 0
    selectedDetailCategory.value = null
    await categoryStore.fetchCategoryList()
  }
)

// detailCategories 변경 시 첫 번째 탭 자동 선택
watch(
  detailCategories,
  cats => {
    if (cats.length > 0) {
      selectedDetailCategory.value = cats[0]
    }
  },
  { immediate: true }
)

// 선택 카테고리, 페이지, 검색어, 등급 필터 변경 시 목록 조회
watch(
  [selectedDetailCategory, currentPage, keyword, gradeFilter],
  ([cat, page, kw, grade]) => {
    if (!cat) return
    saleStore.fetchSaleListByCategory(
      cat.idx,
      page,
      pageSize,
      { keyword: kw, grade }
    )
  },
  { immediate: true }
)

// 페이지 변경 핸들러
function changePage(page) {
  currentPage.value = page
}

// 상세 페이지 이동
function goToDetail(sale) {
  const catId = sale.categoryIdx ?? categoryIdx.value
  router.push(`/sale/detail/${catId}/${sale.idx}`)
}

// 상품 코드로부터 이미지 조회
function findProductByCode(productCode) {
  return productStore.products.find(p => p.code === productCode)
}

// 상태별 배지 클래스
function conditionColorClass(condition) {
  switch (condition) {
    case 'S급': return 'bg-success'
    case 'A급': return 'bg-primary'
    case 'B급': return 'bg-warning text-dark'
    case 'C급': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

// 최저가 조회
function getMinPrice(sale) {
  if (!sale.priceList || sale.priceList.length === 0) return null
  return sale.priceList.reduce((min, p) => p.price < min.price ? p : min, sale.priceList[0])
}

// computed properties
const saleContent = computed(() => saleStore.saleList.content || [])
const totalPages = computed(() => saleStore.saleList.totalPages || 0)
</script>

<template>
  <div class="container-fluid p-0">
    <section class="banner-section">
      <img src="https://rentalcdn.lghellovision.net/uploads/category/l2nml1EqiU.jpg" alt="배너 이미지"
        class="banner-image" />
      <div class="text-area">
        <div class="text01">온 가족이 함께 더 생생한 화질로</div>
        <div class="text02"><strong>TV 렌탈&amp;구독</strong></div>
      </div>
    </section>

    <div class="category-tabs bg-white border-bottom py-4" v-if="detailCategories.length > 0">
      <div class="container d-flex gap-3 flex-wrap">
        <button
          v-for="cat in detailCategories"
          :key="cat.idx"
          @click="selectedDetailCategory = cat"
          class="btn"
          :class="{ 'btn-primary': selectedDetailCategory?.idx === cat.idx, 'btn-light': selectedDetailCategory?.idx !== cat.idx }"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <div class="container py-5">
      <!-- 검색 + 등급 필터 컴포넌트 -->
      <SaleSearch @search="onSearch" />
      <h4 class="fw-bold mb-3">많은 고객님들이 선택한 상품이에요</h4>

      <div v-if="saleContent.length > 0" class="row g-4">
        <div
          v-for="sale in saleContent"
          :key="sale.saleIdx"
          @click="goToDetail(sale)"
          style="cursor:pointer"
          class="col-md-4"
        >
          <div class="card h-100 shadow-sm">
            <div class="d-flex flex-nowrap justify-content-center gap-2 flex-wrap p-2">
              <img
                v-for="(product, pIdx) in sale.productList"
                :key="pIdx"
                :src="findProductByCode(product.productCode)?.productImages?.[0]?.productImgUrl || '/assets/images/placeholder.png'"
                class="img-thumbnail"
                style="width: 120px; height: 120px; object-fit: cover;"
              />
            </div>
            <div class="card-body text-center">
              <h6 class="card-title fw-bold d-flex justify-content-center align-items-center text-nowrap">
                {{ sale.name }}
                <span
                  v-if="findProductByCode(sale.productList[0]?.productCode)?.condition"
                  class="badge ms-2"
                  :class="conditionColorClass(findProductByCode(sale.productList[0]?.productCode)?.condition)"
                >
                  {{ findProductByCode(sale.productList[0]?.productCode)?.condition }}
                </span>
              </h6>
              <p class="card-text text-muted text-nowrap">{{ sale.description }}</p>
              <p v-if="getMinPrice(sale)" class="fw-bold mt-2 text-nowrap">
                월 {{ getMinPrice(sale).price.toLocaleString() }}원 /
                {{ getMinPrice(sale).period }}개월
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-muted py-5">
        해당 카테고리에 등록된 상품이 없습니다.
      </div>

      <div class="text-center mt-4" v-if="totalPages > 1">
        <button
          v-for="n in totalPages"
          :key="n"
          class="btn btn-outline-secondary mx-1"
          :class="{ 'btn-dark': n - 1 === currentPage }"
          @click="changePage(n - 1)"
        >
          {{ n }}
        </button>
      </div>
    </div>

    <div class="position-fixed bottom-0 end-0 p-3 d-flex flex-column align-items-center gap-2">
      <button class="btn btn-outline-secondary rounded-circle">🔍</button>
      <button class="btn btn-dark rounded-circle">TOP</button>
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

.text01 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.text02 {
  font-size: 2rem;
  font-weight: bold;
}

.card img {
  height: 250px;
  object-fit: contain;
}
.sale-search { margin-bottom: 1rem; }
</style>