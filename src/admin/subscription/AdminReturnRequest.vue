<script setup>
import {ref, reactive, onMounted, watch, computed} from 'vue'
import axios from 'axios'

const today = new Date().toISOString().split('T')[0]
const currentPage = ref(1)
const pageSize = 10
const totalPages = ref(1)
const requests = ref([])
const loading = ref(false)
const error = ref(null)

const search = reactive({
  type: 'RETURN', // 'REPAIR' or 'RETURN'
  dateFrom: '',
  dateTo: '',
  status: 'RETURN_REQUESTED',
})



function getTypePath(status) {
  if (status.startsWith('REPAIR')) return 'repair';
  if (status.startsWith('RETURN')) return 'return';
  return '';
}
async function fetchRequests() {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get(`/api/admin/${getTypePath(search.status)}-request`, {
      params: {
        page: currentPage.value - 1,
        size: pageSize,
        dateFrom: search.dateFrom || null,
        dateTo: search.dateTo || null,
        status: search.status || null
      }
    })
    const result = response.data.result
    requests.value = result.content
    totalPages.value = result.totalPages
  } catch (err) {
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
watch(() => search.status, (newStatus) => {
  if (newStatus.startsWith('REPAIR')) {
    search.type = 'repair'
  } else if (newStatus.startsWith('RETURN')) {
    search.type = 'return'
  } else {
    search.type = ''
  }
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

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchRequests()
}

function markAsCompleted(item) {
  axios.post(`/api/admin/${getTypePath(search.status)}/${item.id}`
      ,{
    status: item.status,
    returnLocation: item.returnLocation
      } ,
      {headers: {
    'Content-Type': 'application/json'
  }})
      .then(() => fetchRequests())
      .catch(err => console.error('상태 변경 실패', err))
}

function filterList() {
  currentPage.value = 1
  fetchRequests()
}

onMounted(() => {
  fetchRequests();

  // requests.value = [{
  //   id: 'id',
  //   userName: '이름',
  //   description: '설명',
  //   createdAt:  '2025-04-24 12',
  //   status: 'REQUESTED',
  //   returnLocation: 'BEFORE_RETURN',
  // }]
});



</script>

<template>
  <div class="screen p-4 bg-light">
    <div class="bg-white p-3 rounded shadow-sm mb-3">
      <div class="d-flex flex-wrap gap-3 align-items-center">
        <div class="d-flex gap-2">
          <!-- 대분류 필터: RETURN / REPAIR -->
          <select v-model="search.status" class="form-select form-select-sm" @change="filterList">
            <option value="RETURN_REQUESTED">반납 전체</option>
            <option value="REPAIR_REQUESTED">수리 전체</option>
          </select>


          <input type="date" class="form-control form-control-sm" v-model="search.dateFrom" />
          <span>~</span>
          <input type="date" class="form-control form-control-sm" v-model="search.dateTo" />

<!--          <select v-model="search.status" class="form-select form-select-sm">-->
<!--            <option value="RETURN_REQUESTED">요청됨</option>-->
<!--            <option value="REPAIR_REQUESTED">요청됨</option>-->
<!--            <option value="RETURN_COMPLETED">완료됨</option>-->
<!--            <option value="REPAIR_COMPLETED">완료됨</option>-->
<!--            <option value="RETURN_CANCELED">취소됨</option>-->
<!--            <option value="REPAIR_CANCELED">취소됨</option>-->
<!--          </select>-->

          <button class="btn btn-primary btn-sm text-nowrap" @click="filterList">검색</button>
        </div>
      </div>
    </div>

    <div class="bg-white p-3 rounded shadow-sm">
      <h5 class="text-center border-top pt-3 mt-3">{{ getTypePath(search.status) === "repair" ? '수리 요청 관리' : '반납 요청 관리' }}</h5>

      <div v-if="error" class="alert alert-danger text-center my-3">{{ error }}</div>
      <div v-if="loading" class="text-center my-3">
        <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
      </div>

      <table v-if="!loading" class="table table-bordered table-hover text-center">
        <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>사용자명</th>
          <th>요청내용</th>
          <th>요청일</th>
          <th>상태</th>
          <th>반환장소</th>
          <th>처리</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="requests.length === 0">
          <td colspan="8">데이터가 없습니다.</td>
        </tr>
        <tr v-for="item in requests" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.userName }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.createdAt.split('T')[0] }}</td>
          <td>{{ item.status }}</td>
          <td>
            <!-- 상태가 RETURN_REQUESTED일 때만 select 표시 -->
            <select
                v-if="item.status === 'RETURN_REQUESTED'"
                v-model="item.returnLocation"
                class="form-select form-select-sm"
            >
              <option value="WAREHOUSE">창고</option>
              <option value="REPAIRING">수리중</option>
            </select>

            <!-- 상태가 REPAIR_REQUESTED이고 BEFORE_RETURN이면 강조 표시 -->
            <p v-else-if="item.status === 'REPAIR_REQUESTED' && item.returnLocation === 'BEFORE_RETURN'" class="text-warning mb-0">
              반환 전 상태
            </p>

            <!-- 그 외 모든 경우는 일반 텍스트 출력 -->
            <p v-else class="mb-0">
              {{ item.returnLocation }}
            </p>
          </td>

          <td>
            <button v-if="(item.status === 'RETURN_REQUESTED') || (item.status === 'REPAIR_REQUESTED')" class="btn btn-success btn-sm" @click="markAsCompleted(item)">완료 처리</button>
            <p v-else>처리완료</p>
          </td>
        </tr>
        </tbody>
      </table>

      <nav v-if="!loading && requests.length > 0" class="d-flex justify-content-center">
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
</template>

<style scoped>
.screen {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>
