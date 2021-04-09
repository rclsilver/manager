export default class Database {
  constructor(database) {
    Object.assign(this, database);
  }

  isReady() {
    return this.status === 'READY';
  }

  isUpdating() {
    return this.status === 'UPDATING';
  }
}
