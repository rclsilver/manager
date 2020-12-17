import angular from 'angular';

import component from './component';

import './component.less';

const moduleName = 'ngOvhPaymentMethodIntegrationComponent';

angular.module(moduleName, []).component(component.name, component);

export default moduleName;
