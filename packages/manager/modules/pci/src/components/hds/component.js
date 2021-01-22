import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    hds: '<',
    model: '<',
    onChange: '<',
    onHdsLinkClicked: '<',
    onSupportLevelLinkClicked: '<',
  },
  controller,
  template,
};

export default component;
