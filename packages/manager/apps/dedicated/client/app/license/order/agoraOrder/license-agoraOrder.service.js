import assign from 'lodash/assign';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';
import set from 'lodash/set';

class LicenseAgoraOrder {
  constructor($http, $q, $translate, Alerter, coreConfig, OvhHttp, User) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.coreConfig = coreConfig;
    this.OvhHttp = OvhHttp;
    this.User = User;

    this.licenseTypeToCatalog = {
      CLOUDLINUX: 'licenseCloudLinux',
      CPANEL: 'licensecPanel',
      DIRECTADMIN: 'licenseDirectadmin',
      PLESK: 'licensePlesk',
      SQLSERVER: 'licenseSqlServer',
      VIRTUOZZO: 'licenseVirtuozzo',
      WINDOWS: 'licenseWindows',
      WORKLIGHT: 'licenseWorklight',
      REDHAT: 'licenseRedha t',
    };

    /* this.licenseTypeToCatalog = {
      CLOUDLINUX: 'licenseCloudLinux',
      CPANEL: 'cpanel',
      DIRECTADMIN: 'licenseDirectadmin',
      PLESK: 'plesk',
      SQLSERVER: 'licenseSqlServer',
      VIRTUOZZO: 'licenseVirtuozzo',
      WINDOWS: 'licenseWindows',
      WORKLIGHT: 'licenseWorklight',
    }; */
  }

  getLicenseOffers(licenseType) {
    return this.User.getUser().then((user) =>
      this.OvhHttp.get('/order/catalog/formatted/{catalogName}', {
        rootPath: 'apiv6',
        urlParams: {
          catalogName: this.licenseTypeToCatalog[licenseType],
        },
        params: {
          ovhSubsidiary: get(
            user,
            'ovhSubsidiary',
            this.coreConfig.getRegion(),
          ),
        },
      }).then((data) => data.plans),
    );
  }

  getdAddons(productType) {
    return this.OvhHttp.get(`/order/cartServiceOption/${productType}`, {
      rootPath: 'apiv6',
    });
  }

  getAddon({ productType, serviceName }) {
    return this.OvhHttp.get(
      `/order/cartServiceOption/${productType}/{serviceName}`,
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  addAddon({
    productType,
    serviceName,
    cartId,
    duration,
    planCode,
    pricingMode,
    quantity,
  }) {
    return this.OvhHttp.post(
      `/order/cartServiceOption/${productType}/{serviceName}`,
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          cartId,
          duration,
          planCode,
          pricingMode,
          quantity,
        },
      },
    );
  }

  getDedicatedAddons() {
    return this.OvhHttp.get('/order/cartServiceOption/dedicated', {
      rootPath: 'apiv6',
    });
  }

  getDedicatedAddonLicenses({ serviceName }) {
    return this.OvhHttp.get(
      '/order/cartServiceOption/dedicated/{serviceName}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  addDedicatedAddonLicense({
    serviceName,
    cartId,
    duration,
    planCode,
    pricingMode,
    quantity,
  }) {
    return this.OvhHttp.post(
      '/order/cartServiceOption/dedicated/{serviceName}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {
          cartId,
          duration,
          planCode,
          pricingMode,
          quantity,
        },
      },
    );
  }

  createDedicatedCart(config) {
    let cartId = '';

    return this.User.getUser().then((user) =>
      this.OvhHttp.post('/order/cart', {
        rootPath: 'apiv6',
        data: {
          ovhSubsidiary: get(
            user,
            'ovhSubsidiary',
            this.coreConfig.getRegion(),
          ),
        },
      })
        .then((data) => {
          cartId = get(data, 'cartId');
          return this.OvhHttp.post('/order/cart/{cartId}/assign', {
            rootPath: 'apiv6',
            urlParams: { cartId },
          });
        })
        .then(() => this.pushDedicatedAgoraPlan({ cartId, config }))
        .then(
          () =>
            this.OvhHttp.get('/order/cart/{cartId}/checkout', {
              rootPath: 'apiv6',
              urlParams: { cartId },
            }).then((result) => {
              set(result, 'cartId', cartId);
              return result;
            }),
          // .then(() => {
          //   console.log(config);
          // })
        ),
    );
  }

  pushDedicatedAgoraPlan(params) {
    console.log(params);
    return this.OvhHttp.post(
      `/order/cartServiceOption/baremetalServers/${params.config.serviceName}`,
      {
        rootPath: 'apiv6',
        data: {
          ...params.config,
          cartId: params.cartId,
        },
      },
    ).then((result) => {
      return result;
    });
  }

  checkoutDedicated(cartId) {
    return this.OvhHttp.post(`/order/cart/${cartId}/checkout`, {
      rootPath: 'apiv6',
      urlParams: { cartId },
    });
  }

  getVpsAddons() {
    return this.OvhHttp.get('/order/cartServiceOption/vps', {
      rootPath: 'apiv6',
    });
  }

  getVpsAddonLicenses({ serviceName }) {
    return this.OvhHttp.get('/order/cartServiceOption/vps/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  addVpsAddonLicense({
    serviceName,
    cartId,
    duration,
    planCode,
    pricingMode,
    quantity,
  }) {
    return this.OvhHttp.post('/order/cartServiceOption/vps/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        cartId,
        duration,
        planCode,
        pricingMode,
        quantity,
      },
    });
  }

  getLicenseOfferPlan(licenseType, planCode, ip) {
    return this.getLicenseOffers(licenseType).then((plans) => {
      const plan = assign(
        {},
        find(plans, (planItem) => planItem.planCode === planCode),
      );
      plan.getPrice = (
        config = {
          options: [],
          duration: 1,
        },
      ) => {
        set(config, 'planCode', planCode);
        set(config, 'ip', ip);
        return this.getPlanPrice(config);
      };
      return plan;
    });
  }

  getLicenseOptions(cartId, licenseType, planCode) {
    console.log(cartId, licenseType, planCode);
    return this.OvhHttp.get(
      `/order/cart/${cartId}/${this.licenseTypeToCatalog[licenseType]}/options`,
      {
        rootPath: 'apiv6',
        params: {
          cartId,
          planCode,
        },
      },
    );
  }

  getDedicatedLicensePrices(options, licenses, serviceName) {
    console.log(options, licenses, serviceName);
    //   const promises = map(durations, (duration) =>
    //   plan
    //     .getPrice({
    //       duration: Number(duration),
    //       options: activeOptions,
    //       licenseType: licenseInfo.licenseType,
    //     })
    //     .then((price) => {
    //       prices[duration] = price;
    //     }),
    // );
    const config = {
      productId: 'dedicated',
      serviceName,
      planCode: get(licenses, 'version.planCode'),
      duration: get(licenses, 'version.prices[0].duration'),
      pricingMode: get(licenses, 'version.prices[0].pricingMode'),
      quantity: 1,
    };
    console.log(config);
    return this.getDedicatedPlanPrice(
      options,
      config,
      serviceName,
      licenses.version.typeName,
    );

    //  let promises = [];
    //   map(licenses, (license) => {
    //     map(license.prices, price => {
    //       promises.push(this.getDedicatedPlanPrice(price, license, serviceName));
    //       // console.log(price, license);
    //     })
    //   })
  }

  getDedicatedPlanPrice(options, config, serviceName, typeName) {
    console.log(options, config, serviceName, typeName);
    let cartId = '';
    const result = {};

    return this.User.getUser().then((user) =>
      this.OvhHttp.post('/order/cart', {
        rootPath: 'apiv6',
        data: {
          ovhSubsidiary: get(
            user,
            'ovhSubsidiary',
            this.coreConfig.getRegion(),
          ),
        },
      })
        .then((data) => {
          cartId = get(data, 'cartId');
          set(result, 'cartId', cartId);
          return this.OvhHttp.post('/order/cart/{cartId}/assign', {
            rootPath: 'apiv6',
            urlParams: { cartId },
          });
        })
        .then(() => this.pushDedicatedAgoraPlan({ cartId, config }))
        .then(() => {
          return this.getLicenseOptions(
            cartId,
            typeName,
            config.planCode,
          ).then((option) => set(result, 'option', option));
        })
        // .then((plan) =>
        //   this.configureIpField({
        //     cartId,
        //     itemId: plan.itemId,
        //     ip: config.ip,
        //   }).then(() => plan),
        // )
        // .then((plan) =>{
        //   console.log(plan);
        // }
        // this.$q.all(
        //   map(config.options, (option) =>
        //     this.pushAgoraPlan({
        //       cartId,
        //       config: assign({}, config, {
        //         planCode: option,
        //         options: [],
        //         itemId: plan.itemId,
        //       }),
        //       path: `/order/cart/{cartId}/${
        //         this.licenseTypeToCatalog[licenses.typeName]
        //       }/options`,
        //       urlParams: { cartId },
        //     }),
        //   ),
        // ),
        // )
        .then(() =>
          this.OvhHttp.get(`/order/cart/${cartId}/checkout`, {
            rootPath: 'apiv6',
          }).then((price) => {
            set(result, 'prices', price);
            return result;
          }),
        )
        .finally(() => this.$http.delete(`/order/cart/${cartId}`)),
    );
  }

  getPlanPrice(config) {
    let cartId = '';

    return this.User.getUser().then((user) =>
      this.OvhHttp.post('/order/cart', {
        rootPath: 'apiv6',
        data: {
          ovhSubsidiary: get(
            user,
            'ovhSubsidiary',
            this.coreConfig.getRegion(),
          ),
        },
      })
        .then((data) => {
          cartId = get(data, 'cartId');
          return this.OvhHttp.post('/order/cart/{cartId}/assign', {
            rootPath: 'apiv6',
            urlParams: { cartId },
          });
        })
        .then(() => this.pushAgoraPlan({ cartId, config }))
        .then((plan) =>
          this.configureIpField({
            cartId,
            itemId: plan.itemId,
            ip: config.ip,
          }).then(() => plan),
        )
        .then((plan) =>
          this.$q.all(
            map(config.options, (option) =>
              this.pushAgoraPlan({
                cartId,
                config: assign({}, config, {
                  planCode: option,
                  options: [],
                  itemId: plan.itemId,
                }),
                path: `/order/cart/{cartId}/${
                  this.licenseTypeToCatalog[config.licenseType]
                }/options`,
                urlParams: { cartId },
              }),
            ),
          ),
        )
        .then(() =>
          this.OvhHttp.get('/order/cart/{cartId}/checkout', {
            rootPath: 'apiv6',
          }),
        )
        .finally(() => this.$http.delete(`/order/cart/${cartId}`)),
    );
  }

  pushAgoraPlan(params) {
    set(params, 'path', params.path || '/order/cart/{cartId}/{productId}');
    set(
      params,
      'urlParams',
      params.urlParams || {
        cartId: params.cartId,
        productId: this.licenseTypeToCatalog[params.config.licenseType],
      },
    );

    const payload = {
      rootPath: 'apiv6',
      urlParams: params.urlParams,
      data: {
        duration: `P${params.config.duration}M`,
        planCode: params.config.planCode,
        pricingMode: 'default',
        quantity: 1,
      },
    };

    if (params.config.itemId) {
      payload.data.itemId = params.config.itemId;
    }

    return this.OvhHttp.post(params.path, payload);
  }

  configureIpField({ cartId, itemId, ip }) {
    return this.OvhHttp.post(
      '/order/cart/{cartId}/item/{itemId}/configuration',
      {
        rootPath: 'apiv6',
        urlParams: {
          cartId,
          itemId,
        },
        data: {
          label: 'ip',
          value: ip,
        },
      },
    );
  }

  getFinalizeOrderUrl(licenseInfo) {
    const productToOrder = this.getExpressOrderData(licenseInfo);
    return this.User.getUrlOf('express_order_resume')
      .then((url) => `${url}?products=${JSURL.stringify([productToOrder])}`)
      .catch((err) => {
        this.Alerter.error(this.$translate.instant('ip_order_finish_error'));
        return this.$q.reject(err);
      });
  }

  getExpressOrderData(licenseInfo) {
    const options = [];
    forEach(keys(licenseInfo.options), (key) => {
      if (get(licenseInfo.options[key], 'value')) {
        options.push({
          planCode: licenseInfo.options[key].value,
          duration: `P${licenseInfo.duration}M`,
          pricingMode: 'default',
          quantity: 1,
        });
      }
    });

    const productToOrder = {
      planCode: licenseInfo.version,
      productId: this.licenseTypeToCatalog[licenseInfo.licenseType],
      duration: `P${licenseInfo.duration}M`,
      pricingMode: 'default',
      quantity: licenseInfo.quantity || 1,
      configuration: [
        {
          label: 'ip',
          values: [licenseInfo.ip],
        },
      ],
    };

    if (options.length) {
      productToOrder.option = options;
    }

    return productToOrder;
  }
}

angular
  .module('Module.license')
  .service('LicenseAgoraOrder', LicenseAgoraOrder);
