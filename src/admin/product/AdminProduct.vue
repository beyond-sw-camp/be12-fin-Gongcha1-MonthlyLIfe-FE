<!-- AdminProduct.vue -->
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useProductStore } from '../../store/useProductStore'
import ProductModal from './ProductModal.vue'

const store = useProductStore()

onMounted(() => {
  store.fetchProductList()
})

const search = reactive({
  productId: '',
  productName: ''
})

const currentPage = ref(1)
const pageSize = 10

const filteredData = computed(() =>
  store.products.filter(item =>
    item.code.includes(search.productId) &&
    item.name.includes(search.productName)
  )
)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})
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
const totalPages = computed(() =>
  Math.ceil(filteredData.value.length / pageSize)
)

function filterList() {
  currentPage.value = 1
}

function goToPage(page) {
  currentPage.value = page
}
</script>

<template>
  <div class="screen">
    <div class="root-wrapper">
      <div class="root">
        <!-- (필터 UI 생략) -->

        <!-- 등록 버튼 -->
        <div class="d-flex justify-content-end px-3 my-2">
          <button
            class="btn btn-success btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#registerModal"
          >
            상품 등록
          </button>
        </div>

        <!-- 상품 테이블 -->
        <div class="p-3">
          <div class="text-center border-top pt-3 mt-3 mb-2">
            <h5 class="fw-bold mb-0">상품관리</h5>
          </div>
          <table class="table table-bordered table-hover text-center">
            <thead class="custom-thead">
              <tr>
                <th>상품 코드</th>
                <th>상품명</th>
                <th>설명</th>
                <th>제조사</th>
                <th>이미지</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginatedData" :key="item.code">
                <td>{{ item.code }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.manufacturer }}</td>
                <td>
                  <img
                    v-for="(img, idx) in item.productImages"
                    :key="idx"
                    :src="img.productImgUrl"
                    alt="product"
                    style="width:50px; height:50px; object-fit:cover; margin-right:4px"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 페이지네이션 -->
          <nav class="d-flex justify-content-center">
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ disabled: currentPage === 1 }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="currentPage--"
                >‹</a>
              </li>
              <li
                class="page-item"
                v-for="page in paginatedPages"
                :key="page"
                :class="{ active: page === currentPage }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="goToPage(page)"
                >{{ page }}</a>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="currentPage++"
                >›</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- 상품 등록 모달 -->
  <ProductModal @registered="filterList" />
</template>

<style scoped>
.root { font-size:12px }
.table { font-size:14px }
.custom-thead th { background-color:#DFF0D8 !important }
</style>
