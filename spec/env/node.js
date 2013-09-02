require('./common');

global.Handlebars = require('../../lib/handlebars');

global.CompilerContext = {
  compile: function(template, options) {
//    var templateSpec = Handlebars.precompile(template, options);
//    Handlebars.template(eval('(' + templateSpec + ')'));

    return Handlebars.compile(template, options);
  },
  compileWithPartial: function(template, options) {
    return Handlebars.compile(template, options);
  }
};
