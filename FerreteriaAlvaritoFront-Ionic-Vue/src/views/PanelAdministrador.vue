<template>
    <ion-page>
        <HeaderComponent id="header_admin" color="ligth" value="Panel Principal" :icon="logOutOutline" @accionar-icono="cerrarSesion()">
        </HeaderComponent>
        <ion-content>
            <h1 class="ion-text-center">Bienvenido Administrad@r</h1>
            <div class="card-container">
                <ion-card color="light" @click="$router.push('/productos')">
                    <img src="@/assets/products.png" alt="Icono" />
                    <h1 class="ion-text-left">Productos</h1>
                </ion-card>
                <ion-card color="light" @click="$router.push('/clientes')">
                    <img src="@/assets/cliente.png" alt="Icono" />
                    <h1 class="ion-text-left">Clientes</h1>
                </ion-card>
                <ion-card color="light" @click="$router.push('/ventas')">
                    <img src="@/assets/sales.png" alt="Icono" />
                    <h1 class="ion-text-left">Ventas</h1>
                </ion-card>
            </div>
        </ion-content>
        <FooterComponent id="admin" color="ligth" value="Ferreteria Alvarito" />
    </ion-page>
</template>
<script setup lang="ts">
import { IonPage, IonCard ,IonContent, IonIcon } from '@ionic/vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { logOutOutline } from 'ionicons/icons';
import axios from '@/axios-config';
import router from '@/router/index'
import { Preferences } from '@capacitor/preferences';




const removeToken = async () => {
    await Preferences.remove({ key: 'authToken' });
}

function cerrarSesion() {
    removeToken();
    axios.defaults.headers.common = {
        'Authorization': ``
    };
    router.back();
}


</script>

<style scoped>
.card-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;
}

.card-container ion-card {
    width: 70%;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
}

.card-container h1 {
    margin: 0;
}
</style>