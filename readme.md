[![GitHub](https://img.shields.io/github/license/gullerya/spotlight.svg)](https://github.com/gullerya/spotlight)
[![npm](https://img.shields.io/npm/v/@gullerya/spotlight.svg?label=npm%20@gullerya/spotlight)](https://www.npmjs.com/package/@gullerya/spotlight)
[![Travis](https://travis-ci.org/gullerya/spotlight.svg?branch=master)](https://travis-ci.org/gullerya/spotlight)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/spotlight/master.svg)](https://codecov.io/gh/gullerya/spotlight/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/a3879d7077eb4eef83a591733ad7c579.svg?logo=codacy)](https://www.codacy.com/app/gullerya/spotlight)

# Summary

__`spotlight`__ let's you to visually highlight a chosen element; this is done by shading over the surrounding content

Main aspects:
* TODO

#### Support matrix: ![CHROME](https://github.com/gullerya/object-observer/raw/master/docs/browser_icons/chrome.png)<sub>61+</sub> | ![FIREFOX](https://github.com/gullerya/object-observer/raw/master/docs/browser_icons/firefox.png)<sub>60+</sub> | ![EDGE](https://github.com/gullerya/object-observer/raw/master/docs/browser_icons/edge.png)<sub>16+</sub>

#### Last versions (full changelog is [here](https://github.com/gullerya/object-observer/blob/master/docs/changelog.md))

* __0.0.1__
  * initial take

# Base API
`spotlight` library consists of a single entry-level API,
allowing to create a `spotlight-scene` with a given parameters,
applied to the DOM.

This component may then be further interacted via component's own APIs as described below, to change its appearance, flavor or spot target,
and to be removed at the end of usage.

Each `spotlight-scene` is self-contained and isolated,
therefore it is possible to create as many 'spotlights' as needed,
even if in the real use-cases one would rarely need more than a single instance.

#### import:
Import the library as in example below:
```javascript
import spotlight from './dist/spotlight.min.js';
```

#### syntax:
Imported `spotlight` is a function syntaxed as below:
```javascript
const slsElement = function spotlight(target[, container[, options]]) { ... }
```

#### parameters:
* `target`
    - a target __element__ to place the spot over
    - MAY NOT be a `document.body`
* `container` <small>[optional]</small>
    - a container to shadow contents around the `target`
    - when provided, `container` MUST be an ancestor of the `target`
    - default `container` is `document.body`
* `options` <small>[optional]</small>
    - TBD

# `spotlight-scene` component APIs
The base API outlined above serves as an entry point for the interop
with the library.

The result of that function is the `spotlight-scene` component instance.
It is already applied to the DOM, unless explicitly opted out via the `options` above.

This component may by further interacted via it's own APIs.
Common use-case for this is to move smoothly the spotlight from one element to another, given that all of them are children of the same parent.

Another obvious need is to remove the `spotlight-scene` from the DOM
when not needed anymore.

> In all of the further APIs I'll use `sls` term to represent the concrete
`spotlight-scene` instance that the properties and methods belong to.

#### properties:
* `sls.container` <small>[read only]</small>
    - returns the `container` element that the component was initialized with (see base API above)
    - `container` MAY NOT be changed
* `sls.target`
    - returns the currently 'spotlighted' element (the current `target`)
    - setting this property will move the 'spotlight' to another `target`
    - acceptible values are subject to the same constraints as in the main API
        - MUST be an element
        - MUST be a descendend of the `container`

#### methods:
* `sls.remove()`
    - removes the `spotlight-scene` component and performs all relevant cleanups