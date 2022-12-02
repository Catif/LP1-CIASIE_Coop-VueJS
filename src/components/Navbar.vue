<script setup>
const user = useUserStore();
</script>

<template>
  <nav>
    <div>
      <RouterLink to="/">Accueil</RouterLink>
      <template v-if="user.isConnected">
        <RouterLink to="/members">Membres</RouterLink>
        <RouterLink to="/">Conversations</RouterLink>
      </template>
    </div>

    <div>
      <template v-if="!user.isConnected">
        <RouterLink to="/login">Connexion</RouterLink>
        <RouterLink to="/register">Inscription</RouterLink>
      </template>
      <template v-if="user.isConnected">
        <RouterLink to="/">Profil</RouterLink>
        <RouterLink to="/logout">Déconnexion</RouterLink>
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