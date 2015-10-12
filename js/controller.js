import {$on} from './helpers';
import View from './view';
import Model from './model';

/**
 * @constant
 * @type {String}
 */
const ALLOWED_VIEWS = 'all|active|completed';

/**
 * Control the behaviour and flow of the app.
 * @author Aleksandar Jovanov <ace92bt@gmail.com>
 * @class
 * @exports Controller
 */
export default class Controller {

	constructor() {

		this.model = new Model();
		this.view = new View();

	}

	/**
	 * Initialize the app to load the initial view and listen to hash changes.
	 * @author Aleksandar Jovanov <ace92bt@gmail.com>
	 * @public
	 */
	init() {

		let findView = event => {
			let currentView = 'all';

			if (window.location.hash) {
				currentView = window.location.hash.substr(2);
			}

			this._setView(currentView);
		};

		$on('load', window, findView);
		$on('hashchange', window, findView);

		this._initListeners();

	}

	/**
	 * Set and render the current active view.
	 * @author Aleksandar Jovanov <ace92bt@gmail.com>
	 * @param {String} [view=all]
	 * @private
	 */
	_setView(view = 'all') {

		if (view && ALLOWED_VIEWS.includes(view)) {

			this.model.findAll().then(data => {
				this.view.render('list', {view, data});
				this.view.render('menu', {view});
				this.activeView = view;
				this._updateList();
			}).catch(error => {
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
	_initListeners() {

		this.view.on('insert', title => {
			this.model.create(title).then(item => {
				this.view.render('insert', {item});
				this._updateList();
			});
		});

		this.view.on('toggle', (id, completed) => {
			this.model.update(id, {key: 'completed', value: completed}).then(item => {
				this.view.render('toggle', {item});
				this._updateList();
			}).catch(error => {
				console.log(error);
			});
		});

		this.view.on('remove', (id) => {
			this.model.remove(id).then(() => {
				this.view.render('remove', {id});
				this._updateList();
			}).catch(error => {
				console.log(error);
			});
		});

		this.view.on('edit', (id) => {
			this.view.render('edit', {id});

			this.view.on('save', (action, id, title) => {
				if (action === 'save') {
					this.model.update(id, {key: 'title', value: title}).then((item) => {
						this.view.render('save', {item});
						this._updateList();
					}).catch(error => {
						console.log(error);
					});
				} else if (action === 'remove') {
					this.model.remove(id).then(() => {
						this.view.render('remove', {id});
						this._updateList();
					}).catch(error => {
						console.log(error);
					});
				}
			});
		});

		this.view.on('toggleAll', (completed) => {
			this.model.update(null, {key: 'completed', value: completed}).then(() => {
				this.view.render('toggleAll', {completed});
				this._updateList();
			});
		});

		this.view.on('removeCompleted', () => {
			this.model.remove().then(() => {
				this.view.render('removeCompleted');
				this._updateList();
			});
		});

	}

	/**
	 * Rerender the list after an action occurs.
	 * @author Aleksandar Jovanov <ace92bt@gmail.com>
	 * @private
	 */
	_updateList() {

		let view = this.activeView;

		this.model.findAll().then(data => {
			this.view.render('list', {view, data});
			this.view.render('counter', {data});
		}).catch(error => {
			console.error(error);
		});

	}

}
