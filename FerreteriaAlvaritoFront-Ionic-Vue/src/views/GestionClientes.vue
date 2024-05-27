<template>
    <ion-page>
        <HeaderComponent id="header_admin" color="light" value="Clientes" redireccionamiento="/panel-administrador" />
        <ion-content>
            <ion-progress-bar v-if="cargando" type="indeterminate"></ion-progress-bar>
            <ion-searchbar placeholder="Buscar Clientes..." color="light" v-model="filtro"
                @input="obtenerClientesPorFiltro()"></ion-searchbar>
            <ButtonComponent v-if="cargando" id="recargar" value="Recargar" color="primary"
                @click="$router.push('/clientes')" />
            <div class="alert-resultados" v-if="clientes.length > 0">
                <p>{{ clientes.length }} resultados</p>
            </div>

            <ion-modal :is-open="modalIsOpen">
                <ion-header>
                    <ion-toolbar color="light">
                        <ion-buttons slot="start">
                            <ion-button @click="setOpen(false)">
                                < Regresar</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <div class="modal-content">
                    <div id="data-form">
                        <h1 class="ion-text-center">Editar Cliente</h1>
                        <img class="client-image" id="fotoimg" src="@/assets/cliente.png" height="100">

                        <ion-item color="light">
                            <ion-input v-model="clientes.identificacion" id="identificacion" type="text"
                                label="Identificacion" placeholder="Digite el codigo de identificacion del cliente"
                                required label-placement="floating"></ion-input>
                        </ion-item>
                        <ion-item color="light">
                            <ion-input v-model="clientes.nombres" id="nombres" type="text" label="Nombres"
                                placeholder="Digite los nombres del cliente" required
                                label-placement="floating"></ion-input>
                        </ion-item>

                        <ion-item color="light">
                            <ion-input v-model="clientes.apellidos" id="apellidos" type="text" label="Apellidos"
                                placeholder="Digite los apellidos del cliente" label-placement="floating"></ion-input>
                        </ion-item>

                        <ion-item color="light">
                            <ion-input v-model="clientes.telefono" id="telefono" type="tel" label="Teléfono"
                                placeholder="Digite el teléfono del cliente" required
                                label-placement="floating"></ion-input>
                        </ion-item>



                        <ion-item color="light">
                            <ion-input v-model="clientes.direccion" id="direccion" type="text" label="Dirección"
                                placeholder="Digite la dirección del cliente" required
                                label-placement="floating"></ion-input>
                        </ion-item>





                        <ion-item color="light">
                            <ion-input v-model="clientes.municipio" id="fecha_ingreso" type="text" label="Municipio"
                                placeholder="Digite la fecha de ingreso del cliente" required
                                label-placement="floating"></ion-input>
                        </ion-item>

                        <br>
                        <ButtonComponent id="actualizar" icono="fa-solid fa-floppy-disk" value="ok" color="primary"
                            @click="actualizarCliente()" />
                    </div>
                </div>
            </ion-modal>

            <ion-card color="light" v-for="usuario in usuarios" :key="usuario.id">
                <ion-card-header>
                    <ion-card-title class="ion-text-center">{{ usuario.nombres }} {{
                        usuario.apellidos }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <div class="info-container">
                        <img src="@/assets/card.png" class="info-icon" />
                        <p class="info-text">{{ usuario.identificacion }}</p>
                    </div>
                    <div class="info-container">
                        <img src="@/assets/phone-call.png" class="info-icon" />
                        <p class="info-text">{{ usuario.telefono }}</p>
                    </div>
                    <div class="info-container">
                        <img src="@/assets/placeholder.png" class="info-icon" />
                        <p class="info-text">{{ usuario.direccion }}</p>
                    </div>
                </ion-card-content>
                <ion-item color="light">
                    <ButtonComponent id="ver" value="Actualizar" color="primary" class="large-button"
                        @click="obtenerPorId(usuario.id)" />
                    <ButtonComponent id="eliminar_cliente" value="Eliminar" color="danger" class="large-button"
                        @click="confirmarEliminacion(usuario.id)" />
                </ion-item>
                <ion-alert :is-open="showAlert" header="Confirmar eliminación"
                    message="¿Estás seguro de que deseas eliminar a este cliente?" :buttons="alertButtons"
                    @didDismiss="showAlert = false"></ion-alert>
            </ion-card>
        </ion-content>
        <FooterComponent id="admin" color="ligth" value="Ferreteria Alvarito" />
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonProgressBar, IonSearchbar, IonCard, IonCardContent, IonModal, IonHeader, IonToolbar , IonButtons, IonButton, IonItem, IonInput, IonAlert} from '@ionic/vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue'
import { ref, onMounted } from 'vue';
import { enviarSolicitud } from '../funciones';
import { alertController } from '@ionic/vue';
import axios from '@/axios-config'


