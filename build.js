var modules = require.context(
    "./lib", // context folder
    true,    // include subdirectories
    /(.css|.js$)/   // RegExp
);

modules.keys().forEach(function(name){
    name && modules(name);
});