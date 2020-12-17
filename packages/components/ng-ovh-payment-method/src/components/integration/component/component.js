import controller from './controller';

const name = 'ovhPaymentMethodIntegrationComponent';

export default {
  name,
  controller,
  template: `<div id="${name}"></div>`,
  require: {
    integrationCtrl: '^ovhPaymentMethodIntegration',
  },
};
