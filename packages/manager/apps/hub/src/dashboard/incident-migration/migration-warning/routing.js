export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.incident.confirm', {
    url: '/confirm',
    params: {
      servicesIds: [],
    },
    views: {
      modal: {
        component: 'hubIncidentMigrationWarning',
      },
    },
    layout: 'modal',
    resolve: {
      servicesIds: /* @ngInject */ ($transition$) =>
        $transition$.params().servicesIds,
      hideBreadcrumb: () => true,
    },
    atInternet: {
      rename: 'hub::service-replacement::contract-information',
    },
  });
};
