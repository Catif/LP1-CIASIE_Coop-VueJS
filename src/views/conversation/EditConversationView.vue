<script setup>
const router = inject("router");
const route = inject("route");
const Session = inject("session");

const information = reactive({
  label: "",
  topic: "",
  token: Session.data.token,
});
const error = ref("");

function editConv() {
  if (information.label == "" || information.topic == "") {
    error.value = "Veuillez remplir tous les champs.";
    return;
  }
  api.put("channels/" + route.params.id, { body: information }).then((data) => {
    if (data.message) {
      error.value = data.message;
    } else {
      router.push("/conversations/");
    }
  });
}

function loadData() {
  api.get(`channels/${route.params.id}?token=${Session.data.token}`).then((data) => {
    if (data) {
      information.label = data.label;
      information.topic = data.topic;
    }
  });
}

loadData();
</script>

<template>
  <div>
    <Alert v-if="error" type="error" :message="error" />

    <h1>Edition d'une conversation</h1>

    <form @submit.prevent="editConv">
      <div class="form-group">
        <label for="label">Titre</label>
        <input type="text" v-model="information.label" require />
      </div>
      <div class="form-group">
        <label for="topic">Sujet</label>
        <input type="text" v-model="information.topic" require />
      </div>
      <div class="list-button">
        <button class="btn-primary">Modifier</button>
        <router-link to="/conversations" class="btn-secondary">Annuler</router-link>
      </div>
    </form>
  </div>
</template>

<style lang="scss"></style>
