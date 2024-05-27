<template>
  <ion-page class="contenedor">
    <HeaderComponent id="header_guardar" color="light" value="Crear Cuenta" redireccionamiento="/pagina-principal" />
    <ion-content class="ion-padding">
      <ion-card color="light">
        <ion-grid>
          <ion-row>
            <ion-col>
              <h1 class="ion-text-center">Registrarme</h1>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-item color="light">
          <InputComponent v-model="usuarioNuevo.identificacion" id="identificacion" type="number"
            label="Número de identificación" placeholder="" required />
        </ion-item>

        <ion-item color="light">
          <InputComponent v-model="usuarioNuevo.nombres" id="nombres" type="text" label="Nombres"
            placeholder="Digite su nombre completo" required />
        </ion-item>

        <ion-item color="light">
          <InputComponent v-model="usuarioNuevo.apellidos" id="apellidos" type="text" label="Apellidos"
            placeholder="Digite sus apellidos" required />
        </ion-item>

        <ion-item color="light">
          <InputComponent v-model="usuarioNuevo.telefono" id="telefono" type="number" label="Teléfono"
            placeholder="Digite su teléfono..." required />
        </ion-item>

        <ion-item color="light">
          <InputComponent v-model="usuarioNuevo.direccion" id="direccion" type="text" label="Dirección"
            placeholder="Digite la dirección donde recide" required />
        </ion-item>

        <ion-item color="light">
          <ion-select interface="popover" label="Departamento" v-model="departamentoSeleccionado"
            @ionChange="obtenerMunicipios" placeholder="Seleccionar">
            <ion-select-option v-for="departamento in departamentos" :key="departamento.id" :value="departamento.id">{{
              departamento.departamento }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item color="light">
          <ion-select interface="popover" label="Municipio" :disabled="isSelect" v-model="usuarioNuevo.municipio.id"
            placeholder="Seleccionar">
            <ion-select-option v-for="municipio in municipiosPorDepartamento" :key="municipio.id"
              :value="municipio.id">{{ municipio.nombre }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item color="light">

          <InputComponent v-model="usuarioNuevo.usuario" id="usuario" type="text" label="Usuario"
            placeholder="Digite su usuario..." required />
        </ion-item>

        <ion-item color="light">
          <InputComponent v-model="usuarioNuevo.password" id="usuarpasswordio" type="password" label="Contraseña"
            placeholder="Digite la contraseña..." required />
        </ion-item>
        <br>
        <ButtonComponent id="guardar" value="Listo" color="dark" @click="guardarUsuario()" />
      </ion-card>
    </ion-content>
    <FooterComponent id="home" color="light" value="Ferreteria Alvarito" />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonCard, IonItem, IonSelect, IonContent, IonSelectOption } from '@ionic/vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import InputComponent from '@/components/InputComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import axios from 'axios'
import { alertController } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { enviarSolicitud } from '@/funciones';

let url = ' https://5338-2800-486-1104-c100-b4af-c61e-7da9-6e36.ngrok-free.app/ferreteria_alvarito/alvarito/'

let departamentoSeleccionado = ''
let isSelect = ref(true)
let departamentos = ref([])
let municipiosPorDepartamento = ref([])

let usuarioNuevo = {
  identificacion: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  direccion: '',
  municipio: {
    id: 0
  },
  usuario: '',
  password: ''
}

onMounted(() => {
  obtenerDepartamentos();
});

const guardarUsuario = () => {
  if (usuarioNuevo.identificacion.trim() === '') {
    mostrarAlerta('Datos invalidos', 'Ingrese su numero de identificación')
  } else if (usuarioNuevo.nombres.trim() === '') {
    mostrarAlerta('Datos invalidos', 'Ingrese su nombre completo')
  } else if (usuarioNuevo.apellidos.trim() === '') {
    mostrarAlerta('Datos invalidos', 'Ingrese sus apellidos')
  } else if (usuarioNuevo.telefono.trim() === '') {
    mostrarAlerta('Datos invalidos', 'Ingrese su telefono')
  } else if (usuarioNuevo.direccion.trim() === '') {
    mostrarAlerta('Datos invalidos', 'Seleccione su direccion')
  } else if (usuarioNuevo.municipio.id === 0) {
    mostrarAlerta('Datos invalidos', 'Seleccione un municipio')
  } else if (usuarioNuevo.usuario.trim() === '') {
    mostrarAlerta('Datos invalidos', 'Seleccione un usuario')
  } else if (usuarioNuevo.password.trim() === '') {
    mostrarAlerta('Datos invalidos', 'Seleccione una contraseña')
  }
  else {
    console.log(usuarioNuevo)
    enviarSolicitud('POST', usuarioNuevo, url + 'usuarios/auth/signup', '/')
  }
}

const obtenerDepartamentos = () => {
  axios.get(url + 'departamento/all', {
    headers: {
      'ngrok-skip-browser-warning': '69420'
    }
  }).then(
    (response) => {
      departamentos.value = response.data
      console.log(departamentos.value)
    }
  ).catch((error) => {
    console.error("Estado de la petición: ", error);
  });
}

const obtenerMunicipios = () => {
  axios.get(url + 'municipio/allByDepartamento/' + Number(departamentoSeleccionado), {
    headers: {
      'ngrok-skip-browser-warning': '69420'
    }
  }).then(
    (response) => {
      isSelect.value = false
      municipiosPorDepartamento.value = response.data
    }
  ).catch((error) => {
    console.error("Estado de la petición: ", error);
  });
}
const mostrarAlerta = async (titulo: string, mensaje: string) => {
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