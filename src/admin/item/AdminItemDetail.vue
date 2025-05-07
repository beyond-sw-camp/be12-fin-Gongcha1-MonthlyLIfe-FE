<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import axios from 'axios'
import ItemDetailModal from './ItemDetailModal.vue'

const route = useRoute()
const router = useRouter()
const productId = route.params.id

const loading = ref(false)
const error = ref(null)

const productDetail = ref({
  productName: '',
  productCode: '',
  productDescription: '',
  productDescriptionImageUrl: '',
  manufacturer: '',
  productImages: [],
})

const stockList = ref([])
const savingItemId = ref(null)

const showToast = ref(false)
const toastMessage = ref('')

const showEditModal = ref(false)
const selectedSale = ref(null)
const saleStore = useSaleStore()

// 이 상품을 포함한 판매만 골라내는 computed
const filteredSales = computed(() =>
  saleStore.saleProducts.filter(sale =>
    sale.productList.some(p => p.productCode === productId)
  )
)

// 1) 클라이언트 사이드 페이징 변수
const currentPage = ref(1)
const pageSize = ref(5)
const totalPages = computed(() =>
  Math.ceil(filteredSales.value.length / pageSize.value)
)
const pagedSales = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredSales.value.slice(start, start + pageSize.value)
})

// 2) 페이지 이동 함수
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}


// async function fetchStockDetails() {
//   loading.value = true
//   error.value = null

//   try {
//     const response = await axios.get(`/api/admin/item-detail/${productId}`)
//     const result = response.data.result

//     // productDetail.value = result.productDetail
//     productDetail.value = {
//       ...result.productDetail,
//       productImages: result.productDetail.productImages || []
//     }

//     stockList.value = result.dtoList.map(item => ({
//       ...item,
//       editedCount: item.itemCount
//     }))
//   } catch (err) {
//     console.error(err)
//     error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
//   } finally {
//     loading.value = false
//   }
// }

async function fetchStockDetails() {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get(`/api/admin/item-detail/${productId}`)
    console.log('▶ item-detail payload:', response.data.result.productDetail)
    const result = response.data.result
    const pd = result.productDetail

    // productDetail 에 로컬 키와 백엔드 키를 매핑
    productDetail.value = {
      productName: pd.productName,
      productCode: pd.productCode,
      productDescription: pd.productDescription,
      productDescriptionImageUrl: pd.productDescriptionImageUrl,
      manufacturer: pd.manufacturer,
      productImages: pd.productImages || []
    }

    // 재고 리스트 초기화 (editedCount 포함)
    stockList.value = result.dtoList.map(item => ({
      ...item,
      editedCount: item.itemCount
    }))
  } catch (err) {
    console.error(err)
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}


async function saveCount(item) {
  try {
    savingItemId.value = item.itemIdx

    await axios.patch(`/api/admin/item-detail/${item.itemIdx}`, {
      count: item.editedCount
    })


    item.stockCount = item.editedCount
    showSuccessToast('저장되었습니다!')
  } catch (error) {
    console.error(error)
    showSuccessToast('저장 중 오류가 발생했습니다.')
  } finally {
    savingItemId.value = null
  }
}

function showSuccessToast(message) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

function goBack() {
  router.back()
}



onMounted(fetchStockDetails)
function getProductCondition(sale) {
  const entry = sale.productList.find(p => p.productCode === productId)
  return entry?.conditionName || entry?.conditionIdx || '—'
}

function handleEdit(sale) {
  selectedSale.value = sale
  showEditModal.value = true
}

/**
* 모달에서 저장 완료 시 발생시키는 이벤트
*/
function onSaleUpdated() {
  saleStore.fetchSaleProductsList(0,5)
  showSuccessToast('수정이 완료되었습니다!')
}


// 판매상품 삭제
async function handleDelete(saleIdx) {
  if (!confirm('정말 이 판매상품을 삭제하시겠습니까?')) return
  try {
    await saleStore.deleteSale(saleIdx)
    showSuccessToast('삭제되었습니다!')
  } catch {
    showSuccessToast('삭제 중 오류가 발생했습니다.')
  }
}


// onMounted(async () => {
//   await saleStore.fetchSaleProductList()
//   fetchStockDetails()
// })

 onMounted(async () => {
   loading.value = true
   try {
     // ① 전체 판매상품(넉넉한 사이즈) 불러오기
     await saleStore.fetchSaleProductsList(0, 1000)
     // ② 재고/상품 상세 불러오기
     await fetchStockDetails()
   } catch (e) {
     console.error(e)
     error.value = '초기 데이터 로드 중 오류가 발생했습니다.'
   } finally {
     loading.value = false
   }
 })
</script>

