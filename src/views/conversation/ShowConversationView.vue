<script setup>
const router = inject("router");
const route = inject("route");
const Session = inject("session");

const conversation = reactive({
  channel: {},
  messages: [],
});
const information = reactive({
  member_id: Session.data.member.id,
  message: "",
});
const message = ref("Chargement...");
const error = ref("");

function chargerChannel() {
  api
    .get(`channels/${route.params.id}?token=${Session.data.token}`)
    .then((data) => {
      if (data) {
        conversation.channel = data;
      } else {
        router.push({ name: "conversations" });
      }
    });
}
function chargerMessages() {
  api
    .get(`channels/${route.params.id}/posts?token=${Session.data.token}`)
    .then((data) => {
      if (data.length) {
        data.reverse();
        data.map((el) => {
          el.date = new Date(el.created_at).toLocaleTimeString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
        });
        conversation.messages = data;
      } else {
        message.value = "Aucune message pour le moment.";
      }
    });
}

function postMessage() {
  if (information.message) {
    api
      .post(`channels/${route.params.id}/posts?token=${Session.data.token}`, {
        body: information,
      })
      .then((data) => {
        chargerMessages();
      });
    information.message = "";
  } else {
    error.value = "Vous ne pouvez pas envoyer de message vide.";
  }
}

function deleteMessage(idMessage){
  if (confirm("Voulez-vous vraiment supprimer ce message ?")){
    api.delete(`channels/${route.params.id}/posts/${idMessage}?token=${Session.data.token}`).then(data => {
      chargerMessages();
    })
  }
}

onMounted(() => {
  chargerChannel();
  chargerMessages();
});
</script>

<template>
  <div>
    <Alert v-if="error" type="error" :message="error" />
    <h1>{{ conversation.channel.label }}</h1>
    <div id="list-convs">
      <template
        v-if="conversation.messages.length"
        v-for="(message, index) in conversation.messages"
      >
        <div class="message">
          <div class="member">
            <img
              :src="
                'https://ui-avatars.com/api/?background=random&color=E5E5E5&size=300&name=' +
                'John Doe'
              "
              alt="photo de profile"
            />
            <p class="fullname">John Doe</p>
            <p class="email">john.doe@example.org</p>
            <p class="date">{{ message.date }}</p>
          </div>
          <div class="data">
            <p>
              {{ message.message }}
            </p>
          </div>
          <div class="list-buttons">
            <button class="btn-primary" @click="deleteMember(message.id)">
              <icon-EditPencil />
            </button>
            <button class="btn-danger" @click="deleteMessage(message.id)">
              <icon-Trash />
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <p>{{ message }}</p>
      </template>

      <form @submit.prevent="postMessage">
        <div class="form-group">
          <textarea
            v-model="information.message"
            placeholder="Bonjour..."
            require
          />
          <div class="list-button">
            <button class="btn-primary">Envoyer le message</button>
          </div>
        </div>
      </form>
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

  .message {
    position: relative;
    width: 100%;
    max-width: 900px;
    background-color: $background-color;
    color: $color;
    padding: 20px 20px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 20px;

    .member {
      img {
        max-width: 150px;
        border-radius: 5px;
        margin-bottom: 5px;
      }
      .fullname {
        color: $color;
        font-size: 18px;
      }
      .email {
        color: darken($color, 30%);
        font-size: 13px;
      }
      .date {
        font-size: 12px;
      }
    }

    .data {
      display: flex;
      flex-grow: 1;
      flex-direction: column;

      p {
        width: 100%;
      }
    }

    .list-buttons{
      opacity: 0;
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &:hover .list-buttons{
      opacity: 1;
      transition: all .2s ease;
    }
  }
}
</style>
