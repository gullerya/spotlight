# Changelog

* __1.5.0__
  * Implemented [Issue #4](https://github.com/gullerya/spotlight/issues/4) - raised the default opacity of shadow to `0.8`
  * Implemented [Issue #5](https://github.com/gullerya/spotlight/issues/5) - `shadowColor` is overridable by both initial options and property on the living `spotlight-scene`

* __1.4.0__
  * Implemented [Issue #2](https://github.com/gullerya/spotlight/issues/2) - allow to create spotlight without a target for the beginning
  * overrode `getBoundingClientRect` method to return useful dimensions of the spotted area
  * minor styling adjustements of the transitions

* __1.3.2__
  * Fixed [Issue #1](https://github.com/gullerya/spotlight/issues/1) - misposition of the inner fence on window resize
    * minor styling adjustements of the inner fence

* __1.2.1__
  * minor API bug fix - when moving to the same target we still need to reture `Promise` (resolved one)

* __1.2.0__
  * added customizable transition duration
  * added API `moveTo` (same as setting the target, but returns `Promise`, resolved when finished)
  * `close` API also returns `Promise`, resolved when all done

* __1.1.0__
  * initial release