const
	PARENT_KEY = Symbol('parent.key'),
	TARGET_KEY = Symbol('target.key'),
	SHAPE_KEY = Symbol('shape.key'),
	TD_KEY = Symbol('td.key'),
	RENDER_KEY = Symbol('render.key'),
	COORDS_EXTRACTOR_KEY = Symbol('coords.extractor.key'),

	SHAPES = Object.freeze({ circle: 'circle', oval: 'oval', box: 'box' }),
	DEFAULT_SHAPE = SHAPES.circle,
	DEFAULT_TD = 333,
	DEFAULT_OPTIONS = Object.freeze({
		shape: SHAPES.circle,
		transitionDuration: DEFAULT_TD
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
	sls[TD_KEY] = opts.transitionDuration;

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
			z-index: 999;
			overflow: hidden;
		}

		:host(.shown) .spotlight {
			border-color: rgba(0, 0, 0, 0.5);
		}
		:host(.shown) .inner-fence {
			border-color: rgba(255, 255, 0, 1);
		}

		.spotlight {
			position: absolute;
			border: 200vmax solid;
			border-color: rgba(0, 0, 0, 0);
			transform: translate(-50%, -50%);
			transition: all var(--t-d);
		}

		.inner-fence {
			position: absolute;
			top: -2px;
			left: -2px;
			right: -2px;
			bottom: -2px;
			border: 3px solid;
			border-color: rgba(255, 255, 0, 0);
			transition: all var(--t-d);
		}

		.box,
		.box > .inner-fence {
			border-radius: calc(200vmax + 24px);
		}

		.oval,
		.oval > .inner-fence {
			border-radius: 50%;
		}

		.circle,
		.circle > .inner-fence {
			border-radius: 50%;
		}
	</style>

	<div class="spotlight">
		<div class="inner-fence"></div>
	</div>
`;

customElements.define('spotlight-scene', class extends HTMLElement {
	constructor() {
		super();
		const s = this.attachShadow({ mode: 'open' });
		s.appendChild(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.shadowRoot.host.style.setProperty('--t-d', this[TD_KEY] + 'ms');
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

	get transitionDuration() {
		return this[TD_KEY];
	}

	set transitionDuration(td) {
		if (td && typeof td === 'number') {
			this[TD_KEY] = td;
			this.shadowRoot.host.style.setProperty('--t-d', this[TD_KEY] + 'ms');
		} else {
			console.error('invalid transition duration (' + td + '), staying on the present value (' + this[TD_KEY] + ')');
		}
	}

	get target() {
		return this[TARGET_KEY];
	}

	set target(target) {
		this.moveTo(target);
	}

	moveTo(target) {
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
		return this[RENDER_KEY]();
	}

	close() {
		this.classList.remove('shown');
		return new Promise(resolve => {
			setTimeout(() => {
				this[PARENT_KEY].removeChild(this);
				resolve();
			}, this[TD_KEY]);
		});
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

		const sle = this.shadowRoot.querySelector('.spotlight');
		return new Promise(resolve => {
			sle.className = 'spotlight ' + s;
			Object.assign(sle.style, {
				top: coords.y + coords.height / 2 + 'px',
				left: coords.x + coords.width / 2 + 'px',
				width: w + 'px',
				height: h + 'px'
			});
			setTimeout(resolve, this[TD_KEY]);
		});
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
		console.error('invalid shape (' + opts.shape + '), falling back to the default (' + DEFAULT_SHAPE + ')');
		opts.shape = DEFAULT_SHAPE;
	}
	if (!opts.transitionDuration || typeof opts.transitionDuration !== 'number') {
		console.error('invalid transition duration (' + opts.transitionDuration + '), falling back to the default (' + DEFAULT_TD + ')');
		opts.transitionDuration = DEFAULT_TD;
	}
}