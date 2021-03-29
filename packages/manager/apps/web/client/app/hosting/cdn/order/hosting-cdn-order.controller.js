export default class HostingCdnOrderCtrl {
  $onInit() {
    this.workflowOptions.getPlanCode = this.getPlanCode.bind(this);
  }

  getPlanCode() {
    return this.cdnPlanCode;
  }

  getOrderState({ isLoading }) {
    this.isStepperLoading = isLoading;
  }
}
