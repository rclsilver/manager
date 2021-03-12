import controller from './contracts.controller';
import template from './template.html';

export default {
  bindings: {
    contracts: '<',
    goBackToDashboard: '<',
    goToIncident: '<',
    isAllServicesToMigrate: '<',
    openOrderUrl: '<',
    redirectToServiceDashboard: '<',
    servicesIds: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
