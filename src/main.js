'use strict';

var urls = readFromFile('my-urls.txt').split('\n');
var messages = readFromFile('my-messages.txt').split('\n');

//window.console.log(urls);
//window.console.log(messages);

urls.forEach(function(url) {

  // открываем страницу с комментариями
  playMacro('URL GOTO=' + url);

  var message = messages[Math.floor(Math.random() * messages.length)];

  // заполняем поля соответствующими данными
  playMacro('TAG POS=1 TYPE=INPUT:TEXT FORM=ID:commentform ATTR=ID:author CONTENT=Alexander');
  playMacro('TAG POS=1 TYPE=INPUT:TEXT FORM=ID:commentform ATTR=ID:email CONTENT=alexander@example.com');
  playMacro('TAG POS=1 TYPE=INPUT:TEXT FORM=ID:commentform ATTR=ID:url CONTENT=http://www.example.com');
  playMacro('TAG POS=1 TYPE=TEXTAREA FORM=ID:commentform ATTR=ID:comment CONTENT=' + message.split(' ').join('<SP>'));
  playMacro('PAUSE');
});

function playMacro(macro, opts) {
	var options     = opts || {};
	var errorIgnore = options["errorIgnore"] ? "YES" : "NO" || "NO";
	var timeoutStep = options["timeoutStep"] || 1;
	macro = "SET !REPLAYSPEED FAST" +
		"\nSET !ERRORIGNORE " + errorIgnore +
		"\nSET !TIMEOUT_STEP " + timeoutStep +
		"\n" + macro;
	var code = iimPlayCode(macro);

	switch (code) {
		case -101:
			throw new Error("\nScript was stopped by the user.\n");
		case -920:
		case -921:
		case -922:
		case -923:
		case -924:
		case -925:
		case -926:
			window.console.error("Element was not found on current page: ", iimGetLastError());
			break;
		case -1001:
			window.console.error("error", "Error executing action on current page:", iimGetLastError());
	}

	var extract = iimGetLastExtract().split("[EXTRACT]");

	return {
		"code": code,
		"extract": extract.length === 1 ? extract[0] : extract
	};
}

function readFromFile(fileName) {
  var file = imns.Pref.getFilePref('defdatapath');
  file.append(fileName);
  try {
    return imns.FIO.readTextFile(file).replace(/\uFEFF/g, '');
  } catch (e) {
    throw new Error('File ' + fileName + ' does not exist in the iMacros\' Datasources folder.');
  }
}
