import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

import { ELIGIBLE_FOR_UPGRADE } from './dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard', {
    url: '',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerDashboard',
      },
    },
    resolve: {
      bandwidthInformations: /* @ngInject */ (
        $q,
        $stateParams,
        BandwidthVrackOrderService,
        Server,
      ) =>
        $q
          .all({
            bandwidth: Server.getBandwidth($stateParams.productId),
            bandwidthVrackOption: Server.getBandwidthVrackOption(
              $stateParams.productId,
            ),
            bandwidthVrackOrderOptions: BandwidthVrackOrderService.getOrderableBandwidths(
              $stateParams.productId,
            ),
          })
          .then(
            ({ bandwidth, bandwidthVrackOption, bandwidthVrackOrderOptions }) =>
              Server.getBandwidthOption($stateParams.productId, bandwidth).then(
                (bandwidthOption) => ({
                  bandwidth,
                  bandwidthOption,
                  bandwidthVrackOption,
                  bandwidthVrackOrderOptions,
                }),
              ),
          ),
      biosSettings: /* @ngInject */ (
        $window,
        OvhApiDedicatedServer,
        serverName,
      ) =>
        $window.location.host === 'localhost:9000'
          ? {
              sgx: true,
            }
          : OvhApiDedicatedServer.BiosSettings()
              .v6()
              .get(serverName).$promise,
      changeOwnerUrl: /* @ngInject */ (User) => User.getUrlOf('changeOwner'),
      eligibleData: /* @ngInject */ (Server, user) => {
        const isEligible = includes(
          ELIGIBLE_FOR_UPGRADE.SUBSIDIARIES,
          user.ovhSubsidiary,
        );

        if (isEligible) {
          return Server.getUpgradeProductName(
            ELIGIBLE_FOR_UPGRADE.PLAN_NAME,
            user.ovhSubsidiary,
          ).then((upgradeName) => ({
            isEligible,
            upgradeName,
          }));
        }

        return {
          isEligible: false,
        };
      },
      goToSgxIntroduction: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicated.server.dashboard.sgx.introduction'),
      goToSgxManage: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicated.server.dashboard.sgx.manage'),
      monitoringProtocolEnum: /* @ngInject */ (Server) =>
        Server.getModels().then(
          (models) =>
            models.data.models['dedicated.server.MonitoringProtocolEnum'].enum,
        ),
      orderPrivateBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) =>
        isLegacy
          ? $state.href(
              'app.dedicated.server.dashboard.bandwidth-legacy-private-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated.server.dashboard.bandwidth-private-order',
              { productId: serverName },
            ),
      orderPublicBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) =>
        isLegacy
          ? $state.href(
              'app.dedicated.server.dashboard.bandwidth-legacy-public-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated.server.dashboard.bandwidth-public-order',
              { productId: serverName },
            ),
      resiliatePrivateBandwidthLink: /* @ngInject */ ($state, serverName) =>
        $state.href('app.dedicated.server.dashboard.bandwidth-private-cancel', {
          productId: serverName,
        }),
      resiliatePublicBandwidthLink: /* @ngInject */ ($state, serverName) =>
        $state.href('app.dedicated.server.dashboard.bandwidth-public-cancel', {
          productId: serverName,
        }),
      serviceMonitoring: /* @ngInject */ ($stateParams, Server) =>
        Server.getAllServiceMonitoring($stateParams.productId),
      sgx: /* @ngInject */ ($http, $q, $window, serverName) => {
        if ($window.location.host === 'localhost:9000') {
          return {
            isRunning: false,
            status: 'disabled',
          };
        }

        return $q
          .all({
            sgx: $http.get(`/dedicated/server/${serverName}/biosSettings/sgx`),
            sgxDoingTasks: $http.get(
              `/dedicated/server/${serverName}/task?function=ipmi/configureSGX&status=doing`,
            ),
            sgxInitTasks: $http.get(
              `/dedicated/server/${serverName}/task?function=ipmi/configureSGX&status=init`,
            ),
            sgxTodoTasks: $http.get(
              `/dedicated/server/${serverName}/task?function=ipmi/configureSGX&status=todo`,
            ),
          })
          .then(({ sgx, sgxDoingTasks, sgxInitTasks, sgxTodoTasks }) => {
            return {
              isRunning:
                !isEmpty(sgxDoingTasks) ||
                !isEmpty(sgxInitTasks) ||
                !isEmpty(sgxTodoTasks),
              status: sgx.status,
            };
          });
      },
      trafficInformations: /* @ngInject */ (
        $q,
        $stateParams,
        ServerOrderTrafficService,
        ServerTrafficService,
      ) =>
        $q.all({
          traffic: ServerTrafficService.getTraffic($stateParams.productId),
          trafficOption: ServerOrderTrafficService.getOption(
            $stateParams.productId,
          ),
          trafficOrderables: ServerOrderTrafficService.getOrderables(
            $stateParams.productId,
          ),
        }),
      vrackInfos: /* @ngInject */ ($stateParams, Server) =>
        Server.getVrackInfos($stateParams.productId),
    },
  });
};
