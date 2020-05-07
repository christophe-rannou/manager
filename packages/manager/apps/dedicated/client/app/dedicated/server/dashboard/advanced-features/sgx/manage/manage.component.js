import template from './manage.html';

export default {
  bindings: {
    activationMode: '<',
    activationModeValues: '<',
    biosSettinsSgx: '<',
    prmrr: '<',
    prmrrValues: '<',

    changeSelection: '<',
    goBack: '<',
  },
  template,
  require: {
    dedicatedServer: '^dedicatedServer',
  },
};
