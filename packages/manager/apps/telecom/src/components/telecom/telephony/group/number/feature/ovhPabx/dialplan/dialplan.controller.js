import get from 'lodash/get';
import set from 'lodash/set';
import some from 'lodash/some';

export default class DialplanCtrl {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    atInternet,
    autoScrollOnToggle,
    TucToast,
    TUC_UI_SORTABLE_HELPERS,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.TucToast = TucToast;
    this.tucUiSortableHelpers = TUC_UI_SORTABLE_HELPERS;
    this.autoScrollOnToggle = autoScrollOnToggle;
  }

  $onInit() {
    this.loading = {
      init: false,
    };

    this.popoverStatus = {
      isOpen: false,
      move: false,
      rightPage: null,
    };

    this.displayHelpers = {
      collapsed: false,
      expanded: true,
    };

    this.sortableOptions = null;
    this.ovhPabx = null;

    let sortInterval = null;
    let initPromise = this.$q.when();
    this.loading.init = true;

    // set ovhPabx instance
    this.ovhPabx = this.numberCtrl.number.feature;

    // set sortable options
    this.sortableOptions = {
      axis: 'y',
      handle: '.extension-grip',
      cancel: '.voip-plan__step-icon--grip-disabled',
      containment: 'parent',
      sort: this.tucUiSortableHelpers.variableHeightTolerance,
      start() {
        sortInterval = setInterval(() => {}, 33);
      },
      stop() {
        if (sortInterval) {
          clearInterval(sortInterval);
        }
      },
      update() {
        this.$timeout(() => {
          // update extensions positions
          angular.forEach(this.dialplan.extensions, (extension, index) => {
            set(extension, 'position', index + 1);
          });

          // call api to update all positions
          this.dialplan.updateExtensionsPositions();
        });
      },
    };

    if (this.dialplan) {
      // load extension if dialplan exists
      initPromise = this.dialplan.getExtensions();
    } else if (this.numberCtrl.number.feature.dialplans.length === 0) {
      initPromise = this.createDialplan();
    }

    return initPromise
      .then(() => {
        this.checkForDisplayHelpers();
      })
      .finally(() => {
        this.loading.init = false;
      })
      .catch((error) => {
        this.TucToast.error(
          [
            this.$translate.instant(
              'telephony_number_feature_ovh_pabx_load_error',
            ),
            get(error, 'data.message') || '',
          ].join(' '),
        );
        return this.$q.reject(error);
      });
  }

  isLoading() {
    return (
      this.loading.init ||
      (this.dialplan &&
        ['OK', 'DRAFT', 'DELETE_PENDING'].indexOf(this.dialplan.status) === -1)
    );
  }

  hasInCreationExtension() {
    return some(this.dialplan.extensions, {
      status: 'IN_CREATION',
    });
  }

  createDialplan() {
    // add a dialplan to ovh pabx instance
    const dialplanToCreate = this.ovhPabx.addDialplan({
      name: this.$translate.instant(
        'telephony_number_feature_ovh_pabx_dialplan_new_name',
      ),
      status: 'DRAFT',
    });

    // create it from API
    return dialplanToCreate
      .create()
      .catch((error) => {
        // remove extension from dialplan list
        this.ovhPabx.removeDialplan(dialplanToCreate);
        return this.$q.reject(error);
      })
      .finally(() => {
        // refresh current dialplan
        this.ovhPabxCtrl.refreshDisplayedDialplan();
      });
  }

  /**
   *  Used to determine if extensions must be displayed or not.
   *  Used by telephonyNumberOvhPabxDialplanExtensionCtrl when an extension is deleted.
   */
  checkForDisplayHelpers() {
    if (!this.dialplan.extensions.length) {
      this.displayHelpers.collapsed = true;
      this.displayHelpers.expanded = false;
    }
  }

  onEditDialplanBtnClick() {
    this.popoverStatus.isOpen = true;
    this.atInternet.trackClick({
      name: 'ccs::group-number::modify-ccs-options',
      type: 'navigation',
    });
  }

  onCancelEditDialplan() {
    this.popoverStatus.isOpen = false;
    this.popoverStatus.move = false;
    // if draft => remove from ovh pabx dialplans list and refresh current displayed dialplan
    if (this.dialplan.status === 'DRAFT') {
      this.ovhPabx.removeDialplan(this.dialplan);
      this.ovhPabxCtrl.refreshDisplayedDialplan();
    }
  }

  onDialplanExpanding() {
    this.displayHelpers.expanded = true;
  }

  onExtensionAddBtnClick() {
    this.displayHelpers.collapsed = false;
    this.displayHelpers.expanded = true;

    const addedExtension = this.dialplan.addExtension({
      position: this.dialplan.extensions.length + 1,
      status: 'DRAFT',
    });

    this.atInternet.trackClick({
      name: 'ccs::group-number::add-step',
      type: 'action',
    });

    return addedExtension.create();
  }

  static onDialplanExpanded() {
    const elt = angular.element('#group-number-extension-steps')[0];
    if (elt) {
      elt.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }

  toggleCollapsed() {
    this.displayHelpers.collapsed = !this.displayHelpers.collapsed;

    if (this.displayHelpers.collapsed) {
      this.atInternet.trackClick({
        name: 'ccs::group-number::hide-steps',
        type: 'action',
      });
    }
  }

  onDeleteDialplanBtnClick() {
    this.dialplan.status = 'DELETE_PENDING';
    this.atInternet.trackClick({
      name: 'ccs::group-number::delete-ccs-configuration',
      type: 'action',
    });
  }

  /**
   *  Manage dialplan delete confirm button click.
   *  Deleting a dialplan means deleting its configuration (extension, rules, ...).
   *  Once dialplan is deleted, create a new one with default title.
   */
  onDialplanDeleteConfirmBtnClick() {
    return this.dialplan
      .remove()
      .then(() => {
        this.ovhPabx.removeDialplan(this.dialplan);
        return this.createDialplan();
      })
      .catch((error) => {
        this.TucToast.error(
          [
            this.$translate.instant(
              'telephony_number_feature_ovh_pabx_dialplan_delete_error',
            ),
            error.data && error.data.message,
          ].join(' '),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.ovhPabxDialplanCtrl.loading.remove = false;
      });
  }
}
