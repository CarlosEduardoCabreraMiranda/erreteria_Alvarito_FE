<template>
    <ion-page>
        <HeaderComponent id="header_admin" color="light" value="Productos" redireccionamiento="/panel-administrador" />
        <ion-content>
            <ion-progress-bar v-if="cargando" type="indeterminate" color="primary"></ion-progress-bar>
            <ion-searchbar placeholder="Buscar Productos..." color="light" v-model="filtro"
                @input="filtrarProductos"></ion-searchbar>
            <ButtonComponent v-if="cargando" id="recargar" value="Recargar" color="primary"
                @click="$router.push('/productos')" />
            <ButtonComponent id="agregar" value="Agregar" color="primary" @click="$router.push('/agregar-producto')" />

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
                        <h1 class="ion-text-center">Editar Producto</h1>
                        <img v-if="productoJson.foto" class="product-image" id="fotoimg" :src="productoJson.foto"
                            height="100">
                        <img v-else class="product-image" id="fotoimg" src="@/assets/products.png" height="100">
                        <ion-item color="light">
                            <ion-input v-model="productoJson.nombre" id="nombre" type="text" label="Nombre"
                                placeholder="Digite el nombre del producto" required
                                label-placement="floating"></ion-input>
                        </ion-item>

                        <ion-item color="light">
                            <ion-input v-model="productoJson.marca" id="marca" type="text" label="Marca"
                                placeholder="Digite la marca del producto" required
                                label-placement="floating"></ion-input>
                        </ion-item>

                        <ion-item color="light">
                            <ion-input v-model="productoJson.costo" id="precio" type="number" label="Precio $COP"
                                placeholder="Digite el Precio Unitario" required label-placement="floating"></ion-input>
                        </ion-item>

                        <ion-item lines="none" color="light">
                            <ion-label position="stacked">
                                Imagen <ion-text color="danger">(PNG o JPG)</ion-text>
                            </ion-label>
                            <input @change="previsualizarFoto" type="file" accept="image/png, image/jpeg" required />
                        </ion-item>

                        <ion-item color="light">
                            <ion-input v-model="productoJson.caracteristicas" id="caracteristicas" type="text"
                                label="Características" placeholder="Digite las características..." required
                                label-placement="floating"></ion-input>
                        </ion-item>

                        <ion-item color="light">
                            <ion-input v-model="productoJson.referencia" id="referencia" type="text" label="Referencia"
                                placeholder="Digite la referencia..." required label-placement="floating"></ion-input>
                        </ion-item>
                        <ion-item color="light">
                            <ion-select interface="popover" label="Categoria" v-model="productoJson.categoria.id"
                                placeholder="Seleccionar" cancelText="Volver" okText="Elegir">
                                <ion-select-option v-for="categoria in categorias" :key="categoria.id"
                                    :value="categoria.id">{{ categoria.nombre }}</ion-select-option>
                            </ion-select>
                        </ion-item>
                        <br>
                        <ButtonComponent id="actualizar" icono="fa-solid fa-floppy-disk" value="ok" color="primary"
                            @Click="actualizarProducto()" />
                    </div>
                </div>
            </ion-modal>


            <div class="alert-resultados" v-if="productos.length > 0">
                <p>{{ productos.length }} resultados</p>
            </div>
            <div class="alert-resultados" v-else>
                <p> No se encontraron resultados</p>
            </div>
            <ion-card color="light" v-for="producto in productos" :key="producto.codigo">
                <ion-card-header>
                    <ion-card-title class="ion-text-center">{{ producto.nombre }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <img class="product-image" :src="producto.foto" />
                    <h1 class="ion-text-center"> <strong>{{ formatearValor(producto.costo, 0) }}</strong> COP</h1>
                    <p><strong>Caracteristicas:</strong> {{ producto.caracteristicas }}</p>
                    <p><strong>Categoria:</strong> {{ producto.categoria.nombre }}</p>
                </ion-card-content>
                <ion-item color="light">
                    <ButtonComponent id="actualizar_producto" value="Actualizar" color="tertiary"
                        @click="obtenerPorId(producto.codigo)" class="large-button" />
                    <ButtonComponent id="present-alert" value="Eliminar" color="danger" class="large-button"
                        @click="confirmarEliminacion(producto.codigo)" />
                </ion-item>
            </ion-card>
            <ion-alert :is-open="showAlert" header="Confirmar eliminación"
                message="¿Estás seguro de que deseas eliminar este producto?" :buttons="alertButtons"
                @didDismiss="showAlert = false"></ion-alert>
        </ion-content>
        <FooterComponent id="admin" color="ligth" value="Ferreteria Alvarito" />
    </ion-page>
</template>

<script setup lang="ts">
import { IonAlert, IonCard, IonContent, IonPage, IonSearchbar, IonItem, IonProgressBar, IonModal, IonHeader, IonToolbar, IonSelect, IonInput, IonSelectOption } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import axios from 'axios';
import { alertController } from '@ionic/vue';
import { enviarSolicitud, formatearValor } from '../funciones';
import { cartOutline } from 'ionicons/icons';

let productos = ref([]);
let idProductoAEliminar = ref(0)
let showAlert = ref(false);
let modalIsOpen = ref(false)
const setOpen = (open: boolean) => (modalIsOpen.value = open)
let categorias = ref([]);
let cargando = ref(true);
let filtro = ref('');
let url = ' https://5338-2800-486-1104-c100-b4af-c61e-7da9-6e36.ngrok-free.app/ferreteria_alvarito/alvarito/';
let productoJson = {
    codigo:0,
    nombre: "",
    foto: "",
    marca: "",
    costo: 0,
    caracteristicas: "",
    referencia: "",
    categoria: {
        id: 0
    }
}
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
            eliminarProducto(idProductoAEliminar.value);
        },
    },
];

