export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.databases.onboarding', {
    url: '/onboarding',
    component: 'pciProjectDatabaseOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('databases')
        .then((databases) =>
          databases.length > 0
            ? { state: 'pci.projects.project.databases' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
