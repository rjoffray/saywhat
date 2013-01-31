# JsRender: Next generation NodeJS Templates
Optimized for high-performance pure string-based rendering, without DOM or jQuery hassle dependency. (Current version - "codeless" tag syntax)

Original demos: [http://borismoore.github.com/jsrender/demos/step-by-step/index.html](http://borismoore.github.com/jsrender/demos/step-by-step/index.html).
See also [JsViews step-by-step samples](http://borismoore.github.com/jsviews/demos/step-by-step/index.html)

### Without Express

After you clone this module with npm or git:

git clone git://github.com/alex-pilon/node_jsrender.git
OR
npm install node_jsrender

**// server.js**

    var jsrender = require('jsrender');

    process.on('start', function () {
      jsrender.template("yourtemplate", "{{=myvar}}");
      var result = jsrender.render("yourtemplate", {myvar:"Hello World!"});
      
      console.log(result);
    });

Yields:

    <h4>Hello World</h4>;

### With Express

But who _isn't_ using express these days?

**// server.js**

    var jsrender = require('jsrender');
    var express = require('express');

    var app = express.createServer();

    // TODO Make sure this is right
    app.register('jsrender', jsrender.express);

    app.set("view options", { layout: false });

    app.get('/', function (req, res) {
      var data = {people:[{name:"Alex",age:23},{name:"Waldo",age:34}],things:"Render all the things!"};
      res.render('index.jsrender', {meta: {title: "List of stuff"}, data: data});
    });

    app.listen(8080);


**// index.jsrender**

    {{=meta.title}}

    People!
    {{#each data.people}}
      {{=name}} is {{=age}}
    {{/each}}


### Partials

// TODO In the partial tag if an array of objects is passed in then loop over them with partial..?
Refactoring the above index.jsrender template (pretending that we have a complex view of people data):

**// index.jsrender**

    {{=meta.title}}

    People!
    {{#each data.people}}
      {{partial name=name age=age}}
    {{/each}}

**// person.jsrender**

    {{=name}} is {{=age}}


### Layout

This section demonstrates two features; 
1. Using layouts.
2. The layout tag allows you to change the layout of a particular template.

#### Using layouts 

First lets take the above example express server and remove the nonsense about not using a layout:

**// server.js**

    var jsrender = require('jsrender');
    var express = require('express');

    var app = express.createServer();

    // TODO Make sure this is right
    app.register('jsrender', jsrender.express);

    // no more turn off layout

    app.get('/', function (req, res) {
      var data = {people:[{name:"Alex",age:23},{name:"Waldo",age:34}],things:"Render all the things!"};
      res.render('index.jsrender', {meta: {title: "List of stuff"}, data: data});
    });

    app.listen(8080);

**// layout.jsrender**

    TODO: How does this get here.. can a template pass variables to the layout using something like a block?
    {{=body}}

The layout template automatically receives a variable called body which contains the rendered result of the content template, e.g.; index.js

**// index.js**
    My Interesting Observations about Niches
    This is my content section where I detail something very interesting about a very niche subject.  

    Favorite Links

    NodeJS
    jQuery
    Other great new technologies

#### The layout tag
    
TODO  

### Templatable Templates / Script Blocks containing templates for use on the client

Okay, so far so good. Now the real value (read: what I really like about this) is that using this templating library gives me a single codebase that can work on the same templates on both the client and the server.
One of the problems you may not have thought of is what happens if you have a template that rendered on the server that has an inline template that is meant to be used on the client. Because it is using the same syntax there is some overlap here. We don't want the client template to be rendered at all.

Part of the express wrapper includes a tag syntax that is converted to the regular template syntax post render.

In a server template, {% and %} will be converted to {{ and }} respectively.

// TODO Remove the tmpl tag and put the tag conversion in the compile method.

**// index.js**

    This is a template. This is my variable: {%=myvariable%}
    A quick example of using templatable templates.

Once this is rendered the output returned will look like

**// index.js (rendered)**

    This is a template. This is my variable: {{=myvariable}}

This inline template is now ready to be used on the client.

You can mix and match this syntax to do something interesting things that I have not yet experimented with yet.

### Reusing Partials on the Server and Client

I have yet to add this functionality.. I may need to do some tricky business to accomplish this.
