import set from 'lodash/set';
import 'moment';

import {
  ACTIVE_STATUS,
  ACKNOWLEDGED_STATUS,
  COMPLETED_STATUS,
  REFRESH_TIME,
} from './constants';

export default class Notifications {
  /* @ngInject */
  constructor($http, $interval, $q, $translate, OvhApiNotificationAapi) {
    this.$http = $http;
    this.$interval = $interval;
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiNotificationAapi = OvhApiNotificationAapi;
  }

  getNotifications(lang, target) {
    return this.$http
      .get('/notification', {
        serviceType: 'aapi',
        params: {
          lang,
          target,
        },
      })
      .then(({ data }) => data);
  }

  updateNotifications(status) {
    return this.$http
      .post('/notification', status, {
        serviceType: 'aapi',
      })
      .then(({ data }) => data);
  }

  readNotifications(notification, status) {
    set(notification, 'updating', true);

    return this.updateNotifications({
      [status]: [notification.id],
    })
      .then(() => {
        Object.assign(notification, {
          status,
          isActive: ACTIVE_STATUS === status,
          isCompleted: COMPLETED_STATUS === status,
          acknowledged: ACKNOWLEDGED_STATUS.includes(status),
        });
      })
      .finally(() => {
        set(notification, 'updating', false);
        return notification;
      });
  }

  toggleSublinkAction(toUpdate, linkClicked) {
    if (toUpdate.isActive && !toUpdate.updating) {
      // mark as read
      return this.readNotifications(toUpdate, 'acknowledged');
    }

    if (!toUpdate.isActive && !toUpdate.updating && !linkClicked) {
      // mark as unread
      return this.readNotifications(toUpdate, 'delivered');
    }

    return this.$q.when();
  }

  static formatTime(dateTime) {
    return moment(dateTime).fromNow();
  }

  static convertToSubLink(notification) {
    return {
      ...notification,
      acknowledged: ACKNOWLEDGED_STATUS.includes(notification.status),
      isActive: ACTIVE_STATUS === notification.status,
      isCompleted: COMPLETED_STATUS === notification.status,
      time: Notifications.formatTime(notification.date),
      url: notification.urlDetails.href,
    };
  }

  setRefreshTime(sublinks) {
    if (this.formatTimeTask) {
      this.$interval.cancel(this.formatTimeTask);
    }
    this.formatTimeTask = this.$interval(() => {
      sublinks.forEach((notification) => {
        set(notification, 'time', Notifications.formatTime(notification.date));
      });
    }, REFRESH_TIME);
  }
}
