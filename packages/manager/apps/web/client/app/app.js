import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import set from 'lodash/set';

import { Environment } from '@ovh-ux/manager-config';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhContracts from '@ovh-ux/ng-ovh-contracts';
import ngOvhExportCsv from '@ovh-ux/ng-ovh-export-csv';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngOvhSsoAuthModalPlugin from '@ovh-ux/ng-ovh-sso-auth-modal-plugin';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import ngOvhProxyRequest from '@ovh-ux/ng-ovh-proxy-request';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';
import ngTailLogs from '@ovh-ux/ng-tail-logs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ngUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ovhManagerAccountSidebar from '@ovh-ux/manager-account-sidebar';
import ovhNotificationsSidebar from '@ovh-ux/manager-notifications-sidebar';
import ovhManagerAccountMigration from '@ovh-ux/manager-account-migration';
import ovhManagerBanner from '@ovh-ux/manager-banner';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';
import ovhManagerIncidentBanner from '@ovh-ux/manager-incident-banner';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';
import ovhManagerProductOffers from '@ovh-ux/manager-product-offers';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import ovhManagerServerSidebar from '@ovh-ux/manager-server-sidebar';
import ovhManagerMfaEnrollment from '@ovh-ux/mfa-enrollment';
import emailpro from '@ovh-ux/manager-emailpro';
import exchange from '@ovh-ux/manager-exchange';
import office from '@ovh-ux/manager-office';
import sharepoint from '@ovh-ux/manager-sharepoint';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import WebPaas from '@ovh-ux/manager-web-paas';

import getConfig from './config/config';
import domain from './domain';
import domainDnsZone from './dns-zone';
import emailDomain from './email-domain';
import emailDomainOrder from './email-domain/order';
import errorPage from './error-page/error-page.module';
import hosting from './hosting';
import privateDatabase from './private-database';
import zone from './domain/zone/zone.module';

import emailDomainUpgradeModule from './email-domain/upgrade';
import hostingEmail from './hosting/email';
import hostingEmailActivateModule from './hosting/email/activate';

import wucAlldom from './components/alldom';
import wucAutorenewInvite from './components/autorenew-invite';
import wucCron from './components/cron';
import wucCronValidator from './components/cron-validator';
import wucExpiration from './components/expiration';
import wucOvhFileReader from './components/ovhFileReader';
import wucProgressBarElementCounter from './components/progressBarElementCounter';
import wucServiceStatus from './components/service-status';

import './css/source.less';
import './css/source.scss';

import { TRACKING } from './at-internet.constants';

Environment.setVersion(__VERSION__);

const config = getConfig(Environment.getRegion());

const moduleName = 'App';

