'use strict';

angular.module('towns').factory('initProvider', ['populationProvider', 'buildingsProvider', 'mapProvider',
                         'environmentProvider', 'PopulationConfig', 'Resources', '$interval',
    function(populationProvider, buildingsProvider, mapProvider, environmentProvider, PopulationConfig,
             Resources, $interval) {
  var that = this;

  return {
    initGenericProviders: function () {
      mapProvider.initMap();
      environmentProvider.initEnvironment();
      buildingsProvider.initBuildingsProvider();
    },
    setupInitialInstances: function () {
      populationProvider.setupInitialPopulation(PopulationConfig.initial_population_count);
      buildingsProvider.setupInitialBuildings(
        populationProvider.getAll(), mapProvider.getAllBlocks(), [
          Math.floor(mapProvider.getWidth() * 0.35), Math.floor(mapProvider.getHeight() * 0.35),
          Math.floor(mapProvider.getWidth() * 0.3), Math.floor(mapProvider.getHeight() * 0.3)]);
    },
    setupTickProcessInterval: function () {
      var self = this;
      $interval(function () {
        //var now = new Date();
        self.processTicks();
        //console.log(new Date() - now);
      }, 1000);
    },
    processTicks: function () {
      populationProvider.processTick();
      buildingsProvider.processTick();
      Resources.regenerateResourcesObtainableJobs(); //TODO: should be here ?
    },
    _instance: this
  };
}]);