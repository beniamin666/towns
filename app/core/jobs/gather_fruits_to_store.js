/**
 * Created by benek on 12/25/14.
 */


angular.module('towns').factory('GatherFruitsToStoreJob', ['Job', 'JobsList',
  function (Job, JobsList) {

  var GatherFruitsToStoreJob = function () {
    Job.apply(this, arguments);
    this._class = GatherFruitsToStoreJob;
  };

  GatherFruitsToStoreJob.prototype = Object.create(Job.prototype);
  GatherFruitsToStoreJob.prototype.constructor = GatherFruitsToStoreJob;

  GatherFruitsToStoreJob.prototype.name = 'Gather fruits to store';
  GatherFruitsToStoreJob.prototype.base_progress_increase = 1.0;
  GatherFruitsToStoreJob.prototype.obtainable_resources = {};
  GatherFruitsToStoreJob.prototype.salary = 1;
  GatherFruitsToStoreJob.prototype.gathered_resource = 'fruits';

  GatherFruitsToStoreJob.prototype.can_do = function (person) {
    var parent_result = Job.prototype.can_do.apply(this, arguments);
    return parent_result;
  };

  GatherFruitsToStoreJob.prototype['do'] = function (person) {
    Job.prototype.do.apply(this, arguments);

    this.current_progress += this.base_progress_increase;

    if (this.current_progress >= 1.0) {
      var gathered_resources = person.current_env_block.gatherResources(
        person, this.gathered_resource);

      this.workplace.resources[this.gathered_resource] += gathered_resources[this.gathered_resource];
    }
  };

  GatherFruitsToStoreJob.prototype.finishJob = function () {
    Job.prototype.finishJob.apply(this, arguments);
    this.workplace.jobsPerResource[this.gathered_resource].splice(
      this.workplace.jobsPerResource[this.gathered_resource].indexOf(this), 1);

    if ((this.workplace.resources[this.gathered_resource] <
          this.workplace.requestedResourcesAmounts[this.gathered_resource]) &&
        (this.workplace.requestedResourcesCollectors[this.gathered_resource] >
          this.workplace.jobsPerResource[this.gathered_resource].length))
    {
      var job = new (this._class)(this.workplace, this.giver);
      JobsList.addJob(job);
      this.workplace.jobsPerResource[this.gathered_resource].push(job);
    }
  };

  return GatherFruitsToStoreJob;
}]);
