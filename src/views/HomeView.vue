<script setup>
import { ref, watch, onMounted } from "vue";
import { useTheme } from "@/composable/useTheme";
import { useI18n } from "vue-i18n";
import ProfileMenu from "@/components/ProfileMenu.vue";
import SettingsModal from "@/components/SettingsModal.vue";

const { t } = useI18n();
const { isDark } = useTheme();
const isCollapsed = ref(false);
const closeTabSrc = ref("");
const showMenu = ref(false);
const showSettings = ref(false);

function toggleChat() {
  isCollapsed.value = !isCollapsed.value;
}

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function openSettings() {
  showSettings.value = true;
}

function updateImages() {
  closeTabSrc.value = isDark.value
    ? new URL("../assets/images/close-dark.svg", import.meta.url).href
    : new URL("../assets/images/close-light.svg", import.meta.url).href;
}

onMounted(() => {
  updateImages();
});

watch(isDark, updateImages);
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
        <div id="chat-wrapper"></div>
        <form>
          <input type="text" :placeholder="t('home.ask')" />
          <button class="white">
            <img id="arrow-top" src="../assets/images/arrow-top.svg" />
          </button>
        </form>
      </div>
    </section>
    <div v-else id="collapsed-chat" @click="toggleChat">
      <svg id="expand-icon" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect class="close-vector" x="1" y="1" width="17" height="17" rx="2" stroke="#00AEEF" stroke-width="2" />
            <line class="close-vector" x1="5.5238" y1="4.37114e-08" x2="5.5238" y2="19" stroke="#00AEEF"
              stroke-width="2" />
          </svg>
    </div>
    <section id="report">
      <div>
        <a href="#"></a>
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
</style>
