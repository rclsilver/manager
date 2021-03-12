export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.incident.contracts', {
    url: '/contracts',
    params: {
      servicesIds: [],
    },
    layout: 'modal',
    views: {
      modal: {
        component: 'hubIncidentMigrationContracts',
      },
    },
    resolve: {
      goBackToDashboard: /* @ngInject */ ($state) => () =>
        $state.go('app.dashboard'),

      isAllServicesToMigrate: (impactedServices, servicesIds) =>
        servicesIds.length === impactedServices.length,

      selectedServices: /* @ngInject */ (migrateServices, servicesIds) =>
        migrateServices(true, servicesIds).then((data) => data),

      servicesIds: /* @ngInject */ ($transition$) =>
        $transition$.params().servicesIds,

      contracts: /* @ngInject */ (selectedServices) =>
        selectedServices.contracts,

      openOrderUrl: /* @ngInject */ ($window, selectedServices) => () =>
        $window.open(selectedServices.url, '_blank'),

      getServiceDashboardUrl: /* @ngInject */ (
        $state,
        impactedServices,
        servicesIds,
      ) => () =>
        impactedServices.find(
          ({ serviceToMigrate }) =>
            serviceToMigrate.serviceId === servicesIds[0],
        )?.serviceToMigrate?.url || $state.href('app.dashboard.incident'),

      redirectToServiceDashboard: /* @ngInject */ (
        $window,
        getServiceDashboardUrl,
      ) => () => $window.open(getServiceDashboardUrl(), '_self'),

      hideBreadcrumb: () => true,
    },
    atInternet: {
      rename: 'hub::service-replacement::contract-validation',
    },
  });
};
