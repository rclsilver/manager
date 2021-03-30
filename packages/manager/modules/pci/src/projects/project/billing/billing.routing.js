import { Environment } from '@ovh-ux/manager-config';
import { groupBy } from 'lodash';
import {
  getConsumptionByTheHour,
  getConsumptionByTheMinute,
  getPrice,
} from './billing.utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing', {
    url: '/billing',
    component: 'pciProjectBilling',
    redirectTo: (transition) => {
      // Redirect back to project page if the current NIC
      // is not an admin or a billing contact
      const serviceName = transition.params().projectId;
      const $q = transition.injector().get('$q');
      return $q
        .all([
          transition
            .injector()
            .get('OvhApiMe')
            .v6()
            .get().$promise,
          transition
            .injector()
            .get('OvhApiCloudProjectServiceInfos')
            .v6()
            .get({
              serviceName,
            }).$promise,
        ])
        .then(([me, serviceInfo]) =>
          me.nichandle !== serviceInfo.contactAdmin &&
          me.nichandle !== serviceInfo.contactBilling
            ? 'pci.projects.project'
            : false,
        );
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cpbc_billing_control'),
      serviceInfos: /* @ngInject */ ($http, projectId) =>
        $http
          .get(`/cloud/project/${projectId}/serviceInfos`)
          .then(({ data }) => data),
      catalog: /* @ngInject */ ($http) =>
        $http
          .get(
            `/order/catalog/public/cloud?ovhSubsidiary=${
              Environment.getUser().ovhSubsidiary
            }`,
          )
          .then(({ data }) => data),
      consumption: /* @ngInject */ (
        $http,
        catalog,
        consumptionDetails,
        forecast,
        forecastDetails,
        serviceInfos,
      ) =>
        $http
          .get(`/services/${serviceInfos.serviceId}/consumption`)
          .then(({ data }) => data)
          .then((consumption) => ({
            ...consumption,
            hourlyConsumption: getConsumptionByTheHour(consumption),
            consumptionByTheMinute: getConsumptionByTheMinute(consumption),
            priceByPlanFamily: consumption.priceByPlanFamily.map((price) => ({
              ...price,
              forecast: forecast.priceByPlanFamily.find(
                ({ planFamily }) => planFamily === price.planFamily,
              ),
              details: consumptionDetails[price.planFamily].map((detail) => ({
                ...detail,
                serviceId: detail.metadata?.find(({ key }) =>
                  key.includes('_id'),
                )?.value,
                region: detail.metadata?.find(({ key }) =>
                  key.includes('region'),
                )?.value,
                flavor: detail.metadata?.find(({ key }) =>
                  key.includes('flavor_name'),
                )?.value,
                forecast: forecastDetails.find(
                  ({ uniqueId }) => uniqueId === detail.uniqueId,
                ),
                catalogPrice: getPrice(
                  catalog.addons.find(
                    ({ planCode }) => planCode === detail.planCode,
                  ),
                  consumption.price,
                ),
              })),
            })),
          })),
      consumptionDetails: /* @ngInject */ ($http, serviceInfos) =>
        $http
          .get(`/services/${serviceInfos.serviceId}/consumption/element`)
          .then(({ data }) => data)
          .then((consumption) => groupBy(consumption, 'planFamily')),
      forecast: /* @ngInject */ ($http, serviceInfos) =>
        $http
          .get(`/services/${serviceInfos.serviceId}/consumption/forecast`)
          .then(({ data }) => data),
      forecastDetails: /* @ngInject */ ($http, serviceInfos) =>
        $http
          .get(
            `/services/${serviceInfos.serviceId}/consumption/forecast/element`,
          )
          .then(({ data }) => data),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      billingLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.billing', { projectId }),
      historyLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.billing.history', {
          projectId,
          year: moment.utc().year(),
          month: moment.utc().month(),
        }),
    },
  });
};
