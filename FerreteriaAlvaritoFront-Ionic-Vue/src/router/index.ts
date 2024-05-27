import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import PaginaPrincipal from '@/views/PaginaPrincipal.vue';
import SingIn from '@/views/SingIn.vue';
import SingUp from '@/views/SingUp.vue';
import PanelAdministrador from '@/views/PanelAdministrador.vue';
import GestionProductos from '@/views/GestionProductos.vue';
import GestionClientes from '@/views/GestionClientes.vue';
import AgregarProducto from '@/views/AgregarProducto.vue';
import CompraProductos from '@/views/CompraProductos.vue';
import GestionVentas from '../../src/views/GestionVentas.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/pagina-principal'
  },
  {
    path: '/pagina-principal',
    component: PaginaPrincipal
  },
  {
    path: '/signIn',
    component: SingIn
  },
  {
    path: '/signUp',
    component: SingUp
  },
  {
    path: '/panel-administrador',
    component: PanelAdministrador
  },
  {
    path: '/productos',
    component: GestionProductos
  },
  {
    path: '/agregar-producto',
    component: AgregarProducto
  },
  {
    path: '/clientes',
    component: GestionClientes
  }, 
  {
    path: '/ventas',
    component: GestionVentas
  },
  {
    path: '/clientes-productos',
    component: CompraProductos
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router;
