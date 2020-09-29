export default class OverTheBoxAutoconfigDhcp {
  /* @ngInject */
  constructor($q, $state, $translate, OvhApiOverTheBoxConfiguration) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.OvhApiOverTheBoxConfiguration = OvhApiOverTheBoxConfiguration;
  }

  $onInit() {
    this.displayAddConfigButton = true;
    this.displayAddStaticLeaseButton = true;
    this.showAddConfig = false;
    this.showAddStaticLease = false;

    this.config = {
      interface: '',
      leaseDuration: '',
      offset: '',
      poolSize: '',
      priority: '',
    };

    this.staticLease = {
      hostname: '',
      ip: '',
      mac: '',
      priority: '',
    };

    return this.$q.all([this.loadConfig(), this.loadStaticLeases()]);
  }

  loadConfig() {
    this.configList = [];
    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .Config()
      .v6()
      .showAllConfig({
        serviceName: this.serviceName,
      })
      .$promise.then((data) => {
        if (data.result) {
          this.configList = data.result;
        }
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

  addConfig() {
    this.config.interface = '';
    this.config.leaseDuration = '';
    this.config.offset = '';
    this.config.poolSize = '';
    this.config.priority = '';
    this.showAddConfig = true;
    this.displayAddConfigButton = false;
  }

  createConfig() {
    this.errorMessage = '';
    this.successMessage = '';
    if (
      !this.config.leaseDuration &&
      !this.config.offset &&
      !this.config.poolSize &&
      !this.config.priority
    ) {
      return null;
    }

    const params = {
      leaseDuration: this.config.leaseDuration,
      offset: this.config.offset,
      poolSize: this.config.poolSize,
      priority: this.config.priority,
    };

    if (this.config.interface) {
      params.interface = this.config.interface;
    }

    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .Config()
      .v6()
      .createConfig(
        {
          serviceName: this.serviceName,
        },
        params,
      )
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_config_create_succeed',
        );

        // Reload config table
        this.loadConfig();
        this.showAddConfig = false;
        this.displayAddConfigButton = true;
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_create_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  cancelCreateConfig() {
    this.showAddConfig = false;
    this.displayAddConfigButton = true;
  }

  removeConfig(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .Config()
      .v6()
      .removeConfig({
        serviceName: this.serviceName,
        id: row.id,
      })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_config_remove_succeed',
        );

        // Reload config table
        this.loadConfig();
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_remove_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  loadStaticLeases() {
    this.staticLeases = [];
    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .StaticLease()
      .v6()
      .showAllStaticLease({
        serviceName: this.serviceName,
      })
      .$promise.then((data) => {
        if (data.result) {
          this.staticLeases = data.result;
        }
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

  addStaticLease() {
    this.staticLease.hostname = '';
    this.staticLease.ip = '';
    this.staticLease.mac = '';
    this.staticLease.priority = '';
    this.showAddStaticLease = true;
    this.displayAddStaticLeaseButton = false;
  }

  createStaticLease() {
    this.errorMessage = '';
    this.successMessage = '';
    if (
      !this.staticLease.hostname &&
      !this.staticLease.ip &&
      !this.staticLease.mac &&
      !this.config.priority
    ) {
      return null;
    }

    const params = {
      hostname: this.staticLease.hostname,
      ip: this.staticLease.ip,
      mac: this.staticLease.mac,
      priority: this.staticLease.priority,
    };

    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .StaticLease()
      .v6()
      .createDhcpStaticLease(
        {
          serviceName: this.serviceName,
        },
        params,
      )
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_static_lease_create_succeed',
        );

        // Reload static lease table
        this.loadStaticLeases();
        this.showAddStaticLease = false;
        this.displayAddStaticLeaseButton = true;
        return data;
      })
      .catch((error) => {
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_create_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  cancelCreateStaticLease() {
    this.showAddStaticLease = false;
    this.displayAddStaticLeaseButton = true;
  }

  removeStaticLease(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .StaticLease()
      .v6()
      .removeStaticLease({
        serviceName: this.serviceName,
        id: row.id,
      })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_static_lease_remove_succeed',
        );

        // Reload static lease table
        this.loadStaticLeases();
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_remove_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }
}
