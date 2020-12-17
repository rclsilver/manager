import { get, merge } from 'lodash-es';

import AdyenCheckout from '@adyen/adyen-web';

import { ADYEN_CONFIG } from './constants';

export default class OvhPaymentMethodRegisterComponentCtrl {
  /* @ngInject */
  constructor() {
    // other attributes
    this.integrationInstance = null;
  }

  $onInit() {
    const renderOptions = this.integrationCtrl.onIntegrationInitialized(
      this.submit.bind(this),
    );

    return this.render(renderOptions);
  }

  /**
   *  Render Component Iframe content
   */
  // eslint-disable-next-line class-methods-use-this
  render(renderOptions = {}) {
    // TODO remove start
    // eslint-disable-next-line no-param-reassign
    renderOptions = {
      ...renderOptions,
      locale: 'en_US',
      clientKey: 'test_D6ABJUCXGFHXPNTSHXW73KG3TABYOWTR',
    };
    // TODO remove end

    const adyenConfiguration = merge({}, ADYEN_CONFIG.DEFAULT, renderOptions);

    // eslint-disable-next-line
    console.info('adyenConfiguration:', adyenConfiguration);

    const checkout = new AdyenCheckout(adyenConfiguration);

    // eslint-disable-next-line
    console.info('checkout:', checkout);

    const card = checkout
      .create('card')
      .mount('#ovhPaymentMethodIntegrationComponent');

    // eslint-disable-next-line
    console.info('card:', card);
  }

  /**
   *  Submit the Component iframe form content.
   *  This will call getPaypageRegistrationId of the EprotectIframeClient
   *  that will trigger the callback function configured when instanciating the eProtectClient.
   *  @return {Promise}
   */
  submit() {
    return this.integrationCtrl.onIntegrationSubmit().then(() => {
      return true;
    });
  }

  onIframeSubmitted(response) {
    // eslint-disable-next-line no-unused-vars
    const responseCode = parseInt(get(response, 'response', '-1'), 10);

    // if (responseCode === ADYEN_RESPONSE_CODE.SUCCESS) {
    //   // finalize the payment registration
    //   // then remove ThreatMetrix script and iframe (defined in directive's link function)
    //   return this.integrationCtrl.onIntegrationFinalize({
    //     expirationMonth: parseInt(response.expMonth, 10),
    //     expirationYear: parseInt(response.expYear, 10),
    //     registrationId: response.paypageRegistrationId,
    //   });
    // }

    // transform response to an error structure similar to $http/$resource
    const error = {};
    return this.integrationCtrl.manageCallback('onSubmitError', { error });
  }

  /* ============================
  =            Hooks            =
  ============================= */

  // eslint-disable-next-line class-methods-use-this
  $onDestroy() {}

  /* -----  End of Hooks  ------ */
}
