import { createSuite } from '../../node_modules/just-test/dist/just-test.min.js'
import { spotlight, SHAPES } from '../../dist/spotlight.js';

const suite = createSuite({ name: 'Testing spotlight APIs' });

suite.runTest({ name: 'test A', timeout: 15000 }, async test => {
	const
		divA = document.createElement('div'),
		divB = document.createElement('div'),
		divC = document.createElement('div'),
		divD = document.createElement('div');

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

	divD.style.position = 'absolute';
	divD.style.top = '600px';
	divD.style.left = '300px';
	divD.style.width = '100px';
	divD.style.height = '300px';
	divD.style.overflow = 'auto';
	divD.style.outline = '2px solid orange';
	document.body.appendChild(divD);

	let sl;
	await test.waitMillis(1000);
	sl = spotlight(divA, null, {
		shape: SHAPES.oval,
		transitionDuration: 1000
	});

	await test.waitMillis(3000);
	sl.transitionDuration = 333;
	sl.style.color = '#110';
	sl.target = divB;
	sl.shape = SHAPES.circle;

	await test.waitMillis(3000);
	sl.target = divC; sl.shape = SHAPES.box;

	await test.waitMillis(3000);
	sl.transitionDuration = 2000;
	sl.shape = SHAPES.oval;
	await sl.moveTo(divD);
	console.log('moved');

	await test.waitMillis(1000);
	await sl.close();
	console.log('closed');
});