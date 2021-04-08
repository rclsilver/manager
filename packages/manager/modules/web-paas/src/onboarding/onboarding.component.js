import controller from './onboarding.controller';
import template from './onboarding.html';

export default {
  bindings: {
    createProject: '<',
    guideUrl: '<',
    projects: '<',
  },
  controller,
  template,
};
