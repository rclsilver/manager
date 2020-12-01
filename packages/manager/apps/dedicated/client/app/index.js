import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import { attach as attachPreloader } from '@ovh-ux/manager-preloader';
import { Environment } from '@ovh-ux/manager-config';
import registerApplication from '@ovh-ux/ufrontend/application';

attachPreloader(Environment.getUserLanguage());

registerApplication().then(({ config, ufrontend }) => {
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
      ufrontend.emit({
        id: 'navbar.universe.set',
        universe: 'server',
      });
    });
});
