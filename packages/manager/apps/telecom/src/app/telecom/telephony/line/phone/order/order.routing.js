export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.phone.order', {
    url: '/order',
    views: {
      'lineView@telecom.telephony.billingAccount.line': 'order',
    },
    resolve: {
      billingAccount: /* @ngInject */ ($transition$) =>
        $transition$.params().billingAccount,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('telecom.telephony.billingAccount.line.phone'),
    },
    translations: { value: ['.'], format: 'json' },
  });
};
