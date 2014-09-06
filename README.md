graphular
=========

Extendable library with d3 hooks for creating stunning d3 documents using a
single AngularJS directive.

The goal of Graphular was to create a single directive through which practically
any d3 document could be created. Using magic available through javascript you
may create your own customized d3 object library, use the base graphular library
and implement d3 easily with a single directive.

Features:
---------

**Responsive** - It binds its render method to window resize events. This means
that as your page scales, so does your chart. Graphular defaults to filling the
entire width of its container.

**Real-time** - As your bound data changes, so does your chart. Graphular does
this by setting a deep $watch on the data attribute and firing its render method
when there are changes.

**Simple** - A single directive with only **3** scope-bound attributes is all
you need to include in your HTML to render stunning charts. Best of all, it's
the same directive regardless of the type of chart - Bar, Area, Pie, Line, etc.
Graphular is the one chart directive to rule them all.

**Flexible** - Don't like the default bar chart? Easy enough to fix. *This does
require some experience or knowledge of the d3 library.* Simply copy the
graphularBar.js to your graphularCoolBar.js and modify. Then include your new
cool bar js into your page and update your chart directive's type attribute to
"CoolBar" and watch the magic happen.

**Practically Limitless** - Any document type that can be made with d3 may be
made with graphular and easily injected into your app with a single directive if
you know how to do it. The extendable nature of Graphular is due to javascript's
flexible object creation. For more on this, take a look at 'exampleObject.js'
under the src/lib directory of this project.

How it works:
-------------

Assuming you already have included angularjs core into your page, all you have
to include now is d3, the graphular core and any graphular chart libraries you
wish to use. Next, inject the 'graphular' module into your app, add some code to
your controllers to generate your data, and bind that data and any options to
a 'chart' directive.

Looking at our sandbox, we see:

```html
<script src="[PATH_TO_ANGULAR]/angular.min.js"></script>
<script src="[PATH_TO_D3]/d3.min.js"></script>
<script src="[PATH_TO_GRAPHULAR]/graphular.js"></script>
<!-- Next we include our chart libraries -->
<script src="[PATH_CHART_LIBRARIES]/graphularBar.js"></script>
```
Then in our AngularJS app, we inject the 'graphular' dependency:

```javascript
angular.module('MyAwesomeApp', ['graphular']);
```

In our controller, we set some scope variables, specifically a data variable:

```javascript
$scope.data = [
  {label:'A', value:98},
  {label:'B', value:96},
  {label:'C', value:75},
  {label:'D', value:48}
];
```

Finally, inside a DOM element where we've bound our controller, we add the
directive and bind our data:

```html
<!-- As a tag -->
<div ng-controller="MyAwesomeController">
  <chart type="bar" data="data"></chart>
</div>

<!-- As an attribute -->
<div ng-controller="MyAwesomeController">
  <div chart type="bar" data="data"></div>
</div>
```

Details
-------

The graphular directive has only three bound attributes to deal with:

### 1. 'type'

> A text string that identifies the type of graphular chart to render.

As shown in our example above, the **type** attribute references the object
defined in graphularBar.js. The directive converts the value in **type** to a
camel-case variant, appends this new string to 'graphular' to create a class
name of 'graphularBar'. It then looks for an object named 'graphularBar' to be
registered with the window object. If it finds one, it returns a new instance of
that object. If we look inside graphularBar.js we see that the last thing done
is:

```javascript
window.graphularBar = graphularBar;
```

If we created our own chart called AwesomeBar, at the end of our library we
simply need to add `window.graphularAwesomeBar = {the object name we created}`.
Then we can add a **type** attribute of 'awesomeBar' or 'AwesomeBar' to our
directive and the new chart library will be used to render our AwesomeBar. For
more information on creating your own graphular libraries, look through the code
in `src/lib/exampleObject.js`.

### 2. 'data'

> An array of values or key/value pairs representing the data to render.

