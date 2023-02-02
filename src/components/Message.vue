<script setup>
const Session = inject("session");
const route = inject("route");
const bus = inject("bus");

const props = defineProps({
  message: Object,
  canEdit: {
    type: Boolean,
    default: false,
  },
});

const information = reactive({
  member_id: Session.data.member.id,
  message: "",
});

// Action API
function editMessage() {
  if (!props.canEdit) {
    return false;
  }

  if (!props.message.messageEdited) {
    let error = "Vous ne pouvez pas envoyer de message vide.";
    bus.emit("error", error);
    return false;
  }

  if (props.message.messageEdited == props.message.message) {
    let error = "Vous n'avez pas modifié le message.";
    bus.emit("error", error);
    return false;
  }

  let messageEdited = {
    message: props.message.messageEdited,
    token: Session.data.token,
  };

  api
    .put(`channels/${route.params.id}/posts/${props.message.id}`, {
      body: messageEdited,
    })
    .then((data) => {
      bus.emit("load-messages");
    });

  information.message = "";
}
function deleteMessage() {
  if (!props.canEdit) {
    return false;
  }

  if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
    api.delete(`channels/${route.params.id}/posts/${props.message.id}?token=${Session.data.token}`).then((data) => {
      bus.emit("load-messages");
    });
  }
}

// Action HTML
function showEditFormMessage() {
  if (!props.canEdit) {
    return false;
  }

  props.message.edit = true;
  props.message.messageEdited = props.message.message;
}

function hideEditFormMessage() {
  if (!props.canEdit) {
    return false;
  }

  props.message.edit = false;
  props.message.messageEdited = props.message.message;
}
</script>

<template>
  <div v-if="props.message" class="message">
    <div class="member">
      <div>
        <RouterLink class="fullname" :to="'/profile/' + props.message.member.id"
          ><img
            :src="'https://ui-avatars.com/api/?background=random&color=E5E5E5&size=300&name=' + message.member.fullname"
            alt="photo de profile"
        /></RouterLink>
        <div>
          <RouterLink class="fullname" :to="'/profile/' + props.message.member.id">{{ props.message.member.fullname }} </RouterLink>
          <RouterLink class="email" :to="'/profile/' + props.message.member.id">{{ props.message.member.email }}</RouterLink>
        </div>
      </div>
      <div class="date">
        <p class="date" :title="props.message.dateShort">{{ props.message.dateLong }}</p>
        <template v-if="props.message.dateEditedLong">
          <p class="date" :title="props.message.dateEditedShort"><i class="bi bi-pencil-square"></i> {{ props.message.dateEditedLong }}</p>
        </template>
      </div>
    </div>
    <hr />
    <div class="data">
      <template v-if="!props.message.edit">
        <p v-html="message.message"></p>
      </template>
      <template v-else>
        <form @submit.prevent="editMessage()">
          <div class="form-group">
            <textarea v-model="props.message.messageEdited" require />
            <div class="list-button">
              <button class="btn-primary">Modifier le message</button>
            </div>
          </div>
        </form>
      </template>
    </div>
    <div v-if="props.canEdit" class="list-buttons">
      <template v-if="!props.message.edit">
        <button class="btn-primary" @click="showEditFormMessage()">
          <i class="bi bi-pencil-square"></i>
        </button>
      </template>
      <template v-else>
        <button class="btn-primary" @click="hideEditFormMessage()">
          <i class="bi bi-x-lg"></i>
        </button>
      </template>
      <button class="btn-danger" @click="deleteMessage()">
        <i class="bi bi-trash-fill"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$color: #e5e5e5;
$background-color: hsl(231, 100%, 10%);
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

    div.date {
      display: flex;
      flex-direction: column;

      div {
        display: flex;
        gap: 5px;
      }
      p.date {
        font-size: 12px;
        text-align: right;
        svg {
          position: relative;
          top: 2px;
          display: inline;
          width: 12px;
          height: 12px;
        }

        &:nth-child(2) {
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
</style>
