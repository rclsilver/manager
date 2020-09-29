import component from './autoconfig-dhcp.component';

const moduleName = 'ovhManagerOtbAutoconfigDhcp';

angular
  .module(moduleName, ['ui.router', 'ovh-api-services'])
  .component('autoconfigDhcp', component);

export default moduleName;
