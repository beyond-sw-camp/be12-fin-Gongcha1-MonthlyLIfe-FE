<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const currentPage = ref(1)
const pageSize = 10
const totalPages = ref(1)
const subscribeList = ref([])
const loading = ref(false)
const error = ref(null)

// 🔍 검색 조건
const search = reactive({
  keyword: '',
  status: '',
  minMonths: '',
  maxMonths: ''
})

const fetchSubscribes = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get('/api/admin/subscribe', {
      params: {
        page: currentPage.value - 1,
        size: pageSize,
        keyword: search.keyword || null,
        status: search.status || null,
        minMonths: search.minMonths !== '' ? search.minMonths : null,
        maxMonths: search.maxMonths !== '' ? search.maxMonths : null
      }
    })

    const result = response.data.result
    subscribeList.value = result.content
    totalPages.value = result.totalPages
  } catch (err) {
    console.error(err)
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}


function goToDetail(subscribeId) {
  router.push(`/admin/subscribe-detail/${subscribeId}`)
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchSubscribes()
  }
}

function searchSubmit() {
  currentPage.value = 1
  fetchSubscribes()
}

onMounted(fetchSubscribes)
</script>

<template>
  <div class="screen bg-light">
      <!-- 🔍 검색 옵션 영역 -->
      <div class="bg-white rounded shadow-sm p-3 mb-3">
        <div class="d-flex flex-wrap gap-3 align-items-start">
          <div class="flex-grow-1">
            <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
              <div class="d-flex align-items-center gap-1">
                <label class="form-label mb-0 text-nowrap">통합 검색</label>
                <input v-model="search.keyword" type="text" class="form-control form-control-sm" placeholder="이름, ID 등" style="max-width: 200px;">
              </div>
              <div class="d-flex align-items-center gap-1">
                <label class="form-label mb-0 text-nowrap">구독 상태</label>
                <select v-model="search.status" class="form-select form-select-sm" style="max-width: 140px;">
                  <option value="">전체</option>
                  <option value="SUBSCRIBING">SUBSCRIBING</option>
                  <option value="RETURNING">RETURNING</option>
                  <option value="CANCELED">CANCELED</option>
                </select>
              </div>
              <div class="d-flex align-items-center gap-1">
                <label class="form-label mb-0">구독 상품 갯수</label>
                <input v-model="search.minMonths" type="number" class="form-control form-control-sm" placeholder="최소" style="width: 80px;">
                <span>~</span>
                <input v-model="search.maxMonths" type="number" class="form-control form-control-sm" placeholder="최대" style="width: 80px;">
              </div>
            </div>
          </div>
          <div class="align-self-start">
            <button class="btn btn-primary btn-sm" @click="searchSubmit">검색</button>
          </div>
        </div>
      </div>

      <!-- 🔸 카드 영역 -->
      <div class="bg-white rounded shadow-sm p-3">
        <div class="text-center border-top pt-3 mt-3 mb-3">
          <h5 class="fw-bold mb-0">구독 관리</h5>
        </div>

        <div v-if="loading" class="text-center my-4">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

        <table class="table table-bordered table-hover text-center" v-if="!loading">
          <thead class="table-light">
          <tr>
            <th>구독 ID</th>
            <th>구독자명</th>
            <th>요금제</th>
            <th>구독 상태</th>
            <th>연체 여부</th>
            <th>가입일자</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="sub in subscribeList" :key="sub.subscribeId" @click="goToDetail(sub.subscribeId)" style="cursor:pointer">
            <td>{{ sub.subscribeId }}</td>
            <td>{{ sub.userName }}</td>
            <td>{{ sub.planPrice }}원</td>
            <td>{{ sub.status }}</td>
            <td>{{ sub.overdue }}</td>
            <td>{{ sub.joined }}</td>
          </tr>
          <tr v-if="subscribeList.length === 0">
            <td colspan="6" class="text-center">데이터가 없습니다.</td>
          </tr>
          </tbody>
        </table>

        <nav v-if="totalPages > 1" class="d-flex justify-content-center">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">‹</a>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">›</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
</template>

<style scoped>
.screen {
  background-color: #f8f9fa;
  padding: 20px;
  min-height: 100vh;
}
.table {
  font-size: 14px;
}
.table thead th {
  background-color: #e9f7ef;
}
</style>