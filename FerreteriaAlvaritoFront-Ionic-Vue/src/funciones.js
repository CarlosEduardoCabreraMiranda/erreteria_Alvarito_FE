import { alertController } from '@ionic/vue';
import axios from 'axios'

export function enviarSolicitud(metodo, parametros, url,redireccionar) {
    axios({ method: metodo, url: url, data: parametros })
        .then(function (response) {
            let estado = response.status;
            if (estado === 200) {
                mostrarAlerta('Éxito!', 'La acción se realizó correctamente.',redireccionar);
            }
        })
        .catch(function (error) {
            console.error("Estado de la petición: ", error);
            mostrarAlerta('Error','No se pudo realizar la acción',redireccionar);
        });
}

export function formatearValor(valor, digitos) {
    return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: digitos, })
}

const mostrarAlerta = async (titulo, mensaje, redireccionar) => {
    const alert = await alertController.create({
        header: titulo,
        message: mensaje,
        buttons: [{
            text: 'OK',
            handler: () => {
                window.location.href = redireccionar;
            }
        }]
    });
   await alert.present();
};