let cargando = true;
let filtro = '';
let url = ' https://5338-2800-486-1104-c100-b4af-c61e-7da9-6e36.ngrok-free.app/ferreteria_alvarito/alvarito/usuarios/';
let usuarios = ref([])
let clientes =
{
    id:0,
  identificacion: "",
  nombres: "",
  apellidos: "",
  telefono: "",
  direccion: "",
  estado: true,
  municipio: 0,
}
let modalIsOpen = ref(false)
const setOpen = (open: boolean) => (modalIsOpen.value = open)
let idCliente = ref(null)
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
      eliminarCliente(idCliente.value);
    },
  },
];

onMounted(() => {
    reload();
    obtenerClientes();
});

const reload = () => {
    if(reloaded = false){
    window.location.reload();
    reloaded = true;
    }
}

const obtenerClientes = async () => {
    axios.get(url + 'all-actives').then(
        response => {
            usuarios.value = response.data
            console.log(usuarios.value)
            cargando = false
            
        })
        .catch((error) => {
            console.error("Estado de la petición: ", error);
        });
}
const obtenerClientesPorFiltro = () => {
    axios.get(url + 'search?filtro=' + filtro).then(
        response => {
            usuarios.value = response.data
            cargando = false
            console.log(usuarios.value)
        })
        .catch((error) => {
            console.error("Estado de la petición: ", error);
        });
}
const obtenerPorId = (id) => {
    let urlById = url + 'all/' + id;
    axios.get(urlById).then(
        (response) => {
            let datos = response.data;
            clientes.id = datos.id
            clientes.identificacion = datos.identificacion;
            clientes.nombres = datos.nombres;
            clientes.apellidos = datos.apellidos;
            clientes.direccion = datos.direccion;
            clientes.telefono = datos.telefono;
            clientes.estado = datos.estado;
            clientes.municipio = datos.municipio;
            console.log(clientes)
            modalIsOpen.value = true;
        }).catch((error) => {
            console.error("Error al obtener producto por ID:", error);
        });
};

const actualizarCliente = () => {
    if (clientes.identificacion.trim() === '') {
        mostrarAlerta('Datos incompletos', 'Ingrese una identificación');
    } else if (clientes.nombres.trim() === '') {
        mostrarAlerta('Datos incompletos', 'Ingrese aunque sea un nombre');
    } else if (clientes.apellidos.trim() === '') {
        mostrarAlerta('Datos incompletos', 'Ingrese aunque sea un apellido');
    } else if (clientes.municipio.toString().trim() === '') {
        mostrarAlerta('Datos incompletos', 'Ingrese un municipio');
    } else if (clientes.direccion.trim() === '') {
        mostrarAlerta('Datos incompletos', 'Ingrese una dirección');
    } else if (clientes.telefono.trim() === '') {
        mostrarAlerta('Datos incompletos', 'Ingrese un teléfono');
    } else {
        console.log(clientes);
        enviarSolicitud('PUT', clientes, url + 'update/' + clientes.id);
    }
};



const confirmarEliminacion = (id) => {
    idCliente.value = id;
    showAlert.value = true;
};

const eliminarCliente = (id) => {
    showAlert.value = true;
    enviarSolicitud('DELETE', { id: id }, url + 'delete/' + id,'/clientes');
    showAlert.value = false;
};
const mostrarAlerta = async (titulo, mensaje) => {
    const alert = await alertController.create({
        header: titulo,
        message: mensaje,
        buttons: [{
            text: 'OK'
        }]
    });

   await alert.present();
};



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