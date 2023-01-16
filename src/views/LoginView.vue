<script setup>
const router = inject("router");
const Session = inject("session");

const information = reactive({
  email: "",
  password: "",
});

const error = ref("");

let login = () => {
  if (information.email && information.password) {
    error.value = "";
    api
      .post("members/signin", { body: information })
      .then((data) => {
        if (data.message) {
          error.value = data.message;
        } else {
          Session.setSession(data.member, data.token);
          router.push("/");
        }
      })
      .catch((errorRes) => {
        error.value = errorRes;
      });
  } else {
    error.value = "Tous les champs ne sont pas remplie";
  }
};
</script>

<template>
  <div>
    <Alert v-if="error" :type="'error'" :message="error" />

    <h1>Page de connexion</h1>

    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="information.email" require />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" v-model="information.password" require />
      </div>
      <div class="list-button">
        <button class="btn-primary">Connexion</button>
        <router-link to="/register" class="btn-secondary"
          >Pas de compte ?</router-link
        >
      </div>
    </form>
  </div>
</template>

<style lang="scss"></style>
