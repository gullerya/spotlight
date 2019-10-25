import { createSuite } from '../../node_modules/just-test/dist/just-test.min.js'
import { spotlight, SHAPES } from '../../dist/spotlight.js';

const suite = createSuite({ name: 'Testing spotlight APIs' });

suite.addTest({ name: 'test A' }, test => {
	const
		divA = document.createElement('div'),
		divB = document.createElement('div'),
		divC = document.createElement('div');

	divA.style.position = 'absolute';
	divA.style.top = '100px';
	divA.style.left = '100px';
	divA.style.width = '400px';
	divA.style.height = '200px';
	divA.style.outline = '2px solid red';
	divA.style.overflow = 'auto';
	document.body.appendChild(divA);

	divB.style.position = 'absolute';
	divB.style.top = '400px';
	divB.style.left = '100px';
	divB.style.width = '200px';
	divB.style.height = '100px';
	divB.style.overflow = 'auto';
	divB.style.outline = '2px solid blue';
	document.body.appendChild(divB);

	divC.style.position = 'absolute';
	divC.style.top = '200px';
	divC.textContent = 'some thing to call out over';
	divC.style.outline = '2px solid green';
	document.body.appendChild(divC);

	setTimeout(() => {
		const sl = spotlight(divA);

		setTimeout(() => {
			sl.style.color = '#110';
			sl.target = divB;
			sl.shape = SHAPES.oval;
			setTimeout(() => {
				sl.target = divC;
				sl.shape = SHAPES.box;
				//setTimeout(() => sl.remove(), 5000);
			}, 5000);
		}, 5000);
	}, 1000);

	test.pass();
});

suite.run();