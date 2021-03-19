import map from 'lodash/map';
import some from 'lodash/some';

import Certificate from '../certificate/Certificate.class';
import Tag from '../tag/Tag.class';

import { AUTORENEW_2016_SUBSIDIARIES } from './user.constants';

export default class User {
  constructor(user, certificates, tags) {
    Object.assign(this, {
      ...user,
      certificates: map(
        certificates || user.certificates,
        (certificate) => new Certificate(certificate),
      ),
      tags: map(tags || user.tags, (tag) => new Tag(tag)),
    });
  }

  hasAutorenew2016() {
    return AUTORENEW_2016_SUBSIDIARIES.includes(this.ovhSubsidiary);
  }

  get isEnterprise() {
    return some(this.certificates, (certificate) => certificate.isEnterprise());
  }

  get isTrusted() {
    return some(this.tags, (tag) => tag.isTrusted());
  }

  get isVATNeeded() {
    return !['CA', 'QC', 'WE', 'WS'].includes(this.ovhSubsidiary);
  }

  canHaveInvoicesByPostalMail() {
    return this.billingCountry === 'FR' && this.legalform === 'individual';
  }
}
