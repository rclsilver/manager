import get from 'lodash/get';
import pick from 'lodash/pick';
import set from 'lodash/set';

angular.module('App').controller(
  'ServerTerminateCtrl',
  class ServerTerminateCtrl {
    constructor(
      $q,
      $scope,
      $stateParams,
      Alerter,
      constants,
      DedicatedServerFeatureAvailability,
      ovhFeatureFlipping,
      Server,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.constants = constants;
      this.$q = $q;
      this.Server = Server;
      this.DedicatedServerFeatureAvailability = DedicatedServerFeatureAvailability;
      this.Alerter = Alerter;
      this.ovhFeatureFlipping = ovhFeatureFlipping;
    }

    $onInit() {
      this.loading = false;
      this.$scope.server = this.$scope.currentActionData;
      this.manualRefund = this.DedicatedServerFeatureAvailability.hasDedicatedServerManualRefund();
      this.serviceInfos = get(this.$scope, 'serviceInfos', null);
      this.cancelSubscriptionForm = {
        cancelMethod: null,
        isSubmiting: false,
      };
      this.$scope.submitCancelSubscription = this.submitCancelSubscription.bind(
        this,
      );
      this.terminationUnavailable = false;
      this.getTerminationAvailability();
    }

    getTerminationAvailability() {
      this.loading = true;
      return this.ovhFeatureFlipping
        .checkFeatureAvailability('dedicated-server:terminate')
        .then((featureAvailability) => {
          this.terminationUnavailable = !featureAvailability.isFeatureAvailable(
            'dedicated-server:terminate',
          );
        })
        .catch(() => {
          this.terminationUnavailable = true;
        })
        .finally(() => {
          this.loading = false;
        });
    }

    /**
     * Submit cancel subscription form.
     * @return {Promise}
     */
    submitCancelSubscription() {
      const serviceInfosRenew = pick(this.serviceInfos, 'renew');

      let promise = this.$q.when(true);
      switch (this.cancelSubscriptionForm.cancelMethod) {
        case 'terminate':
          promise = this.Server.terminate(this.$stateParams.productId)
            .then(() =>
              this.Alerter.success(
                this.$translate.instant('server_close_service_success'),
                'server_dashboard_alert',
              ),
            )
            .catch((err) => {
              this.Alerter.alertFromSWS(
                this.$translate.instant('server_close_service_error'),
                err,
                'server_dashboard_alert',
              );
              return this.$q.reject(err);
            });
          break;
        case 'deleteAtExpiration':
          set(serviceInfosRenew, 'renew.automatic', true);
          set(serviceInfosRenew, 'renew.deleteAtExpiration', true);

          promise = this.Server.updateServiceInfos(
            this.$stateParams.productId,
            serviceInfosRenew,
          )
            .then(() =>
              this.Alerter.success(
                this.$translate.instant(
                  'server_close_service_delete_at_expiration_activate_success',
                ),
                'server_dashboard_alert',
              ),
            )
            .catch((err) => {
              this.Alerter.alertFromSWS(
                this.$translate.instant(
                  'server_close_service_delete_at_expiration_activate_error',
                ),
                err,
                'server_dashboard_alert',
              );
              return this.$q.reject(err);
            });
          break;
        case 'cancel':
          set(serviceInfosRenew, 'renew.automatic', true);
          set(serviceInfosRenew, 'renew.deleteAtExpiration', false);

          promise = this.Server.updateServiceInfos(
            this.$stateParams.productId,
            serviceInfosRenew,
          )
            .then(() =>
              this.Alerter.success(
                this.$translate.instant('server_close_service_cancel_success'),
                'server_dashboard_alert',
              ),
            )
            .catch((err) => {
              this.Alerter.alertFromSWS(
                this.$translate.instant('server_close_service_cancel_error'),
                err,
                'server_dashboard_alert',
              );
              return this.$q.reject(err);
            });
          break;
        default:
          break;
      }

      this.cancelSubscriptionForm.isSubmiting = true;
      return promise.finally(() => {
        this.cancelSubscriptionForm.isSubmiting = false;
        this.resetAction();
      });
    }

    resetAction() {
      this.$scope.resetAction();
    }
  },
);
