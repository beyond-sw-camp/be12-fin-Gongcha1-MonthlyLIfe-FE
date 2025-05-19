<template>
  <div class="container-fluid min-vh-100 bg-gradient py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">

        <!-- 메인 카드 -->
        <div class="card border-0 shadow-lg info-card mb-4">
          <div class="card-header d-flex align-items-center bg-white border-0">
            <div class="icon-circle bg-primary text-white me-3">
              <font-awesome-icon :icon="['fas','truck']" />
            </div>
            <h5 class="mb-0">배송 조회</h5>
          </div>

          <div class="card-body p-5">

            <!-- 상태 배지 & 예상 완료 시간 -->
            <div class="d-flex justify-content-center align-items-center mb-5">
              <span
                  class="badge fs-6 badge-pill"
                  :class="statusBadgeClass"
              >
                {{ statusLabel }}
              </span>
              <small v-if="deliveryInfo.estimatedDeliveredAt" class="text-muted ms-3">
                예상 완료: {{ formatDT(deliveryInfo.estimatedDeliveredAt) }}
              </small>
            </div>

            <!-- 배송 기본 정보 -->
            <div class="row g-4">
              <div
                  v-for="item in infoItems"
                  :key="item.label"
                  :class="item.colClass"
              >
                <div class="p-4 bg-white rounded shadow-sm h-100 info-item">
                  <div class="d-flex align-items-center mb-2">
                    <font-awesome-icon
                        :icon="['fas', item.icon]"
                        class="text-primary me-2"
                    />
                    <small class="text-secondary">{{ item.label }}</small>
                  </div>
                  <div class="fw-bold">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useRoute ,useRouter } from 'vue-router'
const router = useRouter()

import {
  faTruck,
  faUser,
  faPhoneAlt,
  faBox,
  faTruckLoading,
  faMapMarkerAlt,
  faStickyNote
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 아이콘 등록
library.add(
    faTruck,
    faUser,
    faPhoneAlt,
    faBox,
    faTruckLoading,
    faMapMarkerAlt,
    faStickyNote
)


// 배송 정보 (backend에서 status, estimatedDeliveredAt을 내려줌)
const deliveryInfo = ref({
  recipientName: '',
  recipientPhone: '',
  postalCode: '',
  address1: '',
  address2: '',
  status: '',
  estimatedDeliveredAt: '',
  courierCompany: '',
  trackingNumber: '',
  deliveryMemo: ''
})

// API 호출 함수
async function fetchDelivery(detailIdx) {
  try {
    const { data } = await axios.get(`/api/subscribe/getsubscribedelivery/${detailIdx}`);
    if (data?.result) {
      deliveryInfo.value = data.result;
    }
  } catch (e) {
    const data = e.response?.data
    alert(data?.message || '배송 조회 중 오류 발생')
    router.back()
  }
}

const route = useRoute()
const detailIdx = route.params.detailIdx

onMounted(() => {
  fetchDelivery(detailIdx);
});

// 한글 상태 라벨 매핑
const statusLabel = computed(() => ({
  PREPARING: '배송 준비중',
  SHIPPING:  '배송 중',
  DELIVERED: '배송 완료'
}[deliveryInfo.value.status] || deliveryInfo.value.status))

// 상태별 badge 클래스
const statusBadgeClass = computed(() => ({
  PREPARING: 'bg-secondary text-white',
  SHIPPING:  'bg-warning text-dark',
  DELIVERED: 'bg-success text-white'
}[deliveryInfo.value.status] || 'bg-secondary text-white'))

// 전체 주소
const fullAddress = computed(() => {
  const { address1 = '', address2 = '' } = deliveryInfo.value
  return [address1, address2].filter(Boolean).join(' ')
})

// 화면에 뿌릴 정보 목록
const infoItems = computed(() => [
  { icon: 'user',        label: '수령인',       value: deliveryInfo.value.recipientName,      colClass: 'col-md-6' },
  { icon: 'phone-alt',   label: '전화번호',     value: deliveryInfo.value.recipientPhone,      colClass: 'col-md-6' },
  // { icon: 'truck-loading',label: '택배사/운송장', value: `${deliveryInfo.value.courierCompany} / ${deliveryInfo.value.trackingNumber}`, colClass: 'col-md-12' },
  { icon: 'map-marker-alt',label: '받는 주소',    value: fullAddress.value,                     colClass: 'col-12' },
  { icon: 'sticky-note',  label: '배송 메모',    value: deliveryInfo.value.deliveryMemo || '없음', colClass: 'col-12' }
])

// 날짜시간 포맷 함수
function formatDT(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${mm}/${dd} ${hh}:${mi}`
}
</script>

<style scoped>
.bg-gradient { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); }
.info-card   { border-left: 5px solid #0d6efd; }
.icon-circle { width:2.5rem; height:2.5rem; display:flex; align-items:center; justify-content:center; border-radius:50%; }
.info-item   { transition: transform .2s, box-shadow .2s; }
.info-item:hover { transform: translateY(-4px); box-shadow: 0 .75rem 1.5rem rgba(0,0,0,0.1); }
.badge-pill  { border-radius: 10rem; }
</style>
