import controller from './databases.controller';
import template from './databases.html';

export default {
  bindings: {
    addDatabase: '<',
    guideUrl: '<',
    databases: '<',
    projectId: '<',
  },
  controller,
  template,
};
