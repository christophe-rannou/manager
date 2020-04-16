import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerHostingDatabaseDetachPrivateModule';

angular
  .module(moduleName, ['oui', 'ui.router', 'pascalprecht.translate'])
  .component(component.name, component)
  .config(routing);

export default moduleName;
