<script setup>
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useTheme } from "@/composable/useTheme";
import NavOptions from "@/components/NavOptions.vue";
import api from "@/composable/useApi";

const { t } = useI18n();
const { isDark } = useTheme();
const router = useRouter();
const email = ref("");
const loading = ref(false);
const errorMessage = ref("");

const UnespLogo = ref("");

function updateImages() {
  UnespLogo.value = isDark.value
    ? new URL("../assets/images/UNESP-dark.png", import.meta.url).href
    : new URL("../assets/images/UNESP-light.png", import.meta.url).href;
}

onMounted(updateImages);
watch(isDark, updateImages);

async function handleSubmit(event) {
  event.preventDefault();
  errorMessage.value = "";
  loading.value = true;

  try {
    const response = await api.post("/auth/send-code", { email: email.value });
    localStorage.setItem("userEmail", email.value);

    if (response.status === 200) {
      router.push("/auth");
    } else {
      errorMessage.value = "Erro ao enviar código. Tente novamente.";
    }
  } catch (error) {
    console.error(error);
    errorMessage.value =
      error.response?.data?.detail || "Falha ao conectar com o servidor.";
  } finally {
    loading.value = false;
  }
}
</script>


<template>
  <NavOptions />
  <main>
    <img :src="UnespLogo" alt="UNESP logo" />
    <section>
      <form @submit="handleSubmit">
        <div>
          <label class="label-form" for="email">{{ t("login.emailLabel") }}</label>
          <input id="email" v-model="email" class="input-form" type="email" placeholder="exemplo@unesp.br" required />
        </div>
        <div>
          <button class="blue-button" type="submit" :disabled="loading">
            {{ loading ? "Enviando..." : t("login.continue") }}
          </button>
        </div>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      </form>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  height: 100%;
}

img {
  width: 14rem;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  min-width: 19.7rem;
}

form div {
  display: flex;
  flex-direction: column;
  width: 100%;
}

a {
  font-size: 14px;
}
</style>
