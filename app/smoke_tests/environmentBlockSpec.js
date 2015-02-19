/**
 * Created by benek on 12/25/14.
 */

describe('EnvironmentBlock', function () {
  beforeEach(module('towns'));

  var EnvironmentBlock, Environment;

  beforeEach(inject(function (_EnvironmentBlock_, _Environment_) {
    EnvironmentBlock = _EnvironmentBlock_;
    Environment = _Environment_;
  }));

  describe('gatherResources', function () {

    it('for max grass amount and none other resources ' +
    'returns specified resources amounts', function () {

      Environment.getResourceInfo('grass')['exploitable_resources'] = {
        straw: 0.1,
        grass: 0.8,
        grass_seeds: 0.05,
        grains: 0.01
      };

      var envBlock = new EnvironmentBlock(0);
      for (var res_name in envBlock.resources) {
        envBlock.resources[res_name] = 0;
      }
      envBlock.resources['grass'] = Environment.getResourceInfo('grass')['max_amount'];

      var gathered_resources = envBlock.gatherResources({strength: 1});

      expect(gathered_resources['straw']).toBe(0.5);
      expect(gathered_resources['grass']).toBe(4);
      expect(gathered_resources['grass_seeds']).toBe(0.25);
      expect(gathered_resources['grains']).toBe(0.05);
    });

    it('for max grass amount, some grains and none other resources ' +
    'returns specified resources amounts', function () {

      Environment.getResourceInfo('grass')['exploitable_resources'] = {
        straw: 1.0,
        grass: 0.8,
        grass_seeds: 1.0,
        grains: 1.0
      };
      Environment.getResourceInfo('grass')['max_amount'] = 5000;
      Environment.getResourceInfo('grains')['exploitable_resources'] = {
        grass_seeds: 1.0,
        grains: 1.0
      };
      Environment.getResourceInfo('grains')['max_amount'] = 1000;

      var envBlock = new EnvironmentBlock(0);
      for (var res_name in envBlock.resources) {
        envBlock.resources[res_name] = 0;
      }
      envBlock.resources['grass'] = 5000;
      envBlock.resources['grains'] = 100;

      var gathered_resources = envBlock.gatherResources({strength: 1});

      expect(gathered_resources['straw']).toBe(5);
      expect(gathered_resources['grass']).toBe(4);
      expect(gathered_resources['grass_seeds']).toBe(5.019);
      expect(gathered_resources['grains']).toBe(5.019);
    });

    it('for max grass amount, some grains and none other resources with another exploitable_resources' +
    'returns specified resources amounts', function () {

      Environment.getResourceInfo('grass')['exploitable_resources'] = {
        straw: 1.0,
        grass: 0.8,
        grass_seeds: 1.0,
        grains: 0.1
      };
      Environment.getResourceInfo('grass')['max_amount'] = 5000;
      Environment.getResourceInfo('grains')['exploitable_resources'] = {
        grass_seeds: 0.5,
        grains: 1.0
      };
      Environment.getResourceInfo('grains')['max_amount'] = 1000;

      var envBlock = new EnvironmentBlock(0);
      for (var res_name in envBlock.resources) {
        envBlock.resources[res_name] = 0;
      }
      envBlock.resources['grass'] = 5000;
      envBlock.resources['grains'] = 100;

      var gathered_resources = envBlock.gatherResources({strength: 1});

      expect(gathered_resources['straw']).toBe(5);
      expect(gathered_resources['grass']).toBe(4);
      expect(gathered_resources['grass_seeds']).toBe(5.0095);
      expect(gathered_resources['grains']).toBe(0.519);
    });

    it('for max grass amount, some grains and none other resources ' +
    'reduce specified resources amounts', function () {

      Environment.getResourceInfo('grass')['max_amount'] = 5000;
      Environment.getResourceInfo('grains')['max_amount'] = 1000;

      var envBlock = new EnvironmentBlock(0);
      for (var res_name in envBlock.resources) {
        envBlock.resources[res_name] = 0;
      }
      var initial_grass_amount = Environment.getResourceInfo('grass')['max_amount'],
        initial_grains_amount = Environment.getResourceInfo('grains')['max_amount'] / 10.0;

      envBlock.resources['grass'] = initial_grass_amount;
      envBlock.resources['grains'] = initial_grains_amount;

      envBlock.gatherResources({strength: 1});

      expect(envBlock.resources['grass']).toBe(initial_grass_amount - 5);
      expect(envBlock.resources['grains']).toBe(initial_grains_amount - 0.019);
    });

    it('for a very little grains and none other resources ' +
    'returns specified resources amounts', function () {

      Environment.getResourceInfo('grains')['exploitable_resources'] = {
        grass_seeds: 0.5,
        grains: 1.0
      };
      Environment.getResourceInfo('grains')['max_amount'] = 10;

      var envBlock = new EnvironmentBlock(0);
      for (var res_name in envBlock.resources) {
        envBlock.resources[res_name] = 0;
      }
      envBlock.resources['grains'] = 0.1;

      var gathered_resources = envBlock.gatherResources({strength: 1});

      expect(gathered_resources['grass_seeds']).toBeCloseTo(0.000000995, 10);
      expect(gathered_resources['grains']).toBeCloseTo(0.000002, 7);
    });

    it('for not much grains and none other resources ' +
    'returns specified resources amounts', function () {

      Environment.getResourceInfo('grains')['exploitable_resources'] = {
        grass_seeds: 0.5,
        grains: 1.0
      };
      Environment.getResourceInfo('grains')['max_amount'] = 1000000;

      var envBlock = new EnvironmentBlock(0);
      for (var res_name in envBlock.resources) {
        envBlock.resources[res_name] = 0;
      }
      envBlock.resources['grains'] = 1000;

      var gathered_resources = envBlock.gatherResources({strength: 1});

      expect(gathered_resources['grass_seeds']).toBeCloseTo(0.001, 5);
      expect(gathered_resources['grains']).toBeCloseTo(0.002, 5);
    });

    it('for some grains and none other resources ' +
    'takes only exploitable_resources resources from it', function () {

      Environment.getResourceInfo('grains')['exploitable_resources'] = {
        grass_seeds: 0.5,
        grains: 1.0
      };
      Environment.getResourceInfo('grains')['max_amount'] = 10;

      var envBlock = new EnvironmentBlock(0);
      for (var res_name in envBlock.resources) {
        envBlock.resources[res_name] = 0;
      }
      envBlock.resources['grains'] = 5;

      var gathered_resources = envBlock.gatherResources({strength: 1});

      expect(Object.keys(gathered_resources).indexOf('grains')).not.toBe(-1);
      expect(Object.keys(gathered_resources).indexOf('grass_seeds')).not.toBe(-1);
      expect(Object.keys(gathered_resources).length).toBe(2);
    });

    it('for a very low max_gather_amount param ' +
    'returns values below or equal max_gather_amount', function () {

      Environment.getResourceInfo('grains')['exploitable_resources'] = {
        grass_seeds: 0.5,
        grains: 1.0
      };
      Environment.getResourceInfo('grains')['max_amount'] = 1000000;

      var envBlock = new EnvironmentBlock(0);
      for (var res_name in envBlock.resources) {
        envBlock.resources[res_name] = 0;
      }
      envBlock.resources['grains'] = Environment.getResourceInfo('grains')['max_amount'];
      envBlock.max_gather_amount = 0.001;

      var gathered_resources = envBlock.gatherResources({strength: 1});

      expect(gathered_resources['grass_seeds']).not.toBeGreaterThan(envBlock.max_gather_amount);
      expect(gathered_resources['grains']).not.toBeGreaterThan(envBlock.max_gather_amount);
    });

    it('for a very low gather_base_divisor param and Infinity as max_gather_amount ' +
    'returns high values', function () {

      Environment.getResourceInfo('grains')['exploitable_resources'] = {
        grass_seeds: 0.5,
        grains: 1.0
      };
      Environment.getResourceInfo('grains')['max_amount'] = 1000000;

      var envBlock = new EnvironmentBlock(0);
      for (var res_name in envBlock.resources) {
        envBlock.resources[res_name] = 0;
      }
      envBlock.resources['grains'] = Environment.getResourceInfo('grains')['max_amount'];
      envBlock.gather_base_divisor = 0.001;
      envBlock.max_gather_amount = Infinity;

      var gathered_resources = envBlock.gatherResources({strength: 1});

      expect(gathered_resources['grass_seeds']).toBe(500000);
      expect(gathered_resources['grains']).toBe(1000000);
    });

  });

  describe('_calculateGatherRatio', function () {

    it('returns 1.0 if gather_env_ratio is 1.0 and gather_person_ratio is 1.0', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_env_ratio = 1.0,
        gather_person_ratio = 1.0;

      var gather_ratio = envBlock._calculateGatherRatio(gather_env_ratio, gather_person_ratio);

      expect(gather_ratio).toBe(1.0);
    });

    it('returns 0.5 if gather_env_ratio is 1.0 and gather_person_ratio is 0.5', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_env_ratio = 1.0,
        gather_person_ratio = 0.5;

      var gather_ratio = envBlock._calculateGatherRatio(gather_env_ratio, gather_person_ratio);

      expect(gather_ratio).toBe(0.5);
    });

    it('returns 0 if gather_env_ratio is 1.0 and gather_person_ratio is 0', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_env_ratio = 1.0,
        gather_person_ratio = 0;

      var gather_ratio = envBlock._calculateGatherRatio(gather_env_ratio, gather_person_ratio);

      expect(gather_ratio).toBe(0);
    });

    it('returns 0.75 if gather_env_ratio is 0.5 and gather_person_ratio is 1.0', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_env_ratio = 0.5,
        gather_person_ratio = 1.0;

      var gather_ratio = envBlock._calculateGatherRatio(gather_env_ratio, gather_person_ratio);

      expect(gather_ratio).toBe(0.75);
    });

    it('returns 0.375 if gather_env_ratio is 0.5 and gather_person_ratio is 0.5', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_env_ratio = 0.5,
        gather_person_ratio = 0.5;

      var gather_ratio = envBlock._calculateGatherRatio(gather_env_ratio, gather_person_ratio);

      expect(gather_ratio).toBe(0.375);
    });

    it('returns 0.4375 if gather_env_ratio is 0.25 and gather_person_ratio is 1.0', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_env_ratio = 0.25,
        gather_person_ratio = 1.0;

      var gather_ratio = envBlock._calculateGatherRatio(gather_env_ratio, gather_person_ratio);

      expect(gather_ratio).toBe(0.4375);
    });

    it('returns 0.9375 if gather_env_ratio is 0.75 and gather_person_ratio is 1.0', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_env_ratio = 0.75,
        gather_person_ratio = 1.0;

      var gather_ratio = envBlock._calculateGatherRatio(gather_env_ratio, gather_person_ratio);

      expect(gather_ratio).toBe(0.9375);
    });

    it('returns 0.19 if gather_env_ratio is 0.1 and gather_person_ratio is 1.0', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_env_ratio = 0.1,
        gather_person_ratio = 1.0;

      var gather_ratio = envBlock._calculateGatherRatio(gather_env_ratio, gather_person_ratio);

      expect(gather_ratio).toBe(0.19);
    });

    it('returns 0.0199 if gather_env_ratio is 0.01 and gather_person_ratio is 1.0', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_env_ratio = 0.01,
        gather_person_ratio = 1.0;

      var gather_ratio = envBlock._calculateGatherRatio(gather_env_ratio, gather_person_ratio);

      expect(gather_ratio).toBe(0.0199);
    });

    it('returns 0.99 if gather_env_ratio is 0.9 and gather_person_ratio is 1.0', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_env_ratio = 0.9,
        gather_person_ratio = 1.0;

      var gather_ratio = envBlock._calculateGatherRatio(gather_env_ratio, gather_person_ratio);

      expect(gather_ratio).toBe(0.99);
    });

  });

  describe('_calculateGatherAmount', function () {

    it('returns 1 if gather_ratio is 1.0 and res_amount is 1000', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 1.0,
        res_amount = 1000;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(1);
    });

    it('returns 0.5 if gather_ratio is 0.5 and res_amount is 1000', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 0.5,
        res_amount = 1000;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(0.5);
    });

    it('returns 0.05 if gather_ratio is 0.5 and res_amount is 100', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 0.5,
        res_amount = 100;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(0.05);
    });

    it('returns 10 if gather_ratio is 0.5 and res_amount is 1 000 000', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 0.5,
        res_amount = 1000000;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(10);
    });

    it('returns 100 if gather_ratio is 0.5, res_amount is 1 000 000 and max_gather_amount is 100', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 0.5,
        res_amount = 1000000;
      envBlock.max_gather_amount = 100;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(100);
    });

    it('returns 500 if gather_ratio is 0.5, res_amount is 1 000 000 and max_gather_amount is Infinity', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 0.5,
        res_amount = 1000000;
      envBlock.max_gather_amount = Infinity;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(500);
    });

    it('returns 10 if gather_ratio is 0.1, res_amount is 100 000 and max_gather_amount is 10', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 0.1,
        res_amount = 100000;
      envBlock.max_gather_amount = 10;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(10);
    });

    it('returns 10 if gather_ratio is 1.0, res_amount is 10 and gather_base_divisor is 1', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 1.0,
        res_amount = 10;
      envBlock.gather_base_divisor = 1;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(10);
    });

    it('returns 5 if gather_ratio is 1.0, res_amount is 10 and gather_base_divisor is 2', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 1.0,
        res_amount = 10;
      envBlock.gather_base_divisor = 2;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(5);
    });

    it('returns 10 if gather_ratio is 1.0, res_amount is 10 and gather_base_divisor is 0.1', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 1.0,
        res_amount = 10;
      envBlock.gather_base_divisor = 0.1;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(10);
    });

    it('returns 1 if gather_ratio is 0.3, res_amount is 1 and gather_base_divisor is 0.01', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 0.3,
        res_amount = 1;
      envBlock.gather_base_divisor = 0.01;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(1);
    });

    it('returns 10 if gather_ratio is 0.27, res_amount is 10 and gather_base_divisor is 0.5', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 0.27,
        res_amount = 10;
      envBlock.gather_base_divisor = 0.5;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(5.4);
    });

    it('returns 10 if gather_ratio is 0.27, res_amount is 10 and gather_base_divisor is 0.25', function () {

      var envBlock = new EnvironmentBlock(0),
        gather_ratio = 0.27,
        res_amount = 10;
      envBlock.gather_base_divisor = 0.25;

      var gather_amount = envBlock._calculateGatherAmount(gather_ratio, res_amount);

      expect(gather_amount).toBe(10);
    });

  });



});