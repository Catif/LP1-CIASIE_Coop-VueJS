<script setup>
const Route = inject("route");
const Session = inject("session");

const member = ref(false);

watch(Route, (to) => {
  loadMember().then(() => loadLastMessages());
});

function loadMember() {
  return api.get("members").then((data) => {
    if (Route.params.id) {
      member.value = data.find((member) => member.id === Route.params.id);
    } else {
      member.value = Session.data.member;
    }
    let date = new Date(member.value.created_at);
    member.value.created_atFormated = [("0" + date.getDate()).slice(-2), ("0" + date.getMonth()).slice(-2), date.getFullYear()].join("/");

    member.value.email = member.value.email.toLowerCase();
  });
}

loadMember();
</script>

<template>
  <div>
    <template v-if="!member">
      <p>Chargement du profil...</p>
    </template>
    <template v-else>
      <div id="Profile">
        <div id="Information">
          <img
            :src="'https://ui-avatars.com/api/?background=random&color=E5E5E5&size=300&name=' + member.fullname"
            alt="photo de profile"
          />
          <p><span>Nom complet :</span> {{ member.fullname }}</p>
          <p>
            <span>Email :</span> <a :href="'mailto=' + member.email">{{ member.email }}</a>
          </p>
          <p><span>Date de création :</span> {{ member.created_atFormated }}</p>
        </div>
        <div id="Last-Messages">
          <h2>Liste des derniers messages :</h2>
          <div class="list-messages">
            <template v-for="i in 5">
              <div class="message">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam temporibus cum voluptatibus autem eum, eius sunt
                  voluptatum officiis eveniet reprehenderit aut pariatur sint facere ex aperiam id ab distinctio veniam!
                </p>
                <div>
                  <p>NomConversation</p>
                  <p>01/01/2022</p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
#Profile {
  display: flex;
  gap: 100px;

  #Information {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 300px;

    img {
      border-radius: 5px;
      width: 100%;
    }

    p {
      span {
        font-weight: 800;
        text-decoration: underline;
      }
    }
  }

  #Last-Messages {
    width: 100%;
    display: flex;
    flex-direction: column;

    .list-messages {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .message {
        background-color: hsl(231, 100%, 10%);
        border-radius: 5px;
        color: #e5e5e5;
        padding: 10px 10px;
        text-align: justify;

        div {
          margin-top: 5px;
          display: flex;
          justify-content: space-between;

          p {
            font-size: 14px;
            color: hsl(231, 30%, 60%);
          }
        }
      }
    }
  }
}
</style>
