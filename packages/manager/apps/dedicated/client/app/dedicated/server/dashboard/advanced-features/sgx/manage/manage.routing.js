import DedicatedServerDashboardSgxManage from './manage.service';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard.sgx.manage', {
    params: {
      goBack: null,
    },
    url: '/manage',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerDashboardSgxManage',
      },
    },
    resolve: {
      activationMode: /* @ngInject */ (biosSettinsSgx) => biosSettinsSgx.status,
      activationModeValues: /* @ngInject */ (schema) =>
        DedicatedServerDashboardSgxManage.buildActivationMode(schema),
      biosSettinsSgx: /* @ngInject */ (
        $window,
        OvhApiDedicatedServer,
        serverName,
      ) =>
        $window.location.host === 'localhost:9000'
          ? {
              prmrr: '128MB',
              status: 'disabled',
            }
          : OvhApiDedicatedServer.BiosSettings()
              .v6()
              .getFeature({
                serverName,
                featureName: 'sgx',
              }).$promise,
      prmrr: /* @ngInject */ (biosSettinsSgx) => biosSettinsSgx.prmrr,
      prmrrValues: /* @ngInject */ (schema) =>
        DedicatedServerDashboardSgxManage.buildPrmrr(schema),
      changeSelection: /* @ngInject */ (
        $window,
        goBack,
        OvhApiDedicatedServer,
        serverName,
      ) => (activationMode, prmrr) =>
        $window.location.host === 'localhost:9000'
          ? goBack()
          : OvhApiDedicatedServer.BiosSettings()
              .v6()
              .configureFeature(
                {
                  serverName,
                  featureName: 'sgx',
                },
                {
                  prmrr,
                  status: activationMode,
                },
              )
              .$promise.then(() => goBack()),
      goBack: /* @ngInject */ ($state, $transition$) => () =>
        ($transition$.params().goBack && $transition$.params().goBack()) ||
        $state.go('app.dedicated.server.dashboard'),
    },
  });
};
