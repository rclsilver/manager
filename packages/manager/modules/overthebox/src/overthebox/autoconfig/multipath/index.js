import component from './autoconfig-multipath.component';

const moduleName = 'ovhManagerOtbAutoconfigMultipath';

angular
  .module(moduleName, ['ui.router', 'ovh-api-services'])
  .component('autoconfigMultipath', component);

export default moduleName;
