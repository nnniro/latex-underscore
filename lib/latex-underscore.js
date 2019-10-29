const {
	CompositeDisposable
} = require('atom')

module.exports = {
	subscriptions: null,

	activate() {
		this.subscriptions = new CompositeDisposable()
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'latex-underscore:underscoring': () => this.underscoring()
		}))
	},

	deactivate() {
		this.subscriptions.dispose()
	},

	underscoring() {
		const editor = atom.workspace.getActiveTextEditor()
		const selection = editor.getSelectedText()
		var strLength = function(str, encode) {
			var underscoredspace ='____'
			var setEncode = 'Shift_JIS'
			var c         = ''

			if (encode && encode !== '') {
				if (encode.match(/^(SJIS|Shift[_\-]JIS)$/i)) {
					setEncode = 'Shift_JIS';
				} else if (encode.match(/^(UTF-?8)$/i)) {
					setEncode = 'UTF-8';
				}
			}

			for (var i = 0, len = str.length; i < len; i++) {
				c = str.charCodeAt(i);
				if (setEncode === 'UTF-8') {
					if ((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
						underscoredspace += '_';
					} else {
						underscoredspace += '__';
					}
				} else if (setEncode === 'Shift_JIS') {
					if ((c >= 0x0 && c < 0x81) || (c == 0xa0) || (c >= 0xa1 && c < 0xdf) || (c >= 0xfd && c < 0xff)) {
						underscoredspace += '_';
					} else {
						underscoredspace += '__';
					}
				}
			}
			return underscoredspace;
		};
		var stringCount = strLength(selection)
		if (editor) {
			editor.insertText('\\underline{' + stringCount + '}')
		}
	}
}
