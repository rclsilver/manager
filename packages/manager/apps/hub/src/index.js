import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@ovh-ux/ui-kit/dist/css/oui.css';
import registerApplication from '@ovh-ux/ufrontend/application';

import { attach as attachPreloader } from '@ovh-ux/manager-preloader';
import { MANAGER_URLS } from '@ovh-ux/manager-core/src/manager-core.constants';
import { Environment } from '@ovh-ux/manager-config';
import { BILLING_REDIRECTIONS } from './constants';

attachPreloader(
  Environment.getUserLanguage(),
  document.getElementById('application'),
);

registerApplication().then(({ config, ufrontend }) => {
  BILLING_REDIRECTIONS.forEach((redirectionRegex) => {
    const hash = window.location.hash.replace('#', '');
    if (redirectionRegex.test(hash)) {
      window.location.assign(
        `${MANAGER_URLS[config.region].dedicated}/${window.location.hash}`,
      );
    }
  });

  import(`./config-${config.region}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: application }) => {
      const injector = angular.bootstrap(document.body, [application], {
        strictDi: true,
      });
      ufrontend.listen(({ id, locale }) => {
        if (id === 'locale.change') {
          const rootScope = injector.get('$rootScope');
          rootScope.$emit('lang.onChange', { lang: locale });
        }
      });
    });
});
