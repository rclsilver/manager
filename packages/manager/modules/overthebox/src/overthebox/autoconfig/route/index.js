import component from './autoconfig-route.component';

const moduleName = 'ovhManagerOtbAutoconfigRoute';

angular
  .module(moduleName, ['ui.router', 'ovh-api-services'])
  .component('autoconfigRoute', component);

export default moduleName;
