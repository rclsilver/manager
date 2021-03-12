import controller from './incident.controller';
import template from './template.html';

export default {
  bindings: {
    confirmMigration: '<',
    goToContracts: '<',
    impactedServices: '<',
    services: '<',
    servicesToMigrate: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
