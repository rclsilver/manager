import controller from './info.controller';
import template from './info.html';

export default {
  controller,
  template,
  bindings: {
    job: '<',
    goToJobKill: '<',
    goToJobResubmit: '<',
    user: '<',
    getTax: '<',
    getPrice: '<',
    refreshState: '<',
    projectId: '<',
    jobId: '<',
    jobInfo: '<',
    jobLogs: '<',
    currentActiveLink: '<',
  },
};
