export default class OverTheBoxAutoconfigMultipath {
  /* @ngInject */
  constructor($translate, OvhApiOverTheBoxConfiguration) {
    this.$translate = $translate;
    this.OvhApiOverTheBoxConfiguration = OvhApiOverTheBoxConfiguration;
  }

  $onInit() {
    this.displayAddInterfaceButton = true;
    this.showAddInterface = false;

    this.interface = {
      gateway: '',
      ifname: '',
      interfaceName: '',
      ipAddr: '',
      isIPv6: false,
      mtu: '',
      netmask: '',
      priority: '',
      protocol: '',
      routingTable: '',
      type: '',
    };

    return this.loadInterfaces();
  }

  loadInterfaces() {
    return this.OvhApiOverTheBoxConfiguration.Network()
      .Interface()
      .v6()
      .showAllInterface({ serviceName: this.serviceName })
      .$promise.then((data) => {
        this.interfaces = data;
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

  addInterface() {
    this.interface.gateway = '';
    this.interface.ifname = '';
    this.interface.interfaceName = '';
    this.interface.ipAddr = '';
    this.interface.isIPv6 = false;
    this.interface.mtu = '';
    this.interface.netmask = '';
    this.interface.priority = '';
    this.interface.protocol = '';
    this.interface.routingTable = '';
    this.interface.type = '';
    this.showAddInterface = true;
    this.displayAddInterfaceButton = false;
  }

  createInterface() {
    this.errorMessage = '';
    this.successMessage = '';
    if (
      !this.interface.ifname &&
      !this.interface.interfaceName &&
      !this.interface.priority
    ) {
      return null;
    }

    const params = {
      ifname: this.interface.ifname,
      interfaceName: this.interface.interfaceName,
      priority: this.interface.priority,
    };

    if (this.interface.gateway) {
      params.gateway = this.interface.gateway;
    }
    if (this.interface.ipAddr) {
      params.ipAddr = this.interface.ipAddr;
    }
    if (this.interface.isIPv6) {
      params.ipv6 = this.interface.isIPv6;
    }
    if (this.interface.mtu) {
      params.mtu = this.interface.mtu;
    }
    if (this.interface.netmask) {
      params.netmask = this.interface.netmask;
    }
    if (this.interface.protocol) {
      params.proto = this.interface.protocol;
    }
    if (this.interface.routingTable) {
      params.routingTable = this.interface.routingTable;
    }
    if (this.interface.type) {
      params.type = this.interface.type;
    }

    return this.OvhApiOverTheBoxConfiguration.Network()
      .Interface()
      .v6()
      .createInterface({ serviceName: this.serviceName }, params)
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_multipath_interface_create_succeed',
        );

        // Reload interface table
        this.loadInterfaces();
        this.showAddInterface = false;
        this.displayAddInterfaceButton = true;
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

  cancelCreateInterface() {
    this.showAddInterface = false;
    this.displayAddInterfaceButton = true;
  }

  removeInterface(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Network()
      .Interface()
      .v6()
      .removeInterface({ serviceName: this.serviceName, id: row.id })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_multipath_interface_remove_succeed',
        );

        // Reload interfaces table
        this.loadInterfaces();
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
