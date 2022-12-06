<script setup>
import { useUserStore } from "@/stores/user";

const router = inject('router');

const User = useUserStore();
const Session = inject('session');

api
  .delete("members/signout", { body: { token: Session.data.token } })
  .then((data) => {
    Session.emptySession();
    User.disconnect();
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
