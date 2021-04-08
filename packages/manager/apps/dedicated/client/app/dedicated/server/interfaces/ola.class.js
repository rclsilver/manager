import isEmpty from 'lodash/isEmpty';

import { OLA_MODES } from './ola-configuration/ola-configuration.constants';

export default class Ola {
  constructor(resource) {
    Object.assign(this, resource);
  }

  getCurrentMode() {
    return this.isConfigured()
      ? OLA_MODES.VRACK_AGGREGATION
      : OLA_MODES.DEFAULT;
  }

  isActivated() {
    return !isEmpty(this.supportedModes);
  }

  isAvailable() {
    return this.available;
  }

  isConfigured() {
    return this.interfaces.length === 1;
  }
}
