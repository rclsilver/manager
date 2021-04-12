export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn.shared', {
    url: '/shared/settings/:domainName',
    params: {
      domain: null,
    },
    views: {
      '@app.hosting.dashboard': {
        component: 'hostingCdnSharedSettings',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToHosting) => goToHosting,

      domainName: /* @ngInject */ ($transition$) =>
        $transition$.params().domainName,

      domainOptions: /* @ngInject */ (
        HostingCdnSharedService,
        serviceName,
        domainName,
      ) =>
        HostingCdnSharedService.getCDNDomainsOptions(
          serviceName,
          domainName,
        ).then(({ data }) => data),

      cdnDetails: /* @ngInject */ (
        HostingCdnSharedService,
        serviceName,
        domainName,
      ) =>
        HostingCdnSharedService.getSharedCDNDomainDetails(
          serviceName,
          domainName,
        ).then(({ data }) => data),

      cdnRange: /* @ngInject */ ($transition$, cdnProperties) =>
        cdnProperties.type
          .split('cdn-')[1]
          .replace('-', ' ')
          .toUpperCase(),

      guideLinkHref: /* @ngInject */ (CORE_URLS, user) =>
        CORE_URLS.guides.cdn[user.ovhSubsidiary] || CORE_URLS.guides.cdn.GB,

      availableOptions: /* @ngInject */ (
        HostingCdnSharedService,
        serviceName,
      ) =>
        HostingCdnSharedService.getSharedCDNAvailableOptions(serviceName).then(
          ({ data }) => data,
        ),

      displayCreateCacheRuleModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.dashboard.cdn.shared.addCacheRule', params),

      displayUpdateCacheRuleModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.dashboard.cdn.shared.editCacheRule', params),

      displayConfirmSettingsModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.dashboard.cdn.shared.confirmSettings', params),

      displayLeaveSettingsModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.dashboard.cdn.shared.leaveSettings', {
          model: params,
        }),

      openCorsList: /* @ngInject */ ($state) => (cors) =>
        $state.go('app.hosting.dashboard.cdn.shared.cors', {
          cors,
        }),

      cdnOptionTypeEnum: /* @ngInject */ ($http) =>
        $http
          .get('/hosting/web.json')
          .then(({ data }) => data)
          .then((schema) =>
            schema.models['cdn.OptionTypeEnum'].enum.reduce(
              (options, option) => ({
                [option.toUpperCase()]: option,
                ...options,
              }),
              {},
            ),
          ),

      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
    },
    atInternet: {
      rename: 'web::hosting::cdn::configure',
    },
  });
};
