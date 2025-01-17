import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import angular from 'angular';
import 'angular-animate';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerCloudConnect from '@ovh-ux/manager-cloud-connect';
import ovhManagerCore from '@ovh-ux/manager-core';

import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

const moduleName = 'cloudConnectApp';
angular
  .module(moduleName, [
    ngUiRouterBreadcrumb,
    ovhManagerCore,
    ovhManagerCloudConnect,
  ])
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/cloud-connect'),
  )
  .run(
    /* @ngInject */ ($translate) => {
      let lang = $translate.use();

      if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
        lang = lang.toLowerCase().replace('_', '-');
      } else {
        [lang] = lang.split('_');
      }

      return import(`script-loader!moment/locale/${lang}.js`).then(() =>
        moment.locale(lang),
      );
    },
  )
  .run(
    /* @ngInject */ ($transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        unregisterHook();
      });
    },
  );

export default moduleName;
