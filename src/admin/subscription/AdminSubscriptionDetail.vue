<script setup>
import { ref, onMounted } from 'vue'
import { useRouter ,useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const subscribeId = route.params.subscribeId

const loading = ref(false)
const error = ref(null)
const detailList = ref([])


const subscribeDetail = ref({
  id: '',
  userName: '',
  price: 0,
  status: '',
  overdue: '',
  joined: '',
  startDate: '',
  endDate: '',
  currentMonth: 0,
  totalMonths: 0,
})

function goBack() {
  router.back()
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await axios.get(`/api/admin/subscribe-detail/${subscribeId}`)
    detailList.value = res.data.result
    subscribeDetail.value = res.data.result[0]
  } catch (err) {
    console.error(err)
    error.value = '데이터를 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container my-4">
    <h4 class="text-center mb-4 fw-bold">구독 상세 정보</h4>

    <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- 뒤로 가기 버튼 -->
    <div class="mb-3">
      <button class="btn btn-outline-secondary btn-sm" @click="goBack">
        ← 뒤로 가기
      </button>
    </div>


    <div v-if="!loading && !error">
      <div class="card p-4 mb-4 shadow-sm">
        <h5 class="mb-3">기본 정보</h5>
        <p><strong>구독 ID:</strong> {{ subscribeDetail.subscribeDetailId }}</p>
        <p><strong>구독자명:</strong> {{ subscribeDetail.userName }}</p>
        <p><strong>구독 상태:</strong> {{ subscribeDetail.status }}</p>
        <p><strong>연체 여부:</strong> {{ subscribeDetail.overdue }}</p>
        <p><strong>가입일자:</strong> {{ subscribeDetail.joined }}</p>
      </div>

      <div class="card p-4 shadow-sm">
        <h5 class="mb-3">구독 기간 정보</h5>
        <div class="container my-4">
          <h4 class="text-center mb-4 fw-bold">구독 상세 정보</h4>

          <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
          <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <table v-if="!loading" class="table table-bordered table-hover text-center">
            <thead class="table-light">
            <tr>
              <th>번호</th>
              <th>가격</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>진행 차수</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in detailList" :key="item.subscribeDetailId">
              <td>{{ index + 1 }}</td>
              <td>{{ item.price.toLocaleString() }}</td>
              <td>{{ item.startDate }}</td>
              <td>{{ item.endDate }}</td>
              <td>{{ item.currentMonth }} / {{ subscribeDetail.period }}개월차</td>

            </tr>
            </tbody>
          </table>
    </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  font-size: 14px;
}
</style>
