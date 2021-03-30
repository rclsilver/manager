import controller from './hosting-cdn-flush.controller';
import template from './hosting-cdn-flush.html';

export default {
  bindings: {
    cdnProperties: '<',
    domain: '<',
    goBack: '<',
    onFlushSuccess: '<',
    productId: '<',
  },
  controller,
  template,
};
