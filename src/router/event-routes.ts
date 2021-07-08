import { RouteConfig } from "vue-router";
import DoctorCamps from '@/views/Camp/DoctorCamps.vue';
import EventCategory from '@/views/Event/EventCategory.vue';
import DoctorCampForm from '@/views/Camp/DoctorCampForm.vue';
import EventCategoryForm from '@/views/Event/EventCategoryForm.vue';

const eventRoutes: Array<RouteConfig> = [
    {
        name: "Event Category",
        path: "/event-category",
        component: EventCategory
    },
    {
        name: "Detail Event Category",
        path: "/event-category/:id/detail",
        component: EventCategoryForm
    },
    {
        name: "Add Event Category",
        path: "/event-category/add",
        component: EventCategoryForm
    },
    {
        name: 'Doctor Camps',
        path: '/doctor-camps',
        component: DoctorCamps
    },
    {
        name: 'Edit Camp',
        path: '/doctor-camps/:id/detail',
        component: DoctorCampForm
    },
    {
        name: 'Add Doctor Camp',
        path: '/doctor-camp/add',
        component: DoctorCampForm
    }

];

export default eventRoutes;