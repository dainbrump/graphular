'use strict';

(function (angular) {
  var graphularBar = function () {
    this.defaults = {
      margin: 20,
      barHeight: 20,
      barPadding: 5
    };
  };
  graphularBar.prototype.addRectangle = function (node, height, width, x, y, fill) {
    var requiredProps = ['height','x','y'];
    var optionalProps = ['width', 'fill'];
    var props = (angular.isObject(height))
      ? this.validateAndFilterProps(height, requiredProps, optionalProps)
      : this.validateAndFilterProps({height:height,width:width||null,x:x,y:y,fill:fill||null}, requiredProps, optionalProps);
    if (props) {
      var rect = node.append('rect');
      if (props.height) { rect.attr('height', props.height); }
      if (props.width) { rect.attr('width', props.width); }
      if (props.fill) { rect.attr('fill', props.fill); }
      rect.attr('x', props.x).attr('y', props.y);
    } else {
      throw 'Incomplete rectangle properties supplied.';
    }
  };
  graphularBar.prototype.addText = function (node, height, width, x, y, fill, text) {
    var requiredProps = ['x','y','text'];
    var optionalProps = ['height','width','fill'];
    var props = (angular.isObject(height))
      ? this.validateAndFilterProps(height, requiredProps, optionalProps)
      : this.validateAndFilterProps({
          height:height||null,width:width||null,x:x,y:y,
          fill:fill||null,text:text}, requiredProps, optionalProps);
    if (props) {
      var t = node.append('text');
      if (props.height) { t.attr('height', props.height); }
      if (props.width) { t.attr('width', props.width); }
      if (props.fill) { t.attr('fill', props.fill); }
      t.attr('x', props.x).attr('y', props.y);
      t.text(props.text);
    } else {
      throw 'Incomplete text properties supplied.';
    }
  };
  graphularBar.prototype.prepHorizontal = function () {
    var self = this;
    return {
      width: self.coreWidth() - self.config.margin,
      xScale: self.setScale([0, self.dataMax], [0, (self.coreWidth() - self.config.margin)]),
      combinedBar: self.config.barHeight + self.config.barPadding,
      height: self.dataCount * (self.config.barHeight + self.config.barPadding),
      color: d3.scale.category20()
    };
  };
  graphularBar.prototype.horizontalBarchart = function (hbSettings) {
    var bar = this.svg.selectAll('g').data(this.data).enter().append('g')
    var barProps = {
      height: this.config.barHeight,
      x: Math.round(this.config.margin/2),
      y: function(d,i) { return i * hbSettings.combinedBar;},
      fill: function(d) { return hbSettings.color(d.value); }
    };
    this.svg.attr('height', hbSettings.height);
    this.addRectangle(bar, barProps);
    this.addTransition('rect', this.config.transition || 0, {'width': 140}, {'width': function(d) { return hbSettings.xScale(d.value); }});
    if (this.config.showDetails) {
      var textProps = {
        fill: '#fff',
        y: function(d,i) { return i * hbSettings.combinedBar + 15; },
        x: 15,
        text: function(d) { return d.value + ""; }
      };
      this.addText(bar, textProps);
    }
  };
  graphularBar.prototype.draw = function () {
    this.horizontalBarchart(this.prepHorizontal());
  };
  window.graphularBar = graphularBar;
})(angular);