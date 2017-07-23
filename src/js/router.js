import Vue from 'vue';
import VueRouter from 'vue-router';
import Directory from 'templates/directory.vue';
import LoginPage from 'templates/login.vue';

import {extComponentMap} from 'utils/consts.js';

Vue.use(VueRouter);

const pathComponentMap = {};
Object.values(extComponentMap).forEach( setting => {
  if(!pathComponentMap[setting.path]){
    pathComponentMap[setting.path] = setting.component;
  }
});

const routes = [
  { path: PublicPath,  component: Directory },
  { path: PublicPath + 'directory/:id', component: Directory, props: true},
].concat( Object.keys(pathComponentMap).map( path => {
  return {
    path: `${PublicPath}${path}/:type/:id`,
    component: pathComponentMap[path],
    props: true
  }
}) );

console.log(routes);

export default new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior: function(to, from, savedPosition){
    return savedPosition;
  }
});


