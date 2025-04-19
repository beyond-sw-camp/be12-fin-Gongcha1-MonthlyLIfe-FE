<template>
  <div class="container py-5">
    <div v-if="store.loading" class="text-center">로딩 중...</div>
    <div v-else-if="store.error" class="alert alert-danger text-center">{{ store.error }}</div>
    <div v-else-if="store.detail" class="fade-in">
      <!-- 제품 이미지 -->
      <div class="text-center mb-4">
        <img
            :src="store.detail.imageUrl"
            @error="e => e.target.src = fallbackImg"
            alt="제품 이미지"
            class="img-fluid rounded shadow-sm"
            style="max-height: 300px;"
        />
      </div>

      <!-- 폼 카드 -->
      <div class="card shadow-lg return_card border-0">
        <div class="card-body p-4">
          <!-- 렌탈 정보 -->
          <div class="mb-3">
            <label class="form-label fw-bold">렌탈 상품명</label>
            <input
                type="text"
                class="form-control"
                :value="store.detail.salename"
                readonly
            />
          </div>

          <!-- 고객명 -->
          <div class="mb-3">
            <label class="form-label fw-bold">고객명</label>
            <input
                type="text"
                class="form-control"
                v-model="subscribeName"
                placeholder="이름을 입력하세요"
            />
          </div>

          <!-- 전화번호 -->
          <div class="mb-3">
            <label class="form-label fw-bold">전화번호</label>
            <input
                type="tel"
                class="form-control"
                v-model="subscribePhone"
                placeholder="010-1234-5678"
            />
          </div>

          <!-- 주소 1 -->
          <div class="mb-3">
            <label class="form-label fw-bold">주소</label>
            <input
                type="text"
                class="form-control"
                v-model="address1"
                placeholder="도로명 주소를 입력하세요"
            />
          </div>

          <!-- 주소 2 -->
          <div class="mb-3">
            <label class="form-label fw-bold">상세 주소</label>
            <input
                type="text"
                class="form-control"
                v-model="address2"
                placeholder="상세 주소를 입력하세요"
            />
          </div>

          <!-- 반납 예정일 -->
          <div class="mb-3">
            <label class="form-label fw-bold">반납 예정일</label>
            <input
                type="date"
                class="form-control"
                v-model="pickupDate"
            />
          </div>

          <!-- 참고사항 -->
          <div class="mb-4">
            <label class="form-label fw-bold">제품 상태 및 참고사항</label>
            <textarea
                class="form-control"
                rows="3"
                v-model="description"
                placeholder="제품 상태 및 반납 시 참고사항을 입력하세요"
            ></textarea>
          </div>

          <!-- 버튼 -->
          <div class="text-end">
            <button
                class="btn btn-outline-primary btn-lg"
                @click="submitReturn"
            >
              반납 신청
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useSubscribeStore } from '../../store/useSubcribeStore.js'

const route = useRoute()
const store = useSubscribeStore()

const fallbackImg = 'https://via.placeholder.com/300x200?text=No+Image'
const pickupDate = ref('')

// 추가된 고객 정보 필드
const subscribeName = ref('')
const subscribePhone = ref('010-')
const address1 = ref('')
const address2 = ref('')
const description = ref('')

onMounted(() => {
  const detailIdx = route.params.detailIdx
  store.fetchSubscribeDetail(detailIdx)


})

async function submitReturn() {
  const payload = {
    subscribedetailIdx: route.params.detailIdx,
    subscribeName: subscribeName.value,
    subscribePhone: subscribePhone.value,
    address1: address1.value,
    address2: address2.value,
    description: description.value,
    pickupDate: `${pickupDate.value}T09:00:00`
  }
  console.log('반납 신청 데이터:', {
    subscribedetailIdx: route.params.detailIdx,
    subscribeName: subscribeName.value,
    subscribePhone: subscribePhone.value,
    address1: address1.value,
    address2: address2.value,
    description: description.value,
    pickupDate: `${pickupDate.value}T09:00:00`
  })
  try {
    const res = await axios.post('/api/subscribe/return', payload)
    if (res.data.isSuccess) {
      alert('반납 신청이 완료되었습니다!')
      // 원하는 경우, 완료 후 다른 페이지로 이동
      // router.push('/user/detail')
    } else {
      alert('실패: ' + res.data.message)
    }
  } catch (err) {
    console.error('반납 신청 오류', err)
    alert('서버 오류가 발생했습니다.')
  }
}
</script>

<style scoped>
.return_card {
  width: 800px;
  margin: auto;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
