/**
 * Find a DOM element.
 * @author Aleksandar Jovanov <ace92bt@gmail.com>
 * @param  {String} selector
 * @return {HTMLElement}
 * @public
 */
let $ = selector => {
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
let $on = (event, element, callback) => {
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
let $off = (event, element, callback) => {
    element.removeEventListener(event, callback);
};

export {$, $on, $off};
