/* eslint-disable import/no-webpack-loader-syntax, import/extensions */

import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!messenger/build/js/messenger.js';
import 'script-loader!messenger/build/js/messenger-theme-future.js';
import 'script-loader!messenger/build/js/messenger-theme-flat.js';

/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import angular from 'angular';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerVrack from '@ovh-ux/manager-vrack';

import './index.scss';

angular
  .module('vrackApp', [ngUiRouterBreadcrumb, ovhManagerVrack])
  .config(
    /* @ngInject */ ($qProvider) => {
      $qProvider.errorOnUnhandledRejections(false);
    },
  )
  .config(
    /* @ngInject */ ($urlRouterProvider) => {
      $urlRouterProvider.otherwise('/vrack');
    },
  );
