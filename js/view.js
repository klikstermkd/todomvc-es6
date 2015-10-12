import {$, $on, $off} from './helpers';

/**
 * @constant
 * @type {Object}
 */
const KEYBOARD_KEYS = {
    ENTER: 13,
    ESC: 27
};

/**
 * The view for the app.
 * @author Aleksandar Jovanov <ace92bt@gmail.com>
 * @class
 * @exports View
 */
export default class View {

	constructor() {

        this.itemsContainer = $('.todo-list');
        this.mainSection = $('.main');
        this.footerSection = $('.footer');
        this.toggleAllCheck = $('.toggle-all');
        this.clearCompleted = $('.clear-completed');

	}

    /**
     * Render the view based on a command.
     * @author Aleksandar Jovanov <ace92bt@gmail.com>
     * @param  {String} command
     * @param  {Null|Object} data
     * @public
     */
	render(command, data) {

        const ALLOWED_COMMANDS = 'list|insert|toggle|toggleAll|remove|removeCompleted|edit|save|menu|counter';

        if (ALLOWED_COMMANDS.includes(command)) {

            if (command === 'list') {
                let view = data.view;
                let items = data.data;
                let completedItems = 0;
                let itemContent, itemContainer;

                if (items.length > 0) {
                    this.mainSection.style.display = 'block';
                    this.footerSection.style.display = 'block';
                    this.itemsContainer.innerHTML = '';

                    for (let item of items) {
                        if ((view === 'active' && item.completed) || (view === 'completed' && !item.completed)) {
                            continue;
                        }

                        itemContainer = document.createElement('li');
                        itemContainer.setAttribute('data-id', item.id);

                        itemContent = `
                            <div class="view">
                                <input class="toggle" type="checkbox">
                                <label>${item.title}</label>
                                <button class="destroy"></button>
                            </div>
                            <input class="edit" value="${item.title}">
                        `;

                        itemContainer.innerHTML = itemContent;

                        if (item.completed) {
                            let toggle = itemContainer.querySelector('.toggle');
                            toggle.setAttribute('checked', true);
                            itemContainer.className = 'completed';
                            completedItems++;
                        }

                        this.itemsContainer.appendChild(itemContainer);
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
                let item = data.item;
                let itemContainer = document.createElement('li');
                let itemsLength = this.itemsContainer.children.length;
                let itemContent;

                itemContainer.setAttribute('data-id', item.id);

                itemContent = `
                    <div class="view">
                        <input class="toggle" type="checkbox">
                        <label>${item.title}</label>
                        <button class="destroy"></button>
                    </div>
                    <input class="edit" value="${item.title}">
                `;

                itemContainer.innerHTML = itemContent;


                $('.new-todo').value = '';

                if (itemsLength === 0) {
                    this.mainSection.style.display = 'block';
                    this.footerSection.style.display = 'block';
                }

                this.itemsContainer.appendChild(itemContainer);
                this.toggleAllCheck.checked = false;
            } else if (command === 'toggle') {
                let item = data.item;
                let itemContainer = document.activeElement.parentNode;
                let itemsLength = this.itemsContainer.children.length;
                let completedItemsLength;

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
                let itemContainer = document.activeElement.parentNode;
                let completedItemsLength;

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
                let id = data.id;
                let itemContainer = $(`[data-id="${id}"`);
                let itemEditContainer;

                itemEditContainer = itemContainer.querySelector('.edit');

                itemContainer.classList.add('editing')

                itemEditContainer.focus();
                
                // Set caret position to the end of the input field.
                if (itemEditContainer.createTextRange) {
                    // IE
                    let fieldRange = itemEditContainer.createTextRange();
                    fieldRange.moveStart('character', itemEditContainer.value.length);
                    fieldRange.collapse();
                    fieldRange.select();
                } else {
                    // Firefox and Opera
                    let length = itemEditContainer.value.length;
                    itemEditContainer.setSelectionRange(length, length);
                }
            } else if (command === 'save') {
                let item = data.item;
                let itemContainer = $(`[data-id="${item.id}"`);
                let itemEditContainer = itemContainer.querySelector('.edit');
                let label = itemContainer.querySelector('label');

                itemEditContainer.value = item.title;
                label.textContent = item.title;
                itemContainer.classList.remove('editing');
            } else if (command ==='toggleAll') {
                let completed = data.completed;

                if (completed) {
                    for (let item of this.itemsContainer.children) {
                        let checker = item.querySelector('.toggle');
                        item.classList.add('completed');
                        checker.setAttribute('checked', true);
                    }

                    this.clearCompleted.style.display = 'block';
                } else {
                    for (let item of this.itemsContainer.children) {
                        let checker = item.querySelector('.toggle');
                        item.classList.remove('completed');
                        checker.setAttribute('checked', false);
                    }

                    this.clearCompleted.style.display = 'none';
                }
            } else if (command === 'removeCompleted') {
                let completedItems = document.querySelectorAll('.completed');

                for (let item of completedItems) {
                    this.itemsContainer.removeChild(item);
                }

                this.toggleAllCheck.checked = false;
                this.clearCompleted.style.display = 'none';

                if (this.itemsContainer.children.length === 0) {
                    this.mainSection.style.display = 'none';
                    this.footerSection.style.display = 'none';
                }
            } else if (command === 'menu') {
                let view = data.view;
                let activeFilter = $('.selected');

                activeFilter.classList.remove('selected');

                if (view === 'all') {
                    $('[href="#/"').classList.add('selected');
                } else {
                    $(`[href="#/${view}"`).classList.add('selected');
                }
            } else if (command === 'counter') {
                let items = data.data;
                let itemsCount = $('.todo-count');
                let activeItems = 0;

                for (let item of items) {
                    if (!item.completed) {
                        activeItems++
                    }
                }

                if (activeItems === 1) {
                    itemsCount.innerHTML = `<strong>${activeItems}</strong> item left`;
                } else {
                    itemsCount.innerHTML = `<strong>${activeItems}</strong> items left`;
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
    on(command = 'unknown', callback) {

        const ALLOWED_COMMANDS = 'insert|remove|removeCompleted|edit|toggle|toggleAll|filter|save';

        if (ALLOWED_COMMANDS.includes(command)) {

            if (command === 'insert') {
                let input = $('.new-todo');

                let _insertCallback = event => {
                    let inputValue = input.value.trim();

                    if ((event.keyCode === KEYBOARD_KEYS.ENTER || event.type === 'blur') && inputValue !== '') {
                        callback(inputValue);
                    }
                }

                $on('keydown', input, _insertCallback);
                $on('blur', input, _insertCallback);
            } else if (command === 'toggle') {
                $on('click', this.itemsContainer, event => {

                    let target = event.target;

                    if (target.className === 'toggle') {
                        let itemContainer = target.parentNode;

                        while (itemContainer.tagName !== 'LI') {
                            itemContainer = itemContainer.parentNode;
                        }
                      
                        let id = itemContainer.getAttribute('data-id');

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
                $on('click', this.itemsContainer, event => {
                    let target = event.target;
                    
                    if (target.className === 'destroy') {
                        let itemContainer = target.parentNode;

                        while (itemContainer.tagName !== 'LI') {
                            itemContainer = itemContainer.parentNode;
                        }
                      
                        let id = itemContainer.getAttribute('data-id');

                        callback(id);
                    }

                });
            } else if (command === 'edit') {
                $on('dblclick', this.itemsContainer, event => {
                    let target = event.target;

                    if (target.tagName === 'LABEL') {
                        let itemContainer = target.parentNode;

                        while (itemContainer.tagName !== 'LI') {
                            itemContainer = itemContainer.parentNode;
                        }
                        
                        let id = itemContainer.getAttribute('data-id');
                        callback(id);
                    }
                });
            } else if (command === 'save') {
                let itemEditContainer = document.activeElement;
                let itemContainer = itemEditContainer.parentNode;
                let originalValue = itemEditContainer.value;

                let _updateCallback = event => {
                    let inputValue = itemEditContainer.value.trim();

                    if (event.keyCode === KEYBOARD_KEYS.ENTER || event.type === 'blur') {
                        let id = itemContainer.getAttribute('data-id');

                        if (inputValue !== '') {
                            callback('save', id, inputValue)
                        } else {
                            callback('remove', id, inputValue)
                        }

                        $off('keydown', itemEditContainer, _updateCallback);
                        $off('blur', itemEditContainer, _updateCallback);
                    } else if (event.keyCode === KEYBOARD_KEYS.ESC) {
                        itemContainer.classList.remove('editing');
                        itemEditContainer.value = originalValue;

                        $off('keydown', itemEditContainer, _updateCallback);
                        $off('blur', itemEditContainer, _updateCallback);
                    }

                };

                $on('keydown', itemEditContainer, _updateCallback);
                $on('blur', itemEditContainer, _updateCallback);
            } else if (command === 'toggleAll') {
                $on('click', this.toggleAllCheck, event => {
                    if (this.toggleAllCheck.checked) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            } else if (command === 'removeCompleted') {
                $on('click', this.clearCompleted, event => {
                    callback();
                });
            }

        } else {
            throw new Error('Unknown provided command.');
        }

    }

}
