(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.validators = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var exists = function exists(value) {
    return value != null && value != undefined;
  };

  var empty = function empty(value) {
    return value === "";
  };

  exports.default = {

    isRequired: function isRequired(value, values) {
      if (!exists(value) || empty(value)) {
        return "Required";
      }
    },

    isEmail: function isEmail(value, values) {
      var emailRegExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
      if (!emailRegExp.test(value)) {
        return "Enter a valid email";
      }
    },

    isAlpha: function isAlpha(value, values) {
      var alphaRegExp = /^[A-Z ]+$/i;
      if (!alphaRegExp.test(value)) {
        return "Use letters only";
      }
    },

    isNumeric: function isNumeric(value, values) {
      var numRegExp = /^[-+]?(?:\d*[.])?\d+$/;
      if (isNaN(value) || !numRegExp.test(value)) {
        return "Use numbers only";
      }
    },

    isAlphanumeric: function isAlphanumeric(value, values) {
      var alphaNumRegExp = /^[0-9A-Z]+$/i;
      if (!alphaNumRegExp.test(value)) {
        return "Use letters and numbers only";
      }
    },

    isUrl: function isUrl(value, values) {
      var urlRegExp = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
      if (!urlRegExp.test(value)) {
        return "Enter a valid url";
      }
    },

    // These validators work by currying

    // isLength(6)
    isLength: function isLength(length) {
      return function (value, values) {
        if (exists(value) && !empty(value) && value.length !== length) {
          return "Requires " + length + " chars";
        }
      };
    },

    // minLength(100)
    minLength: function minLength(length) {
      return function (value, values) {
        if (exists(value) && !empty(value) && value.length < length) {
          return "Min " + length + " chars";
        }
      };
    },

    // maxLength(140)
    maxLength: function maxLength(length) {
      return function (value, values) {
        if (exists(value) && !empty(value) && value.length > length) {
          return "Max " + length + " chars";
        }
      };
    },

    // Validate against another field

    // equalsField('first_password')
    equalsField: function equalsField(field) {
      return function (values, value) {
        if (value !== values[field].value) {
          return "Doesn't match";
        }
      };
    },

    // againstField('points', isLessThanOrEqualTo)
    againstField: function againstField(field, validator) {
      return function (values, value) {
        var againstValue = values[field].value;
        try {
          // try running a returned function from the validator
          return validator(againstValue)(value, values);
        } catch (e) {
          // catch if the validator does not return a function
          return validator(againstValue, values);
        }
      };
    }

  };
});