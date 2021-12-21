import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path)
{
    return () => import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: "history",
    routes:[
         //Register
         {
            path: "/",
            name: "Register",
            meta: {title: 'Register'},
            component: importComponent("Register"),
        },

         //Login
         {
            path: "/login",
            name: "Login",
            meta: {title: 'Login'},
            component: importComponent("Login"),
        },
        {
            path: "/dashboard",
            component: importComponent("DashboardLayout"),
            children: [
                //Dashboard
                {
                    path: "/dashboard",
                    name: "Dashboard",
                    meta: { title: 'Dashboard'},
                    component: importComponent("Dashboard"),
                },
                //Book
                {
                    path: '/book',
                    name: 'Book',
                    meta: {title: 'Book'},
                    component: importComponent('TodoList/Book'),
                },
                //User
                {
                    path: '/user',
                    name: 'User',
                    meta: {title: 'User'},
                    component: importComponent('TodoList/User'),
                },
                //Pinjam
                {
                    path: '/pinjam',
                    name: 'Pinjam',
                    meta: {title: 'Pinjam'},
                    component: importComponent('TodoList/Pinjam'),
                },
                //Pekerja
                {
                    path: '/pekerja',
                    name: 'Pekerja',
                    meta: {title: 'Pekerja'},
                    component: importComponent('TodoList/Pekerja'),
                },
            ],
        },
        {
            path: '*',
            redirect: '/'
        },
    ],
    });

    //Set Judul
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();       
});

export default router;