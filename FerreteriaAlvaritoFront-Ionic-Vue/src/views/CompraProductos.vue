<template>
    <ion-page>
        <HeaderComponent id="header_admin" color="light" value="Productos" redireccionamiento="/" :icon="cartOutline"
            icon-id="shopping-cart" />

        <ion-content class="ion-padding">
            <ion-progress-bar v-if="cargando" type="indeterminate"></ion-progress-bar>
            <ion-searchbar placeholder="Buscar Productos..." color="light" v-model="filtro"
                @input="filtrarProductos"></ion-searchbar>
            <ButtonComponent v-if="cargando" id="recargar" value="Recargar" color="primary"
                @click="$router.push('/clientes-productos')" />

            <ion-button @click="cerrarSesion()" color="danger" size="large">
                <ion-icon slot="start" :icon="logOutOutline"></ion-icon>
                Cerrar sesion
            </ion-button>
            <!--<ion-icon id="logOut" aria-label="logOutIcon" size="large" :icon="logOutOutline"
                @click="cerrarSesion()"></ion-icon>-->

            <div class="alert-resultados" v-if="productos.length > 0">
                <p>{{ productos.length }} resultados</p>
            </div>
            <ion-card color="light" v-for="producto in productos" :key="producto.codigo">
                <ion-card-header>
                    <ion-card-title class="ion-text-center">{{ producto.nombre }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <img class="product-image" :src="producto.foto" />
                    <h1 class="ion-text-center"> $<strong>{{ producto.costo }}</strong> COP</h1>
                    <p><strong>Caracteristicas:</strong> {{ producto.caracteristicas }}</p>
                    <p><strong>Categoria:</strong> {{ producto.categoria.nombre }}</p>
                </ion-card-content>
                <ion-item color="light">
                    <ButtonComponent id="actualizar_producto" value="Añadir" @click="addToCart(producto)"
                        color="success" class="large-button" />
                </ion-item>
            </ion-card>
            <ion-alert :is-open="showAlert" header="Confirmar eliminación"
                message="¿Estás seguro de que deseas eliminar este producto?" :buttons="alertButtons"
                @didDismiss="showAlert = false"></ion-alert>


            <ion-modal class="ion-padding" ref="modal" trigger="shopping-cart">
                <ion-content color="light">
                    <ion-toolbar>
                        <ion-title>Carritos de compra</ion-title>
                        <ion-buttons slot="end">
                            <ion-button color="light" @click="dismiss()"> Close</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                    <ion-list>
                        <ion-item v-for=" producto in detalleVentas" :key="producto.codigo">
                            <ion-avatar slot="start">

                                <ion-img :src="producto.foto"></ion-img>
                            </ion-avatar>

                            <ButtonComponent slot="end" id="minus" value=" - " name="minus"
                                @click="removeFromCart(producto)" />
                            <IonText slot="end">
                                {{ producto.cantidad }}
                            </IonText>
                            <ButtonComponent slot="end" id="minus" value=" + " name="plus"
                                @click="addToCart(producto)" />
                            <ion-label>
                                <h2>{{ producto.nombre }}</h2>
                                <p>{{ producto.costo }}</p>
                                <h4>Valor del producto: <strong>{{ Number(producto.subtotal)
                                        }}</strong>
                                </h4>
                            </ion-label>

                        </ion-item>
                        <IonLabel>
                            <h2>Total del carrito: {{calcularTotalVenta()}}</h2>
                        </IonLabel>
                        <ButtonComponent @click="guardarVenta()" value="Ir a Pagar" id="pagarBtn" expand="block" />
                    </ion-list>
                </ion-content>
            </ion-modal>
        </ion-content>
        <FooterComponent id="admin" color="ligth" value="Ferreteria Alvarito" />
    </ion-page>
</template>

<script setup lang="ts">
import { IonAlert, IonCard, IonContent, IonPage, IonSearchbar, IonItem, IonProgressBar, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonModal, IonToolbar, IonList, IonLabel, IonText, IonAvatar, IonButtons, IonButton, IonTitle, IonImg } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue'
import axios from '@/axios-config';
import { cartOutline, logOutOutline } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

//import { enviarSolicitud } from '../funciones';

onMounted(async () => {
   await obtenerProductos();
   await obtenerCategorias();
});

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
        },
    },
];


