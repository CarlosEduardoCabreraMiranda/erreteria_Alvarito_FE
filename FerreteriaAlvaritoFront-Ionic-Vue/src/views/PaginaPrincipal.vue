<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="page-container">
        <div class="info-section">
          <ion-card-header>
            <ion-card-title class="header-title">
              <h1><strong>{{ nombreEmpresa }}</strong></h1>
            </ion-card-title>
          </ion-card-header>
          <img src="@/assets/logo_ferreteria_alvarito.png" alt="Ferretería Alvarito Logo" />
          <ion-card-content class="content-section">
            <h1>{{ descripcion }}</h1>
            <br>
            <ButtonComponent id="registrar" value="Registrarme" color="dark" @click="$router.push('/signUp')" />
            <ButtonComponent id="registrar" value="Iniciar Sesión" color="dark" @click="$router.push('/signIn')" />
          </ion-card-content>
        </div>
      </div>
    </ion-content>
    <FooterComponent id="home" color="light" value="Ferreteria Alvarito" />
  </ion-page>

</template>

<script setup lang="ts">
import { IonPage, IonContent, IonCardHeader, IonCardTitle, IonCardContent, IonIcon} from '@ionic/vue';
import FooterComponent from '@/components/FooterComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue';
import { Preferences } from '@capacitor/preferences';
import { onMounted } from 'vue';
import { logOutOutline } from 'ionicons/icons';
import axios from '@/axios-config';


let nombreEmpresa = 'Ferreteria Alvarito S.A'
let descripcion = 'En esta App podrás mirar nuestros productos, además que podrás realizar compras con nosotros. ¡Lo mejor en herramientas para tu empresa u hogar! Alvarito S.A, tú mejor opción.'





</script>

<style>
.logo {
  width: 50px;
  height: 50px;
  margin-right: 20px;
}
</style>