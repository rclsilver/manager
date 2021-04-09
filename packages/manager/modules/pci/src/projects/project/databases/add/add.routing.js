export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.databases.add', {
    url: '/new',
    component: 'ovhManagerPciProjectDatabaseAdd',
    resolve: {
      goBack: /* @ngInject */ (goToDatabases) => goToDatabases,

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_database_add'),
    },
  });
};
