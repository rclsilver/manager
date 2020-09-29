import component from './autoconfig-dns.component';

const moduleName = 'ovhManagerOtbAutoconfigDns';

angular
  .module(moduleName, ['ui.router', 'ovh-api-services'])
  .component('autoconfigDns', component);

export default moduleName;
