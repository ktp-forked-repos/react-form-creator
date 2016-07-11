(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'lodash'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('lodash'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.lodash);
    global.CreateForm = mod.exports;
  }
})(this, function (exports, _react, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = CreateForm;

  var _react2 = _interopRequireDefault(_react);

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function CreateForm(WrappedComponent, fieldsData) {
    var ConnectedForm = function (_Component) {
      _inherits(ConnectedForm, _Component);

      function ConnectedForm(props) {
        _classCallCheck(this, ConnectedForm);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ConnectedForm).call(this, props));

        // bind methods to component instance
        _this.getInitialFieldsState = _this.getInitialFieldsState.bind(_this);
        _this.handleFieldChange = _this.handleFieldChange.bind(_this);
        _this.handleFieldValidation = _this.handleFieldValidation.bind(_this);
        _this.runValidationsForField = _this.runValidationsForField.bind(_this);
        _this.runValidationsForAllFields = _this.runValidationsForAllFields.bind(_this);
        _this.refreshFormValidState = _this.refreshFormValidState.bind(_this);
        _this.handleFormSubmission = _this.handleFormSubmission.bind(_this);
        _this.resetForm = _this.resetForm.bind(_this);
        _this.submitForm = _this.submitForm.bind(_this);
        // set initial state
        var initialValid = props.initialValid;
        var fieldValues = props.fieldValues;

        _this.state = {
          isValid: initialValid, // Initial ability to submit form
          isPristine: true,
          isSubmitting: false,
          submitFailure: null,
          submitSuccess: null,
          fieldsData: _this.getInitialFieldsState(fieldValues)
        };
        return _this;
      }

      _createClass(ConnectedForm, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this._isUnmounting = false; // hack alert
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this._isUnmounting = true; // hack alert
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          var fieldValues = nextProps.fieldValues;

          if (fieldValues && !_lodash2.default.isEqual(fieldValues, this.props.fieldValues)) {
            var _fieldsData = this.getInitialFieldsState(fieldValues);
            this.setState({ fieldsData: _fieldsData });
          }
        }
      }, {
        key: 'getInitialFieldsState',
        value: function getInitialFieldsState(fieldValues) {
          var _this2 = this;

          return _lodash2.default.reduce(fieldsData, function (result, data, key) {
            // clone field to avoid mutation issues
            var field = _lodash2.default.extend({}, data);
            field.id = key;
            // start with clean validation state
            field.error = false;
            field.success = false;
            field.loading = false;
            field.pristine = true;
            // add event handlers and partially apply field key
            if (data.validationEvent) {
              field[data.validationEvent] = _lodash2.default.partial(_this2.handleFieldValidation, _lodash2.default, key);
            }
            field.onChange = _lodash2.default.partial(_this2.handleFieldChange, _lodash2.default, key);
            // Map values to fields (see example for setup)
            if (fieldValues && _typeof(fieldValues[key]) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined))) {
              field.value = _lodash2.default.clone(fieldValues[key]);
            } else {
              field.value = null;
            }
            result[key] = field;
            return result;
          }, {});
        }
      }, {
        key: 'handleFieldChange',
        value: function handleFieldChange(value, key) {
          var _this3 = this;

          var _props = this.props;
          var onChange = _props.onChange;
          var onDirty = _props.onDirty;
          var fieldsData = this.state.fieldsData;

          // Update value
          var field = fieldsData[key];
          field.value = value;
          field.pristine = false;
          this.setState({ fieldsData: fieldsData, isPristine: false }, function () {
            // Run validation if error or success is visible
            // or if no other validation event specified.
            if (field.error || field.success || !field.validationEvent) {
              _this3.handleFieldValidation(value, key);
            }
            _lodash2.default.isFunction(onChange) && onChange(fieldsData);
            _lodash2.default.isFunction(onDirty) && onDirty(fieldsData);
          });
        }
      }, {
        key: 'handleFieldValidation',
        value: function handleFieldValidation(value, key) {
          var _this4 = this;

          if (!key) {
            throw new Error("the validation event must pass the field value");
          }

          var fieldsData = this.state.fieldsData;

          var field = fieldsData[key];

          return new Promise(function (resolve, reject) {
            // Don't run validation if validationThreshold exists and hasn't been met
            if (field.validationThreshold && !field.error && !field.success) {
              if (field.value && field.value.length < field.validationThreshold) {
                resolve();
                return;
              }
            }
            // Assume loading on validation
            // Note: showLoading is never set if validators resolve immediately
            field.loading = true;
            // Validate field resolves if all validators pass and rejects the first validation that fails.
            _this4.runValidationsForField(field, value).then(function () {
              if (_this4._isUnmounting) {
                resolve();
                return;
              }
              field.error = false;
              field.success = true;
              field.loading = false;
              _this4.setState({ fieldsData: fieldsData });
              _this4.refreshFormValidState();
              resolve();
            }).catch(function (e) {
              if (_this4._isUnmounting) {
                resolve();
                return;
              }
              if (!(e && e.message)) {
                throw new Error("Invalid promise rejection. Return an Error obj.");
              }
              field.error = e.message;
              field.success = false;
              field.loading = false;
              _this4.setState({ fieldsData: fieldsData });
              _this4.refreshFormValidState();
              resolve();
            });

            // If promises don't resolve immediately show loading state
            _lodash2.default.defer(function () {
              if (_this4._isUnmounting) {
                resolve();
                return; // hack
              }
              if (field.loading) {
                _this4.setState({ fieldsData: fieldsData });
              }
            });
          });
        }
      }, {
        key: 'runValidationsForField',
        value: function runValidationsForField(field, value) {
          var fieldsData = this.state.fieldsData;

          var errors = [];
          var validators = _lodash2.default.clone(field.validators) || [];
          // if field is required add validation rule
          if (field.required) {
            var isRequired = function isRequired(value, values) {
              if (value == undefined || value == null || value == "") {
                return "Required";
              }
            };
            validators.unshift(isRequired);
          }
          // Check field validity if field validators
          if (validators) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              // Get validate rule from passed function
              for (var _iterator = validators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var validator = _step.value;

                var error = validator(value, fieldsData);
                var shouldBreak = false;
                if (error) {
                  // Error can be a string or a promise
                  if (_lodash2.default.isString(error)) {
                    // Convert string error into promise and reject immediately
                    error = Promise.reject(new Error(error));
                    shouldBreak = true;
                  }
                  // Error should be a promise at this point
                  if (!_lodash2.default.isFunction(error.then)) {
                    throw new Error("Invalid return value from validation function. Return a promise or a string.");
                  }
                  errors.push(error);
                  // No need to check for more errors if error has
                  // already returned
                  if (shouldBreak) {
                    break;
                  }
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }
          // Resolves if ALL promises in the array resolve (or no validators).
          // Rejects if ANY promise in the array rejects.
          return Promise.all(errors);
        }
      }, {
        key: 'runValidationsForAllFields',
        value: function runValidationsForAllFields() {
          var _this5 = this;

          var fieldsData = this.state.fieldsData;


          var validations = _lodash2.default.reduce(fieldsData, function (result, field, key) {
            var p = _this5.handleFieldValidation(field.value, key);
            result.push(p);
            return result;
          }, []);

          return Promise.all(validations);
        }
      }, {
        key: 'refreshFormValidState',
        value: function refreshFormValidState() {
          var _state = this.state;
          var fieldsData = _state.fieldsData;
          var isValid = _state.isValid;

          var fieldsKeys = _lodash2.default.keys(fieldsData);
          // Checks each field for error and value
          var allIsValid = _lodash2.default.every(fieldsKeys, function (key) {
            var field = fieldsData[key];
            var isValid = !field.error;
            if (field.required) {
              var hasValue = field.value != undefined && field.value != null && field.value != "";
              return hasValue && isValid;
            }
            return isValid;
          });

          var _props2 = this.props;
          var onValid = _props2.onValid;
          var onInvalid = _props2.onInvalid;

          if (allIsValid && !isValid) {
            this.setState({ isValid: true }, function () {
              _lodash2.default.isFunction(onValid) && onValid(fieldsData);
            });
          } else if (!allIsValid && isValid) {
            this.setState({ isValid: false }, function () {
              _lodash2.default.isFunction(onInvalid) && onInvalid(fieldsData);
            });
          }
          return allIsValid;
        }
      }, {
        key: 'handleFormSubmission',
        value: function handleFormSubmission(submission) {
          var _this6 = this;

          var promise = submission.then ? submission : submission.promise && submission.promise.then ? submission.promise : null;
          if (promise) {
            this.setState({
              submitFailure: null,
              submitSuccess: null,
              isSubmitting: true
            });
            promise.then(function () {
              if (_this6._isUnmounting) {
                return; // hack
              }
              _this6.setState({
                isSubmitting: false,
                submitSuccess: true
              });
            }).catch(function (err) {
              if (_this6._isUnmounting) {
                return; // hack
              }
              _this6.setState({
                isSubmitting: false,
                submitFailure: err
              });
            });
          } else {
            console.warn("form submission did not return a promise");
          }
        }
      }, {
        key: 'resetForm',
        value: function resetForm() {
          var _props3 = this.props;
          var fieldValues = _props3.fieldValues;
          var initialValid = _props3.initialValid;
          var onReset = _props3.onReset;

          var fieldsData = this.getInitialFieldsState(fieldValues);
          this.setState({
            fieldsData: fieldsData,
            isPristine: true,
            isValid: initialValid
          }, function () {
            _lodash2.default.isFunction(onReset) && onReset(fieldsData);
          });
        }
      }, {
        key: 'submitForm',
        value: function submitForm(e) {
          var _this7 = this;

          e && e.preventDefault();
          this.runValidationsForAllFields().then(function () {
            var allIsValid = _this7.refreshFormValidState();
            if (allIsValid) {
              var _fieldsData2 = _this7.state.fieldsData;
              var onSubmit = _this7.props.onSubmit;

              var submission = onSubmit(_fieldsData2, _this7.resetForm);
              if (submission) {
                _this7.handleFormSubmission(submission);
              } else {
                console.warn("nothing returned from form submission");
              }
            } else {
              console.warn("form is invalid");
            }
          }).catch(function (e) {
            console.warn("form is invalid", e);
          });
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, _extends({}, this.props, this.state, {
            handleReset: this.resetForm,
            handleSubmit: this.submitForm
          }));
        }
      }]);

      return ConnectedForm;
    }(_react.Component);

    ConnectedForm.displayName = WrappedComponent.displayName ? 'ConnectedForm' + WrappedComponent.displayName : "ConnectedForm";

    ConnectedForm.propTypes = {
      fieldValues: _react.PropTypes.object,
      initialValid: _react.PropTypes.bool,
      onSubmit: _react.PropTypes.func.isRequired,
      onChange: _react.PropTypes.func,
      onReset: _react.PropTypes.func,
      onValid: _react.PropTypes.func,
      onDirty: _react.PropTypes.func,
      onInvalid: _react.PropTypes.func,
      onPristine: _react.PropTypes.func
    };

    ConnectedForm.defaultProps = {
      initialValid: false
    };

    return ConnectedForm;
  }
});