import Todo from '../model/todo';
import Dom from '../utilities/dom';
import KEYBOARD_KEYS from '../utilities/keyboardKeys';

export class Todos {

	constructor() {
		this.items = [];
		this.$ = document.querySelectorAll.bind(document);
		this.itemsContainer = Array.from(this.$('.todo-list'))[0];
		this.toggleAllCheck = Array.from(this.$('.toggle-all'))[0];
		this.mainSection = Array.from(this.$('.main'))[0];
		this.footerSection = Array.from(this.$('.footer'))[0];
		this.clearCompleted = Array.from(this.$('.clear-completed'))[0];
	}

	getItems() {
		return this.items;
	}

	insert(id, title) {

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
		itemContainer.setAttribute('data-id', id);

		this.items.push(todo);
		this.itemsContainer.appendChild(itemContainer);

	}

	toggleItem(target) {

		let itemContainer = target.parentNode;
		let itemsLength = this.items.length;
		let itemsCompletedCounter = 0;

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

		for (let item of this.items) {
			let itemContainerId = Number.parseInt(itemContainer.getAttribute('data-id'), 10);

			if (item.id === itemContainerId) {
				item.completed = item.completed ? false : true;
			}

			if (item.completed) {
				itemsCompletedCounter++;
			}
		}

		if (itemsLength === itemsCompletedCounter) {
			this.toggleAllCheck.checked = true;
		} else {
			this.toggleAllCheck.checked = false;
		}

		if (itemsCompletedCounter === 0) {
			Dom(this.clearCompleted).hide();
		} else {
			Dom(this.clearCompleted).show();
		}

	}

	remove(target) {

		let itemContainer = target.parentNode;
		let i = this.items.length;
		let itemContainerId;
		let itemsCompletedCounter = 0;

		while (itemContainer.tagName !== 'LI') {
			itemContainer = itemContainer.parentNode;
		}

		itemContainerId = Number.parseInt(itemContainer.getAttribute('data-id'), 10);

		while (i--) {
			if (this.items[i].id === itemContainerId) {
				let itemToRemove = this.itemsContainer.children[i];

				this.items.splice(i, 1);
				this.itemsContainer.removeChild(itemToRemove);
				break;
			}
		}

		for (let item of this.items) {
			if (item.completed) {
				itemsCompletedCounter++;
			}
		}

		if (itemsCompletedCounter === 0) {
			Dom(this.clearCompleted).hide();
			this.toggleAllCheck.checked = false;
		}

		if (this.items.length === 0) {
			Dom().hideSections(this.mainSection, this.footerSection);
		}

	}

	updateTitle(target) {

		let itemContainer = target.parentNode;
		let originalValue = target.textContent;
		let that = this;
		let itemEditContainer, inputValue;

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

		Dom(itemEditContainer).on('keydown', _updateCallback);
		Dom(itemEditContainer).on('blur', _updateCallback);

		function _updateCallback(event) {
			inputValue = itemEditContainer.value.trim();

			if (event.keyCode === KEYBOARD_KEYS.ENTER || event.type === 'blur') {
				console.log(event.keyCode);
				let itemContainerId = Number.parseInt(itemContainer.getAttribute('data-id'), 10);

				if (inputValue !== '') {
					let id = new Date().getTime();
					let title = inputValue;

					for (let item of that.items) {
						if (item.id === itemContainerId) {
							item.title = inputValue;
							break;
						}
					}

					target.textContent = inputValue;
					itemContainer.classList.remove('editing');
				} else {
					let i = that.items.length;

					while (i--) {
						if (that.items[i].id === itemContainerId) {
							let itemToRemove = that.itemsContainer.children[i];

							that.items.splice(i, 1);
							that.itemsContainer.removeChild(itemToRemove);
							break;
						}
					}
				}

				Dom(itemEditContainer).off('keydown', _updateCallback);
				Dom(itemEditContainer).off('blur', _updateCallback);

				that._updateActiveItemsCounter();

				if (that.getItems().length === 0) {
					Dom().hideSections(that.mainSection, that.footerSection);
					that.toggleAllCheck.checked = false;
					Dom(that.clearCompleted).hide();
				}

			} else if (event.keyCode === KEYBOARD_KEYS.ESC) {
				itemContainer.classList.remove('editing');
				itemEditContainer.value = originalValue;

				Dom(itemEditContainer).off('keydown', _updateCallback);
				Dom(itemEditContainer).off('blur', _updateCallback);
			}

		}

	}

	_setCaretEnd(txt) {
		if (txt.createTextRange) {
			// IE
			let fieldRange = txt.createTextRange();
			fieldRange.moveStart('character', txt.value.length);
			fieldRange.collapse();
			fieldRange.select();
		} else {
			// Firefox and Opera
			let length = txt.value.length;
			txt.setSelectionRange(length, length);
		}
	}

	_updateActiveItemsCounter() {

		let itemsCount = Array.from(this.$('.todo-count'))[0];
		let activeItems = 0;

		for (let item of this.getItems()) {
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
