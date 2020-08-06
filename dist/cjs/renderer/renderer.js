"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("./node");
var Renderer = /** @class */ (function () {
    function Renderer() {
    }
    Renderer.bootstrap = function (documentOrHtml) {
        if (typeof documentOrHtml === 'string') {
            this.document = node_1.parse(documentOrHtml);
        }
        else {
            this.document = documentOrHtml;
        }
        if (typeof process !== 'undefined') {
            global.document = this.document;
        }
    };
    Renderer.querySelector = function (selector) {
        return this.document.querySelector(selector);
    };
    return Renderer;
}());
exports.default = Renderer;
