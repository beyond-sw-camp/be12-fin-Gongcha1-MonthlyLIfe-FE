<script setup>
import Navbar from "./component/Navbar.vue";
import Footer from "./component/Footer.vue";
import {ref, onMounted, onUnmounted, nextTick} from 'vue'
import axios from 'axios';
import {useUserStore} from '/src/store/useUserStore'

const userStore = useUserStore()

const showChat = ref(false)  // 상담 채팅 모드
const showAIChat = ref(false)  // AI 채팅 모드
const messagesChat = ref([])  // 상담 채팅 메시지
const messagesAI = ref([])  // AI 채팅 메시지
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
  window.scrollTo({top: 0, behavior: 'smooth'})
}

const scrollToBottom = () => {
  nextTick(() => {
    chatBoxRef.value?.scrollTo({top: chatBoxRef.value.scrollHeight, behavior: 'smooth'})
  })
}

const sendMessage = () => {
  if (!input.value.trim()) return;

  const msg = {from: userId.value, to: 'admin', text: input.value};

  if (showAIChat.value) {
    msg.from = 'me';  // AI 채팅 모드에서는 사용자의 메시지를 'me'로 표시

    messagesAI.value.push({from: 'me', text: msg.text});
    scrollToBottom();

    // AI API 호출 (예: axios를 사용하여 API 호출)
    axios.post('/api/mcp2/chat', {message: msg.text})
        .then(response => {
          const aiResponse = response.data;  // AI 응답 데이터
          const topProducts = aiResponse.slice(0, 3).join(', ');

          messagesAI.value.push({from: 'AI', text: `추천 상품: ${topProducts}`});
          scrollToBottom();
        })
        .catch(error => {
          console.error('AI 요청 실패:', error);
          alert('AI 처리에 실패했습니다. 다시 시도해주세요.');
        });
  } else {
    // 상담 채팅일 때 WebSocket으로 처리
    socket.send(JSON.stringify(msg));
    messagesChat.value.push({from: 'me', text: msg.text});
    scrollToBottom();
  }

  input.value = ''; // 입력값 초기화
};

const toggleChatMode = () => {
  if (showAIChat.value) {
    showAIChat.value = false;
    showChat.value = true;  // 상담 채팅 활성화
  } else {
    showChat.value = false;
    showAIChat.value = true;  // AI 채팅 활성화
    // AI 채팅 모드가 활성화되면 초기 메시지를 추가
    if (messagesAI.value.length === 0 || !messagesAI.value.some(message => message.from === 'AI')) {
      messagesAI.value.push({from: 'AI', text: 'AI가 무엇을 도와드릴까요? (상품검색, 상품구독, 상품추천)'});
      scrollToBottom();
    }
  }
}

const setupSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const host = window.location.host
  socket = new WebSocket(`${protocol}://${host}/ws/chat`)

  socket.onopen = () => console.log('✅ WebSocket 연결 성공')

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    if (showChat.value) {
      // 상담 채팅 모드일 때만 메시지 표시
      messagesChat.value.push(msg);
      scrollToBottom();
    }
  }

  socket.onclose = () => console.warn('❌ WebSocket 연결 종료')
  socket.onerror = err => console.error('WebSocket 에러:', err)
}

onMounted(() => {
})

// WebSocket 연결 전에 userId가 비어있으면 연결 안 하게
const toggleChat = () => {
  userId.value = getUserIdFromSession() // ⭐ 최신값 동기화

  if (!userId.value) {
    alert("유저 정보 불러오는 중입니다. 잠시 후 다시 시도해주세요.")
    return
  }

  if (!showChat.value && !showAIChat.value && (!socket || socket.readyState !== WebSocket.OPEN)) {
    setupSocket()
  }
  unreadCount.value = 0
  showChat.value = !showChat.value
}

onUnmounted(() => socket?.close())
</script>

<template>
  <div class="user-layout">
    <Navbar/>
    <main class="main-content">
      <router-view/>
    </main>

    <!-- Floating Buttons -->
    <div class="position-fixed bottom-0 end-0 p-3 d-flex flex-column align-items-center gap-2">
      <!-- 채팅 버튼: 로그인 상태일 때만 표시 -->
      <button
          v-if="userStore.isLogin"
          class="btn btn-outline-secondary rounded-circle position-relative"
          @click="toggleChat"
      >
        💬
        <span v-if="unreadCount > 0"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
      {{ unreadCount }}
    </span>
      </button>

      <!-- TOP 버튼: 항상 표시 -->
      <button class="btn btn-dark rounded-circle" @click="scrollToTop">TOP</button>
    </div>

    <!-- Chat Area: 상담 채팅 -->
    <div v-if="showChat" class="chat-container">
      <div class="chat-box" ref="chatBoxRef">
        <div
            v-for="(msg, index) in messagesChat"
            :key="index"
            :class="['chat-message', msg.from === 'me' ? 'me' : msg.from === 'admin' ? 'admin' : 'other']">
          <template v-if="msg.from === 'me'">{{ msg.text }}</template>
          <template v-else><span class="sender">{{ msg.from }}:</span> {{ msg.text }}</template>
        </div>
      </div>
      <div class="chat-input">
        <input v-model="input" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..."/>
        <button @click="sendMessage">전송</button>
      </div>
      <button @click="toggleChatMode" class="btn btn-secondary mt-2">
        AI 채팅으로 전환
      </button>
    </div>

    <!-- Chat Area: AI 채팅 -->
    <div v-if="showAIChat" class="chat-container">
      <div class="chat-box" ref="chatBoxRef">
        <div
            v-for="(msg, index) in messagesAI"
            :key="index"
            :class="['chat-message', msg.from === 'me' ? 'me' : msg.from === 'AI' ? 'admin' : 'other']">
          <template v-if="msg.from === 'me'">{{ msg.text }}</template>
          <template v-else><span class="sender">{{ msg.from }}:</span> {{ msg.text }}</template>
        </div>
      </div>
      <div class="chat-input">
        <input v-model="input" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..."/>
        <button @click="sendMessage">전송</button>
      </div>
      <button @click="toggleChatMode" class="btn btn-secondary mt-2">
        상담 채팅으로 전환
      </button>
    </div>

    <Footer/>
  </div>
</template>

<style scoped>
/* 기존 스타일링 */
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
  width: 300px;
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

button {
  padding: 8px 16px;
}
</style>
