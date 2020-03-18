// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"alerts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showAlert = void 0;

var hideAlert = function hideAlert() {
  var el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

var showAlert = function showAlert(type, msg) {
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 6;
  hideAlert();
  var markup = "<div class=\"alert alert-".concat(type === 'success' ? 'success' : 'error', "\">").concat(msg, "</div>");
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

exports.showAlert = showAlert;
},{}],"login.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = void 0;

var _alerts = require("./alerts.js");

var login = function login(email, password) {
  var $login_btn = document.getElementById('login-btn');
  $login_btn.innerText = 'Logging in..';
  $login_btn.setAttribute('disabled', 'disabled');
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/user/login', true);

  xhr.onload = function () {
    $login_btn.innerText = 'Log In';
    $login_btn.removeAttribute('disabled');
    var responseObject = JSON.parse(this.responseText);

    if (responseObject.status === 'success') {
      (0, _alerts.showAlert)('success', 'Logged in successfully!');
      window.setTimeout(function () {
        window.location.assign('/crew');
      }, 1500);
    } else {
      (0, _alerts.showAlert)('error', responseObject.message, 2);
    }
  };

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    email: email,
    password: password
  }));
};

exports.login = login;
},{"./alerts.js":"alerts.js"}],"signup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signup = void 0;

var _alerts = require("./alerts.js");

var signup = function signup(fullname, username, email, password, passwordConfirm) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/user/signup', true);

  xhr.onload = function () {
    var responseObject = JSON.parse(this.responseText);

    if (responseObject.status === 'success') {
      (0, _alerts.showAlert)('success', 'Account Created');
      window.setTimeout(function () {
        window.location.assign('/crew');
      }, 1500);
    } else {
      (0, _alerts.showAlert)('error', responseObject.message, 2);
    }
  };

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    fullname: fullname,
    username: username,
    email: email,
    password: password,
    passwordConfirm: passwordConfirm
  }));
};

exports.signup = signup;
},{"./alerts.js":"alerts.js"}],"logout.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = void 0;

var _alerts = require("./alerts.js");

var logout = function logout() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/user/logout', true);

  xhr.onload = function () {
    var responseObject = JSON.parse(this.responseText);

    if (responseObject.status === 'success') {
      window.location.assign('/');
    } else {
      (0, _alerts.showAlert)('error', responseObject.message, 2);
    }
  };

  xhr.send();
};

exports.logout = logout;
},{"./alerts.js":"alerts.js"}],"forgotpassword.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forgotpassword = void 0;

var _alerts = require("./alerts.js");

var forgotpassword = function forgotpassword(email, forgotBtn) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/user/forgotPassword', true);

  xhr.onload = function () {
    forgotBtn.removeAttribute('disabled');
    forgotBtn.innerText = 'Send Token';
    var responseObject = JSON.parse(this.responseText);
    (0, _alerts.showAlert)(responseObject.status, responseObject.message, 2);
  };

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    email: email
  }));
};

exports.forgotpassword = forgotpassword;
},{"./alerts.js":"alerts.js"}],"resetpassword.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetpassword = void 0;

var _alerts = require("./alerts.js");

var resetpassword = function resetpassword(password, passwordConfirm) {
  var xhr = new XMLHttpRequest();
  xhr.open('PATCH', '/user/resetpassword', true);

  xhr.onload = function () {
    var responseObject = JSON.parse(this.responseText);

    if (responseObject.status === 'success') {
      (0, _alerts.showAlert)('success', 'Password Changed');
      window.setTimeout(function () {
        window.location.assign('/crew');
      }, 1500);
    } else {
      (0, _alerts.showAlert)('error', responseObject.message, 2);
    }
  };

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    password: password,
    passwordConfirm: passwordConfirm
  }));
};

exports.resetpassword = resetpassword;
},{"./alerts.js":"alerts.js"}],"setting.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMe = void 0;

var _alerts = require("./alerts.js");

var updateMe = function updateMe(fullname, status) {
  var xhr = new XMLHttpRequest();
  xhr.open('PATCH', '/user/setting', true);

  xhr.onload = function () {
    var responseObject = JSON.parse(this.responseText);

    if (responseObject.status === 'success') {
      (0, _alerts.showAlert)('success', 'Updated', 2);
    } else {
      (0, _alerts.showAlert)('error', responseObject.message, 2);
    }
  };

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    fullname: fullname,
    status: status
  }));
};

exports.updateMe = updateMe;
},{"./alerts.js":"alerts.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _alerts = require("./alerts.js");

var _login = require("./login.js");

var _signup = require("./signup.js");

var _logout = require("./logout.js");

var _forgotpassword = require("./forgotpassword.js");

var _resetpassword = require("./resetpassword.js");

var _setting = require("./setting.js");

var loginForm = document.getElementById('login-form');
var signupForm = document.getElementById('signup-form');
var logoutButton = document.getElementById('logout-btn');
var forgotForm = document.getElementById('forgot-form');
var resetForm = document.getElementById('reset-form');
var settingForm = document.getElementById('setting-form');

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    (0, _login.login)(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var fullname = document.getElementById('fullname').value;
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var passwordConfirm = document.getElementById('passwordConfirm').value;
    (0, _signup.signup)(fullname, username, email, password, passwordConfirm);
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    (0, _logout.logout)();
  });
}

if (forgotForm) {
  forgotForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var forgotBtn = document.getElementById('forgot-btn');
    forgotBtn.setAttribute('disabled', 'disabled');
    forgotBtn.innerText = 'Sending...';
    var email = document.getElementById('email').value;
    (0, _forgotpassword.forgotpassword)(email, forgotBtn);
  });
}

if (resetForm) {
  resetForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var password = document.getElementById('password').value;
    var passwordConfirm = document.getElementById('passwordConfirm').value;
    (0, _resetpassword.resetpassword)(password, passwordConfirm);
  });
}

if (settingForm) {
  settingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var fullname = document.getElementById('fullname').value;
    var status = document.getElementById('status').value;
    (0, _setting.updateMe)(fullname, status);
  });
}
},{"./alerts.js":"alerts.js","./login.js":"login.js","./signup.js":"signup.js","./logout.js":"logout.js","./forgotpassword.js":"forgotpassword.js","./resetpassword.js":"resetpassword.js","./setting.js":"setting.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "41885" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/bundle.js.map