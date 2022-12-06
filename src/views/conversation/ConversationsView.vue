<script setup>
const Session = inject('session');
const listConvs = ref([]);
const message = ref("Chargement...");

api.get("channels?token=" + Session.data.token).then((data) => {
  if (data.length === 0) {
    message.value = "Aucune conversation pour le moment.";
  } else {
    listConvs.value = data;
  }
});

const deleteConv = (id) => {
  if (confirm("Voulez-vous vraiment supprimer ce membre ?")) {
    api
      .delete(`channels/${id}`, { body: { token: Session.data.token } })
      .then((data) => {
        listConvs.value.splice(listConvs.value.findIndex(element => element.id === id), 1);

        if (listConvs.length === 0){
          message.value = "Aucune conversation pour le moment.";
        }
      });
  }
};
</script>

<template>
  <div>
    <h1>Liste des conversations</h1>
    <div id="list-convs">
      <router-link to="/create-conversation" class="btn-primary"
        >Créer une conversation</router-link
      >
      <template v-if="listConvs.length" v-for="(conv, index) in listConvs">
        <div class="conv">
          <div class="information">
            <p class="title">{{ conv.label }}</p>
            <p class="topic">{{ conv.topic }}</p>
          </div>
          <div class="buttons">
            <router-link class="btn-primary" :to="'/conversation/' + conv.id"
              >Ouvrir</router-link
            >
            <button class="btn-danger" @click="deleteConv(conv.id, index)">
              <icon-Trash />
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <p>{{ message }}</p>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$color: #e5e5e5;
$background-color: hsl(231, 100%, 10%);

#list-convs {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;

  .conv {
    width: 100%;
    max-width: 500px;
    background-color: $background-color;
    color: $color;
    padding: 10px 20px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .information {
      .title {
        color: $color;
      }
      .topic {
        color: darken($color, 30%);
        font-size: 13px;
      }
    }

    .buttons {
      display: flex;
      gap: 10px;
    }
  }
}
</style>