<template>
  <div class="screen">
    <div class="root-wrapper">
      <div class="root">
        <div class="p-3">
          <div class="text-center border-top pt-3 mt-3 mb-4">
            <h5 class="fw-bold mb-0">상품 재고 상세 관리</h5>
          </div>

          <!-- 상품 정보 -->
          <div class="card mb-4 p-3 d-flex flex-row align-items-center gap-4">
            <div class="product-image">

              <img v-if="productDetail.productImages && productDetail.productImages.length"
                :src="productDetail.productImages[0].productImgUrl" alt="상품 이미지"
                style="width:150px; height:150px; object-fit:cover;" />
            </div>
            <div class="product-info">
              <h5 class="mb-2">{{ productDetail.productName }}</h5>
              <p class="mb-1"><strong>상품 코드:</strong> {{ productDetail.productCode }}</p>
              <p class="mb-1"><strong>제조사:</strong> {{ productDetail.manufacturer }}</p>
              <p class="mb-0"><strong>상품 설명:</strong> {{ productDetail.productDescription }}</p>


            </div>
          </div>

          <div class="card mb-4 p-3 d-flex flex-row align-items-center gap-4">
            <div class="mt-2 d-flex justify-content-center w-100">
              <img :src="productDetail.productDescriptionImageUrl || ''" alt="설명 이미지"
                style="max-width:100%; height:auto; object-fit:cover; margin-top:0.5rem" />
            </div>
          </div>


          <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- 재고 테이블 -->
          <table v-if="!loading" class="table table-bordered table-hover text-center">
            <thead>
              <tr>
                <th>상태</th>
                <th>창고명</th>
                <th>재고 수량</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in stockList" :key="item.itemIdx">
                <td>{{ item.conditionName }}</td>
                <td>{{ item.locationName }}</td>
                <td>
                  <div class="d-flex justify-content-center align-items-center">
                    <input type="number" class="form-control form-control-sm me-1" style="width: 70px;"
                      v-model="item.editedCount" :disabled="savingItemId === item.itemIdx" />
                    <button class="btn btn-sm btn-primary" :disabled="savingItemId === item.itemIdx"
                      @click="saveCount(item)">
                      저장
                    </button>
                  </div>
                </td>
                <td>{{ item.createdAt.split('T')[0] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <h5 class="text-center fw-bold mb-3">해당 상품 판매 현황</h5>

      <div v-if="filteredSales.length === 0" class="text-muted">
        판매 내역이 없습니다.
      </div>

      <ul v-else class="list-group">
        <!-- pagedSales 로 바꾸고, key는 sale.idx -->
        <li v-for="sale in pagedSales" :key="sale.idx"
          class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ sale.name }}</strong>
            <small class="badge bg-secondary ms-2">{{ getProductCondition(sale) }}</small>
            <div class="text-muted small">상품 번호: {{ sale.idx }}</div>
          </div>
          <div class="d-flex align-items-center">
            <div class="text-end small me-3">
              <template v-for="p in sale.priceList" :key="p.period">
                {{ p.period }}개월: {{ p.price.toLocaleString() }}원<br />
              </template>
            </div>
            <button @click="handleEdit(sale)" class="btn btn-sm btn-outline-primary me-2">수정</button>
            <button class="btn btn-sm btn-outline-danger" @click="handleDelete(sale.idx)">
              삭제
            </button>
          </div>
        </li>
      </ul>

      <!-- 페이지네이션 -->
      <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-3">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">‹</a>
          </li>
          <li v-for="n in totalPages" :key="n" class="page-item" :class="{ active: currentPage === n }">
            <a class="page-link" href="#" @click.prevent="goToPage(n)">{{ n }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">›</a>
          </li>
        </ul>
      </nav>
    </div>
    <!-- AdminItemDetail.vue -->
    <ItemDetailModal :sale="selectedSale" :show="showEditModal" @update:show="showEditModal = $event"
      @updated="onSaleUpdated" @error="err => showSuccessToast('수정 중 오류가 발생했습니다.')" />

    <!-- 토스트 -->
    <div v-if="showToast" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1000;">
      <div class="toast align-items-center text-white bg-primary border-0 show">
        <div class="d-flex">
          <div class="toast-body">{{ toastMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root {
  font-size: 12px;
}

.table {
  font-size: 14px;
}

/* 판매 목록 컨테이너 여백 (좌우 여백 조금) */
.list-group {
  padding: 1rem;
  /* 좌우·상하 여백 */
  margin: 0;
  /* 기본 리스트 마진 제거 */
}

/* 각 판매 아이템 사이 간격 */
.list-group-item {
  margin-bottom: 1rem;
  /* 아래쪽 여백 */
  padding: 1rem 1.5rem;
  /* 상하 1rem, 좌우 1.5rem */
  border-radius: 8px;
  /* 모서리 둥글게 */
  transition: background 0.2s;
}

/* 마지막 아이템은 아래쪽 마진 제거 */
.list-group-item:last-child {
  margin-bottom: 0;
}

/* 호버 시 살짝 배경 강조 */
.list-group-item:hover {
  background-color: #f1f1f1;
}
</style>
