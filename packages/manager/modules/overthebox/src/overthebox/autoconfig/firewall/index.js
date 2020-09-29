import component from './autoconfig-firewall.component';

const moduleName = 'ovhManagerOtbAutoconfigFirewall';

angular
  .module(moduleName, ['ui.router', 'ovh-api-services'])
  .component('autoconfigFirewall', component);

export default moduleName;
