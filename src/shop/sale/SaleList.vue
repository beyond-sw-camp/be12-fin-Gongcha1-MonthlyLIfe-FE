<script setup>
import {ref, onMounted, watch, computed, onBeforeUnmount} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import { useCategoryStore } from '../../store/useCategoryStore'
import SaleSearch from './SaleSearch.vue'

const route = useRoute()
const router = useRouter()
const saleStore = useSaleStore()
const categoryStore = useCategoryStore()

// 페이징 및 카테고리 상태
const currentPage = ref(0)
const pageSize = 15
const categoryIdx = ref(Number(route.params.categoryIdx))
const selectedDetailCategory = ref(null)
const displayList = ref([])
const scrollEnd = ref(false)

// 검색어 + 등급 필터 상태
const keyword = ref('')
const gradeFilter = ref('')

// 검색 이벤트 핸들러
const onSearch = ({ keyword: kw, grade }) => {
  keyword.value = kw
  gradeFilter.value = grade
  currentPage.value = 0
}

// 카테고리 하위(detail) 목록
const detailCategories = computed(() =>
  categoryStore.categories.filter(c => c.parentIdx === categoryIdx.value)
)
// query 에서 detailIdx 읽기 (문자열 → 숫자)
const detailIdx = computed(() => {
  const d = route.query.detail
  return d != null ? Number(d) : null
})

const loadMore = async () => {
  const cat = selectedDetailCategory.value;
  if (!cat || typeof cat.idx !== 'number') return
  const next = await saleStore.fetchSaleListByCategory(cat.idx, currentPage.value, pageSize,
      {keyword: keyword.value, grade: gradeFilter.value})
  console.log(currentPage.value);
  console.log(next)
  console.log(displayList.value);
  if (!next.empty) {
    displayList.value.push(...next.content)
    currentPage.value++
  }
  else {
    scrollEnd.value = true;
  }
}
let isLoading = false;
const onScroll = async () => {

  if(scrollEnd.value|| isLoading) return;
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const docHeight = document.documentElement.scrollHeight

  if (scrollTop + windowHeight >= docHeight - document.querySelector('.footer-wrapper').offsetHeight) {
    isLoading = true;
    try {
      await loadMore();
    }
    finally {
      isLoading = false;
    }
  }
}



onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
// 마운트 시 카테고리·상품 로드
onMounted(async () => {
  await categoryStore.fetchCategoryList()
  window.addEventListener('scroll', onScroll)
})

// route 변경 시 parent category 초기화 및 재로딩
watch(
  () => route.params.categoryIdx,
  async newVal => {
    categoryIdx.value = Number(newVal)
    currentPage.value = 0
    displayList.value = []
    scrollEnd.value = false
    selectedDetailCategory.value = null
    await categoryStore.fetchCategoryList()
  }
)

// detailCategories 변경 시 첫 번째 탭 자동 선택
// watch(
//   detailCategories,
//   cats => {
//     if (cats.length > 0) {
//       selectedDetailCategory.value = cats[0]
//     }
//   },
//   { immediate: true }
// )
// detailCategories 또는 URL query(detail) 변경 시
watch(
  [detailCategories, detailIdx],
  ([cats, d]) => {
    if (!cats.length) return
    // detailIdx 가 있으면 그 값을, 없으면 첫 번째 탭 idx
    const target = d != null && cats.some(c => c.idx === d)
      ? d
      : cats[0].idx
    selectedDetailCategory.value =
      cats.find(c => c.idx === target) || cats[0]
    currentPage.value = 0
    displayList.value = []
    scrollEnd.value = false
  },
  { immediate: true }
)
// 선택 카테고리, 검색어, 등급 필터 변경 시 목록 조회
watch(
  [selectedDetailCategory, keyword, gradeFilter],
  async ([cat, kw, grade]) => {
    console.log("hi");
    console.log(cat);
    if (!cat || typeof cat.idx !== 'number') return

    currentPage.value = 0
    displayList.value = []
    scrollEnd.value = false
    await loadMore()

  },
  { immediate: true }
)

// 페이지 변경 핸들러
const changePage = (page) => {
  currentPage.value = page
}

// 상세 페이지 이동
const goToDetail = (sale) => {
  const catId = sale.categoryIdx ?? categoryIdx.value
  router.push(`/sale/detail/${catId}/${sale.idx}`)
}

// 상태별 배지 클래스
const conditionColorClass = (condition) => {
  switch (condition) {
    case 'S급': return 'bg-success'
    case 'A급': return 'bg-primary'
    case 'B급': return 'bg-warning text-dark'
    case 'C급': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

// 최저가 조회
const getMinPrice = (sale) => {
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
        <div class="text01">필요할 때, 필요한 만큼</div>
        <div class="text02"><strong>렌탈&amp;구독</strong></div>
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

      <div v-if="displayList.length > 0" class="row g-4">
          <div
              v-for="sale in displayList"
              :key="sale.saleIdx"
              @click="goToDetail(sale)"
              style="cursor:pointer"
              class="col-md-4"
          >
            <div class="card h-100 shadow-sm">
              <!--            이미지-->
              <div class="d-flex flex-nowrap justify-content-center gap-2 flex-wrap p-2">
                <img
                    :src="sale.imageUrl || '/assets/images/placeholder.png'"
                    class="img-thumbnail"
                    style="width: 120px; height: 120px; object-fit: cover;"
                />
              </div>

              <!--            내용-->
              <div class="card-body text-center">


                <!--              이름-->
                <h6 class="card-title fw-bold text-wrap text-break text-center">
                  {{ sale.name }}

                  <!--                등급 태그-->
                  <span
                      v-if="sale.conditionName !== null"
                      class="badge ms-2"
                      :class="conditionColorClass(sale.conditionName)"
                  >
                  {{ sale.conditionName }}
                </span>
                </h6>

                <!--              가격-->
                <!-- <p class="card-text text-muted text-nowrap">{{ sale.description }}</p> -->
                 <p class="text-muted description-truncate">{{ sale.description }}</p>
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
.description-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 줄 수 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}
</style>