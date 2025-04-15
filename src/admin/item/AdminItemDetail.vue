<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const productId = route.params.id

const loading = ref(false)
const error = ref(null)

const productDetail = ref({
  productName: '',
  productCode: '',
  productDescription: '',
  manufacturer: '',
  productImageUrl: ''
})

const stockList = ref([])
const savingItemId = ref(null)

const showToast = ref(false)
const toastMessage = ref('')

async function fetchStockDetails() {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get(`/api/admin/item-detail/${productId}`)
    const result = response.data.result

    productDetail.value = result.productDetail

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

onMounted(fetchStockDetails)
</script>

<template>
  <div class="screen">
    <div class="root-wrapper">
      <div class="root">
        <div class="p-3">
          <div class="text-center border-top pt-3 mt-3 mb-4">
            <h5 class="fw-bold mb-0">상품 상세 관리</h5>
          </div>

          <!-- 상품 정보 -->
          <div class="card mb-4 p-3 d-flex flex-row align-items-center gap-4">
            <div class="product-image">
<!--              <img-->
<!--                  :src="productDetail.productImageUrl || '../../../../assets/images/default-image.jpg'"-->
<!--                  alt="상품 이미지"-->
<!--                  style="width: 150px; height: 150px; object-fit: cover;"-->
<!--              />-->
              <img
                  :src="'/assets/images/default-image.jpg'"
                  alt="상품 이미지"
                  style="width: 150px; height: 150px; object-fit: cover;"
              />
            </div>
            <div class="product-info">
              <h5 class="mb-2">{{ productDetail.productName }}</h5>
              <p class="mb-1"><strong>상품 코드:</strong> {{ productDetail.productCode }}</p>
              <p class="mb-1"><strong>제조사:</strong> {{ productDetail.manufacturer }}</p>
              <p class="mb-0"><strong>상품 설명:</strong> {{ productDetail.productDescription }}</p>
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
                  <input
                      type="number"
                      class="form-control form-control-sm me-1"
                      style="width: 70px;"
                      v-model="item.editedCount"
                      :disabled="savingItemId === item.itemIdx"
                  />
                  <button
                      class="btn btn-sm btn-primary"
                      :disabled="savingItemId === item.itemIdx"
                      @click="saveCount(item)"
                  >
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

    <!-- 토스트 -->
    <div
        v-if="showToast"
        class="toast-container position-fixed bottom-0 end-0 p-3"
        style="z-index: 1000;"
    >
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
</style>
