export default class OverTheBoxAutoconfigDns {
  /* @ngInject */
  constructor($q, $translate, OvhApiOverTheBoxConfiguration) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiOverTheBoxConfiguration = OvhApiOverTheBoxConfiguration;
  }

  $onInit() {
    this.displayAddServerButton = true;
    this.displayAddLocalDomainButton = true;
    this.showAddServer = false;
    this.showAddLocalDomain = false;

    this.nameserver = {
      server: '',
      priority: '',
    };

    this.localDomain = {
      hostname: '',
      ip: '',
      priority: '',
    };

    return this.$q.all([this.loadLocalDomain(), this.loadNameserver()]);
  }

  loadLocalDomain() {
    return this.OvhApiOverTheBoxConfiguration.Dns()
      .LocalDomain()
      .v6()
      .showAllLocalDomain({ serviceName: this.serviceName })
      .$promise.then((data) => {
        this.localDomains = data;
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_loading_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  loadNameserver() {
    return this.OvhApiOverTheBoxConfiguration.Dns()
      .Nameserver()
      .v6()
      .showAllNameserver({ serviceName: this.serviceName })
      .$promise.then((data) => {
        this.nameServers = data;
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_loading_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  addNameserver() {
    this.nameserver.server = '';
    this.nameserver.priority = '';
    this.showAddServer = true;
    this.displayAddServerButton = false;
  }

  createNameServer() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.nameserver.server && !this.nameserver.priority) {
      return null;
    }

    const params = {
      server: this.nameserver.server,
      priority: this.nameserver.priority,
    };
    console.log('nameserver', this.nameserver);

    return this.OvhApiOverTheBoxConfiguration.Dns()
      .Nameserver()
      .v6()
      .createNameserver({ serviceName: this.serviceName }, params)
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_server_create_succeed',
        );

        // Reload nameserver table
        this.loadNameserver();
        this.showAddServer = false;
        this.displayAddServerButton = true;
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_create_failed',
          { errorMessage: error.data.message },
        );
      });
  }

  cancelCreateNameServer() {
    this.showAddServer = false;
    this.displayAddServerButton = true;
  }

  removeNameserver(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Dns()
      .Nameserver()
      .v6()
      .removeNameserver({ serviceName: this.serviceName, id: row.id })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_server_remove_succeed',
        );

        // Reload nameserver table
        this.loadNameserver();
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_remove_failed',
          { errorMessage: error.data.message },
        );
      });
  }

  addLocalDomain() {
    this.localDomain.hostname = '';
    this.localDomain.ip = '';
    this.localDomain.priority = '';
    this.showAddLocalDomain = true;
    this.displayAddLocalDomainButton = false;
  }

  createLocalDomain() {
    this.errorMessage = '';
    this.successMessage = '';
    if (
      !this.localDomain.hostname &&
      !this.localDomain.ip &&
      !this.localDomain.priority
    ) {
      return null;
    }

    const params = {
      hostname: this.localDomain.hostname,
      ip: this.localDomain.ip,
      priority: this.localDomain.priority,
    };

    return this.OvhApiOverTheBoxConfiguration.Dns()
      .LocalDomain()
      .v6()
      .createLocalDomain({ serviceName: this.serviceName }, params)
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_local_domain_create_succeed',
        );

        // Reload local domain table
        this.loadLocalDomain();
        this.showAddLocalDomain = false;
        this.displayAddLocalDomainButton = true;
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_create_failed',
          { errorMessage: error.data.message },
        );
      });
  }

  cancelCreateLocalDomain() {
    this.showAddLocalDomain = false;
    this.displayAddLocalDomainButton = true;
  }

  removeLocalDomain(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Dns()
      .LocalDomain()
      .v6()
      .removeLocalDomain({ serviceName: this.serviceName, id: row.id })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_local_domain_remove_succeed',
        );

        // Reload local domain table
        this.loadLocalDomain();
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_remove_failed',
          { errorMessage: error.data.message },
        );
      });
  }
}
