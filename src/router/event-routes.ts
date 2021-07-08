import { RouteConfig } from "vue-router";
import Campaigns from '@/views/Camp/Campaigns.vue';
import EventCategory from '@/views/Event/EventCategory.vue';
import CampaignForm from '@/views/Camp/CampaignForm.vue';
import CampSummeryReport from '@/views/Camp/CampSummeryReport.vue';
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
        name: 'Campaigns',
        path: '/campaigns',
        component: Campaigns
    },
    {
        name: 'Edit Campaign',
        path: '/campaigns/:id/detail',
        component: CampaignForm
    },
    {
        name: 'Add Campaign',
        path: '/campaign/add',
        component: CampaignForm
    },
    {
        name: 'Camp Summery Report',
        path: '/camp-report',
        component: CampSummeryReport
    }

];

export default eventRoutes;