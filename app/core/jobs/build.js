/**
 * Created by benek on 12/25/14.
 */


angular.module('towns').factory('BuildJob', ['Job', 'Math', function (Job, Math) {

  var BuildJob = function (workplace, giver) {
    Job.apply(this, arguments);
    this._class = BuildJob;
  };

  BuildJob.prototype = Object.create(Job.prototype);
  BuildJob.prototype.constructor = BuildJob;

  BuildJob.prototype.name = 'Constructing a building';
  BuildJob.prototype.base_progress_increase = 0.3334;
  BuildJob.prototype.salary = 1;

  BuildJob.prototype['do'] = function (person) {
    Job.prototype.do.apply(this, arguments);

    //TODO: this.construction_materials
    this.workplace.constructing_progress += this.base_progress_increase;
    this.workplace.constructing_progress = Math.min(this.workplace.constructing_progress, 1.0);
    this.current_progress = this.workplace.constructing_progress;
  };

  BuildJob.prototype.finishJob = function () {
    Job.prototype.finishJob.apply(this, arguments);
    this.workplace.finish_constructing();
  };

  return BuildJob;
}]);