onMounted(() => {
    obtenerProductos();
    obtenerCategorias();
});

const obtenerCategorias = () => {
    axios.get(url + 'categoria/all').then(
        (response) => {
            categorias.value = response.data;
        }
    ).catch(function (error) {
        console.error("Estado de la petición: ", error);
        alert('No se pudo realizar la acción');
    });
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

const filtrarProductos = () => {
    axios.get(url + 'producto/search?filtro=' + filtro.value).then(
        (response) => {
            cargando.value = true;
            productos.value = response.data;
            cargando.value = false;
        }
    ).catch(function (error) {
        console.error("Estado de la petición: ", error);
        alert('No se pudo realizar la acción');
    });
};

const obtenerPorId = (id) => {
    let urlById = url + 'producto/all/' + id;
    axios.get(urlById).then(
        (response) => {
            let datos = response.data;
            productoJson.codigo = datos.codigo;
            productoJson.nombre = datos.nombre;
            productoJson.marca = datos.marca;
            productoJson.foto = datos.foto;
            productoJson.costo = datos.costo;
            productoJson.caracteristicas = datos.caracteristicas;
            productoJson.referencia = datos.referencia;
            productoJson.categoria.id = datos.categoria.id;
            modalIsOpen.value = true;
        }).catch((error) => {
            console.error("Error al obtener producto por ID:", error);
        });
};

const actualizarProducto = () => {
    if (productoJson.nombre.trim() === '') {
        mostrarAlerta('Datos incompletos','Ingrese un nombre');
    } else if (productoJson.marca.trim() === '') {
        mostrarAlerta('Datos incompletos','Ingrese una marca');
    } else if (productoJson.foto.trim() === '') {
        mostrarAlerta('Datos incompletos','Ingrese una foto');
    } else if (productoJson.costo <= 0) {
        mostrarAlerta('Datos incompletos','Seleccione un costo correcto');
    }else if (productoJson.caracteristicas.trim() === '') {
        mostrarAlerta('Datos incompletos','Ingrese las caracteristicas');
    } else if (productoJson.referencia.trim() === '') {
        mostrarAlerta('Datos incompletos','Seleccione la referencia');
    } else if (productoJson.categoria.id === 0) {
        mostrarAlerta('Datos incompletos','Seleccione una categoria');
    } else {
        console.log(productoJson);
        enviarSolicitud('PUT', productoJson, url + 'productos/update/'+productoJson.codigo_producto, '/productos')
    }
};
const confirmarEliminacion = (id) => {
    idProductoAEliminar.value = id;
    showAlert.value = true;
};

const eliminarProducto = (id) => {
    showAlert.value = true;
    enviarSolicitud('DELETE', { id: id }, url + 'producto/delete/' + id, '/productos');
    showAlert.value = false;
};

const mostrarAlerta = async (titulo, mensaje) => {
    const alert = await alertController.create({
        header: titulo,
        message: mensaje,
        buttons: [{
            text: 'OK',
            handler: () => {
            }
        }]
    });

   await alert.present();
};

const previsualizarFoto = (event) => {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
        let miFoto = document.getElementById('fotoimg');
        miFoto.src = reader.result;
        productoJson.foto = 'data:image/png;base64,' + reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
    };
};
</script>
