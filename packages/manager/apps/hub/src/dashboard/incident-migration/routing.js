import {
  formatPrice,
  getDatacenter,
  getPrice,
  getProposedDatacenter,
  getStatus,
  isOutOfOrder,
  getDiscountAsMonth,
  buildAddonsCommercialName,
} from './Offer.utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.incident', {
    url: 'incident/:incidentName',
    component: 'hubIncidentMigration',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('servicesToMigrate')
        .then(() => false)
        .catch(() => 'app.dashboard'),
    resolve: {
      trackingPrefix: () => 'hub::service-replacement',
      incidentName: /* @ngInject */ ($transition$) =>
        $transition$.params().incidentName.toLowerCase(),
      goToIncident: /* @ngInject */ ($state, $transition$) => (
        reload = false,
      ) =>
        $state.go('app.dashboard.incident', $transition$.params, {
          reload,
        }),
      goToContracts: /* @ngInject */ ($state, $transition$) => (servicesIds) =>
        $state.go('app.dashboard.incident.contracts', {
          ...$transition$.params(),
          servicesIds,
        }),
      confirmMigration: /* @ngInject */ ($state, $transition$) => (
        servicesIds,
      ) =>
        $state.go('app.dashboard.incident.confirm', {
          ...$transition$.params(),
          servicesIds,
        }),
      impactedServices: /* @ngInject */ (servicesToMigrate, services) => {
        const allServices = Object.values(services.data?.data).flatMap(
          ({ data }) => data,
        );
        return servicesToMigrate
          .filter(({ orderId }) => !orderId)
          .map((service) => ({
            serviceToMigrate: {
              ...service.serviceToMigrate,
              status: getStatus(service),
              isOutOfOrder: () => isOutOfOrder(service),
              datacenter: getDatacenter(
                service.serviceToMigrate.metadata,
                'datacenter',
              ),
              addonsDescription: buildAddonsCommercialName(
                service,
                'serviceToMigrate.description',
              ),
              url: allServices.find(
                ({ serviceId }) =>
                  serviceId === service.serviceToMigrate.serviceId,
              )?.url,
            },
            proposedOffer: {
              ...service.proposedOffer,
              addonsDescription: buildAddonsCommercialName(
                service,
                'proposedOffer.plan.productName',
              ),
              datacenter: getProposedDatacenter(
                service.proposedOffer.configurations,
              ).toUpperCase(),
              promotionDuration: getDiscountAsMonth(service.proposedOffer),
              price: formatPrice(service, getPrice(service)),
            },
          }));
      },
      servicesToMigrate: /* @ngInject */ ($http, incidentName) =>
        $http
          .get(`/me/incident/${incidentName}/migrateServices`)
          .then(({ data }) => data),
      migrateServices: /* @ngInject */ ($http, incidentName) => (
        dryRun,
        serviceIds,
      ) =>
        $http
          .post(`/me/incident/${incidentName}/migrateServices`, {
            dryRun: true,
            serviceIds,
          })
          .catch(() => ({
            contracts: [
              {
                content: 'Blablablablabla Legal content 1',
                name: 'OVH_Data_Protection_Agreement',
                url: 'https://www.ovh.com/',
              },
              {
                content: 'Blablablablabla Legal content 2',
                name: 'OVH_Data_Protection_Agreement',
                url: 'https://www.ovh.com/',
              },
            ],
            details: [
              {
                cartItemID: 1234,
                description: 'Server order',
                detailType: 'INSTALLATION',
                domain: 'ns-xxx',
                originalTotalPrice: {
                  currencyCode: 'EUR',
                  text: '5.00 €',
                  value: 5,
                },
                quantity: 1,
                reductionTotalPrice: {
                  currencyCode: 'EUR',
                  text: '0.00 €',
                  value: 0,
                },
                reductions: [],
                totalPrice: { currencyCode: 'EUR', text: '5.00 €', value: 5 },
                unitPrice: { currencyCode: 'EUR', text: '5.00 €', value: 5 },
              },
            ],
            orderId: null,
            prices: {
              originalWithoutTax: {
                currencyCode: 'EUR',
                text: '5.00 €',
                value: 5,
              },
              reduction: { currencyCode: 'EUR', text: '0.00 €', value: 0 },
              tax: { currencyCode: 'EUR', text: '1.00 €', value: 1 },
              withTax: { currencyCode: 'EUR', text: '6.00 €', value: 6 },
              withoutTax: { currencyCode: 'EUR', text: '5.00 €', value: 5 },
            },
            url: 'https://www.ovh.com/fr',
          })),
      hideBreadcrumb: /* @ngInject */ () => true,
    },
    atInternet: {
      rename: 'hub::service-replacement',
    },
  });
};
