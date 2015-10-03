import Dom from '../utilities/dom';
import $ from '../utilities/domSelector';
import Todo from '../model/todo';
import TodosService from '../services/todos';
import KEYBOARD_KEYS from '../utilities/keyboardKeys';

const STORAGE_KEY = 'todos-es6';

export default class Todos {

	constructor() {
		this.todosService = new TodosService();
		this.currentFilter = 'all';

		this.itemsContainer = $('.todo-list');
		this.mainSection = $('.main');
		this.footerSection = $('.footer');
		this.toggleAllCheck = $('.toggle-all');
		this.clearCompleted = $('.clear-completed');
		this.filters = $('.filters');
	}

	init() {
		this._initListeners();
		this._setCurrentRoute();
		this._setFilterButtonClass();

		if (this.todosService.getItems().length > 0) {
			Dom().showSections(this.mainSection, this.footerSection);
			this._renderItems(this.currentRoute);
			this._updateActiveItemsCounter();
		} else {
			Dom(this.clearCompleted).hide();
		}

	}

	_setFilterButtonClass() {
		let activeFilter = this.filters.querySelector('.selected');

		if (this.currentRoute !== 'all') {
			activeFilter.classList.remove('selected');

			if (this.currentRoute === 'active') {
				this.filters.children[1].firstElementChild.classList.add('selected');
			} else if (this.currentRoute === 'completed') {
				this.filters.children[2].firstElementChild.classList.add('selected');
			}
		}
	}

	_setCurrentRoute() {
		if (window.location.hash.indexOf('active') > -1) {
			this.currentRoute = 'active';
		} else if (window.location.hash.indexOf('completed') > -1) {
			this.currentRoute = 'completed';
		} else {
			this.currentRoute = 'all';
		}
	}

	_renderItems(filter = 'all') {

		let items = this.todosService.getItems();
		let completedItems = 0;
		let itemContent, itemContainer;

		for (let item of items) {
			if ((filter === 'active' && item.completed) || (filter === 'completed' && !item.completed)) {
				continue;
			}

			itemContent = `
				<div class="view">
					<input class="toggle" type="checkbox">
					<label>${item.title}</label>
					<button class="destroy"></button>
				</div>
				<input class="edit" value="${item.title}">
			`;
			itemContainer = document.createElement('li');

			itemContainer.innerHTML = itemContent;
			itemContainer.setAttribute('data-id', item.id);

			if (item.completed) {
				let toggle = itemContainer.querySelector('.toggle');
				toggle.checked = true;
				itemContainer.className = 'completed';
				completedItems++;
			}

			this.itemsContainer.appendChild(itemContainer);
		}

		if (completedItems > 0) {
			Dom(this.clearCompleted).show();
		} else {
			Dom(this.clearCompleted).hide();
		}

		if (completedItems === items.length) {
			this.toggleAllCheck.checked = true;
		}

	}

	_initListeners() {

		let input = $('.new-todo');
		let itemsList = $('.todo-list');

		Dom(input).on('keydown', _insertCallback.bind(this));
		Dom(input).on('blur', _insertCallback.bind(this));

		function _insertCallback(event) {
			let inputValue = input.value.trim();

			if ((event.keyCode === KEYBOARD_KEYS.ENTER || event.type === 'blur') && inputValue !== '') {
				let id = new Date().getTime();
				let title = inputValue;

				this.todosService.insert(id, title);
				this._clearInput(input);

				if (Dom().areSectionsHidden()) {
					Dom().showSections(this.mainSection, this.footerSection);
				}

				this._updateActiveItemsCounter();
				this._filterList(this.currentFilter);
			}
		}

		Dom(itemsList).on('click', event => {

			let target = event.target;

			if (target.className === 'toggle') {
				this.todosService.toggleItem(target);
				this._updateActiveItemsCounter();
				this._filterList(this.currentFilter);
			} else if (target.className === 'destroy') {
				this.todosService.remove(target);
				this._updateActiveItemsCounter();
				this._filterList(this.currentFilter);
			}

		});

		Dom(itemsList).on('dblclick', event => {

			let target = event.target;

			if (target.tagName === 'LABEL') {
				this.todosService.updateTitle(target);
				// this._filterList(this.currentFilter);
			}

		});

		Dom(this.toggleAllCheck).on('click', event => {

			if (this.toggleAllCheck.checked) {

				for (let item of this.todosService.getItems()) {
					item.completed = true;
				}

				for (let item of this.itemsContainer.children) {
					let checker = item.querySelector('.toggle');
					item.className = 'completed';
					checker.checked = true;
				}

				Dom(this.clearCompleted).show();

			} else {

				for (let item of this.todosService.getItems()) {
					item.completed = false;
				}

				for (let item of this.itemsContainer.children) {
					let checker = item.querySelector('.toggle');
					item.className = '';
					checker.checked = false;
				}

				Dom(this.clearCompleted).hide();

			}

			this._updateActiveItemsCounter();
			this._updateLocalStorage();
			this._filterList(this.currentFilter);

		});

		Dom(this.clearCompleted).on('click', event => {

			let i = this.todosService.getItems().length;

			while (i--) {
				if (this.todosService.getItems()[i].completed) {
					let itemToRemove = this.itemsContainer.children[i];

					this.todosService.getItems().splice(i, 1);

					if (this.currentFilter === 'all') {
						this.itemsContainer.removeChild(itemToRemove);
					}
				}
			}

			if (this.currentFilter === 'completed') {

				// Empty the entire list of items.
				while (this.itemsContainer.firstChild) {
					this.itemsContainer.removeChild(this.itemsContainer.firstChild);
				}
			}

			this.toggleAllCheck.checked = false;
			Dom(this.clearCompleted).hide();

			if (this.todosService.getItems().length === 0) {
				Dom().hideSections(this.mainSection, this.footerSection);
			}

			this._updateLocalStorage();
			this._filterList(this.currentFilter);

		});

		Dom(this.filters).on('click', event => {
			let chosenFilter = event.target;
			let activeFilter = this.filters.querySelector('.selected');

			if (chosenFilter !== activeFilter) {
				activeFilter.classList.remove('selected');
				chosenFilter.classList.add('selected');

				if (chosenFilter.href.indexOf('active') > -1) {
					this._filterList('active');
				} else if (chosenFilter.href.indexOf('completed') > -1) {
					this._filterList('completed');
				} else {
					this._filterList('all');
				}
			}

		});

	}

	_clearInput(input) {
		input.value = '';
	}

	_updateActiveItemsCounter() {

		let itemsCount = $('.todo-count');
		let activeItems = 0;

		for (let item of this.todosService.getItems()) {
			if (!item.completed) {
				activeItems++;
			}
		}

		if (activeItems === 1) {
			itemsCount.innerHTML = `<strong>${activeItems}</strong> item left`;
		} else {
			itemsCount.innerHTML = `<strong>${activeItems}</strong> items left`;
		}

	}

	_filterList(filter) {

		let items = this.todosService.getItems();

		// Empty the entire list of items.
		while (this.itemsContainer.firstChild) {
			this.itemsContainer.removeChild(this.itemsContainer.firstChild);
		}

		switch(filter) {
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

	_updateLocalStorage() {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todosService.getItems()));
	}

}
