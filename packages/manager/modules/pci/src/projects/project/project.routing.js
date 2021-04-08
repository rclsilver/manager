export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project', {
    url: '/{projectId:[0-9a-zA-Z]{32}}',
    views: {
      '@pci': {
        component: 'pciProject',
      },
    },
    redirectTo: (transition) => {
      const projectPromise = transition.injector().getAsync('project');
      return projectPromise.then((project) => {
        if (project.status === 'creating') {
          // for specifying options of redirectTo attribute
          // we need to return a TargetState which is accessible
          // through router.stateService.target of transition object
          return transition.router.stateService.target(
            'pci.projects.project.creating',
            transition.params(),
            {
              location: false,
            },
          );
        }

        return null;
      });
    },
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      project: /* @ngInject */ (OvhApiCloudProject, projectId) =>
        OvhApiCloudProject.v6().get({
          serviceName: projectId,
        }).$promise,
      quotas: /* @ngInject */ (PciProjectsService, projectId) =>
        PciProjectsService.getQuotas(projectId),
      breadcrumb: /* @ngInject */ (project) =>
        project.status !== 'creating' ? project.description : null,
      user: /* @ngInject */ (SessionService) => SessionService.getUser(),
      getQuotaUrl: /* @ngInject */ ($state) => () =>
        $state.href('pci.projects.project.quota'),
    },
  });
};
