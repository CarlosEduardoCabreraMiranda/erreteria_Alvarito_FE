<template>
  <ion-page>
    <HeaderComponent id="principal" color="light" value="Inicio Sesión" redireccionamiento="/pagina-principal" />
    <ion-content class="ion-padding">
      <ion-card color="light">
        <ion-card-header>
          <img src="@/assets/logo_ferreteria_alvarito.png" alt="Ferreteria Alvarito Logo" class="foto-section" />
          <ion-card-title class="ion-text-center">
            <h1><span>Iniciar Sesión</span></h1>
          </ion-card-title>
        </ion-card-header>
        <ion-card-content class="register-section">
          <ion-item color="light">
            <InputComponent id="usuario" v-model="login.usuario" type="text" label="Usuario"
              placeholder="Digite su usuario..." required />
          </ion-item>
          <ion-item color="light">
            <InputComponent id="password" v-model="login.password" type="password" label="Contraseña"
              placeholder="Digite su contraseña..." required />
          </ion-item>
          <br>
          <ButtonGeneric id="guardar" value="Entrar" color="warning" @click="inicioSesion" />
          <br>
          <ion-item color="light">
            <a href="">Olvidaste tu contraseña?</a>
          </ion-item>
          <br>
          <h2>¿Aún no tienes cuenta? Regístrate <router-link to="/signUp">aquí</router-link></h2>
        </ion-card-content>
      </ion-card>
    </ion-content>
    <FooterComponent id="home" color="light" value="Ferreteria Alvarito" />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonItem, IonCard, IonCardHeader, IonCardTitle, IonImg, IonCardContent } from '@ionic/vue';
import InputComponent from '@/components/InputComponent.vue'
import ButtonGeneric from '@/components/ButtonComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { alertController } from '@ionic/vue';
import axios from '@/axios-config'
import router from '@/router/index'
import { Preferences } from '@capacitor/preferences';
import { ref } from 'vue';

let login = {
  usuario: "",
  password: ""
}


const token = ref({ "accessToken": ""});

let roles: Array<String> = [];

let respuesta = {}
let url = ' https://5338-2800-486-1104-c100-b4af-c61e-7da9-6e36.ngrok-free.app/ferreteria_alvarito/alvarito/'

const saveToken = async  () => {
  Preferences.set({
    key: 'authToken',
    value: token.value.accessToken
  });
}

const saveUserId = async () => {
  Preferences.set({
    key: 'userId',
    value: respuesta.usuario.id
  });
}

const inicioSesion = async () => {
  await procesarInicioSesion();
}




const procesarInicioSesion = async () => {
  if (login.usuario.trim() === '') {
    mostrarAlerta('Datos invalidos', 'Ingrese su usuario')
  } else if (login.password.trim() === '') {
    mostrarAlerta('Datos invalidos', 'Ingrese su contraseña')
  } else {
    axios({ method: 'POST', url: url + 'usuarios/auth/login', data: login , headers: {'Authorization': ''}})
      .then(function (response) {
        let estado = response.status;
        respuesta = response.data;
        
         //getToken();
        console.log()
        console.log("Sign in token: ",token);
        if (estado === 200) {
          token.value.accessToken = respuesta.token;
          roles = respuesta.usuario.roles.map(rol => rol.nombre);
          console.log(roles);
          mostrarAlerta('Éxito!', 'La acción se realizó correctamente: '+ token.value.accessToken);

          if (roles.includes("ADMIN")) {
            // El usuario es administrador, redirigir a la ruta de administrador
            router.push('/panel-administrador');
          } else if (roles.includes("USER")) {
            // El usuario no es administrador, redirigir a la ruta por defecto
            router.push('/clientes-productos');
          }else{
            alert("Ha ocurrido un error inesperado");
          //router.push('/panel-administrador');
          }
        } 
      })
      .catch(function (error) {
        console.error("Estado de la petición: ", error);
        mostrarAlerta('Error!', 'Usuario o contraseña incorrectos, Intenta de nuevo');
      });
  }
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
  await saveToken();
  await saveUserId();

  
};

</script>

<style>
.foto-section {
  height: 50%;
  width: 20%;
  position: static;
  margin: auto;
  border-top-left-radius: 46%;
  border-top-right-radius: 46;
}
</style>
