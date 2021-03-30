export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn.flush', {
    url: '/flush',
    layout: 'modal',
    params: {
      cdnProperties: null,
      domain: null,
      productId: null,
    },
    views: {
      modal: {
        component: 'hostingFlushCdnComponent',
      },
    },
    resolve: {
      cdnProperties: /* @ngInject */ ($transition$) =>
        $transition$.params().cdnProperties,
      domain: /* @ngInject */ ($transition$) => $transition$.params().domain,
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.hosting.dashboard.multisite'),
      onFlushSuccess: /* @ngInject */ ($rootScope) => () =>
        $rootScope.$broadcast('hosting.cdn.flush.refresh'),
      productId: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
    },
  });
};
