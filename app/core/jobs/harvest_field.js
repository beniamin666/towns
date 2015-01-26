/**
 * Created by benek on 12/25/14.
 */


angular.module('towns').factory('HarvestFieldJob', ['Job', function (Job) {

  var HarvestFieldJob = function () {
    Job.apply(this, arguments);
  };

  HarvestFieldJob.prototype = Object.create(Job.prototype);
  HarvestFieldJob.prototype.constructor = HarvestFieldJob;

  HarvestFieldJob.prototype.name = 'Harvesting a field';

  HarvestFieldJob.prototype.can_do = function (person) {
    var parent_result = Job.prototype.can_do.apply(this, arguments);

    return parent_result && this.workplace.harvesting_progress < 1.0;
  };

  HarvestFieldJob.prototype['do'] = function (person) {
    Job.prototype.do.apply(this, arguments);

    this.workplace.harvesting_progress += 0.25;
    this.current_progress = this.workplace.harvesting_progress;
    if (this.workplace.harvesting_progress >= 1.0) {
      this.workplace.finish_harvesting();
      this.finishJob();
    }
  };

  return HarvestFieldJob;
}]);
