import cdnConfiguration from './cdnConfiguration';

import routing from './multisite.routing';
import './multisite.css';

const moduleName = 'ovhManagerHostingMultisite';

angular
  .module(moduleName, [cdnConfiguration])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
