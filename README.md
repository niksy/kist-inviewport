# element-within-viewport

[![Build Status][ci-img]][ci]
[![BrowserStack Status][browserstack-img]][browserstack]

Check if element is within viewport.

Convenient wrapper around [viewprt](https://github.com/gpoitch/viewprt)
supporting debounced listeners and fallback for older browsers.

## Install

```sh
npm install element-within-viewport --save
```

## Usage

```js
import elementWithinViewport from 'element-within-viewport';

elementWithinViewport(document.querySelector('#jackie'), {
	onEnter: (element) => {
		// Element in viewport!
	}
});
```

## API

### elementWithinViewport(element, options)

Check if element is within viewport and calls proper callback.

#### element

Type: `Element`

Element to check.

#### options

Type: `Object`

| Property              | Type       | Default value          | Description                                                                                                                                                                                          |
| --------------------- | ---------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `threshold`           | `Number`   | `0`                    | Positive value in pixels which will signal plugin to check for element presence earlier in document.                                                                                                 |
| `scrollResizeHandler` | `Function` | `(handler) => handler` | Window scroll and resize event handler. Useful if you want to use [throttle or debounce methods](#throttle-debounce-scroll-resize) on those events. Should return new handler (original or wrapped). |
| `onEnter`             | `Function` | `() => {}`             | Callback to execute if element is within viewport.                                                                                                                                                   |
| `onExit`              | `Function` | `() => {}`             | Callback to execute if element exits viewport.                                                                                                                                                       |
| `once`                | `Boolean`  | `false`                | If true, will call `onEnter` only once.                                                                                                                                                              |
| `fallback`            | `Boolean`  | `true`                 | Fallback to running `onEnter` on start if browser doesn’t support necessary features.                                                                                                                |

### instance.destroy()

Destroy instance.

## FAQ

### Throttling and debouncing scroll and resize event<a name="throttle-debounce-scroll-resize"></a>

If you want to throttle or debounce scroll and resize events, modify handler
with `scrollResizeHandler` property.

```js
import { debounce } from 'throttle-debounce';

elementWithinViewport(document.querySelector('#jackie'), {
	scrollResizeHandler: (handler) => debounce(300, handler)
});
```

## Browser support

Tested in IE9+ and all modern browsers.

## Test

For automated tests, run `npm run test:automated` (append `:watch` for watcher
support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/element-within-viewport
[ci-img]: https://travis-ci.com/niksy/element-within-viewport.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=N1NNRmJzVHl6WGZYem1CZkxvQk9xSDZLOUtMaGlhbXNRd0kydGM3SURaaz0tLTBqVWlxQXp6cTVmSUM1eEV4TVhCREE9PQ==--824629ccac56e8c6b37b39dc728d871f2c31c336

<!-- prettier-ignore-end -->
