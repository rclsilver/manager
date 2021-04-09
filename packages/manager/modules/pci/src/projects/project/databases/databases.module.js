import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import component from './databases.component';
import onboarding from './onboarding';
import routing from './databases.routing';
import service from './databases.service';

import './index.scss';

const moduleName = 'ovhManagerPciProjectDatabases';

angular
  .module(moduleName, [
    onboarding,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabases', component)
  .service('DatabaseService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
