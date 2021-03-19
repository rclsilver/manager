import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

angular.module('App').controller(
  'configurationCtrl',
  class ConfigurationCtrl {
    constructor(
      $q,
      $translate,
      constants,
      coreConfig,
      OvhHttp,
      ovhFeatureFlipping,
      User,
    ) {
      this.$q = $q;
      this.$translate = $translate;
      this.constants = constants;
      this.coreConfig = coreConfig;
      this.OvhHttp = OvhHttp;
      this.ovhFeatureFlipping = ovhFeatureFlipping;
      this.User = User;
    }

    $onInit() {
      this.currentLanguage = this.$translate.use();
      this.fallbackLanguage = this.$translate.fallbackLanguage();
      this.urlToAllGuides = this.getURLFromSection(
        this.constants.TOP_GUIDES.all,
      );

      return this.getUser()
        .then(() => this.buildingGuideURLs())
        .then(() => this.gettingHelpCenterURLs());
    }

    getURLFromSection(section) {
      if (isString(section)) {
        return section;
      }
      return section[this.currentLanguage] || section[this.fallbackLanguage];
    }

    buildingGuideURLs() {
      return this.fetchingGuideSectionNames()
        .then((sections) => this.getAvailableSections(sections))
        .then((sectionNames) => {
          this.sections = sectionNames.reduce(
            (sections, sectionName) => ({
              ...sections,
              [sectionName]: {
                name: sectionName,
                links: this.getURLFromSection(
                  this.constants.TOP_GUIDES[sectionName],
                ),
              },
            }),
            {},
          );
        });
    }

    fetchingGuideSectionNames() {
      const sectionNames = ['sd'];

      if (this.coreConfig.getRegion() === 'US') {
        return this.OvhHttp.get('/dedicatedCloud', {
          rootPath: 'apiv6',
        }).then((ids) => {
          if (isArray(ids) && !isEmpty(ids)) {
            return sectionNames;
          }

          return [];
        });
      }

      sectionNames.push('pcc');
      return this.$q.when(sectionNames);
    }

    getAvailableSections(sections) {
      return this.ovhFeatureFlipping
        .checkFeatureAvailability(
          sections.map(
            (section) => this.constants.SECTION_AVAILABILITY[section],
          ),
        )
        .then((featureAvailability) =>
          sections.filter((section) =>
            featureAvailability.isFeatureAvailable(
              this.constants.SECTION_AVAILABILITY[section],
            ),
          ),
        );
    }

    getUser() {
      return this.User.getUser().then((user) => {
        this.user = user;
        return this.user;
      });
    }

    gettingHelpCenterURLs() {
      this.subsidiary = this.user.ovhSubsidiary;

      this.helpCenterURLs = Object.keys(this.constants.urls).reduce(
        (helpCenterURLs, subsidiaryName) => ({
          ...helpCenterURLs,
          [subsidiaryName]: this.constants.urls[subsidiaryName].support,
        }),
        {},
      );
    }
  },
);
