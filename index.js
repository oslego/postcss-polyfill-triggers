var postcss   = require('postcss');
var fs        = require('fs');
var source    = fs.readFileSync('styles-pre.css');
var root      = postcss.parse(source);
var keyframes = {};
var prefixes  = ['', '-webkit-'];


var atRuleTemplate = postcss.parse('@keyframes name { to { opacity: 1; } }');

root.eachInside(function (node) {
    var next         = node.next(),
        animName     = "",
        animDuration = "1s",
        animDecl;

    if (node.type === 'comment' && node.text === '@polyfill' && next.type === 'decl'){
        animName = next.prop + '\\:' + next.value;

        prefixes.forEach(function (pfx) {
          animDecl = postcss.decl({ prop: pfx + 'animation', value: animName + ' ' + animDuration });
          node.parent.insertAfter( next, animDecl);
        })

        keyframes[animName] = true;
    }
});

Object.keys(keyframes).map(function (name) {
  prefixes.forEach(function (pfx) {
    var keyframesAtRule = atRuleTemplate.first.clone({ name: pfx + 'keyframes', params: name });
    root.append(keyframesAtRule);
  })
})

console.log(root.toString())
