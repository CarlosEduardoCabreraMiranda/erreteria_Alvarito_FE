<template>
    <ion-footer>
  <ion-toolbar :color="color">
    <div class="footer-content">
      <a target="_blank">Términos y condiciones</a>
      <p>&copy; 2023 {{ value }} Neiva, Colombia</p>
      <a href="mailto:urbanoperdomojgmail.com" target="_blank">Contacto del desarrollador</a>
    </div>
  </ion-toolbar>
</ion-footer>
</template>

<script>
import { IonToolbar,IonFooter } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: String,
    value: String,
    color: String,
  }
})
</script>

<style>
.footer-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
}

.footer-content a,P {
  margin-right: 40px;
  color: inherit;
  text-decoration: none;
}

@media (max-width: 530px) {
  .footer-content {
    flex-direction: column;
    align-items: center; 
  }
}

</style>