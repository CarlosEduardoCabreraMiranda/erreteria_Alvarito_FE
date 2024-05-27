import axios from 'axios';
import { Preferences } from '@capacitor/preferences';


const setupAxios = async () => {
    // Obtener el token de manera asincrónica
    const { value } = await Preferences.get({ key: 'authToken' });
    const token = value;

    // Si el token no es nulo, configurar el encabezado común
    if (token != null) {
        axios.defaults.headers.common = {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': '69420'
        };
    }
};

setupAxios();
// exporta la instancia de axios con header por defecto y para las vistas que la requieran
export default axios;