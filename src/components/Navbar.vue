<script setup>
const Session = inject('session');
</script>

<template>
  <nav>
    <div>
      <router-link to="/">Accueil</router-link>
      <template v-if="Session.data.token">
        <router-link to="/members">Membres</router-link>
        <router-link to="/conversations">Conversations</router-link>
      </template>
    </div>

    <div>
      <template v-if="!Session.data.token">
        <router-link to="/login">Connexion</router-link>
        <router-link to="/register">Inscription</router-link>
      </template>
      <template v-if="Session.data.token">
        <router-link to="/profile">Profil</router-link>
        <router-link to="/logout">Déconnexion</router-link>
      </template>
    </div>
  </nav>
</template>

<style lang="scss">
nav{
  background-color: hsl(231, 100%, 10%);
  display: flex;
  justify-content: space-between;
  padding: 10px 30px;
  font-size: 20px;

  &>div{
    display: flex;
    gap: 25px;
  }
  a{
    color: #E5E5E5;
    text-decoration: none;
  }
}
</style>