<template>
  <div class="container py-4">
    <!-- 구독 목록 카드 -->
    <div class="card shadow-sm mb-4 rounded-lg">
      <div class="card-header bg-light d-flex justify-content-between align-items-center rounded-top-lg">
        <h5 class="mb-0 text-primary">구독 목록</h5>
        <!-- 필터 (최근 6개월, 연도 선택 등) -->
        <div>
          <button class="btn btn-outline-primary btn-sm me-2">최근 6개월</button>
          <button class="btn btn-outline-primary btn-sm">2025</button>
        </div>
      </div>

      <div class="card-body">
        <input
            v-model="search"
            type="text"
            class="form-control mb-3 rounded-pill"
            placeholder="주문한 상품을 검색할 수 있어요!"
        />

        <template v-if="subsToShow.length">
          <!-- 서버 호출로 로드된 구독 리스트 표시 -->
          <div
              v-for="sub in subsToShow"
              :key="sub.subscribeIdx"
              class="subscription-group mb-4"
          >
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold text-secondary mb-0">
                {{ new Date(sub.createdAt).toLocaleDateString('ko-KR') }}
                {{ sub.details[0].status === 'SUBSCRIBING'
                  ? '구독'
                  : sub.details[0].status === 'RETURN_REQUESTED'
                      ? '반납 신청'
                      : '구독 해지' }}
              </h6>
            </div>

            <div class="subscription-details border rounded p-3 bg-light">
              <div
                  v-for="detail in sub.details"
                  :key="detail.subscribeDetailIdx"
                  class="detail-item d-flex align-items-center mb-3"
              >
                <img
                    :src="detail.productImgurl"
                    alt="상품이미지"
                    width="64"
                    height="64"
                    class="me-3 img-thumbnail"
                />
                <div>
                  <p class="mb-1 fw-bold text-dark">{{ detail.salename }}</p>
                  <small class="text-muted">
                    월 결재액 <strong>{{ detail.price.toLocaleString() }}원</strong><br />
                    기간: {{ detail.period }}개월
                  </small>
                </div>

                <div class="ms-auto d-flex flex-column align-items-end gap-2">
                  <small class="text-muted fst-italic">
                    <template v-if="detail.status === 'SUBSCRIBING'">
                      구독 중 · 다음 결제일 {{ nextPaymentDate(sub.createdAt, detail.period) }}
                    </template>
                    <template v-else-if="detail.status === 'RETURN_REQUESTED'">
                      반납 신청 중
                    </template>
                    <template v-else>
                      구독 종료
                    </template>
                  </small>

                  <button
                      v-if="detail.status === 'SUBSCRIBING'"
                      @click="goToReturn(detail.subscribeDetailIdx)"
                      class="btn btn-outline-danger btn-sm"
                  >
                    구독 해지
                  </button>
                  <button
                      v-if="detail.status === 'SUBSCRIBING'"
                      class="btn btn-outline-secondary btn-sm"
                  >
                    수리·반품 신청
                  </button>
                  <button
                      v-if="detail.status === 'SUBSCRIBING' && isExtendable(detail.endAt)"
                      @click="onExtend(detail.subscribeDetailIdx)"
                      class="btn btn-outline-success btn-sm"
                  >
                    연장하기
                  </button>
                  <button
                      v-else-if="detail.status === 'RETURN_REQUESTED'"
                      class="btn btn-outline-warning btn-sm"
                      @click="goCancel(detail.subscribeDetailIdx) " :disabled="isCancelling"

                  >
                    반납 취소
                  </button>

                  <small class="text-secondary mt-1">
                    남은 일수: {{ daysLeft(detail.endAt).toFixed(2) }}일
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div v-if="hasNext" class="text-center mt-3">
            <small class="text-muted">스크롤을 내려 추가 항목을 로드합니다...</small>
          </div>
        </template>

        <template v-else>
          <div class="text-center py-5 text-muted">
            구독 내역이 없습니다.
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const subscriptions = ref([])
const search = ref('')
const page = ref(0)
const size = 5
const hasNext = ref(true)
function loadPage() {
  if (!hasNext.value) return

  axios
      .get('/api/subscribe/info', { params: { page: page.value, size } })
      .then(({ data }) => {
        if (!data.isSuccess) return

        const groups = data.result.content
        groups.forEach(group => {
          // 이미 동일한 subscribeIdx 그룹이 있으면 스킵
          if (!subscriptions.value.some(s => s.subscribeIdx === group.subscribeIdx)) {
            subscriptions.value.push(group)
          }
        })

        hasNext.value = data.result.number + 1 < data.result.totalPages
        page.value++
      })
      .catch(err => console.error('구독 목록 로드 실패', err))
}

const isCancelling = ref(false)


function undoReturn(detailIdx) {
  return axios
      .post(`/api/subscribe/${detailIdx}/cancel/undo`)
}




function goCancel(detailIdx) {
  undoReturn(detailIdx)
      .then(() => {
        // 1) 전체 구독 중에서 detailIdx를 포함하고 있는 sub 찾기
        const subscription = subscriptions.value
            .find(sub => sub.details.some(d => d.subscribeDetailIdx === detailIdx))

        if (!subscription) return

        // 2) 그 안에서 실제 detail 객체 찾아서 status 변경
        const detail = subscription.details
            .find(d => d.subscribeDetailIdx === detailIdx)

        detail.status = 'SUBSCRIBING'         // SUBSCRIBING 으로 바꿔 주면
        // (필요하면 returnedAt 같은 다른 필드도 업데이트)

        // 3) Vue의 반응성 덕분에 화면이 바로 갱신됩니다.
      })
      .catch(err => {
        console.error(err)
        alert('반납 취소에 실패했습니다.')
      })
}

function goToReturn(detailIdx) {
  router.push(`/subscription/${detailIdx}/return`)
}

function daysLeft(endAt) {
  return (new Date(endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
}

function nextPaymentDate(createdAt, period) {
  const dt = new Date(createdAt)
  dt.setMonth(dt.getMonth() + period)
  return dt.toLocaleDateString('ko-KR', {month: 'numeric', day: 'numeric'})
}

function isExtendable(endAt) {
  const end = new Date(endAt)
  return end - new Date() > 0 && end - new Date() <= 1000 * 60 * 60 * 24
}

onMounted(() => {
  loadPage()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
    loadPage()
  }
}

// 정렬 제거, 오직 검색만
const subsToShow = computed(() => {
  return !search.value
      ? subscriptions.value
      : subscriptions.value.filter(sub =>
          sub.details[0].salename.includes(search.value)
      )
})

</script>

<style scoped>
.card {
  border-radius: 0.75rem;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: none;
}

.subscription-group {
  background-color: #ffffff;
}

.subscription-details {
  background-color: #f9f9f9;
}

.btn {
  transition: background-color 0.2s ease, color 0.2s ease;
}

.img-thumbnail {
  border-radius: 0.5rem;
}
</style>
