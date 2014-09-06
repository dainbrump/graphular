'use strict';

// This is a graphular object library template

// First, we depend on Angular to be loaded, so...
(function (angular) {
  /**
   * Define our graphular object. This object's name must start with 'graphular'
   * followed by the object type in camel-case. The object type name must match
   * the format passed into the chart directive's 'type' attribute.
   *
   * Examples:
   *   type attribute               object name
   * --------------------------------------------------------------------------
   *   pieChart or PieChart         graphularPieChart
   *   scattergraph                 graphularScattergraph
   *   superAwesomeChartYay         graphularSuperAwesomeChartYay
   */
  var graphularSuperAwesomeChartYay = function () {
    /**
     * Inside, it may have a 'defaults' object. This should define any default
     * values for this type of d3 object such as padding, margin, height, etc.
     * These are supplied to the graphularObject init method if they exist.
     */
    this.defaults = {};
    /**
     * Any additional constructor functions or properties may be set here. Once
     * this constructor is finished, the graphularObject.init() method takes
     * over.
     */
    this.sacyMessage = 'I am initialized.';
  };

  /**
   * Next we begin fleshing out all of the d3 document specific methods. These
   * methods will be specific to this particular object and once this object
   * is materialized by the graphularSvg method, these will be combined with the
   * core graphularObject methods. If you need to override a core method for
   * this object, do so in the 'redecorate' prototype. Replacing core methods
   * outside the redecorate method will not work since this object is created
   * and then extended with the graphularObject core.
   */

  /**
   * Here we prototype our 'awesomeMethod' which will have access to all other
   * methods defined in this object as well as the public methods in the core
   * graphularObject instance. This method does nothing fancy.
   */
  graphularSuperAwesomeChartYay.prototype.awesomeMethod = function () {
    console.log(this.sacyMessage);
  };

  /**
   * This method is completely optional. Only use it when you need to alter the
   * way one of the core methods operates for this type of d3 document only. The
   * only core method that you will not be able to redecorate is the 'init'
   * method. So, why would I need this?
   *
   * For example, let's say this document requires data formatted some way other
   * than the default array of numerical values or an array of label / value
   * object pairs. We could "hijack" the core 'loadData' method to validate and
   * set our data to the expected format. It is important to set at least the
   * the properties defined in the redecorated method. You may set additional
   * properties inside the new method, but the core properties defined in the
   * original method MUST be defined and type match. Wormholes may suddenly open
   * if not.
   */
  graphularSuperAwesomeChartYay.prototype.redecorate = function () {
    /**
     * Let's hijack the core method of 'coreWidth'.
     *
     * The original method:
     *   function () { return this.getWidth(this.core); };
     *
     * And have it return half the container element's computed width.
     */
    this.coreWidth = function () { return this.getWidth(this.core) / 2; }
    /**
     * Now, anywhere 'coreWidth' is called, we'll get half the container element
     * width.
     */
  };

  /**
   * This should ALWAYS be your final protoyped method... draw(). This is the
   * last thing called by the chart directive and is where the pieces all come
   * together to make something wonderful.
   *
   * Inside this method, you should call any functions that will perform the
   * final rendering of your d3 document.
   */
  graphularSuperAwesomeChartYay.prototype.draw = function () {
    this.sacyMessage = 'I\'m a Super Awesome Chart, YAY!';
    this.awesomeMethod();
  };

  /**
   * Last and most importantly, graphular must know that this object exists. It
   * does this by inspecting the window object for the presence of this class.
   * So, we register the class with the window object and call it done. All
   * that is left is to include this file in our HTML prior to including the
   * graphular core, add our chart directive with 'type="superAwseomeChartYay"',
   * any additionally required properties as individual attributes or in the
   * 'options' attribute as a JSON object, and reload the page.
   */
  window.graphularSuperAwesomeChartYay = graphularSuperAwesomeChartYay;
})(angular);