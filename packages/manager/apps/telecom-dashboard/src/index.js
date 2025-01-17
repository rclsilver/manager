import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import telecomDashboard from '@ovh-ux/manager-telecom-dashboard';

import angular from 'angular';

angular
  .module('telecomDashboardApp', [ngUiRouterBreadcrumb, telecomDashboard])
  .config(
    /* @ngInject */ ($urlRouterProvider) => $urlRouterProvider.otherwise('/'),
  );
