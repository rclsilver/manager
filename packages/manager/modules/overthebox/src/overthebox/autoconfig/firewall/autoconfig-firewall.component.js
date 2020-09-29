import controller from './autoconfig-firewall.controller';
import template from './autoconfig-firewall.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
  },
};
