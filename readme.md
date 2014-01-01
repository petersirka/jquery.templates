# jQuery templates

Simple jQuery template engine. __This plugin is a little big cannon for the web development.__

![jQuery templates](http://source.858project.com/img/jquery-templates.png)

- easy to use
- minified only 9.2 kB (without GZIP compression)
- great functionality
- great use
- works in IE 8+
- supports rendering of collections
- [__DEMO EXAMPLE__](http://source.858project.com/jquery-templates-demo.html)

__MUST SEE:__

- [partial.js client-side routing](https://github.com/petersirka/partial.js-clientside)
- [jQuery two way bindings](https://github.com/petersirka/jquery.bindings)
- [Web application framework for node.js - partial.js](https://github.com/petersirka/partial.js)

#### How does it works?

- plugin parse and compile string from HTML or TEMPLATE
- next is the template cached

__Template markups__

- {property} = output: property value (encoded)
- {!property} = output: property value (raw)
- {} = plain array value (encoded)
- {!} = plain array value (raw)
- {#} = current index
- {number | ### ### ###.##} - numbers formatting
- {date | dd.MM.yyyy HH:mm:ss} - date/time formatting
- {number | 'zero', 'one', 'two', 'two-three-four', 'other'} - number pluralizing
- {boolean | 'true' : 'false'} - condition
- {number | 'EVEN, true' : 'ODD, false'} - condition

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