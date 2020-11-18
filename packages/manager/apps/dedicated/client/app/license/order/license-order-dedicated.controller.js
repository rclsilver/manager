import dropRight from 'lodash/dropRight';
import get from 'lodash/get';
// import has from 'lodash/has';
import isNaN from 'lodash/isNaN';
import last from 'lodash/last';
import set from 'lodash/set';
import values from 'lodash/values';
import _ from 'lodash';

angular
  .module('Module.license')
  .controller(
    'LicenseOrderDedicatedCtrl',
    (
      $q,
      $filter,
      $scope,
      $timeout,
      $translate,
      Alerter,
      License,
      licenseFeatureAvailability,
      LicenseOrder,
    ) => {
      $scope.nbLicence = {
        value: 0,
      };

      $scope.availableTypes = License.types;

      $scope.loaders = {
        ips: false,
        orderableVersion: true,
        durations: false,
        prices: false,
        bc: false,
        agoraUrl: false,
      };

      const getOrderableVersion = function getOrderableVersion() {
        $scope.loaders.orderableVersion = true;
        LicenseOrder.LicenseAgoraOrder.getDedicatedAddonLicenses(
          get($scope, 'selected.ipBlock'),
          ``,
        )
          .then((data) => {
            // console.log(data);
            $scope.types = _.chain(data)
              .filter((license) => {
                const type = license.family.toUpperCase();
                return type.indexOf('LICENSE') !== -1;
              })
              .groupBy((license) => {
                const typeName = license.planCode.split('-')[0].toUpperCase();

                set(license, 'typeName', typeName);
                return typeName === 'SQL' ? 'SQLSERVER' : typeName;
              })
              .value();
            $scope.nbLicence.value = values($scope.types).length || 0;
          })
          .catch(() => {
            $scope.selectedType = {
              value: null,
            };
            $scope.nbLicence.value = values($scope.types).length || 0;
          })
          .finally(() => {
            $scope.loaders.orderableVersion = false;
          });
      };

      function isDomainNumberMandatory() {
        return get($scope.selected, 'version.options', []).length > 0;
      }

      function getResetedOptions() {
        return {
          PLESK: {
            domainNumber: {
              mandatory: isDomainNumberMandatory(),
              value: null,
            },
            antivirus: null,
            languagePackNumber: null,
            powerpack: null,
          },
          VIRTUOZZO: {
            containerNumber: {
              mandatory: true,
              value: null,
            },
          },
          WINDOWS: {
            sqlVersion: null,
          },
          WORKLIGHT: {
            lessThan1000Users: {
              mandatory: true,
              value: null,
              shouldBeEqualsTo: true,
            },
          },
        };
      }

      function getResetedDurations() {
        $scope.details = null;
        return {
          available: null,
          details: {},
        };
      }

      $scope.hasMoreOptions = function hasMoreOptions() {
        // console.log($scope.selected.licenseType[0].typeName);
        return (
          $scope.selected.options[$scope.selected.licenseType[0].typeName] !==
          null
        );
      };

      $scope.isSelectionValid = function isSelectionValid() {
        let valid =
          $scope.selected.licenseType !== null &&
          $scope.selected.version !== null &&
          $scope.selected.ip !== null;
        let moreOptions;
        if (
          $scope.selected.licenseType &&
          $scope.selected.options[$scope.selected.licenseType]
        ) {
          moreOptions = $scope.selected.options[$scope.selected.licenseType];
          angular.forEach(moreOptions, (value) => {
            valid =
              valid &&
              (value === null ||
                !value.mandatory ||
                (value.mandatory &&
                  value.value !== null &&
                  (value.shouldBeEqualsTo === undefined ||
                    value.shouldBeEqualsTo === value.value)));
          });
        }

        return valid;
      };

      $scope.selectType = function selectType(type) {
        $scope.details = null;
        if (
          type &&
          type !== $scope.selected.licenseType &&
          !$scope.loaders.prices
        ) {
          $scope.selectedType = type[0].typeName;
          $scope.selected.licenseType = type.map((licenseType) => {
            let planCode = get(licenseType, 'planCode');

            const licenseCount = parseInt(
              last(licenseType.planCode.split('-')),
              10,
            );
            if (!isNaN(licenseCount)) {
              planCode = dropRight(planCode.split('-')).join('-');
            }

            const translateKey = `license_designation_${licenseType.family.toUpperCase()}_version_${planCode}`;
            const translateValue = $translate.instant(translateKey, {
              licenseCount,
            });

            if (translateKey !== translateValue) {
              set(licenseType, 'productName', translateValue);
            }
            set(
              licenseType,
              'prices',
              get(licenseType, 'prices').filter(
                (price) => price.duration !== 'P0D',
              ),
            );

            return licenseType;
          });
          // [$scope.selected.version] = type;
          $scope.selected.duration = null;
          $scope.selected.agoraUrl = '';
          $scope.loaders.bc = false;
          $scope.order = null;
        }
      };

      function init() {
        // $scope.agoraEnabled = licenseFeatureAvailability.allowLicenseAgoraOrder();
        $scope.powerpackModel = {
          value: false,
        };
        $scope.loaders.ips = true;

        if ($scope.agoraEnabled) {
          $scope.$watch(
            () => $scope.selected,
            (value) => {
              set(LicenseOrder, 'ip', value.ip);
            },
            true,
          );
        }

        getOrderableVersion();
      }

      $scope.$watch(
        'selected.version',
        () => {
          $scope.selected.options = getResetedOptions();
          // console.log($scope.selected.options);
          $scope.selected.duration = null;
          $scope.loaders.bc = false;
          $scope.order = null;
          $scope.durations = getResetedDurations();
          $scope.getDuration();
        },
        true,
      );

      $scope.$watch(
        'selected.options',
        () => {
          $scope.selected.duration = null;
          $scope.loaders.bc = false;
          $scope.order = null;
          $scope.durations = getResetedDurations();
        },
        true,
      );

      $scope.getDuration = function getDuration() {
        // console.log($scope.loaders.durations, $scope.isSelectionValid(), $scope.selected);
        console.log($scope.selected.options, $scope.selected);
        if (!$scope.loaders.durations && $scope.isSelectionValid()) {
          return LicenseOrder.LicenseAgoraOrder.getDedicatedLicensePrices(
            $scope.selected.options,
            $scope.selected,
            get($scope.selected, 'ipBlock.serviceName'),
          ).then((result) => {
            $scope.details = result.prices;
            console.log(result);
          });
          // $scope.loaders.durations = true;
          // const asking = getWhatToSendFromSelected();
          // // console.log(asking);
          // return LicenseOrder.getLicenseDurations(asking).then(
          //   (durations) => {
          //     // console.log(durations);
          //     if (angular.equals(asking, getWhatToSendFromSelected())) {
          //       $scope.durations.available = durations;
          //       loadPrices(asking, durations);
          //     }

          //     $scope.loaders.durations = false;
          //   },
          //   (data) => {
          //     $scope.loaders.durations = false;
          //     Alerter.alertFromSWS(
          //       $translate.instant('license_order_loading_error'),
          //       data.data,
          //       $scope.alerts.order,
          //     );
          //   },
          // );
        }
        return null;
      };

      // function getWhatToSendFromSelected() {
      //   return {
      //     productId: 'dedicated',
      //     serviceName: get($scope.selected, 'ipBlock.serviceName'),
      //     planCode: get($scope.selected, 'version.planCode'),
      //     duration: get($scope.selected, 'duration.duration'),
      //     pricingMode: get($scope.selected, 'duration.pricingMode'),
      //     quantity: 1,
      //   };
      // }

      /**
       *  For plesk powerpack option only (and only for agora order)
       */
      $scope.onPowerpackOptionChange = function onPowerpackOptionChange() {
        $scope.selected.options.PLESK.powerpack = $scope.powerpackModel.value
          ? { value: $scope.selected.version.more.powerPackPlanCode }
          : null;
      };

      $scope.$watch(
        'selected.duration',
        () => {
          $scope.loaders.bc = false;
          $scope.order = null;
          if ($scope.agoraEnabled && $scope.selected.duration) {
            $scope.getAgoraUrl();
          }
        },
        true,
      );

      $scope.durations = getResetedDurations();

      $scope.contractsValidated = {
        value: null,
      };

      $scope.selectDuration = function selectDuration() {
        $scope.contractsValidated = {
          value: null,
        };
      };

      $scope.getAgoraUrl = function getAgoraUrl() {
        $scope.loaders.agoraUrl = true;
        const params = {
          productId: 'dedicated',
          serviceName: get($scope.selected, 'ipBlock.serviceName'),
          planCode: get($scope.selected, 'version.planCode'),
          duration: get($scope.selected, 'duration.duration'),
          pricingMode: get($scope.selected, 'duration.pricingMode'),
          quantity: 1,
        };

        LicenseOrder.LicenseAgoraOrder.createDedicatedCart(params).then(
          (result) => {
            $scope.details = result;
          },
        );
      };

      $scope.openBc = function openBc() {
        LicenseOrder.LicenseAgoraOrder.checkoutDedicated(
          $scope.details.cartId,
        ).then(({ url }) => {
          window.open(url);
        });
      };

      $scope.getBlockDisplay = function getBlockDisplay(ip) {
        return ip.block + (ip.reverse ? ` (${ip.reverse})` : '');
      };

      $scope.filterBlocks = function filterBlocks() {
        $('#licenseOrderBlockFilters').click();
      };

      $scope.order = null;
      init();
    },
  );
