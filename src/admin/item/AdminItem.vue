<script setup>
import {ref, reactive, onMounted, computed} from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'
import ItemModal from './itemModal.vue';

const router = useRouter()

const today = new Date().toISOString().split("T")[0]

const search = reactive({
  productId: '',
  productName: '',
  seller: '',
  searchType: 'productName', // 기본값
  searchQuery: '',
  startDate: '',
  endDate: ''
})

const currentPage = ref(1)
const pageSize = 10
const totalPages = ref(1)
const products = ref([])
const loading = ref(false)
const error = ref(null)
const savingItemId = ref(null)

const showToast = ref(false)
const toastMessage = ref('')

// ✅ API 수정: /api/admin/product
async function fetchProducts() {
  loading.value = true
  error.value = null

const params = {
  page: currentPage.value - 1,
  size: pageSize,
  startDate: search.startDate,
  endDate: search.endDate
}

// 👉 searchType에 따라 조건 파라미터 동적 할당
if (search.searchType === 'productName') {
  params.productName = search.searchQuery
} else if (search.searchType === 'manufacturer') {
  params.manufacturer = search.searchQuery
}


  try {
    const response = await axios.get('/api/admin/product-by-page', {
   params
    })
    const result = response.data.result
    products.value = result.content
    totalPages.value = result.totalPages
  } catch (err) {
    console.error(err)
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}

const visiblePageCount = 10

const paginatedPages = computed(() => {
  const pages = []
  const start = Math.floor((currentPage.value - 1) / visiblePageCount) * visiblePageCount + 1
  const end = Math.min(start + visiblePageCount - 1, totalPages.value)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})


function refreshList() {
   currentPage.value = 1
   fetchProducts()
 }
function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchProducts()
}

function showSuccessToast(message) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

onMounted(fetchProducts)

function goToDetailPage(item) {
  router.push(`/admin/item-detail/${item.productCode}`)
}
</script>

<template>
  <div class="screen bg-light">
    <div class="root-wrapper">
      <div class="root">
        <!-- 검색 조건 -->
        <div class="bg-white rounded shadow-sm p-3 mb-3">
          <div class="d-flex flex-wrap gap-3 align-items-start">
            <div class="flex-grow-1">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                <div class="d-flex align-items-center gap-1">
                  <label class="form-label mb-0 text-nowrap">상품 등록일</label>
                  <!--                  <div class="dropdown">-->
                  <!--                    <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">-->
                  <!--                      상품 등록일-->
                  <!--                    </button>-->
                  <!--                    <ul class="dropdown-menu">-->
                  <!--                      <li><a class="dropdown-item" href="#">상품 등록일</a></li>-->
                  <!--                      <li><a class="dropdown-item" href="#">상품 등록일2</a></li>-->
                  <!--                    </ul>-->
                  <!--                  </div>-->
                  <!--                  <button type="button" class="btn btn-sm btn-primary">전체</button>-->
                </div>
                <div class="d-flex align-items-center gap-1">
                  <input type="date" class="form-control form-control-sm" v-model="search.startDate" style="max-width: 140px;">
                  <span>~</span>
                  <input type="date" class="form-control form-control-sm" v-model="search.endDate" style="max-width: 140px;">

                </div>
                <div class="d-flex align-items-center gap-1 flex-nowrap">
                  <label class="form-label mb-0 text-nowrap" style="font-size: 12px">검색 구분</label>
                  <div class="dropdown">
                    <select v-model="search.searchType" class="form-select form-select-sm" style="min-width: 100px;">
                      <option value="productName">상품명</option>
                      <option value="manufacturer">제조사</option>
                    </select>

                  </div>
                  <input
                      type="text"
                      v-model="search.searchQuery"
                      @keyup.enter="fetchProducts"
                      class="form-control form-control-sm"
                      placeholder="검색어"
                      style="max-width: 200px;"
                  >
                </div>
              </div>
            </div>
            <div class="align-self-start">
              <button type="button" class="btn btn-primary" @click="fetchProducts">검색</button>
            </div>
          </div>
        </div>

        <!-- 전체 감싸기: 흰색 배경 카드 -->
        <div class="bg-white rounded shadow-sm p-3">
          <!-- 제목 영역 -->
          <div class="text-center border-top pt-3 mt-3 mb-2">
            <h5 class="fw-bold mb-0">상품 관리</h5>
          </div>

          <!-- 상품 등록 버튼 -->
          <div class="d-flex justify-content-end px-3 my-2">
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#registerModal">
              + 상품 등록
            </button>
          </div>

          <!-- 데이터 영역 -->
          <div class="p-3">
            <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

          <!-- ✅ 테이블 수정 -->
          <table v-if="!loading" class="table table-bordered table-hover text-center product-table">
            <thead class="custom-thead">
            <tr>
              <th>상품코드</th>
              <th>상품명</th>
              <th>이미지</th>
              <th>제조사</th>
              <th>전체 재고</th>
              <th>가용 재고</th>
              <th>등록일</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="products.length === 0">
              <td colspan="5">데이터가 없습니다.</td>
            </tr>
            <tr v-for="item in products" :key="item.productCode" style="cursor: pointer;" @click="goToDetailPage(item)">
              <td>{{ item.productCode }}</td>
              <td>{{ item.productName }}</td>
              <td>
                  <img
                    v-for="(img, idx) in item.productImages"
                    :key="idx"
                    :src="img.productImgUrl"
                    alt="product"
                    style="width:50px; height:50px; object-fit:cover; margin-right:4px"
                  />
                </td>
              <td>{{ item.manufacturer }}</td>
              <td>{{ item.totalStockCount ?? '-' }}</td>
              <td>{{ item.availableStockCount ?? '-' }}</td>
              <td>{{ item.createdAt.split('T')[0] }}</td>
            </tr>
            </tbody>
          </table>

            <nav v-if="!loading && products.length > 0" class="d-flex justify-content-center">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">‹</a>
                </li>
                <li v-for="page in paginatedPages" :key="page" :class="{ active: page === currentPage }" class="page-item">
                  <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">›</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 토스트 -->
    <div v-if="showToast" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1000;">
      <div class="toast align-items-center text-white bg-primary border-0 show">
        <div class="d-flex">
          <div class="toast-body">{{ toastMessage }}</div>
        </div>
      </div>
    </div>
  </div>


  <!-- 상품 등록 모달 -->
  <ItemModal @registered="refreshList" />

</template>

<style scoped>
.root {
  font-size: 12px;
}

.table {
  font-size: 14px;
}

.product-table th {
  background-color: #FFF8DE;
}
</style>