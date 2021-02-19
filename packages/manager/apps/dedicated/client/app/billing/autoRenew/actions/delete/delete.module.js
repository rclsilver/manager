import billing from '@ovh-ux/manager-billing';
import routing from './delete.routing';

const moduleName = 'ovhManagerBillingAutorenewDelete';

angular
  .module(moduleName, ['ui.router', billing])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
