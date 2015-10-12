/**
 * The model for the app.
 * @author Aleksandar Jovanov <ace92bt@gmail.com>
 * @class
 * @exports Model
 */
export default class Model {

	constructor() {

		this.data = {
			todos: []
		};

		let storage = window.localStorage.getItem('todos-es6');

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
	findAll() {

		let promise = new Promise((resolve, reject) => {
			if (this.data.todos) {
				resolve(this.data.todos);
			} else {
				reject('No todos found.')
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
	create(title) {

		let promise = new Promise((resolve, reject) => {
			let id = new Date().getTime().toString();
			let item = {id, title, completed: false};
			this.data.todos.push(item);
			this._updateLocalStorage();
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
	update(id, data) {

		let promise = new Promise((resolve, reject) => {
			if (id) {
				let items = this.data.todos.filter(item => {
					if (item.id === id) {
						item[data.key] = data.value;
						return true;
					}
				});

				if (items.length === 1) {
					let [first] = items;
					this._updateLocalStorage();
					resolve(first);
				} else {
					reject('Todo not found.')
				}
			} else {
				for (let item of this.data.todos) {
					item.completed = data.value;
				}

				this._updateLocalStorage();
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
	remove(id) {

		let promise = new Promise((resolve, reject) => {
			if (id) {
				let items = this.data.todos.filter((item, i) => {
					if (item.id === id) {
						this.data.todos.splice(i, 1);
						return true;
					}
				});

				if (items.length === 1) {
					this._updateLocalStorage();
					resolve();
				} else {
					reject('Todo not found.')
				}
			} else {
				let i = this.data.todos.length;

				while (i--) {
					if (this.data.todos[i].completed) {
						this.data.todos.splice(i, 1);
					}
				}

				this._updateLocalStorage();
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
	_updateLocalStorage() {
		window.localStorage.setItem('todos-es6', JSON.stringify(this.data.todos));
	}

}
