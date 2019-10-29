# Changelog

* __1.3.0__
  * Fixed [Issue #1](https://github.com/gullerya/spotlight/issues/1) - misposition of the inner fence on window resize

* __1.2.1__
  * minor API bug fix - when moving to the same target we still need to reture `Promise` (resolved one)

* __1.2.0__
  * added customizable transition duration
  * added API `moveTo` (same as setting the target, but returns `Promise`, resolved when finished)
  * `close` API also returns `Promise`, resolved when all done

* __1.1.0__
  * initial release