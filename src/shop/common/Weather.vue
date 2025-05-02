<template>
  <section class="full-width-banner" v-if="products.length && sales.length">
    <div class="banner-text">
      <h1>여름 특가</h1>
      <p>시원한 상품 만나보세요</p>
      <div class="summer-items">
        <div class="item-card" v-for="sale in sales" :key="sale.saleIdx" @click="goDetail(sale)">
          <img :src="products.find(p => p.code === sale.productList[0]?.productCode)
              ?.productImages?.[0]?.productImgUrl
            || '/assets/images/placeholder.png'" :alt="sale.name" />
          <h3>
            {{ sale.name }}
            <span v-if="condition(sale)" class="badge ms-2" :class="conditionColorClass(condition(sale))">
              {{ condition(sale) }}
            </span>
          </h3>
          <p v-if="getMinPrice(sale)">
            월 {{ getMinPrice(sale).price.toLocaleString() }}원 /
            {{ getMinPrice(sale).period }}개월
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

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSaleStore } from '../../store/useSaleStore'
import { useProductStore } from '../../store/useProductStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const saleStore = useSaleStore()
const productStore = useProductStore()
const { products } = storeToRefs(productStore)

const sales = ref([])

const condition = sale =>
  products.value.find(p => p.code === sale.productList[0]?.productCode)
    ?.condition


function goDetail(sale) {
  router.push(`/sale/detail/${sale.categoryIdx}/${sale.idx}`)
}

function getMinPrice(sale) {
  return sale.priceList?.reduce(
    (min, p) => (p.price < min.price ? p : min),
    sale.priceList[0]
  )
}

function conditionColorClass(cond) {
  switch (cond) {
    case 'S급': return 'bg-success'
    case 'A급': return 'bg-primary'
    case 'B급': return 'bg-warning text-dark'
    case 'C급': return 'bg-danger'
    default: return 'bg-secondary'
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


<style scoped>
.summer-items {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.item-card {
  width: 250px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.item-card:hover {
  transform: translateY(-8px);
}

.item-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
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

.full-width-banner {
  margin-top: 20vh;
  margin-bottom: 1000px;
  width: 100vw;
  height: 100vh;
  background-image: url('../../../assets/images/summer.png');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner-text h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.banner-text p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}
</style>
