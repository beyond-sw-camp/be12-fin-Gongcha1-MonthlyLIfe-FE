<!-- src/shop/subscription/RepairReport.vue -->
<template>
  <div class="container py-5">
    <div v-if="store.loading" class="text-center">로딩 중...</div>
    <div v-else-if="store.error" class="alert alert-danger text-center">{{ store.error }}</div>
    <div v-else-if="store.detail" class="fade-in">

      <!-- 제품 이미지 -->
      <div class="text-center re-pair mb-4">
        <img
            :src="store.detail.imageUrl"
            @error="e => e.target.src = fallbackImg"
            alt="제품 이미지"
            class="img-fluid rounded shadow-sm"
            style="max-height: 300px;"
        />
      </div>

      <!-- 폼 카드 -->
      <div class="card shadow-lg report-card border-0">
        <div class="card-body p-4">
          <!-- 렌탈 상품명 -->
          <div class="mb-3">
            <label class="form-label fw-bold">렌탈 상품명</label>
            <input
                type="text"
                class="form-control"
                :value="store.detail.salename"
                readonly
            />
          </div>

          <!-- 신청 종류 선택 -->
          <div class="mb-3">
            <label class="form-label fw-bold">신청 종류</label>
            <div>
              <div class="form-check form-check-inline">
                <input
                    class="form-check-input"
                    type="radio"
                    id="repair"
                    value="REPAIR"
                    v-model="reportType"
                />
                <label class="form-check-label" for="repair">수리 신청</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                    class="form-check-input"
                    type="radio"
                    id="lost"
                    value="LOST"
                    v-model="reportType"
                />
                <label class="form-check-label" for="lost">분실 신고</label>
              </div>
            </div>
          </div>

          <!-- 고객명 -->
          <div class="mb-3">
            <label class="form-label fw-bold">고객명</label>
            <input
                type="text"
                class="form-control"
                v-model="subscriberName"
                placeholder="이름을 입력하세요"
            />
          </div>

          <!-- 연락처 -->
          <div class="mb-3">
            <label class="form-label fw-bold">연락처</label>
            <input
                type="tel"
                class="form-control"
                v-model="subscriberPhone"
                placeholder="010-1234-5678"
            />
          </div>

          <!-- 신고 상세 내용 -->
          <div class="mb-4">
            <label class="form-label fw-bold">
              {{ reportType === 'REPAIR'
                ? '고장 증상 및 요청사항'
                : '분실 경위 및 요청사항' }}
            </label>
            <textarea
                class="form-control"
                rows="4"
                v-model="description"
                :placeholder="reportType === 'REPAIR'
                ? '제품 고장 상태 및 수리 요청사항을 입력하세요'
                : '분실된 상황 및 요청사항을 입력하세요'"
            ></textarea>
          </div>

          <!-- (선택) 사진 URL 입력 필드 -->
          <div v-if="reportType === 'REPAIR'" class="mb-4">
            <label class="form-label fw-bold">증상 사진 URL (선택, 최대 5개)</label>
            <div v-for="(url, i) in imageUrls" :key="i" class="mb-2">
              <input
                  type="text"
                  class="form-control"
                  v-model="imageUrls[i]"
                  placeholder="https://example.com/image.jpg"
              />
            </div>
            <button
                class="btn btn-sm btn-outline-secondary"
                @click="addImageField"
                :disabled="imageUrls.length >= 5"
            >
              + URL 추가
            </button>
          </div>

          <!-- 제출 버튼 -->
          <div class="text-end">
            <button
                class="btn btn-outline-primary btn-lg"
                @click="submitReport"
            >
              {{ reportType === 'REPAIR' ? '수리 신청' : '분실 신고' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useSubscribeStore } from '../../store/useSubcribeStore.js'

const route = useRoute()
const router = useRouter()
const store = useSubscribeStore()

const fallbackImg = 'https://via.placeholder.com/300x200?text=No+Image'
const reportType = ref('REPAIR')       // REPAIR or LOST
const subscriberName = ref('')
const subscriberPhone = ref('')
const description = ref('')
const imageUrls = ref([])              // 직접 URL을 입력받습니다.

// 구독 상세 정보 로드
onMounted(() => {
  const detailIdx = route.params.detailIdx
  store.fetchSubscribeDetail(detailIdx)
})

// 사진 URL 입력 필드 추가
function addImageField() {
  if (imageUrls.value.length < 5) {
    imageUrls.value.push('')
  }
}

async function submitReport() {
  if (!subscriberName.value || !subscriberPhone.value || !description.value) {
    alert('모든 필드를 입력해주세요.')
    return
  }

  // JSON 페이로드 작성
  const payload = {
    subscribeDetailIdx: Number(route.params.detailIdx),
    type: reportType.value,
    subscriberName: subscriberName.value,
    subscriberPhone: subscriberPhone.value,
    description: description.value,
    imageUrls: reportType.value === 'REPAIR'
        ? imageUrls.value.filter(u => u.trim() !== '')
        : undefined
  }

  try {
    const res = await axios.post('/api/subscribe/report', payload)
    if (res.data.isSuccess) {
      alert(
          reportType.value === 'REPAIR'
              ? '수리 신청이 완료되었습니다.'
              : '분실 신고가 접수되었습니다.'
      )
      router.push('/user/detail')
    } else {
      alert('실패: ' + res.data.message)
    }
  } catch (err) {
    console.error('신청 오류', err)
    alert('서버 오류가 발생했습니다.')
  }
}
</script>

<style scoped>
.report-card {
  width: 800px;
  margin: auto;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}
.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px) }
  to   { opacity: 1; transform: translateY(0) }
}
</style>
