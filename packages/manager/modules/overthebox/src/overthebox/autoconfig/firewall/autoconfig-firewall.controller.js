export default class OverTheBoxAutoconfigFirewall {
  /* @ngInject */
  constructor($q, $translate, OvhApiOverTheBoxConfiguration) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiOverTheBoxConfiguration = OvhApiOverTheBoxConfiguration;
  }

  $onInit() {
    this.displayAddRuleButton = true;
    this.showAddRule = false;
    this.displayAddRedirectButton = true;
    this.showAddRedirect = false;

    this.rule = {
      destIp: '',
      destPort: '',
      destZone: '',
      family: '',
      name: '',
      priority: '',
      protocol: '',
      srcIp: '',
      srcPort: '',
      srcZone: '',
      target: '',
    };
    this.redirect = {
      destIp: '',
      destPort: '',
      destZone: '',
      name: '',
      priority: '',
      protocol: '',
      srcDIp: '',
      srcDPort: '',
      srcIp: '',
      srcPort: '',
      srcZone: '',
      target: '',
    };

    return this.$q.all([this.loadRules(), this.loadRedirect()]);
  }

  loadRules() {
    return this.OvhApiOverTheBoxConfiguration.Firewall()
      .Rule()
      .v6()
      .showAllRule({ serviceName: this.serviceName })
      .$promise.then((data) => {
        this.rules = data;
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

  loadRedirect() {
    return this.OvhApiOverTheBoxConfiguration.Firewall()
      .Redirect()
      .v6()
      .showAllRedirect({ serviceName: this.serviceName })
      .$promise.then((data) => {
        this.redirections = data;
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

  addRule() {
    this.rule.destIp = '';
    this.rule.destPort = '';
    this.rule.destZone = '';
    this.rule.family = '';
    this.rule.name = '';
    this.rule.priority = '';
    this.rule.protocol = '';
    this.rule.srcIp = '';
    this.rule.srcPort = '';
    this.rule.srcZone = '';
    this.rule.target = '';
    this.showAddRule = true;
    this.displayAddRuleButton = false;
  }

  createRule() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.rule.srcZone && !this.rule.target && !this.rule.priority) {
      return null;
    }

    const params = {
      priority: this.rule.priority,
      srcZone: this.rule.srcZone,
      target: this.rule.target,
    };

    if (this.rule.destIp) {
      params.destIp = this.rule.destIp;
    }
    if (this.rule.destPort) {
      params.destPort = this.rule.destPort;
    }
    if (this.rule.destZone) {
      params.destZone = this.rule.destZone;
    }
    if (this.rule.family) {
      params.family = this.rule.family;
    }
    if (this.rule.name) {
      params.name = this.rule.name;
    }
    if (this.rule.protocol) {
      params.proto = this.rule.protocol;
    }
    if (this.rule.srcIp) {
      params.srcIp = this.rule.srcIp;
    }
    if (this.rule.srcPort) {
      params.srcPort = this.rule.srcPort;
    }

    return this.OvhApiOverTheBoxConfiguration.Firewall()
      .Rule()
      .v6()
      .createRule({ serviceName: this.serviceName }, params)
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_firewall_rule_create_succeed',
        );

        // Reload rule table
        this.loadRules();
        this.showAddRule = false;
        this.displayAddRuleButton = true;
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

  cancelCreateRule() {
    this.showAddRule = false;
    this.displayAddRuleButton = true;
  }

  removeRule(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Firewall()
      .Rule()
      .v6()
      .removeRule({ serviceName: this.serviceName, id: row.id })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_firewall_rule_remove_succeed',
        );

        // Reload rules table
        this.loadRules();
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

  addRedirect() {
    this.redirect.destIp = '';
    this.redirect.destPort = '';
    this.redirect.destZone = '';
    this.redirect.name = '';
    this.redirect.priority = '';
    this.redirect.protocol = '';
    this.redirect.srcDIp = '';
    this.redirect.srcDPort = '';
    this.redirect.srcIp = '';
    this.redirect.srcPort = '';
    this.redirect.srcZone = '';
    this.redirect.target = '';
    this.showAddRedirect = true;
    this.displayAddRedirectButton = false;
  }

  createRedirect() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.redirect.name && !this.redirect.priority) {
      return null;
    }

    const params = {
      name: this.redirect.name,
      priority: this.redirect.priority,
    };

    if (this.redirect.destIp) {
      params.destIp = this.redirect.destIp;
    }
    if (this.redirect.destPort) {
      params.destPort = this.redirect.destPort;
    }
    if (this.redirect.destZone) {
      params.destZone = this.redirect.destZone;
    }
    if (this.redirect.protocol) {
      params.proto = this.redirect.protocol;
    }
    if (this.redirect.srcDIp) {
      params.srcDIp = this.redirect.srcDIp;
    }
    if (this.redirect.srcDPort) {
      params.srcDPort = this.redirect.srcDPort;
    }
    if (this.redirect.srcIp) {
      params.srcIp = this.redirect.srcIp;
    }
    if (this.redirect.srcPort) {
      params.srcPort = this.redirect.srcPort;
    }
    if (this.redirect.srcZone) {
      params.srcZone = this.redirect.srcZone;
    }
    if (this.redirect.target) {
      params.target = this.redirect.target;
    }

    return this.OvhApiOverTheBoxConfiguration.Firewall()
      .Redirect()
      .v6()
      .createRedirect({ serviceName: this.serviceName }, params)
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_firewall_redirect_create_succeed',
        );

        // Reload redirections table
        this.loadRedirect();
        this.showAddRedirect = false;
        this.displayAddRedirectButton = true;
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

  cancelCreateRedirect() {
    this.showAddRedirect = false;
    this.displayAddRedirectButton = true;
  }

  removeRedirect(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Firewall()
      .Redirect()
      .v6()
      .removeRedirect({ serviceName: this.serviceName, id: row.id })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_firewall_redirect_remove_succeed',
        );

        // Reload redirections table
        this.loadRedirect();
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
