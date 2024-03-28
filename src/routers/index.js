import Vue from "vue";
import VueRouter from "vue-router";

import DashboardView from "@/views/DashboardView.vue";
import ElementuiView from "@/views/element/index.vue";
import TailwindcssView from "@/views/tailwind/index.vue";
import CustomuiView from "@/views/custom/index.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: DashboardView
    },
    {
        path: '/elementui',
        component: ElementuiView
    },
    {
        path: '/tailwindcss',
        component: TailwindcssView,
    },
    {
        path: "/customui",
        component: CustomuiView
    }
];

const router = new VueRouter({
    routes
})

export {
    router
};