export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.dashboard', {
    url: '/dashboard',
    component: 'pciProjectTrainingDashboardComponent',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      usage: /* @ngInject */ (OvhApiCloudProjectUsageCurrent, projectId) =>
        OvhApiCloudProjectUsageCurrent.v6()
          .get({ serviceName: projectId })
          .$promise.catch(() => {
            return {
              resourcesUsage: [],
            };
          }),
      goToInstallDetails: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.dashboard.install', {
          projectId,
        }),
      goToRegistryDetails: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.dashboard.registry', {
          projectId,
        }),
      currencySymbol: /* @ngInject */ (coreConfig) =>
        coreConfig.getUser().currency.symbol,
      goToJobs: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.jobs', {
          projectId,
        }),
    },
  });
};
