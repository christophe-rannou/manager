import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.arp', {
    url: '/arp?ip&ipBlock',
    params: {
      ip: {
        type: 'string',
      },
      ipBlock: {
        type: 'string',
      },
      serviceName: {
        type: 'string',
      },
    },
    redirectTo: (transition) => {
      return Promise.all([
        transition.injector().getAsync('ip'),
        transition.injector().getAsync('ipBlock'),
        transition.injector().getAsync('serviceName'),
      ]).then(([ip, ipBlock, serviceName]) =>
        isEmpty(ip) || isEmpty(ipBlock) || isEmpty(serviceName)
          ? 'app.ip.dashboard'
          : null,
      );
    },
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      ip: /* @ngInject */ ($transition$, ipBlock) => {
        const { ip } = $transition$.params();

        return find(ipBlock.ips, { ip });
      },
      ipBlock: /* @ngInject */ ($transition$, Ip, serviceName) => {
        const { ipBlock } = $transition$.params();

        return Ip.getIpsListForService(serviceName).then((ips) => {
          return find(ips, { ipBlock });
        });
      },
    },
    views: {
      modal: {
        component: 'ipDashboardArp',
      },
    },
    layout: 'modal',
  });
};