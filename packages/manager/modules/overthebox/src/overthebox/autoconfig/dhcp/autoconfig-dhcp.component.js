import controller from './autoconfig-dhcp.controller';
import template from './autoconfig-dhcp.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
  },
};
