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
  contentScript: 'self.on("click", function (node, data) {' +
                 " self.postMessage(node.src);" +
                 '});',
  onMessage: function(src) {
    show_qr_panel();
  }
  });

function handleClick(state) {
  show_qr_panel();
}

function show_qr_panel() {
    console.log("Active Tab: " + tabs.activeTab.url)
    qr_panel.contentURL = "https://chart.googleapis.com/chart?cht=qr&chs=320x320&chl=" + tabs.activeTab.url;
    qr_panel.show();
}