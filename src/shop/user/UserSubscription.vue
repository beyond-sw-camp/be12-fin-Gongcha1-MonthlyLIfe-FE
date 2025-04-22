<template>
  <div class="container py-4">
    <!-- 구독 목록 카드 -->
    <div class="card shadow-sm mb-4 rounded-lg">
      <div class="card-header bg-light d-flex justify-content-between align-items-center rounded-top-lg">
        <h5 class="mb-0 text-primary">구독 목록</h5>
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
          <div
              v-for="sub in subsToShow"
              :key="sub.subscribeIdx"
              class="subscription-group mb-4"
          >
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold text-secondary mb-0">
                {{ new Date(sub.createdAt).toLocaleDateString('ko-KR') }}
                {{
                  sub.details[0].status === 'SUBSCRIBING'
                      ? '구독'
                      : sub.details[0].status === 'RETURN_REQUESTED'
                          ? '반납 신청'
                          : '구독 해지'
                }}
              </h6>
            </div>

            <div class="subscription-details border rounded p-3 bg-light">
              <div
                  v-for="detail in sub.details.filter(d => d.status !== 'RESERVED')"
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
                      반납 신청 완료
                    </template>
                    <template v-else-if="detail.status === 'REPAIR_REQUESTED'">
                      수리 신청 완료
                    </template>
                    <template v-else-if="detail.status === 'LOST'">
                      분실 신청 완료
                    </template>
                    <template v-else>
                      구독 종료
                    </template>
                  </small>

                  <!-- 구독 중일 때만 -->
                  <button
                      v-if="detail.status === 'SUBSCRIBING'"
                      @click="goRepair(detail.subscribeDetailIdx)"
                      class="btn btn-outline-secondary btn-sm"
                  >
                    수리·분실신고
                  </button>
                  <button
                      v-if="detail.status === 'SUBSCRIBING' && isExtendable(detail.endAt)"
                      @click="onExtend(detail.subscribeDetailIdx)"
                      :disabled="isExtending"
                      class="btn btn-outline-success btn-sm"
                  >
                    {{ isExtending ? '연장 중…' : '연장하기' }}
                  </button>
                  <button
                      v-if="detail.status === 'SUBSCRIBING'"
                      @click="goToReturn(detail.subscribeDetailIdx)"
                      class="btn btn-outline-danger btn-sm"
                  >
                    구독 해지
                  </button>

                  <!-- 반납 신청 중일 때만 -->
                  <button
                      v-else-if="detail.status === 'RETURN_REQUESTED'"
                      @click="goCancel(detail.subscribeDetailIdx)"
                      :disabled="isCancelling"
                      class="btn btn-outline-warning btn-sm"
                  >
                    {{ isCancelling ? '취소 중…' : '반납 취소' }}
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

// 상태 플래그
const isCancelling = ref(false)
const isExtending  = ref(false)

function loadPage() {
  if (!hasNext.value) return

  axios
      .get('/api/subscribe/info', { params: { page: page.value, size } })
      .then(({ data }) => {
        if (!data.isSuccess) return

        data.result.content.forEach(group => {
          if (!subscriptions.value.some(s => s.subscribeIdx === group.subscribeIdx)) {
            subscriptions.value.push(group)
          }
        })

        hasNext.value = data.result.number + 1 < data.result.totalPages
        page.value++
      })
      .catch(err => console.error('구독 목록 로드 실패', err))
}

function goCancel(detailIdx) {
  isCancelling.value = true
  axios
      .post(`/api/subscribe/${detailIdx}/cancel/undo`)
      .then(() => {
        // 로컬에서 상태 복원
        const sub = subscriptions.value.find(s =>
            s.details.some(d => d.subscribeDetailIdx === detailIdx)
        )
        const d = sub.details.find(d => d.subscribeDetailIdx === detailIdx)
        d.status = 'SUBSCRIBING'
      })
      .catch(() => alert('반납 취소 실패'))
      .finally(() => (isCancelling.value = false))
}

function goToReturn(detailIdx) {
  router.push(`/subscription/${detailIdx}/return`)
}

function goRepair(detailIdx) {
  router.push(`/subscription/${detailIdx}/repair`)
}

async function onExtend(detailIdx) {
  isExtending.value = true
  try {
    const { data } = await axios.post(`/api/subscribe/${detailIdx}/extend`)
    if (data.isSuccess) {
      // 새로 연장된 디테일이 data.result 로 내려온다고 가정
      const group = subscriptions.value.find(s =>
          s.details.some(d => d.subscribeDetailIdx === detailIdx)
      )
      group.details.push(data.result)
    } else {
      alert('연장 실패: ' + data.message)
    }
  } catch {
    alert('연장 중 오류가 발생했습니다.')
  } finally {
    isExtending.value = false
  }
}

function daysLeft(endAt) {
  return (new Date(endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
}
function nextPaymentDate(createdAt) {
  const base = new Date(createdAt)
  const now = new Date()

  while (base <= now) {
    base.setMonth(base.getMonth() + 1)
  }

  return base.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
}
function isExtendable(endAt) {
  const diff = new Date(endAt).getTime() - Date.now()
  return diff > 0 && diff <= 1000 * 60 * 60 * 24
}

onMounted(() => {
  loadPage()
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100
  ) {
    loadPage()
  }
}

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
/* 버튼 정렬과 크기 통일 */
.subscription-details .btn {
  min-width: 100px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  text-align: center;
}

/* 상태 메시지(구독 중, 반납 신청 등) 정렬 */
.subscription-details small.text-muted.fst-italic {
  min-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

</style>
