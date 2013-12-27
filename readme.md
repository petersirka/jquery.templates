# jQuery templates

Simple jQuery template engine.

- easy to use
- minified only 8.8 kB (without GZIP compression)
- great functionality
- great use
- works in IE 7+
- supports rendering of collections

__MUST SEE:__

- [partial.js client-side routing](https://github.com/petersirka/partial.js-clientside)
- [jQuery two way bindings](https://github.com/petersirka/jquery.bindings)
- [Web application framework for node.js - partial.js](https://github.com/petersirka/partial.js)

Example:

```html
<div id="render"></div>

<div id="render-with-template">
	<div>{name}</div>
</div>

<script type="text/template" id="template">
	<div class="user">
		<div>Index: {#}</div>
		<div>User: {!name} (encoded), {name} (raw)</div>
		<div>Credits: {credits | ### ### ##.##} {credits | 'zero', 'one', 'two-three-four', 'other'}</div>
		<div>Registered: {registered | yyyy-MM-dd}</div>
	</div>
</script>
```

#### $.template(model, [template], [append])

> append {Boolean} - appned or rewrite? Default: __false__.

```js
$('#render').template({ name: 'Peter <b>Širka</b>', credits: 5, registerd: new Date() }, '#template');

// or

$('#render').template([{ name: 'Peter Širka', credits: 5, registerd: new Date() }, { name: 'Lucia Širková', credits: 1230.34, registerd: new Date() }], '#template');

// or

// pre-compile after HTML DOM is ready
// $('#render-with-template').template();

$('#render-with-template').template([{ name: 'Peter' }, { name: 'Lucia' }, { name: 'Ivo' }, { name: 'Sonia' }]);

// or

$('#render').template(['A', 'B', 'C'], '<div>{} - encoded, {!} - raw (index: {#})</div>');
```