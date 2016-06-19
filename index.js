var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var cm = require("sdk/context-menu");

var button = buttons.ActionButton({
  id: "url2qr",
  label: "Convert URL to QR",
  icon: {
    "16": "./qr-code-16.png",
    "32": "./qr-code-32.png",
    "64": "./qr-code-64.png"
  },
  onClick: handleClick
});

var qr_panel = require("sdk/panel").Panel({
  contentURL: 'https://chart.googleapis.com/chart?cht=qr&chs=320x320&chl=https://developer.mozilla.org/',
  height: 360,
  width: 360
});

qr_panel.on("show", function() {
  qr_panel.port.emit("show");
});

require("sdk/context-menu").Item({
  label: "Convert URL to QR",
  context: cm.PageContext(),
  contentScript: 'self.on("click", function (node, data) {' +
                 " self.postMessage(node.src);" +
                 '});',
  onMessage: function(src) {
    show_qr_panel(tabs.activeTab.url);
  }
});

require("sdk/context-menu").Item({
  label: "Convert string to QR",
  context: cm.SelectionContext(),
  contentScript: 'self.on("click", function () {' +
                 " self.postMessage(window.getSelection().toString());" +
                 '});',
  onMessage: function(src) {
    console.log(src)
    show_qr_panel(src);
  }
});

function handleClick(state) {
  show_qr_panel(tabs.activeTab.url);
}

function show_qr_panel(text) {
    console.log("text: " + text)
    console.log("text.length: " + text.length)
    bytes = encodeURI(text).replace(/%[0-9A-F]{2}/g, '*').length
    console.log("text.bytes: " + bytes)
    if (bytes > 100)
    {
      height = 480
      width = 480
    }
    else if (bytes > 50)
    {
      height = 360
      width = 360
    }
    else
    {
      height = 240
      width = 240
    }
    console.log("height: " + height)
    console.log("width: " + width)
    qr_panel.contentURL = "https://chart.googleapis.com/chart?cht=qr&chs=" + width + "x" + height + "&chl=" + encodeURIComponent(text);
    qr_panel.resize(width, height)
    qr_panel.show();
}