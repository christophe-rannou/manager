import FeatureAvailabilityResult from './feature-availability-result.class';

export default class FeatureFlipping {
  constructor($http, applicationName) {
    this.$http = $http;
    this.applicationName = applicationName;
  }

  /**
   * Call feature availability 2API in order to detect availability for a feature
   * or a set of features.
   *
   * @param  {String|Array} featureNameOrFeaturesList The name of the feature or a list of
   *                                                  feature names.
   *
   * @return {Promise}  Which returns an object representing features availabilities.
   */
  checkFeatureAvailability(featureNameOrFeaturesList) {
    let featuresList = featureNameOrFeaturesList;

    if (!Array.isArray(featuresList)) {
      featuresList = [featuresList];
    }

    return this.$http
      .get(`/feature/${featuresList.join(',')}/availability`, {
        params: {
          app: this.applicationName,
        },
        serviceType: 'aapi',
      })
      .then(({ data }) => new FeatureAvailabilityResult(data));
  }
}
