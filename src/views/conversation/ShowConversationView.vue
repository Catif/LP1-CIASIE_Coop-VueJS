<script setup>
const router = inject("router");
const route = inject("route");
const Session = inject("session");

const conversation = reactive({
  channel: {},
  messages: [],
  members: [],
});
const information = reactive({
  member_id: Session.data.member.id,
  message: "",
});
const message = ref("Chargement...");
const error = ref("");

function loadChannel() {
  api.get(`channels/${route.params.id}?token=${Session.data.token}`).then((data) => {
    if (data) {
      conversation.channel = data;
    } else {
      router.push({ name: "conversations" });
    }
  });
}
function loadMessages() {
  api.get(`channels/${route.params.id}/posts?token=${Session.data.token}`).then((data) => {
    if (data.length) {
      data.reverse();
      data.map((el) => {
        el.member = conversation.members.find((member) => member.id == el.member_id);
        el.dateLong = new Date(el.created_at).toLocaleTimeString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        el.dateShort = new Date(el.created_at).toLocaleTimeString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        if(el.modified_at === el.created_at){
          el.dateEditedLong = null;
        } else {
          el.dateEditedLong = new Date(el.modified_at).toLocaleTimeString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          el.dateEditedShort = new Date(el.modified_at).toLocaleTimeString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
        }
        el.edit = false;
        el.messageEdited = el.message;
      });
      conversation.messages = data;
    } else {
      message.value = "Aucune message pour le moment.";
    }
    console.log(conversation.messages)
  });
}

function loadMembers() {
  return api.get(`members?token=${Session.data.token}`).then((data) => {
    if (data.length) {
      conversation.members = data;
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
        loadMessages();
      });
    information.message = "";
  } else {
    error.value = "Vous ne pouvez pas envoyer de message vide.";
  }
}

function showEditFormMessage(message) {
  message.edit = true;
}

function hideEditFormMessage(message) {
  message.edit = false;
  message.messageEdited = message.message;
}

function editMessage(message) {
  if (message.messageEdited) {
    let messageEdited = {
      message: message.messageEdited,
      token: Session.data.token,
    };

    api
      .put(`channels/${route.params.id}/posts/${message.id}`, {
        body: messageEdited,
      })
      .then((data) => {
        loadMessages();
      });
    information.message = "";
  } else {
    error.value = "Vous ne pouvez pas envoyer de message vide.";
  }
}

function deleteMessage(idMessage) {
  if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
    api.delete(`channels/${route.params.id}/posts/${idMessage}?token=${Session.data.token}`).then((data) => {
      loadMessages();
    });
  }
}

onMounted(() => {
  loadChannel();
  loadMembers().then(() => {
    loadMessages();
  });
});
</script>

<template>
  <div>
    <Alert v-if="error" type="error" :message="error" />
    <h1>{{ conversation.channel.label }}</h1>
    <div id="list-convs">
      <template v-if="conversation.messages.length" v-for="(message, index) in conversation.messages">
        <div class="message">
          <div class="member">
            <div>
              <RouterLink class="fullname" :to="'/profile/' + message.member.id"
                ><img
                  :src="'https://ui-avatars.com/api/?background=random&color=E5E5E5&size=300&name=' + message.member.fullname"
                  alt="photo de profile"
              /></RouterLink>
              <div>
                <RouterLink class="fullname" :to="'/profile/' + message.member.id">{{ message.member.fullname }} </RouterLink>
                <RouterLink class="email" :to="'/profile/' + message.member.id">{{ message.member.email }}</RouterLink>
              </div>
            </div>
            <div class="date">
              <p class="date" :title="message.dateShort">{{ message.dateLong }}</p>
              <template v-if="message.dateEditedLong">
                  <p class="date" :title="message.dateEditedShort"><icon-EditPencil /> {{ message.dateEditedLong }}</p>
              </template>
            </div>
          </div>
          <hr />
          <div class="data">
            <template v-if="!message.edit">
              <p v-html="message.message"></p>
            </template>
            <template v-else>
              <form @submit.prevent="editMessage(message)">
                <div class="form-group">
                  <textarea v-model="message.messageEdited" require />
                  <div class="list-button">
                    <button class="btn-primary">Modifier le message</button>
                  </div>
                </div>
              </form>
            </template>
          </div>
          <div class="list-buttons">
            <template v-if="!message.edit">
              <button class="btn-primary" @click="showEditFormMessage(message)">
                <icon-EditPencil />
              </button>
            </template>
            <template v-else>
              <button class="btn-primary" @click="hideEditFormMessage(message)">
                <icon-Cross />
              </button>
            </template>
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
          <textarea v-model="information.message" placeholder="Bonjour..." require />
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
    flex-direction: column;
    align-items: stretch;
    gap: 10px;

    hr {
      border: 1px solid darker($color, 40);
      border-top: none;
      width: 100%;
    }

    .member {
      display: flex;
      align-items: center;
      justify-content: space-between;

      & > div {
        display: flex;
        gap: 10px;

        img {
          max-width: 50px;
          border-radius: 5px;
        }

        & > div {
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          .fullname {
            color: $color;
            font-size: 18px;
          }

          .email {
            color: darken($color, 40%);
            font-size: 13px;
          }
        }
      }

      div.date{
        display: flex;
        flex-direction: column;

        div{
          display: flex;
          gap: 5px;
        }
        p.date {
          font-size: 12px;
          text-align: right;          
          svg{
            position: relative;
            top: 2px;
            display:inline;
            width: 12px;
            height: 12px;
          }

          &:nth-child(2){
            color: darken($color, 40%);
          }
        }
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

    .list-buttons {
      opacity: 0;
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      flex-direction: row;
      gap: 10px;
    }

    &:hover .list-buttons {
      opacity: 1;
      transition: all 0.2s ease;
    }
  }
}
</style>