angular
  .module(
    moduleName,
    [
      ovhManagerAccountSidebar,
      ovhManagerCore,
      ngPaginationFront,
      'ngOvhUtils',
      'ui.bootstrap',
      'ngAria',
      'ngRoute',
      'ngResource',
      'ngSanitize',
      'controllers',
      'services',
      'filters',
      'directives',
      ngQAllSettled,
      'ngMessages',
      'xeditable',
      ngAtInternet,
      ngAtInternetUiRouterPlugin,
      ngOvhApiWrappers,
      ngOvhContracts,
      ngOvhContracts,
      ngOvhExportCsv,
      ngOvhFeatureFlipping,
      ngOvhHttp,
      ngOvhSsoAuth,
      ngOvhSsoAuthModalPlugin,
      ngOvhSwimmingPoll,
      ngOvhProxyRequest,
      ngOvhUserPref,
      ngOvhWebUniverseComponents,
      ngTranslateAsyncLoader,
      ngUiRouterBreadcrumb,
      ngUiRouterLayout,
      ngUiRouterLineProgress,
      ovhManagerServerSidebar,
      uiRouter,
      'pascalprecht.translate',
      ngTailLogs,
      'ovh-api-services',
      ovhManagerMfaEnrollment,
      ovhManagerAtInternetConfiguration,
      ovhManagerAccountMigration,
      ovhManagerBanner,
      ovhManagerCatalogPrice,
      ovhManagerIncidentBanner,
      ovhManagerNavbar,
      ovhManagerProductOffers,
      ovhNotificationsSidebar,
      'oui',
      emailpro,
      exchange,
      office,
      sharepoint,
      domain,
      domainDnsZone,
      emailDomain,
      emailDomainOrder,
      errorPage,
      hosting,
      privateDatabase,
      zone,
      emailDomainUpgradeModule,
      hostingEmail,
      hostingEmailActivateModule,
      wucAlldom,
      wucAutorenewInvite,
      wucCron,
      wucCronValidator,
      wucExpiration,
      wucOvhFileReader,
      wucProgressBarElementCounter,
      wucServiceStatus,
      ...get(__NG_APP_INJECTIONS__, Environment.getRegion(), []),
      WebPaas,
    ].filter(isString),
  )
  .constant('constants', {
    prodMode: config.prodMode,
    aapiRootPath: config.aapiRootPath,
    target: config.target,
    renew: config.constants.RENEW_URL,
    urls: config.constants.URLS,
    comodo: config.constants.COMODO,
    TOP_GUIDES: config.constants.TOP_GUIDES,
    swsProxyRootPath: 'apiv6/',
    aapiHeaderName: 'X-Ovh-Session',
    flags_options: config.constants.flags_options,
    algorithm_options: config.constants.algorithm_options,
    HOSTING: config.constants.HOSTING,
    DOMAIN: config.constants.DOMAIN,
    WEBSITE_URLS: config.constants.website_url,
    new_bdd_user_grant_options: config.constants.new_bdd_user_grant_options,
    ORDER_URL: config.constants.ORDER_URL,
  })
  .constant('website_url', config.constants.website_url)
  .factory('serviceTypeInterceptor', () => ({
    // eslint-disable-next-line no-shadow
    request: (config) => {
      if (/^(\/?engine\/)?2api(-m)?\//.test(config.url)) {
        set(config, 'url', config.url.replace(/^(\/?engine\/)?2api(-m)?/, ''));
        set(config, 'serviceType', 'aapi');
      }

      if (/^apiv6\//.test(config.url)) {
        set(config, 'url', config.url.replace(/^apiv6/, ''));
        set(config, 'serviceType', 'apiv6');
      }

      if (/^apiv7\//.test(config.url)) {
        set(config, 'url', config.url.replace(/^apiv7/, ''));
        set(config, 'serviceType', 'apiv7');
      }

      return config;
    },
  }))
  .config([
    '$qProvider',
    ($qProvider) => {
      $qProvider.errorOnUnhandledRejections(false);
    },
  ])
  .config(
    /* @ngInject */ (ovhPaymentMethodProvider) => {
      ovhPaymentMethodProvider.setPaymentMethodPageUrl(
        buildURL('dedicated', '#/billing/payment/method'),
      );
      ovhPaymentMethodProvider.setUserLocale(Environment.getUserLocale());
    },
  )
  .config(
    /* @ngInject */ (ovhProxyRequestProvider) => {
      ovhProxyRequestProvider.proxy('$http');
      ovhProxyRequestProvider.pathPrefix('apiv6');
    },
  )
  .config([
    'tmhDynamicLocaleProvider',
    (tmhDynamicLocaleProvider) => {
      tmhDynamicLocaleProvider.localeLocationPattern(
        'resources/angular/i18n/angular-locale_{{locale}}.js',
      );
    },
  ])
  .config([
    'OvhHttpProvider',
    'constants',
    (OvhHttpProvider, constants) => {
      set(OvhHttpProvider, 'rootPath', constants.swsProxyPath);
      set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
      set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
      set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
    },
  ])
  .config([
    '$compileProvider',
    '$logProvider',
    'constants',
    ($compileProvider, $logProvider, constants) => {
      // Debug mode and logs are disabled in production
      $compileProvider.debugInfoEnabled(!constants.prodMode);
      $logProvider.debugEnabled(!constants.prodMode);
    },
  ])
  .config(
    /* @ngInject */ (atInternetConfigurationProvider) => {
      atInternetConfigurationProvider.setConfig(TRACKING);
      atInternetConfigurationProvider.setReplacementRules([
        {
          pattern: /^app/,
          replacement: 'web',
        },
      ]);
    },
  )
  .config([
    '$locationProvider',
    ($locationProvider) => {
      $locationProvider.hashPrefix('');
    },
  ])
  .constant('URLS_REDIRECTED_TO_DEDICATED', [
    new RegExp('/useraccount/.*'),
    new RegExp('/billing/.*'),
  ])
  .config(
    /* @ngInject */ (ovhFeatureFlippingProvider) => {
      ovhFeatureFlippingProvider.setApplicationName(
        Environment.getApplicationName(),
      );
    },
  )
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'URLS_REDIRECTED_TO_DEDICATED',
    ($stateProvider, $urlRouterProvider, URLS_REDIRECTED_TO_DEDICATED) => {
      forEach(URLS_REDIRECTED_TO_DEDICATED, (url) => {
        $urlRouterProvider.when(url, [
          '$window',
          '$location',
          ($window, $location) => {
            const lastPartOfUrl = $location.url().substring(1);
            set(
              $window,
              'location',
              buildURL('dedicated', `#/${lastPartOfUrl}`),
            );
          },
        ]);
      });

      $urlRouterProvider.otherwise('/configuration');
    },
  ])
  .constant('COMPOSED_TLD', [
    'org.pl',
    'net.pl',
    'com.pl',
    'miasto.pl',
    'co.uk',
    'me.uk',
    'org.uk',
    'ac.uk',
    'asn.au',
    'com.au',
    'net.au',
    'id.au',
    'org.au',
    'edu.au',
    'gov.au',
    'csiro.au',
    'act.au',
    'nsw.au',
    'nt.au',
    'qld.au',
    'sa.au',
    'tas.au',
    'vic.au',
    'wa.au',
    'ac.za',
    'gov.za',
    'law.za',
    'mil.za',
    'school.za',
    'net.za',
    'ltd.uk',
    'plc.uk',
    'net.uk',
    'sch.uk',
    'gov.uk',
    'mod.uk',
    'mil.uk',
    'nhs.uk',
    'police.uk',
    'tm.fr',
    'com.fr',
    'asso.fr',
    'gov.fr',
    'ovh.net',
    'com.af',
    'org.af',
    'net.af',
    'edu.af',
    'ac.be',
    'ab.ca',
    'bc.ca',
    'mb.ca',
    'nb.ca',
    'nf.ca',
    'nl.ca',
    'ns.ca',
    'nt.ca',
    'nu.ca',
    'on.ca',
    'pe.ca',
    'qc.ca',
    'sk.ca',
    'yk.ca',
    'aeroport.fr',
    'assedic.fr',
    'avocat.fr',
    'avoues.fr',
    'cci.fr',
    'chambagri.fr',
    'chirurgiens-dentistes.fr',
    'experts-comptables.fr',
    'geometre-expert.fr',
    'gouv.fr',
    'greta.fr',
    'huissier-justice.fr',
    'medecin.fr',
    'notaires.fr',
    'pharmacien.fr',
    'port.fr',
    'veterinaire.fr',
    'aid.pl',
    'agro.pl',
    'atm.pl',
    'auto.pl',
    'biz.pl',
    'edu.pl',
    'gmina.pl',
    'gsm.pl',
    'info.pl',
    'mail.pl',
    'miasta.pl',
    'media.pl',
    'mil.pl',
    'nieruchomosci.pl',
    'nom.pl',
    'pc.pl',
    'powiat.pl',
    'priv.pl',
    'realestate.pl',
    'rel.pl',
    'sex.pl',
    'shop.pl',
    'sklep.pl',
    'sos.pl',
    'szkola.pl',
    'targi.pl',
    'tm.pl',
    'tourism.pl',
    'travel.pl',
    'turystyka.pl',
  ])
  .run([
    '$location',
    'URLS_REDIRECTED_TO_DEDICATED',
    ($location, URLS_REDIRECTED_TO_DEDICATED) => {
      forEach(
        filter(URLS_REDIRECTED_TO_DEDICATED, (url) =>
          url.test(window.location.href),
        ),
        () => {
          const lastPartOfUrl = $location.url().substring(1);
          window.location = buildURL('dedicated', `#/${lastPartOfUrl}`);
        },
      );
    },
  ])
  .run([
    '$rootScope',
    ($rootScope) => {
      $rootScope.$on('$locationChangeStart', () => {
        // eslint-disable-next-line no-param-reassign
        delete $rootScope.isLeftMenuVisible;
      });
    },
  ])
  .run([
    '$location',
    ($location) => {
      const queryParams = $location.search();

      if (queryParams && queryParams.redirectTo) {
        $location.path(queryParams.redirectTo);
        delete queryParams.redirectTo;
        $location.search(queryParams);
      }
    },
  ])
  .run(
    /* @ngInject */ ($translate) => {
      let lang = $translate.use();

      if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
        lang = lang.toLowerCase().replace('_', '-');
      } else {
        [lang] = lang.split('_');
      }

      return import(`script-loader!moment/locale/${lang}.js`).then(() =>
        moment.locale(lang),
      );
    },
  )

  .config(
    /* @ngInject */ (ouiCalendarConfigurationProvider) => {
      const lang = Environment.getUserLanguage();
      return import(`flatpickr/dist/l10n/${lang}.js`)
        .then((module) => {
          ouiCalendarConfigurationProvider.setLocale(module.default[lang]);
        })
        .catch(() => {});
    },
  )
  .run([
    'storage',
    (storage) => {
      storage.setKeyPrefix('UNIVERS-WEB');
    },
  ])
  .run((editableOptions, editableThemes) => {
    set(editableOptions, 'theme', 'default');

    // overwrite submit button template
    set(
      editableThemes,
      'default.submitTpl',
      [
        '<button style="background:none;border:none" type="submit">',
        '<i class="fa fa-check green"></i>',
        '</button>',
      ].join(''),
    );
    set(
      editableThemes,
      'default.cancelTpl',
      [
        '<button style="background:none;border:none" ng-click="$form.$cancel()">',
        '<i class="fa fa-times red"></i>',
        '</button>',
      ].join(''),
    );
  })
  .constant('UNIVERSE', 'WEB')
  .run(
    /* @ngInject */ ($rootScope, $state) => {
      $state.defaultErrorHandler((error) => {
        if (error.type === RejectType.ERROR) {
          $rootScope.$emit('ovh::sidebar::hide');
          $state.go(
            'error',
            {
              detail: {
                message: get(error.detail, 'data.message'),
                code: has(error.detail, 'headers')
                  ? error.detail.headers('x-ovh-queryId')
                  : null,
              },
            },
            { location: false },
          );
        }
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./core/translations */)
  .run(
    /* @ngInject */ ($rootScope, $transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        $rootScope.$broadcast('app:started');
        unregisterHook();
      });
    },
  )
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'app.**' }, () => $translate.refresh());
    },
  );

export default moduleName;
