import { BillingService as Service } from '@ovh-ux/manager-models';

import { END_STRATEGIES } from '../autorenew.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.resiliation', {
    url: '/resiliation?serviceId&serviceName',
    component: 'ovhManagerBillingResiliation',
    resolve: {
      availableStrategies: /* @ngInjecgt */ (endStrategyEnum, service) =>
        endStrategyEnum
          .filter((strategy) =>
            service.billing.engagement?.endRule.possibleStrategies.includes(
              strategy,
            ),
          )
          .map((strategy) => ({
            strategy,
          })),
      goToDeleteService: /* @ngInject */ (
        $state,
        serviceId,
        serviceType,
      ) => () =>
        $state.go('app.account.billing.autorenew.delete', {
          serviceId,
          serviceType,
        }),
      displayErrorMessage: /* @ngInject */ (Alerter) => (message) =>
        Alerter.set('alert-danger', message),
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      onSuccess: /* @ngInject */ (Alerter, goBack, goToDeleteService) => (
        successMessage,
        endStrategy,
      ) =>
        endStrategy === END_STRATEGIES.CANCEL_SERVICE
          ? goToDeleteService()
          : goBack().then(() => Alerter.success(successMessage)),
      service: /* @ngInject */ ($http, serviceId) =>
        $http
          .get(`/services/${serviceId}`)
          .then(({ data }) => new Service(data)),
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      serviceType: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceType,
      validate: /* @ngInject */ (BillingService, serviceId) => (strategy) =>
        BillingService.putEndRuleStrategy(serviceId, strategy),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_autorenew_resiliate'),
    },
  });
};
