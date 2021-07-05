import { RouteConfig } from "vue-router";
import DoctorCamps from '@/views/Camp/DoctorCamps.vue';
import DoctorCampForm from '@/views/Camp/DoctorCampForm.vue';

const eventRoutes: Array<RouteConfig> = [

    {
        name: 'Doctor Camps',
        path: '/doctor-camps',
        component: DoctorCamps
    },
    {
        name: 'Add Doctor Camp',
        path: '/doctor-camp/add',
        component: DoctorCampForm
    }

];

export default eventRoutes;