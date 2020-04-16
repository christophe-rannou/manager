import get from 'lodash/get';

import component from './component';

export default /* @ngInject */ function($stateProvider) {
  $stateProvider.state('app.hosting.database.detachPrivate', {
    url: '/detach',
    component: component.name,
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('app.hosting'),
      pricingType: /* @ngInject */ (
        OVH_MANAGER_PRODUCT_OFFERS_PRICING_CONSTANTS,
      ) =>
        OVH_MANAGER_PRODUCT_OFFERS_PRICING_CONSTANTS.PRICING_CAPACITIES.DETACH,
      workflow: /* @ngInject */ (
        privateDatabasesDetachable,
        OVH_MANAGER_PRODUCT_OFFERS_WORKFLOW_CONSTANTS,
      ) => ({
        options: {
          ...privateDatabasesDetachable[0],
        },
        type:
          OVH_MANAGER_PRODUCT_OFFERS_WORKFLOW_CONSTANTS.WORKFLOW_TYPES.SERVICES,
      }),
      onError: ($translate, Alerter) => (error) => {
        Alerter.error(
          $translate.instant('hosting_database_private_detach_option_error', {
            error: get(error, 'data.message', error.message),
          }),
          'detach',
        );
      },
      onSuccess: /* @ngInject */ ($translate, $window, Alerter, goBack) => (
        detachResult,
      ) => {
        let successMessage;
        if (!detachResult.autoPayWithPreferredPaymentMethod) {
          successMessage = $translate.instant(
            'hosting_database_private_detach_option_success_with_no_payment',
            {
              billUrl: detachResult.url,
            },
          );
        } else {
          successMessage = $translate.instant(
            'hosting_database_private_detach_option_success_with_payment',
            {
              accountId: detachResult.paymentMethodLabel,
              billUrl: detachResult.url,
              price: detachResult.prices.withTax.text,
            },
          );
        }

        return goBack().then(() => {
          Alerter.success(successMessage, 'app.alerts.tabs');
        });
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
}
