<script setup>
const router = inject("router");
const Session = inject("session");

const information = reactive({
  label: "",
  topic: "",
  token: Session.data.token,
});
const error = ref("");

const createConv = () => {
  api.post("channels", { body: information }).then((data) => {
    if (data.message) {
      error.value = data.message;
    } else {
      router.push("/conversation/" + data.id);
    }
  });
};
</script>

<template>
  <div>
    <Alert v-if="error" type="error" :message="error" />

    <h1>Création d'une conversation</h1>

    <form @submit.prevent="createConv">
      <div class="form-group">
        <label for="label">Titre</label>
        <input type="text" v-model="information.label" require />
      </div>
      <div class="form-group">
        <label for="topic">Sujet</label>
        <input type="text" v-model="information.topic" require />
      </div>
      <div class="list-button">
        <button class="btn-primary">Créer</button>
        <router-link to="/conversations" class="btn-secondary">Annuler</router-link>
      </div>
    </form>
  </div>
</template>

<style lang="scss"></style>
