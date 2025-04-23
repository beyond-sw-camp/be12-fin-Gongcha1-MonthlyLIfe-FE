<script setup>
import { ref, onUnmounted, nextTick } from 'vue'

const nickname = ref('')
const nicknameSet = ref(false)
const showChat = ref(false)
const messages = ref([])
const input = ref('')
const chatBoxRef = ref(null)
let socket = null
const unreadCount = ref(0)



const scrollToBottom = () => {
  nextTick(() => {
    chatBoxRef.value?.scrollTo({ top: chatBoxRef.value.scrollHeight, behavior: 'smooth' })
  })
}

const sendMessage = () => {
  if (!nicknameSet.value || !input.value.trim()) return

  const msg = { from: nickname.value, to: 'admin', text: input.value }
  socket.send(JSON.stringify(msg))

  messages.value.push({ from: 'me', text: msg.text })
  input.value = ''
  scrollToBottom()
}

const setupSocket = () => {
  const SOCKET_URL = `ws://localhost:8080/ws/chat?nickname=${nickname.value}`
  socket = new WebSocket(SOCKET_URL)

  socket.onopen = () => console.log('✅ WebSocket 연결 성공')

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data)

    if (msg.from === 'admin') {
      messages.value.push({ from: 'admin', text: msg.text })

      // 채팅창이 열려있지 않으면 뱃지 카운트 증가
      if (!showChat.value) {
        unreadCount.value++
      }

    } else if (msg.from === nickname.value) {
      messages.value.push({ from: 'me', text: msg.text })
    } else {
      messages.value.push(msg)
    }

    scrollToBottom()
  }


  socket.onclose = () => console.warn('❌ WebSocket 연결 종료')
  socket.onerror = err => console.error('WebSocket 에러:', err)
}

const setNickname = () => {
  if (!nickname.value.trim()) return alert('닉네임을 입력하세요.')
  nicknameSet.value = true
  setupSocket()
  showChat.value = true
}

const toggleChat = () => {
  showChat.value = !showChat.value

  // 열면서 읽음 처리
  if (showChat.value) {
    unreadCount.value = 0
  }
}


onUnmounted(() => socket?.close())
</script>




<template>
  <div>
    <!-- 💬 버튼 -->
    <button class="chat-toggle" @click="toggleChat">
      💬
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </button>
    <!-- 닉네임 입력 -->
    <div v-if="!nicknameSet && showChat" class="nickname-setup">
      <input v-model="nickname" placeholder="닉네임을 입력하세요" />
      <button @click="setNickname">닉네임 설정</button>
    </div>

    <!-- 채팅창 -->
    <div v-if="nicknameSet && showChat" class="chat-container">
      <div class="chat-box" ref="chatBoxRef">
        <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['chat-message', msg.from === 'me' ? 'me' : msg.from === 'admin' ? 'admin' : 'other']"
        >
          <template v-if="msg.from === 'me'">{{ msg.text }}</template>
          <template v-else><span class="sender">{{ msg.from }}:</span> {{ msg.text }}</template>
        </div>
      </div>

      <div class="chat-input">
        <input v-model="input" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
        <button @click="sendMessage">전송</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.chat-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 24px;
  padding: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  z-index: 1000;
}

.nickname-setup {
  position: fixed;
  bottom: 80px;
  right: 20px;
  display: flex;
  gap: 10px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
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
  height: 250px;
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

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 4px 7px;
  font-size: 12px;
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
