/**
 * Created by benek on 12/25/14.
 */


angular.module('towns').factory('CultivateFieldJob', ['Job', function (Job) {

  var CultivateFieldJob = function () {
    Job.apply(this, arguments);
  };

  CultivateFieldJob.prototype = Object.create(Job.prototype);
  CultivateFieldJob.prototype.constructor = CultivateFieldJob;

  CultivateFieldJob.prototype.name = 'Cultivating a field';

  CultivateFieldJob.prototype.can_do = function (person) {
    var parent_result = Job.prototype.can_do.apply(this, arguments);

    return parent_result && this.workplace.cultivating_progress < 1.0;
  };

  CultivateFieldJob.prototype['do'] = function (person) {
    Job.prototype.do.apply(this, arguments);

    this.workplace.cultivating_progress += 0.25;
    this.current_progress = this.workplace.cultivating_progress;
    if (this.workplace.cultivating_progress >= 1.0) {
      this.workplace.finish_cultivating();
      this.finishJob();
    }
  };

  return CultivateFieldJob;
}]);
