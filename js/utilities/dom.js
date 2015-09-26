let Dom = element => {
	return {
		on(event, callback) {
			if (element && element instanceof HTMLElement) {
				element.addEventListener(event, callback);
			} else {
				throw new Error('Element does not exist.');
			}
		},
		hide() {
			if (element) {
				element.style.display = 'none';
			} else {
				throw new Error('Element does not exist.');
			}
		},
		show() {
			if (element) {
				element.style.display = 'block';
			} else {
				throw new Error('Element does not exist.');
			}
		}
	}
};

export default Dom;
