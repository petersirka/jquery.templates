# jQuery templates

Simple jQuery template engine.

__IMPORTANT:__

- [partial.js - web application framework for node.js](https://github.com/petersirka/partial.js)
- [partial.js client-side routing](https://github.com/petersirka/partial.js-clientside)
- [jQuery two way bindings](https://github.com/petersirka/jquery.bindings)

Example:

```html
<div id="render"></div>

<div id="render-with-template">
	<div>{name}</div>
</div>

<script type="text/template" id="template">
	<div class="user">
		<div>User: {!name} (encoded), {name} (raw)</div>
		<div>Credits: {credits | ### ### ##.##} {credits | 'zero', 'one', 'two-three-four', 'other'}</div>
		<div>Registered: {registered | yyyy-MM-dd}</div>
	</div>
</script>
```

```js
$('#render').template({ name: 'Peter <b>Širka</b>', credits: 5, registerd: new Date() }, '#template');

// or

$('#render').template([{ name: 'Peter Širka', credits: 5, registerd: new Date() }, { name: 'Lucia Širková', credits: 1230.34, registerd: new Date() }], '#template');

// or

// pre-compile after HTML DOM is ready
// $('#render-with-template').template();

$('#render-with-template').template([{ name: 'Peter' }, { name: 'Lucia' }, { name: 'Ivo' }, { name: 'Sonia' }]);

// or

$('#render').template(['A', 'B', 'C'], '<div>{}</div>');

// or

$('#render').template(['A', 'B', 'C'], '<div>{}</div>');
```