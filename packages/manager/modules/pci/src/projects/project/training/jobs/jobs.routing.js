export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs', {
    url: '/jobs',
    component: 'pciProjectTrainingJobsComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_jobs_title'),
      pricesCatalog: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.getPricesFromCatalog(projectId),
      getCatalogEntryF: /* @ngInject */ (pricesCatalog) => (resourceId) =>
        pricesCatalog[`ai-training.ai1-1-${resourceId}.minute.consumption`],
      getPrice: /* @ngInject */ (getCatalogEntryF) => (qty, resourceId) => {
        return getCatalogEntryF(resourceId).priceInUcents * 60 * qty;
      },
      getTax: /* @ngInject */ (getCatalogEntryF) => (qty, resourceId) =>
        getCatalogEntryF(resourceId).tax * 60 * qty,
      job: /* @ngInject */ (PciProjectTrainingJobService, projectId) => (
        jobId,
      ) => PciProjectTrainingJobService.get(projectId, jobId),
      goToJobs: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.training.jobs',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.training.jobs',
            ),
          );
        }

        return promise;
      },
    },
  });
};
