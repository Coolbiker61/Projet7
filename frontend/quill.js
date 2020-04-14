
var options = {
    debug: 'info',
    modules: {
      toolbar: '#toolbar-container',
    },
    placeholder: 'Compose an epic...',
    //readOnly: true,
    theme: 'snow'
};
let counter = 0;
var editor;
document.getElementById("repond").addEventListener("click", function (params) {
    counter++;
    var html = "<div id=\"editor"+counter+"\"><p>Hello World!</p></div>";
    document.getElementById("repond").insertAdjacentHTML('afterend', html); 
    editor = new Quill('#editor'+counter, options);
})

var quill = new Quill('#editor-container', {
    modules: {
      syntax: true,
      toolbar: '#toolbar-container'
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  });






