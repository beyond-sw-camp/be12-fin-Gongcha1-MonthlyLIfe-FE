<template>
  <div class="container py-4">
    <!-- 구독 목록 카드 -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">구독 목록</h5>
        <!-- 필터 (최근 6개월, 연도 선택 등) -->
        <div>
          <button class="btn btn-outline-secondary btn-sm me-2">최근 6개월</button>
          <button class="btn btn-outline-secondary btn-sm">2025</button>
        </div>
      </div>

      <div class="card-body">
        <input
            v-model="search"
            type="text"
            class="form-control mb-3"
            placeholder="주문한 상품을 검색할 수 있어요!"
        />

        <template v-if="sortedSubs.length">
          <div
              v-for="sub in sortedSubs"
              :key="sub.subscribeIdx"
              class="mb-4 border p-3 rounded"
          >
            <!-- 구독 헤더 -->
            <h6 class="fw-bold">
              {{ new Date(sub.createdAt).toLocaleDateString('ko-KR') }}
              {{ sub.details[0].status === 'SUBSCRIBING' ? '구독' : sub.details[0].status === 'RETURN_REQUESTED' ? '반납 신청' : '구독 해지' }}
            </h6>

            <div class="border p-3 rounded">
              <!-- 상태 바 -->
              <div class="mb-2 text-muted fw-bolder">
                <template v-if="sub.details[0].status === 'SUBSCRIBING'">
                  구독 중 · 다음 결제일 {{ nextPaymentDate(sub.createdAt, sub.details[0].period) }}
                </template>
                <template v-else-if="sub.details[0].status === 'RETURN_REQUESTED'">
                  반납 신청 중
                </template>
                <template v-else>
                  구독 종료
                </template>
              </div>

              <!-- 상품 정보 -->
              <div class="d-flex align-items-center">
                <img
                    :src="sub.details[0].productImgurl"
                    alt="상품이미지"
                    width="64"
                    height="64"
                    class="me-3"
                />
                <div>
                  <p class="mb-1 fw-bold">{{ sub.details[0].salename }}</p>
                  <small class="text-muted">
                    월 결재액 {{ sub.details[0].price.toLocaleString() }}원
                    기간: {{ sub.details[0].period }}개월
                  </small>
                </div>

                <!-- 액션 버튼 -->
                <div class="ms-auto d-flex flex-column">
                  <button
                      v-if="sub.details[0].status === 'SUBSCRIBING'"
                      @click="goToReturn(sub.details[0].subscribeDetailIdx)"

                      class="btn btn-outline-primary btn-sm mb-2"
                  >
                    구독 해지
                  </button>
                  <button
                      v-if="sub.details[0].status === 'SUBSCRIBING'"
                      class="btn btn-outline-primary btn-sm"
                  >
                    수리·반품 신청
                  </button>

                  <button
                      v-else-if="sub.details[0].status === 'RETURN_REQUESTED'"
                      class="btn btn-outline-warning btn-sm"
                  >
                    반납 취소
                  </button>

                  <button
                      v-else
                      class="btn btn-outline-primary btn-sm"
                  >
                    다시 구독하기
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="text-end">
            <button class="btn btn-outline-secondary btn-sm" @click="loadMore">
              더보기
            </button>
          </div>
        </template>

        <template v-else>
          <div class="text-center py-5 text-muted">
            검색된 구독 내역이 없습니다.
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'    // ← 추가

import axios from 'axios'
const router = useRouter()

const subscriptions = ref([])
const search = ref('')

// API 호출
onMounted(async () => {
  try {
    const { data } = await axios.get('/api/subscribe/test/mysubscribe')  // 실제 엔드포인트로 변경
    if (data.isSuccess) {
      subscriptions.value = data.result
    }
  } catch (e) {
    console.error('구독 목록 로드 실패', e)
  }
})
function goToReturn(detailIdx) {
  router.push(`/subscription/${detailIdx}/return`)
}

// 검색 필터
const filtered = computed(() => {
  if (!search.value) return subscriptions.value
  return subscriptions.value.filter(sub =>
      sub.details[0].salename.includes(search.value)
  )
})

// 다음 결제일 계산 (예: createdAt + period개월)
function nextPaymentDate(createdAt, period) {
  const dt = new Date(createdAt)
  dt.setMonth(dt.getMonth() + period)
  return dt.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
}
const sortedSubs = computed(() => {
  return filtered.value
      .slice() // 원본 보호
      .sort((a, b) => b.subscribeIdx - a.subscribeIdx)
})
// 더보기 예시 (페이징)
function loadMore() {
  console.log('더보기 클릭!')
  // 추가 API 호출 로직...
}
</script>

<style scoped>
.checkout-container {
  /* 필요 시 추가 스타일 */
}
</style>
