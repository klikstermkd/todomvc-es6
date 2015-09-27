let Dom = element => {

	let sectionsHidden = true;

	return {
		on(event, callback) {
			if (element && element instanceof HTMLElement) {
				element.addEventListener(event, callback);
			} else {
				throw new Error('Element does not exist.');
			}
		},
		off(event, callback) {
			if (element && element instanceof HTMLElement) {
				element.removeEventListener(event, callback);
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
		},
		hideSections(...sections) {
			for (let section of sections) {
				Dom(section).hide();
			}

			sectionsHidden = true;
		},
		showSections(...sections) {
			for (let section of sections) {
				Dom(section).show();
			}

			sectionsHidden = false;
		},
		areSectionsHidden() {
			return sectionsHidden;
		}
	}
};

export default Dom;
