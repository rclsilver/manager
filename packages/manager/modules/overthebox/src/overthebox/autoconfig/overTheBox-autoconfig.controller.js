export default class OverTheBoxAutoconfigCtrl {
  /* @ngInject */
  constructor($translate, OvhApiOverTheBoxConfiguration) {
    this.$translate = $translate;
    this.OvhApiOverTheBoxConfiguration = OvhApiOverTheBoxConfiguration;
  }
}
