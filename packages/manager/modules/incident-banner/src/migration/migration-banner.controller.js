export default class BannerController {
  /* @ngInject */
  constructor($http, coreURLBuilder) {
    this.$http = $http;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.isActive = false;
    this.migrationLink = this.coreURLBuilder.buildURL(
      'hub',
      `#/incident/${this.incident.toUpperCase()}/migration`,
    );
    return this.getImpactedService();
  }

  getImpactedService() {
    return this.$http
      .get(`/me/incident/${this.incident}/migrateServices`)
      .then(({ data }) => {
        this.isActive = !!data.length;
      })
      .catch(() => {
        this.isActive = false;
      });
  }
}
