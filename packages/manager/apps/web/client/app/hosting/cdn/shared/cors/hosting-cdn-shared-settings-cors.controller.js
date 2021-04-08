export default class HostingCdnSharedCorsController {
  $onInit() {
    this.origins =
      this.cors.config.origins !== '*'
        ? this.cors.config.origins.split(',')
        : [];

    this.domainsToRemove = [];
  }

  addDomain(domain) {
    this.origins = [...this.origins, domain];

    this.domainToAdd = null;
  }

  removeDomains(domainsToRemove) {
    this.origins = [
      ...this.origins.filter((domain) => !domainsToRemove.includes(domain)),
    ];

    this.domainsToRemove = [];
  }
}
