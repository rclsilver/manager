angular
  .module('Billing')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.billing.payment.credits';

    $stateProvider.state(name, {
      url: '/credits',
      templateUrl: 'billing/payment/credits/billing-credits.html',
      controller: 'Billing.controllers.Credits',
      controllerAs: '$ctrl',
      resolve: {
        balances: /* @ngInject */ ($http) =>
          $http
            .get('/me/credit/balance')
            .then(({ data }) => data)
            .then((balances) =>
              balances.map((balanceName) => ({ balanceName })),
            ),
        goToCredits: /* @ngInject */ ($state, $timeout, Alerter) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'app.account.billing.payment.credits',
            {},
            {
              reload,
            },
          );

          if (message) {
            promise.then(() =>
              $timeout(() => Alerter.set(`alert-${type}`, message)),
            );
          }

          return promise;
        },
        addVoucherLink: /* @ngInject */ ($state) =>
          $state.href('app.account.billing.payment.credits.add'),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_payment_credits'),
      },
    });

    $urlRouterProvider.when(/^\/billing\/credits/, ($location, $state) =>
      $state.go(name),
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
