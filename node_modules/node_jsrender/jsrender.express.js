var jsrender = require('./jsrender');

jsrender.views.registerTags({
	"partial": function (path, opts) {
		return this.data.partial(path, opts || {});
	},
	"layout": function (path) {
		this.data.layout(path);
	},
	// allow serverside templates to contain templates for clientside use
	"tmpl": function (content) {
		return jsrender.render(content).replace('{%','{{').replace('%}','}}');
	}
});

exports.compile = function (markup, options) {
	jsrender.views.allowCode = true;

	options = options || {};
	var name = options.filename || markup;

	delete jsrender.views.templates[name];

	jsrender.template(name, markup);

	return function render(locals) {
		return jsrender.render(name, locals);
	};
};
