(function(Hope){
    var hyphenate = function (text) {
        var all = "[ґєіїабвгдеёжзийклмнопрстуфхцчшщъыьэюя]",
            glas = "[єіїаеёиоуыэюя]",
            sogl = "[ґбвгджзклмнпрстфхцчшщ]",
            zn = "[йъь]",
            shy = "\xAD",
            re = [];

        re[1] = new RegExp("(" + zn + ")(" + all + all + ")", "ig");
        re[2] = new RegExp("(" + glas + ")(" + glas + all + ")", "ig");
        re[3] = new RegExp("(" + glas + sogl + ")(" + sogl + glas + ")", "ig");
        re[4] = new RegExp("(" + sogl + glas + ")(" + sogl + glas + ")", "ig");
        re[5] = new RegExp("(" + glas + sogl + ")(" + sogl + sogl + glas + ")", "ig");
        re[6] = new RegExp("(" + glas + sogl + sogl + ")(" + sogl + sogl + glas + ")", "ig");

        for (var i = 1; i < 7; ++i) {
            text = text.replace(re[i], "$1" + shy + "$2");
        }

        return text;
    };

    const symbolWeight = {
        large: ['m', 'w', 'ю', 'ж', 'ф', 'ш', 'щ', 'ы', 'м', 'д', 'ъ', '—', '…'],
        small: ['l', 'i', 'j', 'f', 't', 'r', 'ґ', 'г', 'і', 'ї', '!', '?', ',', '.', ':', ';', ' ', '\"', '\'', '\(', '\)', '\{', '\}', '\[', '\]', '-']
    };
    const symbolWeightValues = {small: 1, medium: 2, large: 3};

    var getWeight = function (symbol) {
        if (typeof symbol !== 'string') {
            console.error('type error');
        } else {
            symbol = symbol.toLowerCase();

            if (symbolWeight.large.indexOf(symbol) != -1) {
                return symbolWeightValues.large;
            }
            else if (symbolWeight.small.indexOf(symbol) != -1) {
                return symbolWeightValues.small;
            } else {
                return symbolWeightValues.medium;
            }
        }
    };

    var defaultOptions = {
        hyphenate: true,
        symbols: '&hellip;'
    };

    var textTrim = function (string, number, options = {}) {
        options = Object.assign(defaultOptions, options);

        string = string.trim();
        if (options.hyphenate) {
            string = hyphenate(string);
        }

        var reg = /[а-яёіїА-Яa-zA-Z]/;
        var total = 0;

        if (string.length > number) {

            string = string.substring(0, number).trim();

            for (var i = string.length - 1; i > 0; i--) {
                var currentTitle = string.charAt(i);
                if (reg.test(currentTitle)) {
                    break;
                } else {
                    string = string.substring(0, string.length - 1);
                }
            }

            string += options.symbols;
        }

        var arrayOfString = string.split('');
        string = string.replace(/<\/?[a-z][a-z0-9]*\s?\/?>/gi, ' ');
        string = string.replace(/\•/gi, '');
        string = string.replace(/\n/gi, ' ');
        string = string.replace(/\&para\;/gi, ' ');
        string = string.replace(/\&sect\;/gi, ' ');

        for (var i = 0; i < arrayOfString.length; i++) {
            total += getWeight(arrayOfString[i]);
        }

        if (total > number) {

            string = string.substring(0, number).trim();

            for (var i = string.length - 1; i > 0; i--) {
                var desc = string.charAt(i);

                if (reg.test(desc)) {
                    break;
                } else {
                    string = string.substring(0, string.length - 1);
                }
            }

            var summLastLetters = String(string).substring(String(string).lastIndexOf(' ')).trim().replace(/\-\–[ ]\,\./gi, '');
            if (summLastLetters.length <= 1) {
                string = string.substring(0, string.length - summLastLetters.length);
                string += options.symbols;
            } else {
                string += options.symbols;
            }
        }

        return string;
    };

    Hope.Utils = Hope.Utils || {};
    Hope.Utils.textTrim = textTrim;
})(Hope);