!function t(e,o,n){function r(i,c){if(!o[i]){if(!e[i]){var f="function"==typeof require&&require;if(!c&&f)return f(i,!0);if(u)return u(i,!0);var l=new Error("Cannot find module '"+i+"'");throw l.code="MODULE_NOT_FOUND",l}var a=o[i]={exports:{}};e[i][0].call(a.exports,function(t){var o=e[i][1][t];return r(o?o:t)},a,a.exports,t,e,o,n)}return o[i].exports}for(var u="function"==typeof require&&require,i=0;i<n.length;i++)r(n[i]);return r}({1:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}var r=t("./tls_check"),u=n(r);!function(){u["default"]()}()},{"./tls_check":3}],2:[function(t,e,o){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o["default"]={domain:"lorefnon.me"}},{}],3:[function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}function r(){location.host==i["default"].domain?"https:"!==location.protocol&&(location.protocol="https"):location.host.match(/^localhost:\d+$/)||(location.href="https://"+i["default"].domain)}Object.defineProperty(o,"__esModule",{value:!0}),o["default"]=r;var u=t("./settings"),i=n(u)},{"./settings":2}]},{},[1]);