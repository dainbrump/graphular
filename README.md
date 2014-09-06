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
