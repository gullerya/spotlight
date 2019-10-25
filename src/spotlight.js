const
	PARENT_KEY = Symbol('parent.key'),
	TARGET_KEY = Symbol('target.key'),
	SHAPE_KEY = Symbol('shape.key'),
	COORDS_EXTRACTOR_KEY = Symbol('coords.extractor.key'),
	RENDER_KEY = Symbol('render.key'),
	SHAPES = Object.freeze({ circle: 'circle', oval: 'oval', box: 'box' }),
	DEFAULT_OPTIONS = Object.freeze({
		shape: SHAPES.circle
	});

export {
	SHAPES,
	spotlight
}

function spotlight(target, container, options) {
	const opts = Object.assign({}, DEFAULT_OPTIONS, options, { target: target, parent: container || document.body });
	validateOptions(opts);

	const sls = document.createElement('spotlight-scene');
	//	setting the relevant options first
	sls[PARENT_KEY] = opts.parent;
	sls.shape = opts.shape;

	//	setting the target last
	sls.target = opts.target;
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
			color: #000;
			z-index: 999;
			overflow: hidden;
		}

		:host(.shown) .spotlight {
			opacity: 0.4;
		}

		.spotlight {
			position: absolute;
			border: 200vmax solid;
			transform: translate(-50%, -50%);
			opacity: 0;
			transition: all 333ms;
		}

		:host .spotlight.border {
			border: 3px solid #ff0;
			opacity: 1;
		}

		:host(.box) .spotlight {
			border-radius: calc(200vmax + 24px);
		}

		:host(.oval) .spotlight {
			border-radius: 50%;
		}

		:host(.circle) .spotlight {
			border-radius: 50%;
		}
	</style>

	<div class="spotlight shadow"></div>
	<div class="spotlight border"></div>
`;

customElements.define('spotlight-scene', class extends HTMLElement {
	constructor() {
		super();
		const s = this.attachShadow({ mode: 'open' });
		s.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		if (typeof this.offsetWidth === 'number') {
			this.classList.add('shown');
		}
	}

	get parent() {
		return this[PARENT_KEY];
	}

	get shape() {
		return this[SHAPE_KEY];
	}

	set shape(shape) {
		if (this[SHAPE_KEY] !== shape) {
			this[SHAPE_KEY] = shape;
			this[RENDER_KEY]();
		}
	}

	get target() {
		return this[TARGET_KEY];
	}

	set target(target) {
		if (this[TARGET_KEY] === target) {
			return;
		}

		if (!target || target.nodeType !== Node.ELEMENT_NODE || target === document.body) {
			throw new Error('invalid target');
		}
		if (!this[PARENT_KEY].contains(target) || this[PARENT_KEY] === target) {
			throw new Error('target MUST be a child of a given parent; they MAY NOT be the same element');
		}

		this[TARGET_KEY] = target;
		this[RENDER_KEY]();
	}

	remove() {
		const sl = this.shadowRoot.querySelector('.spotlight');
		sl.addEventListener('transitionend', () => {
			this[PARENT_KEY].removeChild(this);
		});
		this.classList.remove('shown');
	}

	[RENDER_KEY]() {
		if (!this[TARGET_KEY]) {
			return;
		}

		const coords = this[COORDS_EXTRACTOR_KEY](this[TARGET_KEY]);
		let w, h, s;
		switch (this[SHAPE_KEY]) {
			case SHAPES.box:
				w = coords.width + 24;
				h = coords.height + 24;
				s = SHAPES.box;
				break;
			case SHAPES.oval:
				w = coords.width * Math.pow(2, 0.5);
				h = coords.height * Math.pow(2, 0.5);
				s = SHAPES.oval;
				break;
			case SHAPES.circle:
			default:
				w = h = Math.pow(Math.pow(coords.width, 2) + Math.pow(coords.height, 2), 0.5) + 12;
				s = SHAPES.circle;
		}
		const sle = this.shadowRoot.querySelectorAll('.spotlight');
		sle.forEach(e => {
			e.style.top = coords.y + coords.height / 2 + 'px';
			e.style.left = coords.x + coords.width / 2 + 'px';
			e.style.width = w + 'px';
			e.style.height = h + 'px';
		});
		Object.keys(SHAPES).forEach(sk => {
			if (SHAPES[sk] !== s) {
				this.classList.remove(SHAPES[sk]);
			}
		});
		this.classList.add(s);
	}

	[COORDS_EXTRACTOR_KEY](e) {
		const result = e.getBoundingClientRect();
		return result;
	}
});

function validateOptions(opts) {
	if (!opts.target || opts.target.nodeType !== Node.ELEMENT_NODE || opts.target === document.body) {
		throw new Error('invalid target (' + opts.target + ')');
	}
	if (!opts.parent || opts.parent.nodeType !== Node.ELEMENT_NODE) {
		throw new Error('invalid parent (' + opts.parent + ')');
	}
	if (!opts.parent.contains(opts.target) || opts.parent === opts.target) {
		throw new Error('target MUST be a child of a given parent; they MAY NOT be the same element');
	}
	if (!opts.shape || !(opts.shape in SHAPES)) {
		console.error('invalid shape (' + opts.shape + '), falling back to the default (circle)');
		opts.shape = SHAPES.circle;
	}
}