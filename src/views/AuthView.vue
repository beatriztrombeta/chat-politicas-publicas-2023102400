<script setup>
import NavOptions from "@/components/NavOptions.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const code = ref("");
const error = ref("");
const loading = ref(false);
const resending = ref(false);
const showResend = ref(false);

const apiUrl = import.meta.env.VITE_BACKEND_API_URL

onMounted(() => {
  const storedEmail = localStorage.getItem("userEmail");
  showResend.value = !!storedEmail;
});

const handleSubmit = async (e) => {
  e.preventDefault();
  error.value = "";
  loading.value = true;

  const email = localStorage.getItem("userEmail");
  if (!email) {
    error.value = "E-mail não encontrado. Volte para a etapa anterior.";
    loading.value = false;
    return;
  }

  try {
    const res = await axios.post(
      "/auth/verify-code",
      {
        email,
        code: code.value,
      },
      { withCredentials: true }
    );
    console.log(res.data);

    router.push("/home");
  } catch (err) {
    console.error(err);
    error.value = "Código inválido ou erro na verificação.";
  } finally {
    loading.value = false;
  }
};

async function resendCode() {
  resending.value = true;
  error.value = "";

  try {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      error.value = "E-mail não encontrado. Volte para a etapa anterior.";
      return;
    }

    await axios.post(
      "/auth/send-code",
      { email },
      { withCredentials: true }
    );
  } catch (err) {
    console.error(err);
    error.value = "Erro ao reenviar código. Tente novamente.";
  } finally {
    resending.value = false;
  }
}
</script>

<template>
  <NavOptions />
  <main>
    <div id="circle">
      <img id="locker" src="../assets/images/locker.svg" alt="locker svg" />
    </div>
    <section>
      <p>{{ t("auth.instruction") }}</p>
      <form @submit="handleSubmit">
        <div>
          <label class="label-form">{{ t("auth.codeLabel") }}</label>
          <input class="input-form" v-model="code" type="text" required />
        </div>
        <div>
          <button class="blue-button" :disabled="loading">
            {{ loading ? "Verificando..." : t("auth.continue") }}
          </button>
          <a v-if="showResend" href="#" @click.prevent="resendCode" :style="{ opacity: resending ? 0.6 : 1 }">
            {{ resending ? "Reenviando..." : "Reenviar código" }}
          </a>
        </div>

        <p v-if="error" style="color: red; text-align: center;">{{ error }}</p>
      </form>
    </section>
  </main>
</template>

<style scoped>
main {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

#circle {
  border-radius: 100%;
  border: 0.3rem solid var(--color-primary);
}

#locker {
  width: 8rem;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 19.7rem;
}

section p {
  width: 70%;
  text-align: center;
  align-self: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

form div {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
