export default class Tag {
  constructor(name) {
    Object.assign(this, {
      name,
    });
  }

  isTrusted() {
    return this.name === 'TRUSTED_ZONE';
  }
}
