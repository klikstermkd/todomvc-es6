import Router from '../utilities/router';
import Dom from '../utilities/dom';
import Todo from '../model/todo';
import KEYBOARD_KEYS from '../utilities/keyboardKeys';
import {Todos as TodosService} from '../services/todos';

export default class Todos {

	constructor() {
		this.router = new Router();
		this.todosService = new TodosService();
		this.$ = document.querySelectorAll.bind(document);
		this.itemsContainer = Array.from(this.$('.todo-list'))[0];
		this.mainSection = Array.from(this.$('.main'))[0];
		this.footerSection = Array.from(this.$('.footer'))[0];
		this.toggleAllCheck = Array.from(this.$('.toggle-all'))[0];
		this.clearCompleted = Array.from(this.$('.clear-completed'))[0];
	}

	init() {
		this._initListeners();

		if (this.todosService.getItems().length === 0) {
			Dom().hideSections(this.mainSection, this.footerSection);
		}

		Dom(this.clearCompleted).hide();
	}

	_initListeners() {

		let input = Array.from(this.$('.new-todo'))[0];
		let itemsList = Array.from(this.$('.todo-list'))[0];

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
			}
		}

		Dom(itemsList).on('click', event => {

			let target = event.target;

			if (target.className === 'toggle') {
				this.todosService.toggleItem(target);
				this._updateActiveItemsCounter();
			} else if (target.className === 'destroy') {
				this.todosService.remove(target);
				this._updateActiveItemsCounter();
			}

		});

		Dom(itemsList).on('dblclick', event => {

			let target = event.target;

			if (target.tagName === 'LABEL') {
				this.todosService.updateTitle(target);
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

		});

		Dom(this.clearCompleted).on('click', event => {

			let i = this.todosService.getItems().length;

			while (i--) {
				if (this.todosService.getItems()[i].completed) {
					let itemToRemove = this.itemsContainer.children[i];

					this.todosService.getItems().splice(i, 1);
					this.itemsContainer.removeChild(itemToRemove);
				}
			}

			this.toggleAllCheck.checked = false;
			Dom(this.clearCompleted).hide();

			if (this.todosService.getItems().length === 0) {
				Dom().hideSections(this.mainSection, this.footerSection);
			}

		});

	}

	_clearInput(input) {
		input.value = '';
	}

	_updateActiveItemsCounter() {

		let itemsCount = Array.from(this.$('.todo-count'))[0];
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

}
