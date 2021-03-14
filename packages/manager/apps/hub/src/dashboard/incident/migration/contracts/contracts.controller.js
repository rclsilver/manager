export default class IncidentMigrationContractController {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.totalContracts = this.contracts.length;
    this.contractIndex = 0;

    this.contractToValidate = this.getCurrentContract(this.contractIndex);
  }

  agreeContracts() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::contract-validation::confirm`,
      type: 'action',
    });
    if (this.contractIndex < this.totalContracts - 1) {
      this.contractIndex += 1;
      this.contractToValidate = this.getCurrentContract(this.contractIndex);
      this.agree = false;
    } else {
      this.handleRedirect();
    }
  }

  handleRedirect() {
    this.openOrderUrl();

    if (this.servicesIds.length === 1) {
      return this.redirectToServiceDashboard();
    }

    return this.isAllServicesToMigrate
      ? this.goBackToDashboard()
      : this.goToIncident(true);
  }

  getCurrentContract(contractIndex) {
    return [this.contracts[contractIndex]];
  }

  cancel() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::contract-validation::cancel`,
      type: 'action',
    });
    return this.goToIncident();
  }
}
