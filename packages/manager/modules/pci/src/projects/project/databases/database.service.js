import Database from './database.class';

export default class DatabaseService {
  /* @ngInject */
  constructor($http, $q, $translate) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
  }

  getDatabases(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/database/mongodb`)
      .then((databases) => databases.data);
  }

  getDatabaseDetails(projectId, databaseId) {
    return this.$http
      .get(`/cloud/project/${projectId}/database/mongodb/${databaseId}`)
      .then((database) => new Database(database.data));
  }
}
