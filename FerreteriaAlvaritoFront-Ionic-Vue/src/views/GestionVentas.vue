<template>
    <ion-page>
        <HeaderComponent id="header_admin" color="light" value="Ventas" redireccionamiento="/panel-administrador" />
        <ion-content>
            <ion-progress-bar v-if="cargando" type="indeterminate"></ion-progress-bar>
            <div class="alert-resultados" v-if="Ventas.length > 0">
                <p>{{ Ventas.length }} resultados</p>
            </div>

            <ButtonComponent v-if="cargando" id="recargar" value="Recargar" color="primary"
                @click="$router.push('/ventas')" />

            <ion-card color="light" v-for="venta in ventas" :key="venta.id">
                <ion-card-header>
                    <ion-card-title class="ion-text-center">Comprador: {{ venta.cliente.nombres }} {{
                        venta.cliente.apellidos }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <div class="info-container">
                        <img src="@/assets/sales.png" class="info-icon" />
                        <p class="info-text">Total Comprado: {{ venta.totalVenta }}</p>
                    </div>
                    <div class="info-container">
                        <img src="@/assets/placeholder.png" class="info-icon" />
                        <p class="info-text">Fecha: {{ venta.fechaVenta }}</p>
                    </div>
                </ion-card-content>
                <ion-item color="light">
                    <!--<ButtonComponent id="ver" value="Actualizar" color="primary" class="large-button"
                        @click="obtenerPorId(venta.id)" />-->
                    <ButtonComponent id="eliminar_Venta" value="Eliminar" color="danger" class="large-button"
                        @click="confirmarEliminacion(venta.id)" />
                </ion-item>
                <ion-alert :is-open="showAlert" header="Confirmar eliminación"
                    message="¿Estás seguro de que deseas eliminar a este Venta?" :buttons="alertButtons"
                    @didDismiss="showAlert = false"></ion-alert>
            </ion-card>
        </ion-content>
        <FooterComponent id="admin" color="ligth" value="Ferreteria Alvarito" />
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonProgressBar, IonCardHeader, IonCard, IonCardContent, IonCardTitle, IonHeader, IonToolbar, IonButtons, IonButton, IonItem, IonInput, IonAlert } from '@ionic/vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue'
import { ref, onMounted } from 'vue';
import { enviarSolicitud } from '../funciones';
import { alertController } from '@ionic/vue';
import axios from '@/axios-config'


let cargando = true;
let filtro = '';
let url = ' https://5338-2800-486-1104-c100-b4af-c61e-7da9-6e36.ngrok-free.app/ferreteria_alvarito/alvarito/venta/';
let ventas = ref([])
let Ventas =
{
    clienteId: 0,
    fechaVenta: "",
    totalVenta: 0.0
}
let modalIsOpen = ref(false)
//const setOpen = (open: boolean) => (modalIsOpen.value = open)
let idVenta = ref(null)
let showAlert = ref(false);
let reloaded = false;

const alertButtons = [
    {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
            console.log('Eliminación cancelada');
        },
    },
    {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
            eliminarVenta(idVenta.value);
        },
    },
];

onMounted(() => {
    reload();
    obtenerVentas();
});

const reload = () => {
    if (reloaded = false) {
        window.location.reload();
        reloaded = true;
    }
}

const obtenerVentas = async () => {
    axios.get(url + 'all').then(
        response => {
            ventas.value = response.data
            console.log(ventas.value)
            cargando = false

        })
        .catch((error) => {
            console.error("Estado de la petición: ", error);
        });
}





const confirmarEliminacion = (id) => {
    idVenta.value = id;
    showAlert.value = true;
};

const eliminarVenta = (id) => {
    showAlert.value = true;
    enviarSolicitud('DELETE', { id: id }, url + 'delete/' + id, '/ventas');
    showAlert.value = false;
};
/*const mostrarAlerta = async (titulo, mensaje) => {
    const alert = await alertController.create({
        header: titulo,
        message: mensaje,
        buttons: [{
            text: 'OK'
        }]
    });

    await alert.present();
};*/



</script>

<style>
.info-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.info-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
}

.large-button {
    flex: 1;
    margin: 10px;
    height: 30px;
}
</style>