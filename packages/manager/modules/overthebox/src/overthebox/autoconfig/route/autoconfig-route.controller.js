export default class OverTheBoxAutoconfigRoute {
  /* @ngInject */
  constructor($q, $translate, OvhApiOverTheBoxConfiguration) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiOverTheBoxConfiguration = OvhApiOverTheBoxConfiguration;
  }

  $onInit() {
    this.displayAddRouteButton = true;
    this.showAddRoute4 = false;

    this.route4 = {
      gateway: '',
      interface: '',
      metric: '',
      mtu: '',
      name: '',
      netmask: '',
      priority: '',
      table: '',
      target: '',
      type: '',
    };

    return this.$q.all([this.loadRoute4()]);
  }

  loadRoute4() {
    return this.OvhApiOverTheBoxConfiguration.Network()
      .Route4()
      .v6()
      .showAllRoute4({ serviceName: this.serviceName })
      .$promise.then((data) => {
        this.routes4 = data;
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

  addRoute4() {
    this.route4.gateway = '';
    this.route4.interface = '';
    this.route4.metric = '';
    this.route4.mtu = '';
    this.route4.name = '';
    this.route4.netmask = '';
    this.route4.priority = '';
    this.route4.table = '';
    this.route4.target = '';
    this.route4.type = '';
    this.showAddRoute4 = true;
    this.displayAddRouteButton = false;
  }

  createRoute4() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.route4.name && !this.route4.priority && !this.route4.target) {
      return null;
    }

    const params = {
      name: this.route4.name,
      priority: this.route4.priority,
      target: this.route4.target,
    };

    if (this.route4.gateway) {
      params.gateway = this.route4.gateway;
    }
    if (this.route4.interface) {
      params.interface = this.route4.interface;
    }
    if (this.route4.metric) {
      params.metric = this.route4.metric;
    }
    if (this.route4.mtu) {
      params.mtu = this.route4.mtu;
    }
    if (this.route4.netmask) {
      params.netmask = this.route4.netmask;
    }
    if (this.route4.table) {
      params.table = this.route4.table;
    }
    if (this.route4.type) {
      params.type = this.route4.type;
    }

    return this.OvhApiOverTheBoxConfiguration.Network()
      .Route4()
      .v6()
      .createRoute4({ serviceName: this.serviceName }, params)
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_route_server_create_succeed',
        );

        // Reload route4 table
        this.loadRoute4();
        this.showAddRoute4 = false;
        this.displayAddRouteButton = true;
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

  cancelCreateRoute4() {
    this.showAddRoute4 = false;
    this.displayAddRouteButton = true;
  }

  removeRoute4(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Network()
      .Route4()
      .v6()
      .removeRoute4({ serviceName: this.serviceName, id: row.id })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_route_server_remove_succeed',
        );

        // Reload route4 table
        this.loadRoute4();
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
