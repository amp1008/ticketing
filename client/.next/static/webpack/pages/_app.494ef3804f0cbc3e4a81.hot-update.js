webpackHotUpdate_N_E("pages/_app",{

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _Users_ashish_Documents_Learning_Node_UdemyNodeCourse_microservice_ticketing_client_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/regenerator */ \"./node_modules/@babel/runtime/regenerator/index.js\");\n/* harmony import */ var _Users_ashish_Documents_Learning_Node_UdemyNodeCourse_microservice_ticketing_client_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Users_ashish_Documents_Learning_Node_UdemyNodeCourse_microservice_ticketing_client_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _Users_ashish_Documents_Learning_Node_UdemyNodeCourse_microservice_ticketing_client_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator */ \"./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_ashish_Documents_Learning_Node_UdemyNodeCourse_microservice_ticketing_client_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/defineProperty */ \"./node_modules/@babel/runtime/helpers/esm/defineProperty.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var bootstrap_dist_css_bootstrap_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! bootstrap/dist/css/bootstrap.css */ \"./node_modules/bootstrap/dist/css/bootstrap.css\");\n/* harmony import */ var bootstrap_dist_css_bootstrap_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_css_bootstrap_css__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _api_build_client__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../api/build-client */ \"./api/build-client.js\");\n\n\n\n\nvar _jsxFileName = \"/Users/ashish/Documents/Learning/Node/UdemyNodeCourse/microservice/ticketing/client/pages/_app.js\";\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { Object(_Users_ashish_Documents_Learning_Node_UdemyNodeCourse_microservice_ticketing_client_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n\n\n\n\nfunction AppComponent(_ref) {\n  var Component = _ref.Component,\n      pageProps = _ref.pageProps,\n      user = _ref.user;\n\n  var newProps = _objectSpread(_objectSpread({}, pageProps), {}, {\n    user: user\n  });\n\n  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(\"div\", {\n    className: \"p-3\",\n    children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(\"h3\", {\n      children: \"Header\"\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 13,\n      columnNumber: 4\n    }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(Component, _objectSpread({}, newProps), void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 14,\n      columnNumber: 4\n    }, this)]\n  }, void 0, true, {\n    fileName: _jsxFileName,\n    lineNumber: 12,\n    columnNumber: 3\n  }, this);\n}\n\n_c = AppComponent;\n\nAppComponent.getInitialProps = /*#__PURE__*/function () {\n  var _ref2 = Object(_Users_ashish_Documents_Learning_Node_UdemyNodeCourse_microservice_ticketing_client_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__[\"default\"])( /*#__PURE__*/_Users_ashish_Documents_Learning_Node_UdemyNodeCourse_microservice_ticketing_client_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(appContext) {\n    var client, _yield$client$get, data, pageProps;\n\n    return _Users_ashish_Documents_Learning_Node_UdemyNodeCourse_microservice_ticketing_client_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.prev = 0;\n            client = Object(_api_build_client__WEBPACK_IMPORTED_MODULE_6__[\"default\"])(appContext.ctx);\n            _context.next = 4;\n            return client.get('/api/users/current-user');\n\n          case 4:\n            _yield$client$get = _context.sent;\n            data = _yield$client$get.data;\n            pageProps = {};\n            /* Executing initial props method of the individual component,\n            as this method is not getting invoked from the component */\n\n            if (!(appContext.Component && appContext.Component.getInitialProps)) {\n              _context.next = 11;\n              break;\n            }\n\n            _context.next = 10;\n            return appContext.Component.getInitialProps(appContext.ctx);\n\n          case 10:\n            pageProps = _context.sent;\n\n          case 11:\n            return _context.abrupt(\"return\", {\n              pageProps: pageProps,\n              user: data.user\n            });\n\n          case 14:\n            _context.prev = 14;\n            _context.t0 = _context[\"catch\"](0);\n            console.error(_context.t0);\n\n          case 17:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee, null, [[0, 14]]);\n  }));\n\n  return function (_x) {\n    return _ref2.apply(this, arguments);\n  };\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (AppComponent);\n\nvar _c;\n\n$RefreshReg$(_c, \"AppComponent\");\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/next/dist/compiled/webpack/harmony-module.js */ \"./node_modules/next/dist/compiled/webpack/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vcGFnZXMvX2FwcC5qcz9kNTMwIl0sIm5hbWVzIjpbIkFwcENvbXBvbmVudCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInVzZXIiLCJuZXdQcm9wcyIsImdldEluaXRpYWxQcm9wcyIsImFwcENvbnRleHQiLCJjbGllbnQiLCJidWlsZENsaWVudCIsImN0eCIsImdldCIsImRhdGEiLCJjb25zb2xlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBRUE7O0FBRUEsU0FBU0EsWUFBVCxPQUF1RDtBQUFBLE1BQTlCQyxTQUE4QixRQUE5QkEsU0FBOEI7QUFBQSxNQUFuQkMsU0FBbUIsUUFBbkJBLFNBQW1CO0FBQUEsTUFBUkMsSUFBUSxRQUFSQSxJQUFROztBQUN0RCxNQUFJQyxRQUFRLG1DQUNSRixTQURRO0FBRVhDLFFBQUksRUFBSkE7QUFGVyxJQUFaOztBQUlBLHNCQUNDO0FBQUssYUFBUyxFQUFDLEtBQWY7QUFBQSw0QkFDQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQURELGVBRUMscUVBQUMsU0FBRCxvQkFBZUMsUUFBZjtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBRkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBREQ7QUFNQTs7S0FYUUosWTs7QUFhVEEsWUFBWSxDQUFDSyxlQUFiO0FBQUEsK1hBQStCLGlCQUFPQyxVQUFQO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUV6QkMsa0JBRnlCLEdBRWhCQyxpRUFBVyxDQUFDRixVQUFVLENBQUNHLEdBQVosQ0FGSztBQUFBO0FBQUEsbUJBR1JGLE1BQU0sQ0FBQ0csR0FBUCxDQUFXLHlCQUFYLENBSFE7O0FBQUE7QUFBQTtBQUd2QkMsZ0JBSHVCLHFCQUd2QkEsSUFIdUI7QUFLekJULHFCQUx5QixHQUtiLEVBTGE7QUFNN0I7QUFDRjs7QUFQK0Isa0JBUXpCSSxVQUFVLENBQUNMLFNBQVgsSUFBd0JLLFVBQVUsQ0FBQ0wsU0FBWCxDQUFxQkksZUFScEI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxtQkFTVkMsVUFBVSxDQUFDTCxTQUFYLENBQXFCSSxlQUFyQixDQUFxQ0MsVUFBVSxDQUFDRyxHQUFoRCxDQVRVOztBQUFBO0FBUzVCUCxxQkFUNEI7O0FBQUE7QUFBQSw2Q0FZdEI7QUFDTkEsdUJBQVMsRUFBVEEsU0FETTtBQUVOQyxrQkFBSSxFQUFFUSxJQUFJLENBQUNSO0FBRkwsYUFac0I7O0FBQUE7QUFBQTtBQUFBO0FBaUI3QlMsbUJBQU8sQ0FBQ0MsS0FBUjs7QUFqQjZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQS9COztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQXFCZWIsMkVBQWYiLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCAnYm9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5jc3MnO1xuXG5pbXBvcnQgYnVpbGRDbGllbnQgZnJvbSAnLi4vYXBpL2J1aWxkLWNsaWVudCc7XG5cbmZ1bmN0aW9uIEFwcENvbXBvbmVudCAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcywgdXNlciB9KSB7XG5cdGxldCBuZXdQcm9wcyA9IHtcblx0XHQuLi5wYWdlUHJvcHMsXG5cdFx0dXNlclxuXHR9O1xuXHRyZXR1cm4gKFxuXHRcdDxkaXYgY2xhc3NOYW1lPVwicC0zXCI+XG5cdFx0XHQ8aDM+SGVhZGVyPC9oMz5cblx0XHRcdDxDb21wb25lbnQgey4uLm5ld1Byb3BzfSAvPlxuXHRcdDwvZGl2PlxuXHQpO1xufVxuXG5BcHBDb21wb25lbnQuZ2V0SW5pdGlhbFByb3BzID0gYXN5bmMgKGFwcENvbnRleHQpID0+IHtcblx0dHJ5IHtcblx0XHRsZXQgY2xpZW50ID0gYnVpbGRDbGllbnQoYXBwQ29udGV4dC5jdHgpO1xuXHRcdGxldCB7IGRhdGEgfSA9IGF3YWl0IGNsaWVudC5nZXQoJy9hcGkvdXNlcnMvY3VycmVudC11c2VyJyk7XG5cblx0XHRsZXQgcGFnZVByb3BzID0ge307XG5cdFx0LyogRXhlY3V0aW5nIGluaXRpYWwgcHJvcHMgbWV0aG9kIG9mIHRoZSBpbmRpdmlkdWFsIGNvbXBvbmVudCxcblx0XHRhcyB0aGlzIG1ldGhvZCBpcyBub3QgZ2V0dGluZyBpbnZva2VkIGZyb20gdGhlIGNvbXBvbmVudCAqL1xuXHRcdGlmIChhcHBDb250ZXh0LkNvbXBvbmVudCAmJiBhcHBDb250ZXh0LkNvbXBvbmVudC5nZXRJbml0aWFsUHJvcHMpIHtcblx0XHRcdHBhZ2VQcm9wcyA9IGF3YWl0IGFwcENvbnRleHQuQ29tcG9uZW50LmdldEluaXRpYWxQcm9wcyhhcHBDb250ZXh0LmN0eCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHBhZ2VQcm9wcyxcblx0XHRcdHVzZXI6IGRhdGEudXNlclxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcik7XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcENvbXBvbmVudDsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ })

})