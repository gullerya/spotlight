const
	PARENT_KEY = Symbol('parent.key'),
	TARGET_KEY = Symbol('target.key'),
	COORDS_EXTRACTOR_KEY = Symbol('coords.extractor.key'),
	DEFAULT_OPTIONS = {

	};

export function spotlight(target, container, options) {
	const opts = Object.assign(DEFAULT_OPTIONS, options, { target: target, parent: container || document.body });
	validateOptions(opts);
	const sls = document.createElement('spotlight-scene');
	sls[PARENT_KEY] = opts.parent;
	sls.target = opts.target;
	//	configure more options - TODO
	sls[PARENT_KEY].appendChild(sls);
	return sls;
}

const template = document.createElement('template');

template.innerHTML = `
	<style>
		:host {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			overflow: hidden;
		}

		.spotlight {
			position: absolute;
			border: 100vmax solid;
			border-color: rgba(0, 0, 0, 0.1);
			transform: translate(-50%, -50%);
			transition: all 0.5s;
		}

		.round {
			border-radius: 50%;
		}
	</style>

	<div class="spotlight round"></div>
`;

customElements.define('spotlight-scene', class extends HTMLElement {
	constructor() {
		super();
		const s = this.attachShadow({ mode: 'open' });
		s.appendChild(template.content.cloneNode(true));
	}

	get parent() {
		return this[PARENT_KEY];
	}

	get target() {
		return this[TARGET_KEY];
	}

	set target(target) {
		if (!target || target.nodeType !== Node.ELEMENT_NODE || target === document.body) {
			throw new Error('invalid target');
		}
		if (!this[PARENT_KEY].contains(target) || this[PARENT_KEY] === target) {
			throw new Error('target MUST be a child of a given parent; they MAY NOT be the same element');
		}

		this[TARGET_KEY] = target;
		const coords = this[COORDS_EXTRACTOR_KEY](this[TARGET_KEY]);
		const sl = this.shadowRoot.querySelector('.spotlight');
		sl.style.top = coords.y + coords.height / 2 + 'px';
		sl.style.left = coords.x + coords.width / 2 + 'px';
		sl.style.width = sl.style.height = Math.max(coords.width, coords.height);
	}

	static [COORDS_EXTRACTOR_KEY](e) {
		const result = e.getBoundingClientRect();
		return result;
	}
});

function validateOptions(opts) {
	if (!opts.target || opts.target.nodeType !== Node.ELEMENT_NODE || opts.target === document.body) {
		throw new Error('invalid target');
	}
	if (!opts.parent || opts.parent.nodeType !== Node.ELEMENT_NODE) {
		throw new Error('target parent MUST be an element node');
	}
	if (!opts.parent.contains(opts.target) || opts.parent === opts.target) {
		throw new Error('target MUST be a child of a given parent; they MAY NOT be the same element');
	}
}