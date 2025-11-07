<script setup>
import { ref, watch, nextTick } from "vue";
import { useTheme } from "@/composable/useTheme";
import { useI18n } from "vue-i18n";
import ProfileMenu from "@/components/ProfileMenu.vue";
import SettingsModal from "@/components/SettingsModal.vue";
import api from "@/composable/useApi";

const { t } = useI18n();
const { isDark } = useTheme();

const answer = ref("");
const chatWrapper = ref(null);
const error = ref("");
const isCollapsed = ref(false);
const loading = ref(false);
const messages = ref([]);
const question = ref("");
const showMenu = ref(false);
const showSettings = ref(false);
const reportLink = ref(null);

const apiUrl = import.meta.env.BACKEND_API_URL

function toggleChat() {
  isCollapsed.value = !isCollapsed.value;
}

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function openSettings() {
  showSettings.value = true;
}

function scrollToBottom() {
  const el = chatWrapper.value;
  if (el) el.scrollTop = el.scrollHeight;
}

async function handleAsk(event) {
  event.preventDefault();

  if (loading.value) return;
  if (!question.value.trim()) return;

  messages.value.push({ text: question.value, sender: "user" });

  loading.value = true;
  error.value = "";
  answer.value = "";
  reportLink.value = null;

  const currentQuestion = question.value;
  question.value = "";

  await nextTick();
  scrollToBottom();

  try {
    const response = await api.post("/chat", {
      question: currentQuestion,
    });

    answer.value = response.data.answer;
    reportLink.value = response.data.report_link;

    messages.value.push({ text: answer.value, sender: "bot" });

    await nextTick();
    scrollToBottom();

  } catch (err) {
    console.error(err);
    error.value = "Erro ao obter resposta do chatbot.";
  } finally {
    loading.value = false;
  }
}

watch(isDark);
</script>

<template>
  <main>
    <section v-if="!isCollapsed" id="chat">
      <div id="header">
        <button class="invisible-button" @click="toggleMenu">
          <svg id="profile" width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle class="profile-bg" cx="19.5" cy="19.5" r="19.5" fill="#39BFF2" />
            <mask id="mask0_80_448" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="39"
              height="39">
              <circle class="profile-user" cx="19.5" cy="19.5" r="19.5" fill="#4A4A4A" />
            </mask>
            <g mask="url(#mask0_80_448)">
              <circle class="profile-user" cx="19.8422" cy="35.579" r="13" fill="#AEE6FB" />
              <circle class="profile-user" cx="19.5" cy="14.0264" r="5.81579" fill="#AEE6FB" />
            </g>
          </svg>
        </button>
        <ProfileMenu :show="showMenu" @close="showMenu = false" @open-settings="openSettings" />
        <button class="invisible-button" @click="toggleChat">
          <svg id="close-tab" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect class="close-vector" x="1" y="1" width="17" height="17" rx="2" stroke="#00AEEF" stroke-width="2" />
            <line class="close-vector" x1="5.5238" y1="4.37114e-08" x2="5.5238" y2="19" stroke="#00AEEF"
              stroke-width="2" />
          </svg>
        </button>
      </div>
      <div id="body">
        <div id="chat-wrapper" ref="chatWrapper">
          <transition-group name="fade-up" tag="div" class="message-list">
            <div v-for="(msg, i) in messages" :key="i" :class="['message', msg.sender]">
              {{ msg.text }}
            </div>
          </transition-group>
          <div v-if="loading" class="loading-spinner"></div>
        </div>
        <form @submit="handleAsk" @keydown.enter.prevent="handleAsk">
          <input v-model="question" type="text" :placeholder="t('home.ask')" autocomplete="off" :disabled="loading"/>
          <button class="white" type="submit" :disabled="loading">
            <img id="arrow-top" src="../assets/images/arrow-top.svg" />
          </button>
        </form>
      </div>
    </section>
    <div v-else id="collapsed-chat" @click="toggleChat">
      <svg id="expand-icon" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect class="close-vector" x="1" y="1" width="17" height="17" rx="2" stroke="#00AEEF" stroke-width="2" />
        <line class="close-vector" x1="5.5238" y1="4.37114e-08" x2="5.5238" y2="19" stroke="#00AEEF" stroke-width="2" />
      </svg>
    </div>
    <section id="report">
      <div>
        <iframe width="600" height="450" src={{reportLink.value}} frameborder="0" style="border:0" allowfullscreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
        </iframe>
      </div>
    </section>

    <SettingsModal v-if="showSettings" @close="showSettings = false" />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: row;
  height: 100%;
  position: relative;
}

#chat {
  width: 18%;
  padding: 1rem;
  background-color: var(--color-chat-bg);
  display: flex;
  flex-direction: column;
}

#collapsed-chat {
  width: 3rem;
  height: 100%;
  background-color: var(--color-chat-bg);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: width 0.3s ease;
}

#expand-icon {
  width: 1.2rem;
  margin-top: 1rem;
  cursor: pointer;
}

#report {
  flex: 1;
  padding: 1rem;
}

#report div {
  border: 0.2rem solid var(--color-report-border);
  height: 100%;
  border-radius: var(--radius-md);
  background-color: var(--color-report-bg);
}

iframe {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5%;
}

#profile {
  width: 2.2rem;
  height: fit-content;
  border-radius: 100%;
  box-shadow: var(--shadow-sm);
}

.profile-bg {
  fill: var(--color-profile-bg);
}

.profile-user {
  fill: var(--color-profile-user);
}

.invisible-button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}

#close-tab {
  width: 1.2rem;
}

.close-vector {
  stroke: var(--color-close-tab);
}

#body {
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

::-webkit-scrollbar {
  width: 0.4rem;
}

::-webkit-scrollbar-track {
  background: none;
}

::-webkit-scrollbar-thumb {
  background: var(--color-chatbar-bg);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-chatbar-hv);
}

#chat-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.chat-error {
  color: red;
  text-align: center;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem 0 1rem;
}

.message {
  max-width: 70%;
  padding: 0.7rem 1rem;
  border-radius: 16px;
  word-wrap: break-word;
  white-space: pre-wrap;
  background-color: var(--color-message-bg);
  box-shadow: var(--shadow-sm);
}

.message.user {
  align-self: flex-end;
}

.message.bot {
  align-self: flex-start;
}

.message.bot.error {
  background-color: #ffdddd;
  color: #a00;
}

.fade-up-enter-active {
  transition: all 0.35s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

form {
  display: flex;
  flex-direction: row;
  border: 1px solid var(--normal-blue);
  border-radius: var(--radius-gg);
  justify-content: space-between;
  padding: 0.6rem 0.8rem;
  box-shadow: var(--shadow-sm);
}

input {
  border: 0;
  background: none;
  width: 100%;
  font-family: var(--font-sans-serif);
}

input,
input::placeholder {
  font-size: 16px;
  font-weight: 500;
}

.white {
  background-color: var(--white);
  border: none;
  border-radius: 100%;
  padding: 0.3rem;
  display: flex;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  padding: 0.4rem;
}

.white img {
  width: 1rem;
  height: 1rem;
}

.loading-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid var(--color-report-border);
  border-top-color: var(--normal-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 1rem auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
