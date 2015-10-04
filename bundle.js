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
	
	var _controllersTodos = __webpack_require__(1);
	
	var _controllersTodos2 = _interopRequireDefault(_controllersTodos);
	
	var app = new _controllersTodos2['default']();
	
	app.init();

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
	
	var _utilitiesDom = __webpack_require__(2);
	
	var _utilitiesDom2 = _interopRequireDefault(_utilitiesDom);
	
	var _utilitiesDomSelector = __webpack_require__(3);
	
	var _utilitiesDomSelector2 = _interopRequireDefault(_utilitiesDomSelector);
	
	var _modelTodo = __webpack_require__(4);
	
	var _modelTodo2 = _interopRequireDefault(_modelTodo);
	
	var _servicesTodos = __webpack_require__(5);
	
	var _servicesTodos2 = _interopRequireDefault(_servicesTodos);
	
	var _utilitiesKeyboardKeys = __webpack_require__(6);
	
	var _utilitiesKeyboardKeys2 = _interopRequireDefault(_utilitiesKeyboardKeys);
	
	var STORAGE_KEY = 'todos-es6';
	
	var Todos = (function () {
		function Todos() {
			_classCallCheck(this, Todos);
	
			this.todosService = new _servicesTodos2['default']();
			this.currentFilter = 'all';
	
			this.itemsContainer = (0, _utilitiesDomSelector2['default'])('.todo-list');
			this.mainSection = (0, _utilitiesDomSelector2['default'])('.main');
			this.footerSection = (0, _utilitiesDomSelector2['default'])('.footer');
			this.toggleAllCheck = (0, _utilitiesDomSelector2['default'])('.toggle-all');
			this.clearCompleted = (0, _utilitiesDomSelector2['default'])('.clear-completed');
			this.filters = (0, _utilitiesDomSelector2['default'])('.filters');
		}
	
		_createClass(Todos, [{
			key: 'init',
			value: function init() {
				this._initListeners();
				this._setCurrentRoute();
				this._setFilterButtonClass();
	
				if (this.todosService.getItems().length > 0) {
					(0, _utilitiesDom2['default'])().showSections(this.mainSection, this.footerSection);
					this._renderItems(this.currentRoute);
					this._updateActiveItemsCounter();
				} else {
					(0, _utilitiesDom2['default'])(this.clearCompleted).hide();
				}
			}
		}, {
			key: '_setFilterButtonClass',
			value: function _setFilterButtonClass() {
				var activeFilter = this.filters.querySelector('.selected');
	
				if (this.currentRoute !== 'all') {
					activeFilter.classList.remove('selected');
	
					if (this.currentRoute === 'active') {
						this.filters.children[1].firstElementChild.classList.add('selected');
					} else if (this.currentRoute === 'completed') {
						this.filters.children[2].firstElementChild.classList.add('selected');
					}
				}
			}
		}, {
			key: '_setCurrentRoute',
			value: function _setCurrentRoute() {
				if (window.location.hash.indexOf('active') > -1) {
					this.currentRoute = 'active';
				} else if (window.location.hash.indexOf('completed') > -1) {
					this.currentRoute = 'completed';
				} else {
					this.currentRoute = 'all';
				}
			}
		}, {
			key: '_renderItems',
			value: function _renderItems() {
				var filter = arguments.length <= 0 || arguments[0] === undefined ? 'all' : arguments[0];
	
				var items = this.todosService.getItems();
				var completedItems = 0;
				var itemContent = undefined,
				    itemContainer = undefined;
	
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;
	
				try {
					for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var item = _step.value;
	
						if (filter === 'active' && item.completed || filter === 'completed' && !item.completed) {
							continue;
						}
	
						itemContent = '\n\t\t\t\t<div class="view">\n\t\t\t\t\t<input class="toggle" type="checkbox">\n\t\t\t\t\t<label>' + item.title + '</label>\n\t\t\t\t\t<button class="destroy"></button>\n\t\t\t\t</div>\n\t\t\t\t<input class="edit" value="' + item.title + '">\n\t\t\t';
						itemContainer = document.createElement('li');
	
						itemContainer.innerHTML = itemContent;
						itemContainer.setAttribute('data-id', item.id);
	
						if (item.completed) {
							var toggle = itemContainer.querySelector('.toggle');
							toggle.checked = true;
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
					(0, _utilitiesDom2['default'])(this.clearCompleted).show();
				} else {
					(0, _utilitiesDom2['default'])(this.clearCompleted).hide();
				}
	
				if (completedItems === items.length) {
					this.toggleAllCheck.checked = true;
				}
			}
		}, {
			key: '_initListeners',
			value: function _initListeners() {
				var _this = this;
	
				var input = (0, _utilitiesDomSelector2['default'])('.new-todo');
				var itemsList = (0, _utilitiesDomSelector2['default'])('.todo-list');
	
				(0, _utilitiesDom2['default'])(input).on('keydown', _insertCallback.bind(this));
				(0, _utilitiesDom2['default'])(input).on('blur', _insertCallback.bind(this));
	
				function _insertCallback(event) {
					var inputValue = input.value.trim();
	
					if ((event.keyCode === _utilitiesKeyboardKeys2['default'].ENTER || event.type === 'blur') && inputValue !== '') {
						var id = new Date().getTime();
						var title = inputValue;
	
						this.todosService.insert(id, title);
						this._clearInput(input);
	
						if ((0, _utilitiesDom2['default'])().areSectionsHidden()) {
							(0, _utilitiesDom2['default'])().showSections(this.mainSection, this.footerSection);
						}
	
						this._updateActiveItemsCounter();
						this._filterList(this.currentFilter);
					}
				}
	
				(0, _utilitiesDom2['default'])(itemsList).on('click', function (event) {
	
					var target = event.target;
	
					if (target.className === 'toggle') {
						_this.todosService.toggleItem(target);
						_this._updateActiveItemsCounter();
						_this._filterList(_this.currentFilter);
					} else if (target.className === 'destroy') {
						_this.todosService.remove(target);
						_this._updateActiveItemsCounter();
						_this._filterList(_this.currentFilter);
					}
				});
	
				(0, _utilitiesDom2['default'])(itemsList).on('dblclick', function (event) {
	
					var target = event.target;
	
					if (target.tagName === 'LABEL') {
						_this.todosService.updateTitle(target);
						// TODO: Filter the list after the action occurs.
						// this._filterList(this.currentFilter);
					}
				});
	
				(0, _utilitiesDom2['default'])(this.toggleAllCheck).on('click', function (event) {
	
					if (_this.toggleAllCheck.checked) {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;
	
						try {
	
							for (var _iterator2 = _this.todosService.getItems()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var item = _step2.value;
	
								item.completed = true;
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
	
						var _iteratorNormalCompletion3 = true;
						var _didIteratorError3 = false;
						var _iteratorError3 = undefined;
	
						try {
							for (var _iterator3 = _this.itemsContainer.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var item = _step3.value;
	
								var checker = item.querySelector('.toggle');
								item.className = 'completed';
								checker.checked = true;
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
	
						(0, _utilitiesDom2['default'])(_this.clearCompleted).show();
					} else {
						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;
	
						try {
	
							for (var _iterator4 = _this.todosService.getItems()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								var item = _step4.value;
	
								item.completed = false;
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
	
						var _iteratorNormalCompletion5 = true;
						var _didIteratorError5 = false;
						var _iteratorError5 = undefined;
	
						try {
							for (var _iterator5 = _this.itemsContainer.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
								var item = _step5.value;
	
								var checker = item.querySelector('.toggle');
								item.className = '';
								checker.checked = false;
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
	
						(0, _utilitiesDom2['default'])(_this.clearCompleted).hide();
					}
	
					_this._updateActiveItemsCounter();
					_this._updateLocalStorage();
					_this._filterList(_this.currentFilter);
				});
	
				(0, _utilitiesDom2['default'])(this.clearCompleted).on('click', function (event) {
	
					var i = _this.todosService.getItems().length;
	
					while (i--) {
						if (_this.todosService.getItems()[i].completed) {
							var itemToRemove = _this.itemsContainer.children[i];
	
							_this.todosService.getItems().splice(i, 1);
	
							if (_this.currentFilter === 'all') {
								_this.itemsContainer.removeChild(itemToRemove);
							}
						}
					}
	
					if (_this.currentFilter === 'completed') {
	
						// Empty the entire list of items.
						while (_this.itemsContainer.firstChild) {
							_this.itemsContainer.removeChild(_this.itemsContainer.firstChild);
						}
					}
	
					_this.toggleAllCheck.checked = false;
					(0, _utilitiesDom2['default'])(_this.clearCompleted).hide();
	
					if (_this.todosService.getItems().length === 0) {
						(0, _utilitiesDom2['default'])().hideSections(_this.mainSection, _this.footerSection);
					}
	
					_this._updateLocalStorage();
					_this._filterList(_this.currentFilter);
				});
	
				(0, _utilitiesDom2['default'])(this.filters).on('click', function (event) {
					var chosenFilter = event.target;
					var activeFilter = _this.filters.querySelector('.selected');
	
					if (chosenFilter !== activeFilter) {
						activeFilter.classList.remove('selected');
						chosenFilter.classList.add('selected');
	
						if (chosenFilter.href.indexOf('active') > -1) {
							_this._filterList('active');
						} else if (chosenFilter.href.indexOf('completed') > -1) {
							_this._filterList('completed');
						} else {
							_this._filterList('all');
						}
					}
				});
			}
		}, {
			key: '_clearInput',
			value: function _clearInput(input) {
				input.value = '';
			}
		}, {
			key: '_updateActiveItemsCounter',
			value: function _updateActiveItemsCounter() {
	
				var itemsCount = (0, _utilitiesDomSelector2['default'])('.todo-count');
				var activeItems = 0;
	
				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;
	
				try {
					for (var _iterator6 = this.todosService.getItems()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						var item = _step6.value;
	
						if (!item.completed) {
							activeItems++;
						}
					}
				} catch (err) {
					_didIteratorError6 = true;
					_iteratorError6 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion6 && _iterator6['return']) {
							_iterator6['return']();
						}
					} finally {
						if (_didIteratorError6) {
							throw _iteratorError6;
						}
					}
				}
	
				if (activeItems === 1) {
					itemsCount.innerHTML = '<strong>' + activeItems + '</strong> item left';
				} else {
					itemsCount.innerHTML = '<strong>' + activeItems + '</strong> items left';
				}
			}
		}, {
			key: '_filterList',
			value: function _filterList(filter) {
	
				var items = this.todosService.getItems();
	
				// Empty the entire list of items.
				while (this.itemsContainer.firstChild) {
					this.itemsContainer.removeChild(this.itemsContainer.firstChild);
				}
	
				switch (filter) {
					case 'all':
						this._renderItems();
						this.currentFilter = 'all';
						break;
					case 'active':
						this._renderItems('active');
						this.currentFilter = 'active';
						break;
					case 'completed':
						this._renderItems('completed');
						this.currentFilter = 'completed';
						break;
					default:
						break;
				}
	
				// this._updateActiveItemsCounter();
			}
		}, {
			key: '_updateLocalStorage',
			value: function _updateLocalStorage() {
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todosService.getItems()));
			}
		}]);
	
		return Todos;
	})();
	
	exports['default'] = Todos;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	var Dom = function Dom(element) {
	
		var sectionsHidden = true;
	
		return {
			on: function on(event, callback) {
				if (element && element instanceof HTMLElement) {
					element.addEventListener(event, callback);
				} else {
					throw new Error('Element does not exist.');
				}
			},
			off: function off(event, callback) {
				if (element && element instanceof HTMLElement) {
					element.removeEventListener(event, callback);
				} else {
					throw new Error('Element does not exist.');
				}
			},
			hide: function hide() {
				if (element) {
					element.style.display = 'none';
				} else {
					throw new Error('Element does not exist.');
				}
			},
			show: function show() {
				if (element) {
					element.style.display = 'block';
				} else {
					throw new Error('Element does not exist.');
				}
			},
			hideSections: function hideSections() {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;
	
				try {
					for (var _len = arguments.length, sections = Array(_len), _key = 0; _key < _len; _key++) {
						sections[_key] = arguments[_key];
					}
	
					for (var _iterator = sections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var section = _step.value;
	
						Dom(section).hide();
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
	
				sectionsHidden = true;
			},
			showSections: function showSections() {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;
	
				try {
					for (var _len2 = arguments.length, sections = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
						sections[_key2] = arguments[_key2];
					}
	
					for (var _iterator2 = sections[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var section = _step2.value;
	
						Dom(section).show();
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
	
				sectionsHidden = false;
			},
			areSectionsHidden: function areSectionsHidden() {
				return sectionsHidden;
			}
		};
	};
	
	exports['default'] = Dom;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var $ = function $(selector) {
		return document.querySelector(selector);
	};
	
	exports["default"] = $;
	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Todo = function Todo(id, title) {
		var completed = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
		_classCallCheck(this, Todo);
	
		this.id = id;
		this.title = title;
		this.completed = completed;
	};
	
	exports["default"] = Todo;
	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _modelTodo = __webpack_require__(4);
	
	var _modelTodo2 = _interopRequireDefault(_modelTodo);
	
	var _utilitiesDom = __webpack_require__(2);
	
	var _utilitiesDom2 = _interopRequireDefault(_utilitiesDom);
	
	var _utilitiesDomSelector = __webpack_require__(3);
	
	var _utilitiesDomSelector2 = _interopRequireDefault(_utilitiesDomSelector);
	
	var _utilitiesKeyboardKeys = __webpack_require__(6);
	
	var _utilitiesKeyboardKeys2 = _interopRequireDefault(_utilitiesKeyboardKeys);
	
	var STORAGE_KEY = 'todos-es6';
	
	var Todos = (function () {
		function Todos() {
			_classCallCheck(this, Todos);
	
			this.items = [];
	
			this.itemsContainer = (0, _utilitiesDomSelector2['default'])('.todo-list');
			this.mainSection = (0, _utilitiesDomSelector2['default'])('.main');
			this.footerSection = (0, _utilitiesDomSelector2['default'])('.footer');
			this.toggleAllCheck = (0, _utilitiesDomSelector2['default'])('.toggle-all');
			this.clearCompleted = (0, _utilitiesDomSelector2['default'])('.clear-completed');
	
			var localItems = window.localStorage.getItem(STORAGE_KEY);
	
			if (localItems) {
				this.items = JSON.parse(localItems);
			}
		}
	
		_createClass(Todos, [{
			key: 'getItems',
			value: function getItems() {
				return this.items;
			}
		}, {
			key: 'insert',
			value: function insert(id, title) {
	
				var todo = new _modelTodo2['default'](id, title);
				var itemContent = '\n\t\t\t<div class="view">\n\t\t\t\t<input class="toggle" type="checkbox">\n\t\t\t\t<label>' + title + '</label>\n\t\t\t\t<button class="destroy"></button>\n\t\t\t</div>\n\t\t\t<input class="edit" value="' + title + '">\n\t\t';
				var itemContainer = document.createElement('li');
	
				itemContainer.innerHTML = itemContent;
				itemContainer.setAttribute('data-id', id);
	
				this.items.push(todo);
				this.itemsContainer.appendChild(itemContainer);
				this._updateLocalStorage();
			}
		}, {
			key: 'toggleItem',
			value: function toggleItem(target) {
	
				var itemContainer = target.parentNode;
				var itemsLength = this.items.length;
				var itemsCompletedCounter = 0;
	
				while (itemContainer.tagName !== 'LI') {
					itemContainer = itemContainer.parentNode;
				}
	
				if (itemContainer.className) {
					if (itemContainer.className === 'completed') {
						itemContainer.className = '';
					} else {
						itemContainer.className = 'completed';
					}
				} else {
					itemContainer.className = 'completed';
				}
	
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;
	
				try {
					for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var item = _step.value;
	
						var itemContainerId = Number.parseInt(itemContainer.getAttribute('data-id'), 10);
	
						if (item.id === itemContainerId) {
							item.completed = item.completed ? false : true;
						}
	
						if (item.completed) {
							itemsCompletedCounter++;
						}
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
	
				this._updateLocalStorage();
	
				if (itemsLength === itemsCompletedCounter) {
					this.toggleAllCheck.checked = true;
				} else {
					this.toggleAllCheck.checked = false;
				}
	
				if (itemsCompletedCounter === 0) {
					(0, _utilitiesDom2['default'])(this.clearCompleted).hide();
				} else {
					(0, _utilitiesDom2['default'])(this.clearCompleted).show();
				}
			}
		}, {
			key: 'remove',
			value: function remove(target) {
	
				var itemContainer = target.parentNode;
				var i = this.items.length;
				var itemContainerId = undefined;
				var itemsCompletedCounter = 0;
	
				while (itemContainer.tagName !== 'LI') {
					itemContainer = itemContainer.parentNode;
				}
	
				itemContainerId = Number.parseInt(itemContainer.getAttribute('data-id'), 10);
	
				while (i--) {
					if (this.items[i].id === itemContainerId) {
						var itemToRemove = this.itemsContainer.children[i];
	
						this.items.splice(i, 1);
						this.itemsContainer.removeChild(itemToRemove);
						break;
					}
				}
	
				this._updateLocalStorage();
	
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;
	
				try {
					for (var _iterator2 = this.items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var item = _step2.value;
	
						if (item.completed) {
							itemsCompletedCounter++;
						}
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
	
				if (itemsCompletedCounter === 0) {
					(0, _utilitiesDom2['default'])(this.clearCompleted).hide();
					this.toggleAllCheck.checked = false;
				}
	
				if (this.items.length === 0) {
					(0, _utilitiesDom2['default'])().hideSections(this.mainSection, this.footerSection);
				}
			}
		}, {
			key: 'updateTitle',
			value: function updateTitle(target) {
				var _this = this;
	
				var itemContainer = target.parentNode;
				var originalValue = target.textContent;
				var itemEditContainer = undefined,
				    inputValue = undefined;
	
				while (itemContainer.tagName !== 'LI') {
					itemContainer = itemContainer.parentNode;
				}
	
				itemEditContainer = itemContainer.querySelector('.edit');
	
				if (itemContainer.className && itemContainer.className === 'completed') {
					itemContainer.className = 'completed editing';
				} else {
					itemContainer.className = 'editing';
				}
	
				itemEditContainer.focus();
				this._setCaretEnd(itemEditContainer);
	
				var _updateCallback = function _updateCallback(event) {
					inputValue = itemEditContainer.value.trim();
	
					if (event.keyCode === _utilitiesKeyboardKeys2['default'].ENTER || event.type === 'blur') {
						var itemContainerId = Number.parseInt(itemContainer.getAttribute('data-id'), 10);
	
						if (inputValue !== '') {
							var id = new Date().getTime();
							var title = inputValue;
	
							var _iteratorNormalCompletion3 = true;
							var _didIteratorError3 = false;
							var _iteratorError3 = undefined;
	
							try {
								for (var _iterator3 = _this.items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
									var item = _step3.value;
	
									if (item.id === itemContainerId) {
										item.title = inputValue;
										break;
									}
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
	
							target.textContent = inputValue;
							itemContainer.classList.remove('editing');
						} else {
							var i = _this.items.length;
	
							while (i--) {
								if (_this.items[i].id === itemContainerId) {
									var itemToRemove = _this.itemsContainer.children[i];
	
									_this.items.splice(i, 1);
									_this.itemsContainer.removeChild(itemToRemove);
									break;
								}
							}
						}
	
						_this._updateLocalStorage();
	
						(0, _utilitiesDom2['default'])(itemEditContainer).off('keydown', _updateCallback);
						(0, _utilitiesDom2['default'])(itemEditContainer).off('blur', _updateCallback);
	
						_this._updateActiveItemsCounter();
	
						if (_this.getItems().length === 0) {
							(0, _utilitiesDom2['default'])().hideSections(_this.mainSection, _this.footerSection);
							_this.toggleAllCheck.checked = false;
							(0, _utilitiesDom2['default'])(_this.clearCompleted).hide();
						}
					} else if (event.keyCode === _utilitiesKeyboardKeys2['default'].ESC) {
						itemContainer.classList.remove('editing');
						itemEditContainer.value = originalValue;
	
						(0, _utilitiesDom2['default'])(itemEditContainer).off('keydown', _updateCallback);
						(0, _utilitiesDom2['default'])(itemEditContainer).off('blur', _updateCallback);
					}
				};
	
				(0, _utilitiesDom2['default'])(itemEditContainer).on('keydown', _updateCallback);
				(0, _utilitiesDom2['default'])(itemEditContainer).on('blur', _updateCallback);
			}
		}, {
			key: '_setCaretEnd',
			value: function _setCaretEnd(txt) {
				if (txt.createTextRange) {
					// IE
					var fieldRange = txt.createTextRange();
					fieldRange.moveStart('character', txt.value.length);
					fieldRange.collapse();
					fieldRange.select();
				} else {
					// Firefox and Opera
					var _length = txt.value.length;
					txt.setSelectionRange(_length, _length);
				}
			}
		}, {
			key: '_updateActiveItemsCounter',
			value: function _updateActiveItemsCounter() {
	
				var itemsCount = (0, _utilitiesDomSelector2['default'])('.todo-count');
				var activeItems = 0;
	
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;
	
				try {
					for (var _iterator4 = this.getItems()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var item = _step4.value;
	
						if (!item.completed) {
							activeItems++;
						}
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
	
				if (activeItems === 1) {
					itemsCount.innerHTML = '<strong>' + activeItems + '</strong> item left';
				} else {
					itemsCount.innerHTML = '<strong>' + activeItems + '</strong> items left';
				}
			}
		}, {
			key: '_updateLocalStorage',
			value: function _updateLocalStorage() {
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
			}
		}]);
	
		return Todos;
	})();
	
	exports['default'] = Todos;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var KEYBOARD_KEYS = {
		ENTER: 13,
		ESC: 27
	};
	
	exports["default"] = KEYBOARD_KEYS;
	module.exports = exports["default"];

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map