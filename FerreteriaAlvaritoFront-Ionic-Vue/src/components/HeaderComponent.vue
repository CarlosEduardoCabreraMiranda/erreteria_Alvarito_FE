<template>
  <ion-header>
    <ion-toolbar :color="color">
      <ion-buttons slot="start">
        <ion-button @click="$router.push(redireccionamiento)">
          <img src="@/assets/logo_ferreteria_alvarito.png" alt="Ferretería Alvarito Logo"
            style="width: 50px; height: auto; object-fit: contain;" />
        </ion-button>
      </ion-buttons>
      <ion-title class="ion-text-left">
        {{ value }}
      </ion-title>
      <ion-icon slot="end" :id="iconId" aria-label="headIcon" size="large" :icon="icon"
        @click="cerrarSesion()"></ion-icon>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {IonHeader, IonToolbar, IonButton, IonTitle, IonButtons, IonIcon},
  props: {
    value: String,
    color: String,
    src:String,
    redireccionamiento: {
      type: String,
      require: false,
      default: '/'
    },
    icon: String,
    iconId: String,
  },
  methods:{
    cerrarSesion() {
      this.$emit('accionarIcono');
    }
  }
});
</script>
