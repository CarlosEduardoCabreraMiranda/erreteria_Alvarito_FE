<template>
    <ion-page>
        <HeaderComponent id="header_guardar" color="ligth" value="Productos" redireccionamiento="/productos"/>
        <ion-content ref="content" class="ion-padding">
            <ion-card color="light">
                <h1 class="ion-text-center">Agregar Producto</h1>
                <img v-if="productoJson.foto" class="product-image" id="fotoimg" :src="productoJson.foto" height="100">
                <img v-else class="product-image" id="fotoimg" src="@/assets/products.png" height="100">
                <ion-item color="light">
                    <InputComponent v-model="productoJson.nombre" obligatorio="*" id="nombre" type="text" label="Nombre"
                        placeholder="Digite el nombre del producto" required />
                </ion-item>
                <ion-item color="light">
                    <InputComponent v-model="productoJson.marca" obligatorio="*" id="marca" type="text" label="Marca"
                        placeholder="Digite la marca del porducto" required />
                </ion-item>
                <ion-item color="light">
                    <InputComponent v-model="productoJson.costo" obligatorio="*" id="precio" type="number"
                        label="Precio $COP" placeholder="Digite el Precio Unitario" required />
                </ion-item>
                <ion-item lines="none" color="light">
                    <ion-label position="stacked">Imagen <ion-text color="danger">(PNG o JPG)</ion-text></ion-label>
                    <input @change="previsualizarFoto" type="file" accept="image/png, image/jpeg" required />
                </ion-item>
                <ion-item color="light">
                    <InputComponent v-model="productoJson.caracteristicas" id="caracteristicas" type="text"
                        label="Caracteristicas" placeholder="Digite las caracteristicas..." required />
                </ion-item>
                <ion-item color="light">
                    <InputComponent v-model="productoJson.referencia" obligatorio="*" id="referencia" type="text"
                        label="Referencia" placeholder="Digite la referencia..." required />
                </ion-item>
                <ion-item color="light">
                    <ion-select interface="popover" label="Categoria" v-model="productoJson.categoria.id" placeholder="Seleccionar">
                        <ion-select-option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">{{categoria.nombre }}</ion-select-option>
                    </ion-select>
                </ion-item>
                <br>
                <ButtonComponent id="guardar" icono="fa-solid fa-floppy-disk" value="Guardar" color="success"
                    @Click="guardarProducto()" />
            </ion-card>
        </ion-content>
        <FooterComponent id="home" color="ligth" value="Ferreteria Alvarito" />
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonCard, IonItem, IonContent, IonSelect, IonSelectOption } from '@ionic/vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import InputComponent from '@/components/InputComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue'
import axios from '@/axios-config';
import { enviarSolicitud } from '@/funciones';
import { ref, onMounted } from 'vue';

let categorias = ref([]);

let url = ' https://5338-2800-486-1104-c100-b4af-c61e-7da9-6e36.ngrok-free.app/ferreteria_alvarito/alvarito/'

onMounted(() => {
    obtenerCategorias();
});

let productoJson = {
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

const guardarProducto = () =>{
    if (productoJson.nombre.trim() === '') {
        alert('Ingrese un nombre')
            } else if (productoJson.marca.trim() === '') {
                alert('Ingrese una marca')
            } else if (productoJson.caracteristicas.trim() === '') {
                alert('Ingrese las caracteristicas')
            } else if (productoJson.referencia.trim() === '') {
                alert('Seleccione una referencia')
            }else if(productoJson.categoria.id ===0) {
                alert('Seleccione una categoria')
            }
            else {
                console.log(productoJson)
        enviarSolicitud('POST', productoJson, url + 'producto/save','/productos/save')
            }
}

const obtenerCategorias = () => {
    axios.get(url+'categoria/all' )
    .then((response) =>{
            categorias.value = response.data
            console.log(categorias.value)
        })
        .catch((error) => {
            console.error("Estado de la petición: ", error);
        });
}



const previsualizarFoto = (event) => {
    let reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    reader.onload = () => {
        let miFoto = document.getElementById('fotoimg')
        miFoto.src = reader.result
        productoJson.foto = 'data:image/png;base64,' + reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
    }
}
</script>