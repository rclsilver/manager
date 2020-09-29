import controller from './autoconfig-dns.controller';
import template from './autoconfig-dns.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
  },
};
