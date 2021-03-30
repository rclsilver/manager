import { groupBy } from 'lodash';
import 'moment';
import { getPrice } from '../billing.utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing.history', {
    url: '/history/:year/:month',
    component: 'pciProjectBillingHistory',
    params: {
      year: {
        value: moment.utc().year(),
        type: 'int',
      },
      month: {
        value: moment.utc().month(),
        type: 'int',
      },
    },
    onExit: /* @ngInject */ (Poller) =>
      Poller.kill({ namespace: 'pci.billing.history' }),
    resolve: {
      exportToCSV: /* @ngInject */ ($window, Poller) => (orderId) =>
        Poller.poll(
          `/me/order/${orderId}/consumption/details?fileFormat=csv`,
          {},
          {
            method: 'get',
            namespace: 'pci.billing.history',
            successRule: ({ taskStatus }) => taskStatus === 'DONE',
          },
        ).then(({ fileURL }) => {
          $window.open(fileURL);
          return fileURL;
        }),
      period: /* @ngInject */ (month, year) => {
        let validYear = year;
        let validMonth = month - 1;
        const period = moment({
          year,
          month,
        });
        if (!period.isValid() || period.isAfter(moment.utc())) {
          validYear = moment.utc().year();
          validMonth = moment.utc().month();
        }

        if (validYear < 1990) {
          validYear = moment.utc().year();
        }
        // moment indexes from 0 to 11
        if (validMonth < 0 || validMonth > 11) {
          validMonth = moment.utc().month();
        }

        return moment()
          .utc()
          .year(validYear)
          .month(validMonth)
          .toDate();
      },
      year: /* @ngInject */ ($transition$) => $transition$.params().year,
      month: /* @ngInject */ ($transition$) => $transition$.params().month,
      history: /* @ngInject */ (iceberg, serviceInfos) =>
        iceberg(`/services/${serviceInfos.serviceId}/consumption/history`)
          .query()
          .expand('CachedObjectList-Pages')
          .limit(5000)
          .sort('beginDate', 'desc')
          .execute()
          .$promise.then(({ data }) => data),
      currentMonthHistory: /* @ngInject */ (history, month, year) => {
        const date = moment()
          .utc()
          .month(month - 1)
          .year(year)
          .startOf('month')
          .toISOString();
        return history.find(({ beginDate }) => beginDate === date);
      },
      monthHistory: /* @ngInject */ (
        catalog,
        currentMonthHistory,
        historyDetails,
      ) => ({
        ...currentMonthHistory,
        priceByPlanFamily: currentMonthHistory.priceByPlanFamily.map(
          (price) => ({
            ...price,
            details: (historyDetails[price.planFamily] || []).map((detail) => ({
              ...detail,
              serviceId: detail.metadata?.find(({ key }) => key.includes('_id'))
                ?.value,
              region: detail.metadata?.find(({ key }) => key.includes('region'))
                ?.value,
              flavor: detail.metadata?.find(({ key }) =>
                key.includes('flavor_name'),
              )?.value,
              catalogPrice: getPrice(
                catalog.addons.find(
                  ({ planCode }) => planCode === detail.planCode,
                ),
                currentMonthHistory.price,
              ),
            })),
          }),
        ),
      }),
      historyDetails: /* @ngInject */ (
        $http,
        currentMonthHistory,
        serviceInfos,
      ) =>
        $http
          .get(
            `/services/${serviceInfos.serviceId}/consumption/history/${currentMonthHistory.id}/element`,
          )
          .then(({ data }) => data)
          .then((details) => groupBy(details, 'planFamily')),
      goToMonth: /* @ngInject */ ($state) => (month, year) =>
        $state.go('pci.projects.project.billing.history', {
          month,
          year,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cpbc_tab_history'),
    },
  });
};