let productos = ref([]);
let showAlert = ref(false);
let categorias = ref([]);
let cargando = ref(true);
let filtro = ref('');
const detalleVentas = ref([]);
let clientId = 0;
let url = 'https://5338-2800-486-1104-c100-b4af-c61e-7da9-6e36.ngrok-free.app/ferreteria_alvarito/alvarito/';




const obtenerCategorias = async () => {
    try {
        const response = await axios.get(url + 'categoria/all');
        categorias.value = response.data;
    } catch (error) {
        console.error("Error al obtener categorías:", error);
    }
};

const obtenerProductos = () => {
    axios.get(url + 'producto/all').then(
        (response) => {
            productos.value = response.data;
            cargando.value = false;
        }
    ).catch(function (error) {
            console.error("Estado de la petición: ", error);
            alert('No se pudo realizar la acción');
        });
    }


const filtrarProductos = async () => {
    try {
        const response = await axios.get(url + 'producto/search?filtro=' + filtro.value);
        productos.value = response.data;
    } catch (error) {
        console.error("Error al filtrar productos:", error);
    }
};

const modal = ref()

const dismiss = () => {
    modal.value.$el.dismiss()
}; 

//Nuevas funciones
const removeToken = async () => {
    await Preferences.remove({ key: 'authToken' });
}

const getUserId = async () => {
    const { value } = await Preferences.get({ key: 'userId' });
    clientId = Number(value);
    return value;
};

const cerrarSesion =() => {
    removeToken();
    axios.defaults.headers.common = {
        'Authorization': ``
    };
    history.back();
}



const removeFromCart = (producto) => {
        const indice = detalleVentas.value.indexOf(producto);
        if (indice > -1) {
            if (producto.cantidad > 1) {
                producto.cantidad--;
            } else {
                detalleVentas.value.splice(indice, 1);
            }
        }
    }
const addToCart = (producto: Object) => {
    if (producto) {
        const existingProductIndex = detalleVentas.value.findIndex(item => item.codigo === producto.codigo);
        if (existingProductIndex !== -1) {
            detalleVentas.value[existingProductIndex].cantidad += 1;
            detalleVentas.value[existingProductIndex].subtotal = producto.costo*producto.cantidad;
            
        } else {
            producto.cantidad = 1;
            detalleVentas.value.push(producto);
        }

        //subtotal.value += producto.costo;
        console.log(detalleVentas);
    }
}

const guardarVenta = async () => {
    if (detalleVentas.value.length === 0) {
        console.warn('No hay productos en el carrito');
        return;
    }
    await getUserId();
    const venta = {
        totalVenta: calcularTotalVenta(), // Calculate total before sending
        cliente:  {id: clientId} , // Replace with logic to get customer data
        detallesVentas: detalleVentas.value.map(productoEnCarrito => ({
            cantidad: productoEnCarrito.cantidad,
            valorUnitario: productoEnCarrito.costo, // Assuming 'costo' is unit price
            subtotal: productoEnCarrito.cantidad * productoEnCarrito.costo,
            producto: {
                id: productoEnCarrito.codigo, // Assuming 'codigo' is product ID
            },
        })),
    };

    console.log("detallesventa[]:");
    console.log(venta.detallesVentas);
    console.log("venta[]:");
    console.log(venta);
    try {
        const response = await axios.post(url + 'venta/save', Object(venta));
        console.log('Venta registrada:', response.data); // Handle successful response
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        // Handle error appropriately (e.g., display error message to user)
    }
};

const calcularTotalVenta = () => {
    let total = 0;
    for (const producto of detalleVentas.value) {
        total += producto.cantidad * producto.costo;
    }
    return total;
};

//

</script>
