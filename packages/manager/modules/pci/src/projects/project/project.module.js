import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-incident-banner';

import analyticsDataPlatform from './analytics-data-platform';
import baremetal from './baremetal';
import billing from './billing';
import contacts from './contacts';
import creating from './creating';
import dataProcessing from './data-processing';
import edit from './edit';
import errorModal from '../new/error-modal';
import failoverIps from './failover-ips';
import instances from './instances';
import kubernetes from './kubernetes';
import loadBalancer from './load-balancer';
import sshKeys from './ssh-keys';
import privateNetworks from './private-networks';
import quota from './quota';
import privateRegistry from './private-registry';
import sidebar from './sidebar';
import storages from './storages';
import users from './users';
import vouchers from './vouchers';
import regions from './regions';
import routing from './project.routing';
import serving from './serving';
import training from './training';
import workflow from './workflow';

import projectComponent from './project.component';

import './project.less';

const moduleName = 'ovhManagerPciProject';

angular
  .module(moduleName, [
    analyticsDataPlatform,
    baremetal,
    billing,
    contacts,
    creating,
    dataProcessing,
    edit,
    errorModal,
    failoverIps,
    instances,
    loadBalancer,
    kubernetes,
    privateNetworks,
    quota,
    regions,
    privateRegistry,
    'oui',
    'ovhManagerCore',
    'ovhManagerIncidentBanner',
    'ovh-api-services',
    'pascalprecht.translate',
    sshKeys,
    sidebar,
    storages,
    users,
    vouchers,
    workflow,
    serving,
    training,
  ])
  .config(routing)
  .component('pciProject', projectComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
