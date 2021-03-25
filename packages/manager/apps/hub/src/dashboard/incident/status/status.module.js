import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import component from './status.component';
import routing from './routing';

import resiliation from './resiliation';

const moduleName = 'ovhManagerHubIncidentStatus';

angular
  .module(moduleName, [resiliation, uiRouter])
  .config(routing)
  .component('hubIncidentStatus', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
