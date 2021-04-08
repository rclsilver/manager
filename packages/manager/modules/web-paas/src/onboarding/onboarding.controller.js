import reduce from 'lodash/reduce';
import illustration from './assets/PlatformSH.png';
import { GUIDES } from './onboarding.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
        },
      ],
      [],
    );
    this.illustration = illustration;
  }
}
