<script setup>
import Message from "@/components/Message.vue";

const router = inject("router");
const route = inject("route");
const Session = inject("session");
const bus = inject("bus");

const conversation = reactive({
  channel: {},
  messages: [],
  members: [],
});
const information = reactive({
  member_id: Session.data.member.id,
  message: "",
});
const messagePage = ref("Chargement...");
const error = ref("");

// Load variables
function loadChannel() {
  return api.get(`channels/${route.params.id}?token=${Session.data.token}`).then((data) => {
    if (data) {
      conversation.channel = data;
    } else {
      router.push({ name: "conversations" });
    }
  });
}
function loadMessages() {
  return api.get(`channels/${route.params.id}/posts?token=${Session.data.token}`).then((data) => {
    if (!data.length) {
      messagePage.value = "Aucun message";
      return false;
    }

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

      if (el.modified_at === el.created_at) {
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
  });
}
function loadMembers() {
  return api.get(`members?token=${Session.data.token}`).then((data) => {
    if (data.length) {
      conversation.members = data;
    } else {
      error.value = "Aucun membre trouvé.";
    }
  });
}

// Action API
function postMessage() {
  if (!information.message) {
    error.value = "Vous ne pouvez pas envoyer de message vide.";
    return false;
  }

  api
    .post(`channels/${route.params.id}/posts?token=${Session.data.token}`, {
      body: information,
    })
    .then((data) => {
      loadMessages();
      information.message = "";
    });
}

// Action BUS
bus.on("error", (message) => {
  error.value = message;
});
bus.on("load-messages", () => {
  loadMessages();
});

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
      <template v-if="conversation.messages.length">
        <Message v-for="(message, index) in conversation.messages" :message="message" :canEdit="true"></Message>
      </template>
      <template v-else>
        <p>{{ messagePage }}</p>
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
#list-convs {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}
</style>
