import get from 'lodash/get';
import { GUIDELINK } from './web-paas.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas', {
    url: '/paas/webpaas',
    component: 'webPaas',
    redirectTo: 'web-paas.projects',
    resolve: {
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      guideUrl: /* @ngInject */ (user) => get(GUIDELINK, user.ovhSubsidiary),
      createProject: /* @ngInject */ ($state) => () =>
        $state.go('web-paas.add'),
      viewDetails: /* @ngInject */ ($state) => (projectId) =>
        $state.go('web-paas.dashboard', {
          projectId,
        }),
      openPartnerConsole: /* @ngInject */ ($window) => (project) =>
        $window.open(project.metadata.partnerConsole, '_blank', 'noopener'),
      goToWebPaas: ($state, Alerter) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go('web-paas', {
          reload,
        });

        if (message) {
          Alerter.alertFromSWS(message, type, 'web_paas_dashboard_list');
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('web_paas_title'),
    },
  });
};
