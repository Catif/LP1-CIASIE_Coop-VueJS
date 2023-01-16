<script setup>
const Session = inject('session');

const listMembers = ref([]);
const message = ref('Chargement...')

api.get("members?token=" + Session.data.token).then((data) => {
  if (data.length === 0){
    message.value = 'Il n\'existe aucune membre'
  } else {
    listMembers.value = data;
  }
});

const deleteMember = (id, index) => {
  if (Session.data.member.id != id) {
    if (confirm("Voulez-vous vraiment supprimer ce membre ?")) {
      api
        .delete(`members/${id}`, { body: { token: Session.data.token } })
        .then((data) => {
          listMembers.value.splice(listMembers.value.findIndex(element => element.id === id), 1);
        });
    }
  } else {
    alert("Mais... C'est vous !");
  }
};
</script>

<template>
  <div>
    <h1>Liste des membres</h1>
    <div id="list-member">
      <template
        v-if="listMembers.length"
        v-for="(member, index) in listMembers"
      >
        <div class="member">
          <div class="information">
            <p class="fullname">{{ member.fullname }}</p>
            <p class="email">{{ member.email }}</p>
          </div>
          <div class="buttons">
            <RouterLink class="btn-primary" :to="'/profile/' + member.id"
              >Voir</RouterLink
            >
            <button class="btn-danger" @click="deleteMember(member.id, index)">
              <icon-Trash />
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <p>{{message}}</p>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$color: #e5e5e5;
$background-color: hsl(231, 100%, 10%);

#list-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;

  .member {
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
      .fullname {
        color: $color;
      }
      .email {
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
