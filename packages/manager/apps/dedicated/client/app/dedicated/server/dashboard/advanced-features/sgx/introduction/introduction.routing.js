export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard.sgx.introduction', {
    url: '/introduction',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerDashboardSgxIntroduction',
      },
    },
    resolve: {
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicated.server.dashboard'),
      goToManage: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicated.server.dashboard.sgx.manage', {
          goBack: () =>
            $state.go('app.dedicated.server.dashboard.sgx.introduction'),
        }),
    },
  });
};
