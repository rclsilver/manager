export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  resiliate() {
    return this.askForResilation()
      .then(() =>
        this.goBack(
          this.$translate.instant(
            this.service.isEngaged
              ? 'manager_hub_incident_status_resiliate_success_engaged'
              : 'manager_hub_incident_status_resiliate_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          `${this.$translate.instant(
            'manager_hub_incident_status_resiliate_error',
          )} ${error.data?.message}`,
          'error',
        ),
      );
  }
}
