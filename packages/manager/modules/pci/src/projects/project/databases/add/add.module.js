import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciProjectDatabaseAdd';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
