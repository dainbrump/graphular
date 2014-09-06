'use strict';

// First things first. Verify D3 presence and set our global reference or barf.
var d3 = window.d3 || null;
if (!d3) { throw 'd3 library not found.'; }

// Since we depend on Angular, let's make sure it's loaded before we continue.
(function (angular) {
  /**
   * This is the core functional object for Graphular. The goal here is that
   * all methods defined in graphularObject should be shared / shareable
   * between all d3 object types. Any d3 methods that are specific to a d3 class
   * or group of d3 classes should be specified in a separate library for those
   * objects. Each of these methods may also be hijacked or redefined inside
   * graphular object templates.
   */
  var graphularObject = {};

  /**
   * Initializes the graphular object, identifies the container DOM element and
   * creates an svg object for d3 to work with. It then checks to see if the
   * graphular object has a redecorate method. If so, it executes it. This
   * method allows the graphular object to redefine some of these core methods
   * to better work with the particular object type.
   *
   * @param  object element  a jQuery or Angular element reference to the d3
   *                         container used for this d3 document instance.
   * @param  object defaults A JSON of default configuration settings for the
   *                         current d3 document instance and type.
   */
  graphularObject.init = function (element, defaults) {
    this.core   = element;
    this.config = defaults || {};
    this.svg    = d3.select(this.core).append("svg").style('width', '100%');
    if (this.redecorate) { this.redecorate(); }
  };

  /**
   * Processes additional configuration settings for the current d3 document
   * instance. Filters out Angular and jQuery scope references (${something} and
   * $${something_else}). It then applies these key / value pairs to the current
   * instance configuration.
   *
   * @param  object  opt JSON collection of key / value pair settings for the
   *                     current graphular instance.
   */
  graphularObject.loadOptions = function (opt) {
    angular.forEach(opt, function (v, k) {
      if (!k.match(/^\${1,2}/)) {
        this[k] = (!isNaN(parseInt(v, 10))) ? parseInt(v, 10) : v;
      }
    }, this.config);
  };

  /**
   * SVG container reset method. Removes specified elements from the SVG node.
   * Defaults to '*' or all SVG child nodes.
   *
   * @param  string elements Valid DOM selector pattern
   */
  graphularObject.svgReset = function (elements) {
    elements = elements || '*';
    this.svg.selectAll(elements).remove();
  };

  /**
   * Validates and populates the graphular instance's data.
   * @param  mixed  data Array or JSON collection of data to be used by d3 to
   *                     render the d3 document.
   */
  graphularObject.loadData = function (data) {
    if (isNaN(parseInt(data[0], 10)) && isNaN(parseInt(data[0].value, 10))) {
      throw 'Your data is invalidly formatted.';
    }
    this.data = data;
    this.dataCount = this.data.length;
    if (this.data[0].value) {
      this.dataMax = d3.max(this.data, function (d) { return d.value; })
    } else {
      this.dataMax = d3.max(this.data);
    }
  };

  /**
   * Simple validation. It does not verify format, only presence of the required
   * properties.
   *
   * @param  object  obj  Object to validate
   * @param  mixed   reqs String or array of strings identifying keys that must
   *                      exist in the object.
   * @return boolean      True if all properties exist
   */
  graphularObject.validateProps = function (obj, reqs) {
    if (!angular.isObject(obj)) {
      throw 'You must supply an object for validation.'
    };
    reqs = (angular.isArray(reqs)) ? reqs : ((reqs) ? new Array(reqs) : null);
    var hasReqs = true;
    angular.forEach(reqs, function (v) {
      hasReqs |= !angular.isUndefined(obj[v]);
    });
    return hasReqs;
  };

  /**
   * Iterates through the object and returns an object that contains only key /
   * value pairs where the keys are in the required or optional list. All other
   * key value pairs are ignored.
   *
   * @param  object obj  Object to filter
   * @param  mixed  reqs String or array of strings for required keys
   * @param  mixed  opts String or array of strings for optional keys
   * @return object      Filtered object with only required and optional values
   */
  graphularObject.filterProps = function (obj, reqs, opts) {
    if (!angular.isObject(obj)) {
      throw 'You must supply an object for filtering.'
    };
    reqs = (angular.isArray(reqs)) ? reqs : ((reqs) ? new Array(reqs) : null);
    opts = (angular.isArray(opts)) ? opts : ((opts) ? new Array(opts) : null);
    var clean = {};
    if (this.validateProps(obj, reqs)) {
      if (reqs) {
        angular.forEach(reqs, function (v) {
          var a = (!angular.isUndefined(obj[v])) ? this[v] = obj[v] : null;
        }, clean);
      }
      if (opts) {
        angular.forEach(opts, function (v) {
          var b = (!angular.isUndefined(obj[v])) ? this[v] = obj[v] : null;
        }, clean);
      }
    }
    return clean;
  };

  /**
   * Performs a validateProps and filterProps all in one action.
   *
   * @param  object obj  Object to validate and filter
   * @param  mixed  reqs String or array of strings for required keys
   * @param  mixed  opts String or array of strings for optional keys
   * @return object      Filtered object with only required and optional values
   */
  graphularObject.validateAndFilterProps = function (obj, reqs, opts) {
    if (this.validateProps(obj, reqs)) {
      return this.filterProps(obj, reqs, opts);
    }
  };

  /**
   * Returns the calculated width of element.
   *
   * @param  object element jQuery / Angular element to measure.
   * @return number         The calculated width in pixels
   */
  graphularObject.getWidth = function (element) {
    return element.offsetWidth;
  };

  /**
   * Returns the calculated height of element.
   *
   * @param  object element jQuery / Angular element to measure.
   * @return number         The calculated height in pixels
   */
  graphularObject.getHeight = function (element) {
    return element.offsetHeight;
  };

  /**
   * Returns the calculated width of the graphular container element.
   *
   * @return number The calculated width in pixels
   */
  graphularObject.coreWidth = function () {
    return this.getWidth(this.core);
  };

  /**
   * Returns the calculated height of the graphular container element.
   *
   * @return number The calculated height in pixels
   */
  graphularObject.coreHeight = function () {
    return this.getHeight(this.core);
  };

  /**
   * Sets the chart scale method, chart domain and value range. The scale type
   * defaultsto linear if it is not supplied.
   *
   * @param  string scale  Type of scaling method to use
   * @param  array  domain Chart domain supplied as a '[min, max]' array
   * @param  array  range  Chart range supplied as a '[min, max]' array
   * @return object        A d3 scale object
   */
  graphularObject.setScale = function (scale, domain, range) {
    if (!angular.isString(scale)) {
      range = domain; domain = scale; scale = 'linear';
    }
    switch (scale) {
      case 'sqrt':
        var s = d3.scale.sqrt();
        if (domain) { s.domain(domain); }
        if (range) {s.range(range); }
        return s;
        break;
      case 'pow':
        var s = d3.scale.pow();
        if (domain) { s.domain(domain); }
        if (range) {s.range(range); }
        return s;
        break;
      case 'log':
        var s = d3.scale.log();
        if (domain) { s.domain(domain); }
        if (range) {s.range(range); }
        return s;
        break;
      case 'quantize':
        var s = d3.scale.quantize();
        if (domain) { s.domain(domain); }
        if (range) {s.range(range); }
        return s;
        break;
      case 'threshold':
        var s = d3.scale.threshold();
        if (domain) { s.domain(domain); }
        if (range) {s.range(range); }
        return s;
        break;
      case 'quantile':
        var s = d3.scale.quantile();
        if (domain) { s.domain(domain); }
        if (range) {s.range(range); }
        return s;
        break;
      case 'identity':
        var s = d3.scale.identity();
        if (domain) { s.domain(domain); }
        if (range) {s.range(range); }
        return s;
        break;
      case 'ordinal':
        var s = d3.scale.ordinal();
        if (domain) { s.domain(domain); }
        if (range) {s.range(range); }
        return s;
        break;
      case 'linear':
      default:
        var s = d3.scale.linear();
        if (domain) { s.domain(domain); }
        if (range) {s.range(range); }
        return s;
        break;
    }
  };

  /**
   * Sets or resets the chart domain. If the first supplied value is an array
   * and the second value is an object, the method assumes the first value as
   * the domain and the second value as the scale object.
   *
   * @param integer min      The minimum value in the domain
   * @param integer max      The maximum value in the domain
   * @param object  scaleObj The d3 scale object to work with
   */
  graphularObject.setDomain = function (min, max, scaleObj) {
    if (!scaleObj && angular.isObject(max) && angular.isArray(min)) {
      scaleObj = max;
      scaleObj.domain(min);
    } else {
      scaleObj.domain([min, max]);
    }
  };

  /**
   * Sets or resets the chart range. If the first supplied value is an array and
   * the second value is an object, the method assumes the first value as the
   * range and the second value as the scale object.
   *
   * @param integer min      The minimum value in the range
   * @param integer max      The maximum value in the range
   * @param object  scaleObj The d3 scale object to work with
   */
  graphularObject.setRange = function (min, max, scaleObj) {
    if (!scaleObj && angular.isObject(max) && angular.isArray(min)) {
      scaleObj = max;
      scaleObj.range(min);
    } else {
      scaleObj.range([min, max]);
    }
  };

  graphularObject.addTransition = function (nodes, duration, start, end) {
    var n = this.svg.selectAll(nodes);
    n.attr(start).transition().duration(duration).attr(end);
  };

  /**
   * The graphular "God" level function. It materializes an instance of the
   * graphular d3 object type, extends the object functions with the core
   * graphularObject functions and returns the shiny new graphular object.
   *
   * @param  object element jQuery / Angular DOM reference to the container.
   * @param  string type    The graphular object type to create.
   * @return object         Functionally ready to rock graphular object.
   */
  function materialize (element, type) {
    var objType = 'graphular'+type.charAt(0).toUpperCase()+type.slice(1);
    if (!window[objType]) {
      throw 'Missing library for ' + objType + '.';
    }
    var object = new (window[objType]);
    object = angular.extend(object, graphularObject);
    object.init(element, object.defaults);
    return object;
  };

  /**
   * And finally, drum roll please....
   *
   * The one directive to rule them all. This is the graphular chart directive.
   * It may be used as an element or an attribute. All attributes and nested
   * content is transcluded. The controller watches for changes to data and for
   * window resizes and rerenders the object.
   *
   * @return object Fully functional Angular directive in all it's glory.
   */
  angular.module('graphular', []).directive('chart', function () {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: '<div class="graphular" ng-transclude></div>',
      scope: { options: '=', type: '@', data: '=' },
      controller: function ($scope, $element) {
        $scope.self = $element[0];
        window.onresize = function() { $scope.$apply(); };
        $scope.$watch(function () { return angular.element(window)[0].innerWidth; },
          function(){ $scope.render($scope.data);
        });
        $scope.$watch('data', function(data, old) {
          if (data !== old) { $scope.render(data); }
        }, true);
      },
      link: function (scope, elem, attr) {
        var chart = materialize(scope.self, scope.type);
        chart.loadOptions(attr);
        if (scope.options) { chart.loadOptions(scope.options); }
        scope.render = function(data) {
          chart.svgReset();
          if (!data) return;
          chart.loadData(data);
          chart.draw();
        }
      }
    };
  });

  // And Bob's your uncle!
})(angular);