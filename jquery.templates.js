var jquerytemplates_cache = {};

function template_parse(template) {

	var self = this;

	var indexBeg = 0;
	var indexer = 0;
	var index = 0;

	var builder = [];
	var property = [];
	var keys = {};

	var tmp = template.match(/(@)?\{[^}\n]*\}/g);

	if (tmp === null)
		tmp = [];

	var length = tmp.length;

	for (var i = 0; i < length; i++) {

		var format = '';
		var name = tmp[i];
		var isEncode = true;

		indexEnd = template.indexOf(name, indexBeg);

		var b = template.substring(indexBeg, indexEnd);

		builder.push(b);
		indexBeg = indexEnd + name.length;

		index = name.indexOf('|');
        if (index !== -1) {

            format = name.substring(index + 1, name.length - 1).trim();
            name = name.substring(1, index);

            var pluralize = template_parse_pluralize(format);
            if (pluralize.length === 0) {
                if (format.indexOf('#') === -1) {
                    var condition = template_parse_condition(format);
                    if (condition.length === 0) {
                        var count = parseInt(format, 10);
                        if (isNaN(count))
                        	count = 0;
                        if (count === 0) {
                            format = ".format('" + format + "')";
                        } else
                            format = ".max(" + (count + 3) + ",'...')";
                    } else
                        format = ".condition(" + condition + ")";
                } else
                    format = ".format('" + format + "')";
            } else
                format = pluralize;
        }
        else
            name = name.substring(1, name.length - 1);

		if (name[0] === '!') {
			name = name.substring(1);
			isEncode = false;
		}

		name = name.trim();

		if (isEncode)
			format += '.toString().encode()';

		var controller = '';
		var key = name + format;

		indexer = keys[key];

		if (typeof(indexer) === 'undefined') {
			property.push(name.trim());
			indexer = property.length - 1;
			keys[key] = indexer;
		}
		builder.push('prop[' + indexer + ']' + format);
	}

	if (indexBeg !== template.length)
		builder.push(template.substring(indexBeg));

	var fn = [];
	var length = builder.length;
	for (var i = 0; i < length; i++) {

		var str = builder[i];

		if (i % 2 !== 0) {
			if (str.length > 0)
				fn.push(str);
		}
		else
			fn.push("'" + str.replace(/\'/g, "\\'").replace(/\n/g, '\\n') + "'");
	}

	return { generator: eval('(function(prop){return ' + fn.join('+') + ';})'), property: property };
}

function template_eval(generator, model, indexer) {

	var params = [];
	var length = generator.property.length;

	for (var i = 0; i < length; i++) {

		var property = generator.property[i];
		var val;

		if (property !== '') {

			if (property.indexOf('.') !== -1) {
				var arr = property.split('.');
				if (arr.length === 2)
					val = model[arr[0]][arr[1]];
				else if (arr.length === 3)
					val = model[arr[0]][arr[1]][arr[3]];
				else if (arr.length === 4)
					val = model[arr[0]][arr[1]][arr[3]][arr[4]];
				else if (arr.length === 5)
					val = model[arr[0]][arr[1]][arr[3]][arr[4]][arr[5]];
			} else if (property === '#')
				val = indexer;
			else
				val = model[property];
		} else
			val = model;

		if (typeof(val) === 'function')
			val = val(i);

		if (typeof(val) === 'undefined' || val === null)
			val = '';

		params.push(val);
	}

	return generator.generator.call(null, params);
}

function template_parse_pluralize(value) {

	value = value.trim();

	var condition = value.substring(0, 1);
	if (condition !== '"' && condition !== '\'')
		return '';

	var index = value.indexOf(condition, 1);
	if (index === -1)
		return '';

	var a = value.substring(1, index).replace(/\'/g, "\\'");
	var b = '';
	var c = '';
	var d = '';

	var beg = value.indexOf(condition, index + 1);

	if (beg === -1)
		return '';

	index = value.indexOf(condition, beg + 1);
	b = value.substring(beg + 1, index).replace(/\'/g, "\\'");
	c = '';

	beg = value.indexOf(condition, index + 1);
	if (beg === -1)
		return '';

	index = value.indexOf(condition, beg + 1);
	c = value.substring(beg + 1, index).replace(/\'/g, "\\'");

	beg = value.indexOf(condition, index + 1);
	if (beg === -1)
		return -1;

	index = value.indexOf(condition, beg + 1);
	d = value.substring(beg + 1, index).replace(/\'/g, "\\'");

	console.log(d);

	return ".pluralize('{0}','{1}','{2}','{3}')".format(a, b, c, d);
}

function template_parse_condition(value) {

	value = value.trim();

	var condition = value[0];
	if (condition !== '"' && condition !== '\'')
		return '';

	var index = value.indexOf(condition, 1);
	if (index === -1)
		return '';

	var a = value.substring(1, index).replace(/\'/g, "\\'");
	index = value.indexOf(condition, index + 2);

	if (index === -1)
		return "'{0}'".format(a);

	return "'{0}','{1}'".format(a, value.substring(index + 1, value.length - 1).replace(/\'/g, "\\'"));
}

String.prototype.max = function(length, chars) {
	var str = this;
	chars = chars || '...';
    return str.length > length ? str.substring(0, length - chars.length) + chars : str;
};

if (!String.prototype.encode) {
	String.prototype.encode = function() {
		return this.replace(/\&/g, '&amp;').replace(/\>/g, '&gt;').replace(/\</g, '&lt;').replace(/\"/g, '&quot;');
	};
}

if (!String.prototype.decode) {
	String.prototype.decode = function() {
		return this.replace(/&gt;/g, '>').replace(/\&lt;/g, '<').replace(/\&quot;/g, '"').replace(/&amp;/g, '&');
	};
}

if (!Date.prototype.format) {
	Date.prototype.format = function(format) {
		var self = this;

		var h = self.getHours();
		var m = self.getMinutes().toString();
		var s = self.getSeconds().toString();
		var M = (self.getMonth() + 1).toString();
		var yyyy = self.getFullYear().toString();
		var d = self.getDate().toString();

		var a = 'AM';
		var H = h.toString();


		if (h >= 12) {
			h -= 12;
			a = 'PM';
		}

		if (h === 0)
			h = 12;

		h = h.toString();

		var hh = h.padLeft(2, '0');
		var HH = H.padLeft(2, '0');
		var mm = m.padLeft(2, '0');
		var ss = s.padLeft(2, '0');
		var MM = M.padLeft(2, '0');
		var dd = d.padLeft(2, '0');
		var yy = yyyy.substring(2);

		return format.replace(/yyyy/g, yyyy).replace(/yy/g, yy).replace(/MM/g, MM).replace(/M/g, M).replace(/dd/g, dd).replace(/d/g, d).replace(/HH/g, HH).replace(/H/g, H).replace(/hh/g, hh).replace(/h/g, h).replace(/mm/g, mm).replace(/m/g, m).replace(/ss/g, ss).replace(/s/g, ss).replace(/a/g, a);
	};
}

if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^[\s]+|[\s]+$/g, '');
	};
}

if (!Number.prototype.format) {
	Number.prototype.format = function(format) {

		var index = 0;
		var num = this.toString();
		var beg = 0;
		var end = 0;
		var max = 0;
		var output = '';
		var length = 0;

		if (typeof(format) === STRING) {

			var d = false;
			length = format.length;

			for (var i = 0; i < length; i++) {
				var c = format.substring(i, i + 1);
				if (c === '#') {
					if (d)
						end++;
					else
						beg++;
				}

				if (c === '.')
					d = true;
			}

			var strBeg = num;
			var strEnd = '';

			index = num.indexOf('.');

			if (index !== -1) {
				strBeg = num.substring(0, index);
				strEnd = num.substring(index + 1);
			}

			if (strBeg.length > beg) {
				max = strBeg.length - beg;
				var tmp = '';
				for (var i = 0; i < max; i++)
					tmp += '#';

				format = tmp + format;
			}

			if (strBeg.length < beg)
				strBeg = strBeg.padLeft(beg, ' ');

			if (strEnd.length < end)
				strEnd = strEnd.padRight(end, '0');

			if (strEnd.length > end)
				strEnd = strEnd.substring(0, end);

			d = false;
			index = 0;

			var skip = true;
			length = format.length;

			for (var i = 0; i < length; i++) {

				var c = format.substring(i, i + 1);

				if (c !== '#') {

					if (skip)
						continue;

					if (c === '.') {
						d = true;
						index = 0;
					}

					output += c;
					continue;
				}

				var value = d ? strEnd.substring(index, index + 1) : strBeg.substring(index, index + 1);

				if (skip)
					skip = [',', ' '].indexOf(value) !== -1;

				if (!skip)
					output += value;

				index++;
			}

			return output;
		}

		output = '### ### ###';
		beg = num.indexOf('.');
		max = format || 0;

		if (max === 0 && beg !== -1)
			max = num.length - (beg + 1);

		if (max > 0) {
			output += '.';
			for (var i = 0; i < max; i++)
				output += '#';
		}

		return this.format(output);
	};
}

if (!Number.prototype.pluralize) {
	Number.prototype.pluralize = function(zero, one, few, other) {

		var num = this;
		var value = '';

		if (num == 0)
			value = zero || '';
		else if (num == 1)
			value = one || '';
		else if (num > 1 && num < 5)
			value = few || '';
		else
			value = other;

		var beg = value.indexOf('#');
		var end = value.lastIndexOf('#');

		if (beg === -1)
			return value;

		var format = value.substring(beg, end + 1);
		return num.format(format) + value.replace(format, '');
	};
}

if (!String.prototype.padLeft) {
	String.prototype.padLeft = function (max, c) {
	    var self = this.toString();
	    return Array(Math.max(0, max - self.length + 1)).join(c || '0') + self;
	};
}

if (!String.prototype.padRight) {
	String.prototype.padRight = function (max, c) {
	    var self = this.toString();
	    return self + Array(Math.max(0, max - self.length + 1)).join(c || '0');
	};
}

String.prototype.template = function(model) {

	var generator = template_parse(obj);

	if (!(model instanceof Array))
		return template_eval(generator, model, 0);

	var builder = '';
	for (var i = 0; i < length; i++)
		builder += template_eval(generator, model[i], i);

	return builder;
};

if (!String.prototype.format) {
	String.prototype.format = function() {
	    var formatted = this;
	    var length = arguments.length;
	    for (var i = 0; i < length; i++) {
	        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
	        formatted = formatted.replace(regexp, arguments[i]);
	    }
	    return formatted;
	};
}

$.fn.template = function(model, template) {

	var self = this;

	if (typeof(model) === 'string' && typeof(template) === 'undefined') {
		var tmp = template;
		template = model;
		model = tmp;
	}

	var id = template || '';

	if (template) {
		if (template.indexOf('{') === -1)
			template = $(template).html();
	} else
		template = self.attr('data-template');

	var isArray = model instanceof Array;
	var length = isArray ? model.length : 0;

	self.each(function() {

		var self = this;
		var el = $(self);

		if (id.length === 0)
			id = el.attr('id') || '';

		if (id.length === 0)
			id = el.attr('data-id') || '';

		if (id.length === 0)
			id = el.attr('data-model') || '';

		if (id.length === 0)
			id = el.attr('class') || '';

		if (id.length === 0)
			throw new Error('You must define "id" or "data-id" or "data-model" or "class" attribute in element.');

		var obj = jquerytemplates_cache[id];

		if (typeof(obj) === 'undefined') {

			if (typeof(template) === 'undefined')
				template = el.html();

			obj = template_parse(template);
			jquerytemplates_cache[id] = obj;
		}

		if (typeof(model) === 'undefined' || model === null) {
			el.html('');
			return;
		}


		if (!isArray) {
			el.html(template_eval(obj, model, 0));
			return;
		}

		var builder = '';
		for (var i = 0; i < length; i++)
			builder += template_eval(obj, model[i], i);

		el.html(builder);
	});

	return self;
};

Number.prototype.condition = function(ifTrue, ifFalse) {
	return (this % 2 === 0 ? ifTrue : ifFalse) || '';
};

Boolean.prototype.condition = function(ifTrue, ifFalse) {
	return (this == true ? ifTrue : ifFalse) || '';
};