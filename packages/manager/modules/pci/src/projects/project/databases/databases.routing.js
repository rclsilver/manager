export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.databases', {
    url: '/databases',
    component: 'ovhManagerPciProjectDatabases',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('databases')
        .then((databases) =>
          databases.length === 0
            ? { state: 'pci.projects.project.databases.onboarding' }
            : false,
        ),
    resolve: {
      addDatabase: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.databases.add', { projectId }),

      databases: /* @ngInject */ (DatabasesService, projectId) =>
        DatabasesService.getDatabases(projectId),

      goToDatabases: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.databases',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'databases'));
        }

        return promise;
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_database_list_title'),

      databasesTrackPrefix: () =>
        'PublicCloud::pci::projects::project::databases',

      trackDatabases: /* @ngInject */ (databasesTrackPrefix, trackClick) => (
        complement,
      ) => {
        trackClick(`${databasesTrackPrefix}::${complement}`);
      },

      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
    },
  });
};
