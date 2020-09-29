export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.autoconfig', {
    url: '/autoconfig',
    views: {
      otbView: 'overTheBoxAutoconfig',
    },
  });
};
