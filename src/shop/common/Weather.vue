<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'

const router = useRouter()
const saleStore = useSaleStore()
const sales = ref([])

const goDetail = (sale) => {
  router.push(`/sale/detail/${sale.categoryIdx}/${sale.idx}`)
}

const conditionColorClass = (cond) => {
  switch (cond) {
    case 'S급': return 'bg-success'
    case 'A급': return 'bg-primary'
    case 'B급': return 'bg-warning text-dark'
    case 'C급': return 'bg-danger'
    default:    return 'bg-secondary'
  }
}

onMounted(async () => {
  await saleStore.fetchCategorySales(33)
  await saleStore.fetchCategorySales(34)
  sales.value = [
    ...saleStore.categorySales[33],
    ...saleStore.categorySales[34],
  ]
})
</script>

<template>
  <section class="full-width-banner" v-if="sales.length">
    <div class="banner-text">
      <h1>여름 특가</h1>
      <p>시원한 상품 만나보세요</p>
      <div class="summer-items">
        <div
          class="item-card"
          v-for="sale in sales"
          :key="sale.idx"
          @click="goDetail(sale)"
        >
          <img :src="sale.imageUrl || '/assets/images/placeholder.png'" />
          <h3>
            {{ sale.name }}
            <span
              v-if="sale.conditionName"
              class="badge ms-2"
              :class="conditionColorClass(sale.conditionName)"
            >
              {{ sale.conditionName }}
            </span>
          </h3>
          <p v-if="sale.price">
            월 {{ sale.price.toLocaleString() }}원 /
            {{ sale.period }}개월
          </p>
          <button class="buy-btn">자세히 보기 →</button>
        </div>
      </div>
    </div>
  </section>

  <div v-else class="text-center py-5 text-muted">
    상품 로딩 중…
  </div>
</template>

<style scoped>
.full-width-banner {
  width: 100vw;
  padding: 4rem 0;
  background-image: url('../../../assets/images/summer.png');
  background-size: cover;
  background-position: center;
}
.banner-text {
  max-width: 1140px;
  margin: 0 auto; /* 중앙 정렬 */
  text-align: center;
  padding: 0 1rem; /* 반응형 여유 */
}

.banner-text h1 {
  font-size: 7em; /* 기존보다 큼 */
  font-weight: 900; /* 훨씬 두껍게 */
  color: #ffffff;
  -webkit-text-stroke: 0.5px black; /* 흰색 테두리 */
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5); 
  margin-bottom: 1rem;
}
.banner-text p {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #ffffff;
}
.summer-items {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
}

.item-card {
  width: 250px;
  height: 400px; /* 고정 높이 추가 */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 버튼을 하단으로 밀어줌 */
  background: rgba(255, 255, 255, 0.9);
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.item-card:hover {
  transform: translateY(-8px);
}
.item-card img {
  width: 100%;
  height: 160px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.item-card h3 {
  margin: 0.5rem 0;
  font-size: 1.2rem;
  font-weight: bold;
}
.item-card p {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 1rem;
}
.buy-btn {
  padding: 0.5rem 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.buy-btn:hover {
  background-color: #0056b3;
}
</style>
