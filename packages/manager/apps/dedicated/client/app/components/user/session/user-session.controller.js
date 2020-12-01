import isString from 'lodash/isString';
import set from 'lodash/set';
import { Environment } from '@ovh-ux/manager-config';
import { emit, listen } from '@ovh-ux/ufrontend/communication';

angular.module('App').controller(
  'SessionCtrl',
  class SessionCtrl {
    /* @ngInject */
    constructor($document, $scope, $state, $transitions, $translate) {
      this.$document = $document;
      this.$scope = $scope;
      this.$state = $state;
      this.$transitions = $transitions;
      this.$translate = $translate;
      this.chatbotEnabled = false;
    }

    $onInit() {
      this.$scope.$on('switchUniverse', (event, universe) => {
        this.sidebarNamespace = universe === 'server' ? undefined : 'hpc';
        this.navbarOptions.universe = universe;
        emit({
          id: 'navbar.universe.set',
          universe,
        });
      });

      this.messageListeners = [
        listen('navigation-sidebar.show', () => {
          this.sidebarIsOpen = true;
        }),
        listen('navigation-sidebar.hide', () => {
          this.sidebarIsOpen = false;
        }),
      ];

      this.currentLanguage = Environment.getUserLanguage();
      this.user = Environment.getUser();
      const unregisterListener = this.$scope.$on('app:started', () => {
        this.chatbotEnabled = true;
        unregisterListener();
      });

      this.navbarOptions = {
        toggle: {
          event: 'sidebar:loaded',
        },
        universe: 'server',
      };

      set(this.$document, 'title', this.$translate.instant('global_app_title'));

      this.hooksToUnsubscribe = [
        this.$transitions.onStart({}, () => {
          this.closeSidebar();
        }),
        this.$transitions.onSuccess({}, () => {
          this.displayAccountSidebar = ['support', 'app.account'].some((name) =>
            this.$state.includes(name),
          );
        }),
      ];

      // Scroll to anchor id
      this.$scope.scrollTo = (id) => {
        // Set focus to target
        if (isString(id)) {
          this.$document.find(`#${id}`)[0].focus();
        }
      };
    }

    openSidebar() {
      this.sidebarIsOpen = true;
    }

    closeSidebar() {
      this.sidebarIsOpen = false;
    }

    $onDestroy() {
      this.hooksToUnsubscribe.forEach((hook) => hook());
      this.messageListeners.forEach((forget) => forget());
    }
  },
);
