import Vue from 'vue';
import VueRouter from 'vue-router';
import Directory from 'templates/directory.vue';
import Zip from 'templates/zip.vue';
import Download from 'templates/download.vue';
import LoginPage from 'templates/login.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: PublicPath,  component: Directory },
    { path: PublicPath + 'directory/',  component: Directory },
    { path: PublicPath + 'directory/:id', component: Directory, props: true},
    { path: PublicPath + 'zip/:id', component: Zip, props: true},
    { path: PublicPath + 'zip/:id/:page', component: Zip, props: true},
    { path: PublicPath + 'login',  component: LoginPage },
    { path: PublicPath + ':ext/:id',  component: Download },
  ],
  scrollBehavior: function(to, from, savedPosition){
    return savedPosition;
  }
});


