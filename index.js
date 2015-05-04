var postcss = require('postcss');
var fs = require('fs');

var source = fs.readFileSync('styles-pre.css');
var root = postcss.parse(source);

var rules = root.nodes.filter(function(rule){
  return rule.type === "atrule"
}).map(function(rule){
  return {
    condition: rule.params,
    rules: rule.nodes.join('').replace(/\n/g, '')
  }
})

var host = postcss.rule({ selector: 'html' })
host.append({ prop: "content", value: '\'' + JSON.stringify(rules) + '\'' })

root.append(host);

fs.writeFile('styles-post.css', root.toResult().css);
