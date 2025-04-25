<script setup>
import Navbar from "./component/Navbar.vue";
import Footer from "./component/Footer.vue";
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const showChat = ref(false)
const messages = ref([])
const input = ref('')
const chatBoxRef = ref(null)
let socket = null
const unreadCount = ref(0)
const getUserIdFromSession = () => {
  try {
    const stored = sessionStorage.getItem('user')
    return stored ? JSON.parse(stored).id : ''
  } catch {
    return ''
  }
}

const userId = ref(getUserIdFromSession())


function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToBottom = () => {
  nextTick(() => {
    chatBoxRef.value?.scrollTo({ top: chatBoxRef.value.scrollHeight, behavior: 'smooth' })
  })
}



const sendMessage = () => {
  if (!input.value.trim()) return
  const msg = { from: userId.value, to: 'admin', text: input.value }
  socket.send(JSON.stringify(msg))
  console.log(msg)
  messages.value.push({ from: 'me', text: msg.text })
  input.value = ''
  scrollToBottom()
}

const setupSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const host = window.location.host
  socket = new WebSocket(`${protocol}://${host}/api/ws/chat`)

  socket.onopen = () => console.log('✅ WebSocket 연결 성공')

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    messages.value.push(msg)
    if (msg.from === 'admin' && !showChat.value) unreadCount.value++
    scrollToBottom()
  }

  socket.onclose = () => console.warn('❌ WebSocket 연결 종료')
  socket.onerror = err => console.error('WebSocket 에러:', err)
}

onMounted(() => {
})

// WebSocket 연결 전에 userId가 비어있으면 연결 안 하게
const toggleChat = () => {
  userId.value = getUserIdFromSession() // ⭐ 최신값 동기화

  console.log(userId.value)
  if (!userId.value) {
    alert("유저 정보 불러오는 중입니다. 잠시 후 다시 시도해주세요.")
    return
  }

  if (!showChat.value && (!socket || socket.readyState !== WebSocket.OPEN)) {
    setupSocket()
  }
  unreadCount.value = 0
  showChat.value = !showChat.value
}

onUnmounted(() => socket?.close())


</script>




<template>
  <div class="user-layout">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>

    <!-- Floating Buttons -->
    <div class="position-fixed bottom-0 end-0 p-3 d-flex flex-column align-items-center gap-2">
      <button class="btn btn-outline-secondary rounded-circle position-relative" @click="toggleChat">
        💬
        <span v-if="unreadCount > 0"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {{ unreadCount }}
        </span>
      </button>
      <button class="btn btn-dark rounded-circle" @click="scrollToTop">TOP</button>
    </div>

    <!-- Chat Area -->
    <div v-if="showChat" class="chat-container">
      <div class="chat-box" ref="chatBoxRef">
        <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['chat-message', msg.from === 'me' ? 'me' : msg.from === 'admin' ? 'admin' : 'other']">
          <template v-if="msg.from === 'me'">{{ msg.text }}</template>
          <template v-else><span class="sender">{{ msg.from }}:</span> {{ msg.text }}</template>
        </div>
      </div>
      <div class="chat-input">
        <input v-model="input" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
        <button @click="sendMessage">전송</button>
      </div>
    </div>

    <Footer />
  </div>
</template>


<style scoped>
.user-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  text-align: center;
  flex: 1;
  padding-top: 150px;
  margin: 0 auto;
}

.chat-container {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 10px;
  z-index: 1000;
}

.chat-box {
  height: 400px;
  overflow-y: auto;
  padding: 8px;
  background: #fff;
  border: 1px solid #eee;
  margin-bottom: 10px;
  border-radius: 8px;
}

.chat-message {
  margin-bottom: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  max-width: 80%;
  word-break: break-word;
  display: inline-block;
}

.chat-message.me {
  background-color: #daf1ff;
  float: right;
  clear: both;
  text-align: right;
}

.chat-message.admin {
  background-color: #ffdede;
  color: #b30000;
  float: left;
  clear: both;
}

.chat-message.other {
  background-color: #eee;
  float: left;
  clear: both;
}

.chat-message .sender {
  font-weight: bold;
  margin-right: 5px;
}

.chat-input {
  display: flex;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.chat-input button {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
</style>