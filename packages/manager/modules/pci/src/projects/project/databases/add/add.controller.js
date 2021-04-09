export default class {
  /* @ngInject */
  constructor($translate, $q, CucCloudMessage, DatabaseService, Poller) {
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.Poller = Poller;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.databases.add');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.databases.add',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
