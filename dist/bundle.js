/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _controller = __webpack_require__(1);
	
	var _controller2 = _interopRequireDefault(_controller);
	
	var todos = new _controller2['default']();
	
	todos.init();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _helpers = __webpack_require__(2);
	
	var _view = __webpack_require__(3);
	
	var _view2 = _interopRequireDefault(_view);
	
	var _model = __webpack_require__(4);
	
	var _model2 = _interopRequireDefault(_model);
	
	/**
	 * @constant
	 * @type {String}
	 */
	var ALLOWED_VIEWS = 'all|active|completed';
	
	/**
	 * Control the behaviour and flow of the app.
	 * @author Aleksandar Jovanov <ace92bt@gmail.com>
	 * @class
	 * @exports Controller
	 */
	
	var Controller = (function () {
	    function Controller() {
	        _classCallCheck(this, Controller);
	
	        this.model = new _model2['default']();
	        this.view = new _view2['default']();
	    }
	
	    /**
	     * Initialize the app to load the initial view and listen to hash changes.
	     * @author Aleksandar Jovanov <ace92bt@gmail.com>
	     * @public
	     */
	
	    _createClass(Controller, [{
	        key: 'init',
	        value: function init() {
	            var _this = this;
	
	            var findView = function findView(event) {
	                var currentView = 'all';
	
	                if (window.location.hash) {
	                    currentView = window.location.hash.substr(2);
	                }
	
	                _this._setView(currentView);
	            };
	
	            (0, _helpers.$on)('load', window, findView);
	            (0, _helpers.$on)('hashchange', window, findView);
	
	            this._initListeners();
	        }
	
	        /**
	         * Set and render the current active view.
	         * @author Aleksandar Jovanov <ace92bt@gmail.com>
	         * @param {String} [view=all]
	         * @private
	         */
	    }, {
	        key: '_setView',
	        value: function _setView() {
	            var _this2 = this;
	
	            var view = arguments.length <= 0 || arguments[0] === undefined ? 'all' : arguments[0];
	
	            if (view && ALLOWED_VIEWS.includes(view)) {
	
	                this.model.findAll().then(function (data) {
	                    _this2.view.render('list', { view: view, data: data });
	                    _this2.view.render('menu', { view: view });
	                    _this2.activeView = view;
	                    _this2._updateList();
	                })['catch'](function (error) {
	                    console.error(error);
	                });
	            } else {
	                window.location.hash = '#/';
	                this._setView('all');
	            }
	        }
	
	        /**
	         * Initialize the listeners and its appropriate handlers.
	         * @author Aleksandar Jovanov <ace92bt@gmail.com>
	         * @private
	         */
	    }, {
	        key: '_initListeners',
	        value: function _initListeners() {
	            var _this3 = this;
	
	            this.view.on('insert', function (title) {
	                _this3.model.create(title).then(function (item) {
	                    _this3.view.render('insert', { item: item });
	                    _this3._updateList();
	                });
	            });
	
	            this.view.on('toggle', function (id, completed) {
	                _this3.model.update(id, { key: 'completed', value: completed }).then(function (item) {
	                    _this3.view.render('toggle', { item: item });
	                    _this3._updateList();
	                })['catch'](function (error) {
	                    console.log(error);
	                });
	            });
	
	            this.view.on('remove', function (id) {
	                _this3.model.remove(id).then(function () {
	                    _this3.view.render('remove', { id: id });
	                    _this3._updateList();
	                })['catch'](function (error) {
	                    console.log(error);
	                });
	            });
	
	            this.view.on('edit', function (id) {
	                _this3.view.render('edit', { id: id });
	
	                _this3.view.on('save', function (action, id, title) {
	                    if (action === 'save') {
	                        _this3.model.update(id, { key: 'title', value: title }).then(function (item) {
	                            _this3.view.render('save', { item: item });
	                            _this3._updateList();
	                        })['catch'](function (error) {
	                            console.log(error);
	                        });
	                    } else if (action === 'remove') {
	                        _this3.model.remove(id).then(function () {
	                            _this3.view.render('remove', { id: id });
	                            _this3._updateList();
	                        })['catch'](function (error) {
	                            console.log(error);
	                        });
	                    }
	                });
	            });
	
	            this.view.on('toggleAll', function (completed) {
	                _this3.model.update(null, { key: 'completed', value: completed }).then(function () {
	                    _this3.view.render('toggleAll', { completed: completed });
	                    _this3._updateList();
	                });
	            });
	
	            this.view.on('removeCompleted', function () {
	                _this3.model.remove().then(function () {
	                    _this3.view.render('removeCompleted');
	                    _this3._updateList();
	                });
	            });
	        }
	
	        /**
	         * Rerender the list after an action occurs.
	         * @author Aleksandar Jovanov <ace92bt@gmail.com>
	         * @private
	         */
	    }, {
	        key: '_updateList',
	        value: function _updateList() {
	            var _this4 = this;
	
	            var view = this.activeView;
	
	            this.model.findAll().then(function (data) {
	                _this4.view.render('list', { view: view, data: data });
	                _this4.view.render('counter', { data: data });
	            })['catch'](function (error) {
	                console.error(error);
	            });
	        }
	    }]);
	
	    return Controller;
	})();
	
	exports['default'] = Controller;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Find a DOM element.
	 * @author Aleksandar Jovanov <ace92bt@gmail.com>
	 * @param  {String} selector
	 * @return {HTMLElement}
	 * @public
	 */
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var $ = function $(selector) {
	  return document.querySelector(selector);
	};
	
	/**
	 * Add an event listener on a DOM element.
	 * @author Aleksandar Jovanov <ace92bt@gmail.com>
	 * @param  {String} event - The name of an event.
	 * @param  {element} element - The DOM element.
	 * @param  {Function} callback
	 * @public
	 */
	var $on = function $on(event, element, callback) {
	  element.addEventListener(event, callback);
	};
	
	/**
	 * Remove an event listener from a DOM element.
	 * @author Aleksandar Jovanov <ace92bt@gmail.com>
	 * @param  {String} event - The name of an event.
	 * @param  {element} element - The DOM element.
	 * @param  {Function} callback
	 * @public
	 */
	var $off = function $off(event, element, callback) {
	  element.removeEventListener(event, callback);
	};
	
	exports.$ = $;
	exports.$on = $on;
	exports.$off = $off;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _helpers = __webpack_require__(2);
	
	/**
	 * @constant
	 * @type {Object}
	 */
	var KEYBOARD_KEYS = {
	    ENTER: 13,
	    ESC: 27
	};
	
	/**
	 * The view for the app.
	 * @author Aleksandar Jovanov <ace92bt@gmail.com>
	 * @class
	 * @exports View
	 */
	
	var View = (function () {
	    function View() {
	        _classCallCheck(this, View);
	
	        this.itemsContainer = (0, _helpers.$)('.todo-list');
	        this.mainSection = (0, _helpers.$)('.main');
	        this.footerSection = (0, _helpers.$)('.footer');
	        this.toggleAllCheck = (0, _helpers.$)('.toggle-all');
	        this.clearCompleted = (0, _helpers.$)('.clear-completed');
	    }
	
	    /**
	     * Render the view based on a command.
	     * @author Aleksandar Jovanov <ace92bt@gmail.com>
	     * @param  {String} command
	     * @param  {Null|Object} data
	     * @public
	     */
	
	    _createClass(View, [{
	        key: 'render',
	        value: function render(command, data) {
	
	            var ALLOWED_COMMANDS = 'list|insert|toggle|toggleAll|remove|removeCompleted|edit|save|menu|counter';
	
	            if (ALLOWED_COMMANDS.includes(command)) {
	
	                if (command === 'list') {
	                    var view = data.view;
	                    var items = data.data;
	                    var completedItems = 0;
	                    var itemContent = undefined,
	                        itemContainer = undefined;
	
	                    if (items.length > 0) {
	                        this.mainSection.style.display = 'block';
	                        this.footerSection.style.display = 'block';
	                        this.itemsContainer.innerHTML = '';
	
	                        var _iteratorNormalCompletion = true;
	                        var _didIteratorError = false;
	                        var _iteratorError = undefined;
	
	                        try {
	                            for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                                var item = _step.value;
	
	                                if (view === 'active' && item.completed || view === 'completed' && !item.completed) {
	                                    continue;
	                                }
	
	                                itemContainer = document.createElement('li');
	                                itemContainer.setAttribute('data-id', item.id);
	
	                                itemContent = '\n                            <div class="view">\n                                <input class="toggle" type="checkbox">\n                                <label>' + item.title + '</label>\n                                <button class="destroy"></button>\n                            </div>\n                            <input class="edit" value="' + item.title + '">\n                        ';
	
	                                itemContainer.innerHTML = itemContent;
	
	                                if (item.completed) {
	                                    var toggle = itemContainer.querySelector('.toggle');
	                                    toggle.setAttribute('checked', true);
	                                    itemContainer.className = 'completed';
	                                    completedItems++;
	                                }
	
	                                this.itemsContainer.appendChild(itemContainer);
	                            }
	                        } catch (err) {
	                            _didIteratorError = true;
	                            _iteratorError = err;
	                        } finally {
	                            try {
	                                if (!_iteratorNormalCompletion && _iterator['return']) {
	                                    _iterator['return']();
	                                }
	                            } finally {
	                                if (_didIteratorError) {
	                                    throw _iteratorError;
	                                }
	                            }
	                        }
	
	                        if (completedItems > 0) {
	                            this.clearCompleted.style.display = 'block';
	                        } else {
	                            this.clearCompleted.style.display = 'none';
	                        }
	
	                        if (completedItems === items.length) {
	                            this.toggleAllCheck.checked = true;
	                        }
	                    } else {
	                        this.mainSection.style.display = 'none';
	                        this.footerSection.style.display = 'none';
	                    }
	                } else if (command === 'insert') {
	                    var item = data.item;
	                    var itemContainer = document.createElement('li');
	                    var itemsLength = this.itemsContainer.children.length;
	                    var itemContent = undefined;
	
	                    itemContainer.setAttribute('data-id', item.id);
	
	                    itemContent = '\n                    <div class="view">\n                        <input class="toggle" type="checkbox">\n                        <label>' + item.title + '</label>\n                        <button class="destroy"></button>\n                    </div>\n                    <input class="edit" value="' + item.title + '">\n                ';
	
	                    itemContainer.innerHTML = itemContent;
	
	                    (0, _helpers.$)('.new-todo').value = '';
	
	                    if (itemsLength === 0) {
	                        this.mainSection.style.display = 'block';
	                        this.footerSection.style.display = 'block';
	                    }
	
	                    this.itemsContainer.appendChild(itemContainer);
	                    this.toggleAllCheck.checked = false;
	                } else if (command === 'toggle') {
	                    var item = data.item;
	                    var itemContainer = document.activeElement.parentNode;
	                    var itemsLength = this.itemsContainer.children.length;
	                    var completedItemsLength = undefined;
	
	                    while (itemContainer.tagName !== 'LI') {
	                        itemContainer = itemContainer.parentNode;
	                    }
	
	                    itemContainer.classList.toggle('completed');
	
	                    completedItemsLength = document.querySelectorAll('.completed').length;
	
	                    if (itemsLength === completedItemsLength) {
	                        this.toggleAllCheck.checked = true;
	                    } else {
	                        this.toggleAllCheck.checked = false;
	                    }
	
	                    if (completedItemsLength === 0) {
	                        this.clearCompleted.style.display = 'none';
	                    } else {
	                        this.clearCompleted.style.display = 'block';
	                    }
	                } else if (command === 'remove') {
	                    var itemContainer = document.activeElement.parentNode;
	                    var completedItemsLength = undefined;
	
	                    while (itemContainer.tagName !== 'LI') {
	                        itemContainer = itemContainer.parentNode;
	                    }
	
	                    this.itemsContainer.removeChild(itemContainer);
	                    completedItemsLength = document.querySelectorAll('.completed').length;
	
	                    if (completedItemsLength === 0) {
	                        this.clearCompleted.style.display = 'none';
	                        this.toggleAllCheck.checked = false;
	                    }
	
	                    if (this.itemsContainer.children.length === 0) {
	                        this.mainSection.style.display = 'none';
	                        this.footerSection.style.display = 'none';
	                    }
	                } else if (command === 'edit') {
	                    var id = data.id;
	                    var itemContainer = (0, _helpers.$)('[data-id="' + id + '"');
	                    var itemEditContainer = undefined;
	
	                    itemEditContainer = itemContainer.querySelector('.edit');
	
	                    itemContainer.classList.add('editing');
	
	                    itemEditContainer.focus();
	
	                    // Set caret position to the end of the input field.
	                    if (itemEditContainer.createTextRange) {
	                        // IE
	                        var fieldRange = itemEditContainer.createTextRange();
	                        fieldRange.moveStart('character', itemEditContainer.value.length);
	                        fieldRange.collapse();
	                        fieldRange.select();
	                    } else {
	                        // Firefox and Opera
	                        var _length = itemEditContainer.value.length;
	                        itemEditContainer.setSelectionRange(_length, _length);
	                    }
	                } else if (command === 'save') {
	                    var item = data.item;
	                    var itemContainer = (0, _helpers.$)('[data-id="' + item.id + '"');
	                    var itemEditContainer = itemContainer.querySelector('.edit');
	                    var label = itemContainer.querySelector('label');
	
	                    itemEditContainer.value = item.title;
	                    label.textContent = item.title;
	                    itemContainer.classList.remove('editing');
	                } else if (command === 'toggleAll') {
	                    var completed = data.completed;
	
	                    if (completed) {
	                        var _iteratorNormalCompletion2 = true;
	                        var _didIteratorError2 = false;
	                        var _iteratorError2 = undefined;
	
	                        try {
	                            for (var _iterator2 = this.itemsContainer.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                                var item = _step2.value;
	
	                                var checker = item.querySelector('.toggle');
	                                item.classList.add('completed');
	                                checker.setAttribute('checked', true);
	                            }
	                        } catch (err) {
	                            _didIteratorError2 = true;
	                            _iteratorError2 = err;
	                        } finally {
	                            try {
	                                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                                    _iterator2['return']();
	                                }
	                            } finally {
	                                if (_didIteratorError2) {
	                                    throw _iteratorError2;
	                                }
	                            }
	                        }
	
	                        this.clearCompleted.style.display = 'block';
	                    } else {
	                        var _iteratorNormalCompletion3 = true;
	                        var _didIteratorError3 = false;
	                        var _iteratorError3 = undefined;
	
	                        try {
	                            for (var _iterator3 = this.itemsContainer.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                                var item = _step3.value;
	
	                                var checker = item.querySelector('.toggle');
	                                item.classList.remove('completed');
	                                checker.setAttribute('checked', false);
	                            }
	                        } catch (err) {
	                            _didIteratorError3 = true;
	                            _iteratorError3 = err;
	                        } finally {
	                            try {
	                                if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	                                    _iterator3['return']();
	                                }
	                            } finally {
	                                if (_didIteratorError3) {
	                                    throw _iteratorError3;
	                                }
	                            }
	                        }
	
	                        this.clearCompleted.style.display = 'none';
	                    }
	                } else if (command === 'removeCompleted') {
	                    var completedItems = document.querySelectorAll('.completed');
	
	                    var _iteratorNormalCompletion4 = true;
	                    var _didIteratorError4 = false;
	                    var _iteratorError4 = undefined;
	
	                    try {
	                        for (var _iterator4 = completedItems[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                            var item = _step4.value;
	
	                            this.itemsContainer.removeChild(item);
	                        }
	                    } catch (err) {
	                        _didIteratorError4 = true;
	                        _iteratorError4 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion4 && _iterator4['return']) {
	                                _iterator4['return']();
	                            }
	                        } finally {
	                            if (_didIteratorError4) {
	                                throw _iteratorError4;
	                            }
	                        }
	                    }
	
	                    this.toggleAllCheck.checked = false;
	                    this.clearCompleted.style.display = 'none';
	
	                    if (this.itemsContainer.children.length === 0) {
	                        this.mainSection.style.display = 'none';
	                        this.footerSection.style.display = 'none';
	                    }
	                } else if (command === 'menu') {
	                    var view = data.view;
	                    var activeFilter = (0, _helpers.$)('.selected');
	
	                    activeFilter.classList.remove('selected');
	
	                    if (view === 'all') {
	                        (0, _helpers.$)('[href="#/"').classList.add('selected');
	                    } else {
	                        (0, _helpers.$)('[href="#/' + view + '"').classList.add('selected');
	                    }
	                } else if (command === 'counter') {
	                    var items = data.data;
	                    var itemsCount = (0, _helpers.$)('.todo-count');
	                    var activeItems = 0;
	
	                    var _iteratorNormalCompletion5 = true;
	                    var _didIteratorError5 = false;
	                    var _iteratorError5 = undefined;
	
	                    try {
	                        for (var _iterator5 = items[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                            var item = _step5.value;
	
	                            if (!item.completed) {
	                                activeItems++;
	                            }
	                        }
	                    } catch (err) {
	                        _didIteratorError5 = true;
	                        _iteratorError5 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion5 && _iterator5['return']) {
	                                _iterator5['return']();
	                            }
	                        } finally {
	                            if (_didIteratorError5) {
	                                throw _iteratorError5;
	                            }
	                        }
	                    }
	
	                    if (activeItems === 1) {
	                        itemsCount.innerHTML = '<strong>' + activeItems + '</strong> item left';
	                    } else {
	                        itemsCount.innerHTML = '<strong>' + activeItems + '</strong> items left';
	                    }
	                }
	            }
	        }
	
	        /**
	         * Set up event listener based on a command.
	         * @author Aleksandar Jovanov <ace92bt@gmail.com>
	         * @param  {String}   [command=unknown]
	         * @param  {Function} callback
	         * @public
	         */
	    }, {
	        key: 'on',
	        value: function on(command, callback) {
	            var _this = this;
	
	            if (command === undefined) command = 'unknown';
	
	            var ALLOWED_COMMANDS = 'insert|remove|removeCompleted|edit|toggle|toggleAll|filter|save';
	
	            if (ALLOWED_COMMANDS.includes(command)) {
	
	                if (command === 'insert') {
	                    (function () {
	                        var input = (0, _helpers.$)('.new-todo');
	
	                        var _insertCallback = function _insertCallback(event) {
	                            var inputValue = input.value.trim();
	
	                            if ((event.keyCode === KEYBOARD_KEYS.ENTER || event.type === 'blur') && inputValue !== '') {
	                                callback(inputValue);
	                            }
	                        };
	
	                        (0, _helpers.$on)('keydown', input, _insertCallback);
	                        (0, _helpers.$on)('blur', input, _insertCallback);
	                    })();
	                } else if (command === 'toggle') {
	                    (0, _helpers.$on)('click', this.itemsContainer, function (event) {
	
	                        var target = event.target;
	
	                        if (target.className === 'toggle') {
	                            var itemContainer = target.parentNode;
	
	                            while (itemContainer.tagName !== 'LI') {
	                                itemContainer = itemContainer.parentNode;
	                            }
	
	                            var id = itemContainer.getAttribute('data-id');
	
	                            if (target.getAttribute('checked')) {
	                                target.removeAttribute('checked');
	                                callback(id, false);
	                            } else {
	                                target.setAttribute('checked', 'true');
	                                callback(id, true);
	                            }
	                        }
	                    });
	                } else if (command === 'remove') {
	                    (0, _helpers.$on)('click', this.itemsContainer, function (event) {
	                        var target = event.target;
	
	                        if (target.className === 'destroy') {
	                            var itemContainer = target.parentNode;
	
	                            while (itemContainer.tagName !== 'LI') {
	                                itemContainer = itemContainer.parentNode;
	                            }
	
	                            var id = itemContainer.getAttribute('data-id');
	
	                            callback(id);
	                        }
	                    });
	                } else if (command === 'edit') {
	                    (0, _helpers.$on)('dblclick', this.itemsContainer, function (event) {
	                        var target = event.target;
	
	                        if (target.tagName === 'LABEL') {
	                            var itemContainer = target.parentNode;
	
	                            while (itemContainer.tagName !== 'LI') {
	                                itemContainer = itemContainer.parentNode;
	                            }
	
	                            var id = itemContainer.getAttribute('data-id');
	                            callback(id);
	                        }
	                    });
	                } else if (command === 'save') {
	                    (function () {
	                        var itemEditContainer = document.activeElement;
	                        var itemContainer = itemEditContainer.parentNode;
	                        var originalValue = itemEditContainer.value;
	
	                        var _updateCallback = function _updateCallback(event) {
	                            var inputValue = itemEditContainer.value.trim();
	
	                            if (event.keyCode === KEYBOARD_KEYS.ENTER || event.type === 'blur') {
	                                var id = itemContainer.getAttribute('data-id');
	
	                                if (inputValue !== '') {
	                                    callback('save', id, inputValue);
	                                } else {
	                                    callback('remove', id, inputValue);
	                                }
	
	                                (0, _helpers.$off)('keydown', itemEditContainer, _updateCallback);
	                                (0, _helpers.$off)('blur', itemEditContainer, _updateCallback);
	                            } else if (event.keyCode === KEYBOARD_KEYS.ESC) {
	                                itemContainer.classList.remove('editing');
	                                itemEditContainer.value = originalValue;
	
	                                (0, _helpers.$off)('keydown', itemEditContainer, _updateCallback);
	                                (0, _helpers.$off)('blur', itemEditContainer, _updateCallback);
	                            }
	                        };
	
	                        (0, _helpers.$on)('keydown', itemEditContainer, _updateCallback);
	                        (0, _helpers.$on)('blur', itemEditContainer, _updateCallback);
	                    })();
	                } else if (command === 'toggleAll') {
	                    (0, _helpers.$on)('click', this.toggleAllCheck, function (event) {
	                        if (_this.toggleAllCheck.checked) {
	                            callback(true);
	                        } else {
	                            callback(false);
	                        }
	                    });
	                } else if (command === 'removeCompleted') {
	                    (0, _helpers.$on)('click', this.clearCompleted, function (event) {
	                        callback();
	                    });
	                }
	            } else {
	                throw new Error('Unknown provided command.');
	            }
	        }
	    }]);
	
	    return View;
	})();
	
	exports['default'] = View;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * The model for the app.
	 * @author Aleksandar Jovanov <ace92bt@gmail.com>
	 * @class
	 * @exports Model
	 */
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var Model = (function () {
	    function Model() {
	        _classCallCheck(this, Model);
	
	        this.data = {
	            todos: []
	        };
	
	        var storage = window.localStorage.getItem('todos-es6');
	
	        if (storage) {
	            this.data.todos = JSON.parse(storage);
	        }
	    }
	
	    /**
	     * Find all stored todos.
	     * @author Aleksandar Jovanov <ace92bt@gmail.com>
	     * @return {Promise} promise
	     * @public
	     */
	
	    _createClass(Model, [{
	        key: 'findAll',
	        value: function findAll() {
	            var _this = this;
	
	            var promise = new Promise(function (resolve, reject) {
	                if (_this.data.todos) {
	                    resolve(_this.data.todos);
	                } else {
	                    reject('No todos found.');
	                }
	            });
	
	            return promise;
	        }
	
	        /**
	         * Create a todo in the storage.
	         * @author Aleksandar Jovanov <ace92bt@gmail.com>
	         * @param  {String} title
	         * @return {Promise} promise
	         * @public
	         */
	    }, {
	        key: 'create',
	        value: function create(title) {
	            var _this2 = this;
	
	            var promise = new Promise(function (resolve, reject) {
	                var id = new Date().getTime().toString();
	                var item = { id: id, title: title, completed: false };
	                _this2.data.todos.push(item);
	                _this2._updateLocalStorage();
	                resolve(item);
	            });
	
	            return promise;
	        }
	
	        /**
	         * Update the storage based on the specified ids.
	         * @author Aleksandar Jovanov <ace92bt@gmail.com>
	         * @param  {String|Array} id
	         * @param  {Object} data - The data to update.
	         * @return {Promise} promise
	         */
	    }, {
	        key: 'update',
	        value: function update(id, data) {
	            var _this3 = this;
	
	            var promise = new Promise(function (resolve, reject) {
	                if (id) {
	                    var items = _this3.data.todos.filter(function (item) {
	                        if (item.id === id) {
	                            item[data.key] = data.value;
	                            return true;
	                        }
	                    });
	
	                    if (items.length === 1) {
	                        var _items = _slicedToArray(items, 1);
	
	                        var first = _items[0];
	
	                        _this3._updateLocalStorage();
	                        resolve(first);
	                    } else {
	                        reject('Todo not found.');
	                    }
	                } else {
	                    var _iteratorNormalCompletion = true;
	                    var _didIteratorError = false;
	                    var _iteratorError = undefined;
	
	                    try {
	                        for (var _iterator = _this3.data.todos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                            var item = _step.value;
	
	                            item.completed = data.value;
	                        }
	                    } catch (err) {
	                        _didIteratorError = true;
	                        _iteratorError = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion && _iterator['return']) {
	                                _iterator['return']();
	                            }
	                        } finally {
	                            if (_didIteratorError) {
	                                throw _iteratorError;
	                            }
	                        }
	                    }
	
	                    _this3._updateLocalStorage();
	                    resolve();
	                }
	            });
	
	            return promise;
	        }
	
	        /**
	         * Remove a todo from the storage.
	         * @author Aleksandar Jovanov <ace92bt@gmail.com>
	         * @param {String} id
	         * @return {Promise} promise
	         * @public
	         */
	    }, {
	        key: 'remove',
	        value: function remove(id) {
	            var _this4 = this;
	
	            var promise = new Promise(function (resolve, reject) {
	                if (id) {
	                    var items = _this4.data.todos.filter(function (item, i) {
	                        if (item.id === id) {
	                            _this4.data.todos.splice(i, 1);
	                            return true;
	                        }
	                    });
	
	                    if (items.length === 1) {
	                        _this4._updateLocalStorage();
	                        resolve();
	                    } else {
	                        reject('Todo not found.');
	                    }
	                } else {
	                    var i = _this4.data.todos.length;
	
	                    while (i--) {
	                        if (_this4.data.todos[i].completed) {
	                            _this4.data.todos.splice(i, 1);
	                        }
	                    }
	
	                    _this4._updateLocalStorage();
	                    resolve();
	                }
	            });
	
	            return promise;
	        }
	
	        /**
	         * Update the local storage.
	         * @author Aleksandar Jovanov <ace92bt@gmail.com>
	         * @private
	         */
	    }, {
	        key: '_updateLocalStorage',
	        value: function _updateLocalStorage() {
	            window.localStorage.setItem('todos-es6', JSON.stringify(this.data.todos));
	        }
	    }]);
	
	    return Model;
	})();
	
	exports['default'] = Model;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map