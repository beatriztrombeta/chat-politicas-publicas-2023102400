<script setup>
import { useLogin } from "@/composables/useLogin.js";
</script>

<template>
  <main>
    <img src="../assets/images/UNESP-light.png" alt="UNESP logo" />
    <section>
      <form action="">
        <div>
          <label class="label-form" for="">E-mail</label>
          <input class="input-form" type="email" />
        </div>
        <div>
          <button>Continuar</button>
        </div>
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
  gap: 3rem;
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
