import Router from '../utilities/router';
import Dom from '../utilities/dom';
import Todo from '../model/todo';

export class Todos {

	constructor() {
		this.todo = 0;
		this.items = [];
		this.router = new Router();
		this.$ = document.querySelectorAll.bind(document);
		this.ENTER_KEY = 13;
		this.itemsContainer = [...this.$('.todo-list')][0];
		this.mainSection = [...this.$('.main')][0];
		this.footerSection = [...this.$('.footer')][0];
		this.sectionsHidden = true;
	}

	init() {
		this._initListeners();

		if (this.items.length === 0) {
			this._hideSections();
		}
	}

	_hideSections() {
		try {
			Dom(this.mainSection).hide();
			Dom(this.footerSection).hide();
		} catch(e) {
			console.log(e);
		}
	}

	_initListeners() {
		let input = [...this.$('.new-todo')][0];

		Dom(input).on('keydown', event => {
			if (event.keyCode === this.ENTER_KEY && input.value.trim() !== '') {
				let id = new Date().getTime();
				let title = input.value.trim();
				let todo = new Todo(id, title);
				let itemContent = `
					<div class="view">
						<input class="toggle" type="checkbox">
						<label>${title}</label>
						<button class="destroy"></button>
					</div>
					<input class="edit" value="${title}">
				`;
				let itemContainer = document.createElement('li');
				itemContainer.innerHTML = itemContent;

				this.items.push(todo);
				this.itemsContainer.appendChild(itemContainer);
				input.value = '';

				if (this.sectionsHidden) {
					try {
						Dom(this.mainSection).show();
						Dom(this.footerSection).show();
						this.sectionsHidden = false;
					} catch(e) {
						console.log(e);
					}
				}
			}
		});
	}

}
