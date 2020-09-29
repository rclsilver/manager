import component from './overTheBox-autoconfig.component';
import routing from './overTheBox-autoconfig.routing';

import dhcp from './dhcp';
import dns from './dns';
import firewall from './firewall';
import multipath from './multipath';
import route from './route';

const moduleName = 'ovhManagerOtbAutoconfig';

angular
  .module(moduleName, [
    'ui.router',
    'ovh-api-services',
    dhcp,
    dns,
    firewall,
    multipath,
    route,
  ])
  .component('overTheBoxAutoconfig', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
