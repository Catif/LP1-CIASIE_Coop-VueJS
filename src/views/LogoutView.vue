<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";

const router = useRouter();

const User = useUserStore();
const Session = useSessionStore();

onMounted(() => {
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
});
</script>

<template>
  <div>
    <h1>Déconnexion en cours...</h1>
  </div>
</template>
