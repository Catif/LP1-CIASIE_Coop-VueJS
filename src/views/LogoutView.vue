<script setup>
const router = inject("router");
const Session = inject("session");

api
  .delete("members/signout", { body: { token: Session.data.token } })
  .then((data) => {
    Session.emptySession();
    router.push("/login");
  })
  .catch((errorRes) => {
    console.log(errorRes);
  });
</script>

<template>
  <div>
    <h1>Déconnexion en cours...</h1>
  </div>
</template>
