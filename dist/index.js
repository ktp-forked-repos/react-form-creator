(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './CreateForm', './validators'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./CreateForm'), require('./validators'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.CreateForm, global.validators);
    global.index = mod.exports;
  }
})(this, function (exports, _CreateForm, _validators) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.validators = exports.CreateForm = undefined;

  var _CreateForm2 = _interopRequireDefault(_CreateForm);

  var _validators2 = _interopRequireDefault(_validators);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.CreateForm = _CreateForm2.default;
  exports.validators = _validators2.default;
});