Data is always an array of numeric values or an array of key/numeric value pairs
unless you have created a custom graphular library that accepts data in another
format.

### 3. 'options'

> A key/value pair collection of chart configuration specific to the chart type.

The options attribute is a key/value collection that overrides the default
configuration of the associated graphular chart. These options may be similar
or completely different and are dependent on the library being used. For a
complete list of options for each chart, refer to the developer notes for that
library.

Shared Methods
--------------

### init (element, defaults)

> Initializes the graphular object, identifies the container DOM element and
> creates an svg object for d3 to work with. It then checks to see if the
> graphular object has a redecorate method. If so, it executes it. This
> method allows the graphular object to redefine some of the following core
> methods to better work with the particular object type.

`element` - a jQuery or Angular element reference to the d3 container used for
this d3 document instance.

`defaults` - A JSON of default configuration settings for the current d3
document instance and type.

### loadOptions (opt)

> Processes additional configuration settings for the current d3 document
> instance. Filters out Angular and jQuery scope references (${something} and
> $${something_else}). It then applies these key / value pairs to the current
> instance configuration.

`opt` - JSON collection of key / value pair settings for the current graphular
instance.

### svgReset (elements)

> SVG container reset method. Removes specified elements from the SVG node.
> Defaults to '*' or all SVG child nodes.

`elements` - A valid DOM selector pattern.

### loadData (data)

> Validates and populates the graphular instances data.

`data` - An array of values or key/value pairs to be used by d3 for rendering
the chart.

### validateProps (obj, reqs)

> Simple validation. It does not verify format, only presence of the required
> properties.

`obj` - Object to validate.

`reqs` - String or array of strings identifying keys that must exist in the
object.

Returns `true` if all properties exist.

### filterProps (obj, reqs, opts)

> Iterates through the object and returns an object that contains only key /
> value pairs where the keys are in the required or optional list. All other
> key value pairs are ignored.

`obj` - Object to filter.

`reqs` - String or array of strings for required keys.

`opts` - String or array of strings for optional keys.

Returns a filtered object with only required and optional values.

### validateAndFilterProps (obj, reqs, opts)

> Performs a 'validateProps' and 'filterProps' all in one action.

`obj` - Object to validate and filter.

`reqs` - String or array of strings for required keys.

`opts` - String or array of strings for optional keys.

Returns a filtered object with only required and optional values.

### getWidth (element)

> Returns the calculated width of the supplied element.

`element` - jQuery / Angular element to measure.

Returns the calculated width in pixels.

### getHeight (element)

> Returns the calculated height of the supplied element.

`element` - jQuery / Angular element to measure.

Returns the calculated height in pixels.

### coreWidth ()

> Returns the calculated width of the graphular container element.

Returns the calculated width of the primary container in pixels.

### coreHeight ()

> Returns the calculated height of the graphular container element.

Returns the calculated height of the primary container in pixels.

### setScale (scale, domain, range)

> Sets the chart scale method, chart domain and value range. The scale type
> defaults to linear if it is not supplied.

`scale` - Type of scaling method to use. Options are 'linear', 'sqrt', 'pow',
'log', 'quantize', 'threshold', 'quantile', 'identity', and 'ordinal'.

`domain` - Chart domain supplied as a '[min, max]' array.

`range` -  Chart range supplied as a '[min, max]' array.

Returns a d3 scale object.

### setDomain (min, max, scaleObj)

> Sets or resets the chart domain. If the first supplied value is an array
> and the second value is an object, the method assumes the first value as
> the domain and the second value as the scale object.

`min` - The minimum value in the domain.

`max` - The maximum value in the domain.

`scaleObj` - The d3 scale object to work with.

### setRange (min, max, scaleObj)

> Sets or resets the chart range. If the first supplied value is an array and
> the second value is an object, the method assumes the first value as the
> range and the second value as the scale object.

`min` - The minimum value in the range.

`max` - The maximum value in the range.

`scaleObj` - The d3 scale object to work with.

### **More shared methods to come**