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
  $stateProvider.state('app.dashboard.incident.migration', {
    url: '/migration',
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
        $state.go('app.dashboard.incident.migration', $transition$.params, {
          reload,
        }),
      goToContracts: /* @ngInject */ ($state, $transition$) => (servicesIds) =>
        $state.go('app.dashboard.incident.migration.contracts', {
          ...$transition$.params(),
          servicesIds,
        }),
      confirmMigration: /* @ngInject */ ($state, $transition$) => (
        servicesIds,
      ) =>
        $state.go('app.dashboard.incident.migration.confirm', {
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
        $http.post(`/me/incident/${incidentName}/migrateServices`, {
          dryRun: true,
          serviceIds,
        }),
      hideBreadcrumb: /* @ngInject */ () => true,
    },
    atInternet: {
      rename: 'hub::service-replacement',
    },
  });
};
