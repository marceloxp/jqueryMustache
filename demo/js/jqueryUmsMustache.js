// Version: 1.0.2 - Last modified: 2020-07-02 20:00:01
function jqueryumsmustache_utf8_encode(argString)
{
	//  discuss at: http://phpjs.org/functions/utf8_encode/
	// original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: sowberry
	// improved by: Jack
	// improved by: Yves Sucaet
	// improved by: kirilloid
	// bugfixed by: Onno Marsman
	// bugfixed by: Onno Marsman
	// bugfixed by: Ulrich
	// bugfixed by: Rafal Kukawski
	// bugfixed by: kirilloid
	//   example 1: utf8_encode('Kevin van Zonneveld');
	//   returns 1: 'Kevin van Zonneveld'

	if (argString === null || typeof argString === 'undefined')
	{
		return '';
	}

	// .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	var string = (argString + '');
	var utftext = '',
		start, end, stringl = 0;

	start = end = 0;
	stringl = string.length;
	for (var n = 0; n < stringl; n++)
	{
		var c1 = string.charCodeAt(n);
		var enc = null;

		if (c1 < 128)
		{
			end++;
		}
		else if (c1 > 127 && c1 < 2048)
		{
			enc = String.fromCharCode(
				(c1 >> 6) | 192, (c1 & 63) | 128
			);
		}
		else if ((c1 & 0xF800) != 0xD800)
		{
			enc = String.fromCharCode(
				(c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
		}
		else
		{
			// surrogate pairs
			if ((c1 & 0xFC00) != 0xD800)
			{
				throw new RangeError('Unmatched trail surrogate at ' + n);
			}
			var c2 = string.charCodeAt(++n);
			if ((c2 & 0xFC00) != 0xDC00)
			{
				throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
			}
			c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
			enc = String.fromCharCode(
				(c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
		}
		if (enc !== null)
		{
			if (end > start)
			{
				utftext += string.slice(start, end);
			}
			utftext += enc;
			start = end = n + 1;
		}
	}

	if (end > start)
	{
		utftext += string.slice(start, stringl);
	}

	return utftext;
}

function jqueryumsmustache_md5(str)
{
	//  discuss at: http://phpjs.org/functions/md5/
	// original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// improved by: Michael White (http://getsprink.com)
	// improved by: Jack
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//    input by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//  depends on: utf8_encode
	//   example 1: md5('Kevin van Zonneveld');
	//   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

	var xl;

	var rotateLeft = function(lValue, iShiftBits)
	{
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	};

	var addUnsigned = function(lX, lY)
	{
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4)
		{
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4)
		{
			if (lResult & 0x40000000)
			{
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			}
			else
			{
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		}
		else
		{
			return (lResult ^ lX8 ^ lY8);
		}
	};

	var _F = function(x, y, z)
	{
		return (x & y) | ((~x) & z);
	};
	var _G = function(x, y, z)
	{
		return (x & z) | (y & (~z));
	};
	var _H = function(x, y, z)
	{
		return (x ^ y ^ z);
	};
	var _I = function(x, y, z)
	{
		return (y ^ (x | (~z)));
	};

	var _FF = function(a, b, c, d, x, s, ac)
	{
		a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _GG = function(a, b, c, d, x, s, ac)
	{
		a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _HH = function(a, b, c, d, x, s, ac)
	{
		a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _II = function(a, b, c, d, x, s, ac)
	{
		a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var convertToWordArray = function(str)
	{
		var lWordCount;
		var lMessageLength = str.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = new Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength)
		{
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};

	var wordToHex = function(lValue)
	{
		var wordToHexValue = '',
			wordToHexValue_temp = '',
			lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++)
		{
			lByte = (lValue >>> (lCount * 8)) & 255;
			wordToHexValue_temp = '0' + lByte.toString(16);
			wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
		}
		return wordToHexValue;
	};

	var x = [],
		k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
		S12 = 12,
		S13 = 17,
		S14 = 22,
		S21 = 5,
		S22 = 9,
		S23 = 14,
		S24 = 20,
		S31 = 4,
		S32 = 11,
		S33 = 16,
		S34 = 23,
		S41 = 6,
		S42 = 10,
		S43 = 15,
		S44 = 21;

	str = this.jqueryumsmustache_utf8_encode(str);
	x = convertToWordArray(str);
	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;

	xl = x.length;
	for (k = 0; k < xl; k += 16)
	{
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = addUnsigned(a, AA);
		b = addUnsigned(b, BB);
		c = addUnsigned(c, CC);
		d = addUnsigned(d, DD);
	}

	var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

	return temp.toLowerCase();
}
(function defineMustache(global, factory)
{
	if (typeof exports === "object" && exports && typeof exports.nodeName !== "string")
	{
		factory(exports)
	}
	else if (typeof define === "function" && define.amd)
	{
		define(["exports"], factory)
	}
	else
	{
		global.Mustache = {};
		factory(global.Mustache)
	}
})(this, function mustacheFactory(mustache)
{
	var objectToString = Object.prototype.toString;
	var isArray = Array.isArray || function isArrayPolyfill(object)
	{
		return objectToString.call(object) === "[object Array]"
	};

	function isFunction(object)
	{
		return typeof object === "function"
	}

	function typeStr(obj)
	{
		return isArray(obj) ? "array" : typeof obj
	}

	function escapeRegExp(string)
	{
		return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
	}

	function hasProperty(obj, propName)
	{
		return obj != null && typeof obj === "object" && propName in obj
	}
	var regExpTest = RegExp.prototype.test;

	function testRegExp(re, string)
	{
		return regExpTest.call(re, string)
	}
	var nonSpaceRe = /\S/;

	function isWhitespace(string)
	{
		return !testRegExp(nonSpaceRe, string)
	}
	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
		"/": "&#x2F;",
		"`": "&#x60;",
		"=": "&#x3D;"
	};

	function escapeHtml(string)
	{
		return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s)
		{
			return entityMap[s]
		})
	}
	var whiteRe = /\s*/;
	var spaceRe = /\s+/;
	var equalsRe = /\s*=/;
	var curlyRe = /\s*\}/;
	var tagRe = /#|\^|\/|>|\{|&|=|!/;

	function parseTemplate(template, tags)
	{
		if (!template) return [];
		var sections = [];
		var tokens = [];
		var spaces = [];
		var hasTag = false;
		var nonSpace = false;

		function stripSpace()
		{
			if (hasTag && !nonSpace)
			{
				while (spaces.length) delete tokens[spaces.pop()]
			}
			else
			{
				spaces = []
			}
			hasTag = false;
			nonSpace = false
		}
		var openingTagRe, closingTagRe, closingCurlyRe;

		function compileTags(tagsToCompile)
		{
			if (typeof tagsToCompile === "string") tagsToCompile = tagsToCompile.split(spaceRe, 2);
			if (!isArray(tagsToCompile) || tagsToCompile.length !== 2) throw new Error("Invalid tags: " + tagsToCompile);
			openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + "\\s*");
			closingTagRe = new RegExp("\\s*" + escapeRegExp(tagsToCompile[1]));
			closingCurlyRe = new RegExp("\\s*" + escapeRegExp("}" + tagsToCompile[1]))
		}
		compileTags(tags || mustache.tags);
		var scanner = new Scanner(template);
		var start, type, value, chr, token, openSection;
		while (!scanner.eos())
		{
			start = scanner.pos;
			value = scanner.scanUntil(openingTagRe);
			if (value)
			{
				for (var i = 0, valueLength = value.length; i < valueLength; ++i)
				{
					chr = value.charAt(i);
					if (isWhitespace(chr))
					{
						spaces.push(tokens.length)
					}
					else
					{
						nonSpace = true
					}
					tokens.push(["text", chr, start, start + 1]);
					start += 1;
					if (chr === "\n") stripSpace()
				}
			}
			if (!scanner.scan(openingTagRe)) break;
			hasTag = true;
			type = scanner.scan(tagRe) || "name";
			scanner.scan(whiteRe);
			if (type === "=")
			{
				value = scanner.scanUntil(equalsRe);
				scanner.scan(equalsRe);
				scanner.scanUntil(closingTagRe)
			}
			else if (type === "{")
			{
				value = scanner.scanUntil(closingCurlyRe);
				scanner.scan(curlyRe);
				scanner.scanUntil(closingTagRe);
				type = "&"
			}
			else
			{
				value = scanner.scanUntil(closingTagRe)
			}
			if (!scanner.scan(closingTagRe)) throw new Error("Unclosed tag at " + scanner.pos);
			token = [type, value, start, scanner.pos];
			tokens.push(token);
			if (type === "#" || type === "^")
			{
				sections.push(token)
			}
			else if (type === "/")
			{
				openSection = sections.pop();
				if (!openSection) throw new Error('Unopened section "' + value + '" at ' + start);
				if (openSection[1] !== value) throw new Error('Unclosed section "' + openSection[1] + '" at ' + start)
			}
			else if (type === "name" || type === "{" || type === "&")
			{
				nonSpace = true
			}
			else if (type === "=")
			{
				compileTags(value)
			}
		}
		openSection = sections.pop();
		if (openSection) throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
		return nestTokens(squashTokens(tokens))
	}

	function squashTokens(tokens)
	{
		var squashedTokens = [];
		var token, lastToken;
		for (var i = 0, numTokens = tokens.length; i < numTokens; ++i)
		{
			token = tokens[i];
			if (token)
			{
				if (token[0] === "text" && lastToken && lastToken[0] === "text")
				{
					lastToken[1] += token[1];
					lastToken[3] = token[3]
				}
				else
				{
					squashedTokens.push(token);
					lastToken = token
				}
			}
		}
		return squashedTokens
	}

	function nestTokens(tokens)
	{
		var nestedTokens = [];
		var collector = nestedTokens;
		var sections = [];
		var token, section;
		for (var i = 0, numTokens = tokens.length; i < numTokens; ++i)
		{
			token = tokens[i];
			switch (token[0])
			{
				case "#":
				case "^":
					collector.push(token);
					sections.push(token);
					collector = token[4] = [];
					break;
				case "/":
					section = sections.pop();
					section[5] = token[2];
					collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
					break;
				default:
					collector.push(token)
			}
		}
		return nestedTokens
	}

	function Scanner(string)
	{
		this.string = string;
		this.tail = string;
		this.pos = 0
	}
	Scanner.prototype.eos = function eos()
	{
		return this.tail === ""
	};
	Scanner.prototype.scan = function scan(re)
	{
		var match = this.tail.match(re);
		if (!match || match.index !== 0) return "";
		var string = match[0];
		this.tail = this.tail.substring(string.length);
		this.pos += string.length;
		return string
	};
	Scanner.prototype.scanUntil = function scanUntil(re)
	{
		var index = this.tail.search(re),
			match;
		switch (index)
		{
			case -1:
				match = this.tail;
				this.tail = "";
				break;
			case 0:
				match = "";
				break;
			default:
				match = this.tail.substring(0, index);
				this.tail = this.tail.substring(index)
		}
		this.pos += match.length;
		return match
	};

	function Context(view, parentContext)
	{
		this.view = view;
		this.cache = {
			".": this.view
		};
		this.parent = parentContext
	}
	Context.prototype.push = function push(view)
	{
		return new Context(view, this)
	};
	Context.prototype.lookup = function lookup(name)
	{
		var cache = this.cache;
		var value;
		if (cache.hasOwnProperty(name))
		{
			value = cache[name]
		}
		else
		{
			var context = this,
				names, index, lookupHit = false;
			while (context)
			{
				if (name.indexOf(".") > 0)
				{
					value = context.view;
					names = name.split(".");
					index = 0;
					while (value != null && index < names.length)
					{
						if (index === names.length - 1) lookupHit = hasProperty(value, names[index]);
						value = value[names[index++]]
					}
				}
				else
				{
					value = context.view[name];
					lookupHit = hasProperty(context.view, name)
				}
				if (lookupHit) break;
				context = context.parent
			}
			cache[name] = value
		}
		if (isFunction(value)) value = value.call(this.view);
		return value
	};

	function Writer()
	{
		this.cache = {}
	}
	Writer.prototype.clearCache = function clearCache()
	{
		this.cache = {}
	};
	Writer.prototype.parse = function parse(template, tags)
	{
		var cache = this.cache;
		var tokens = cache[template];
		if (tokens == null) tokens = cache[template] = parseTemplate(template, tags);
		return tokens
	};
	Writer.prototype.render = function render(template, view, partials)
	{
		var tokens = this.parse(template);
		var context = view instanceof Context ? view : new Context(view);
		return this.renderTokens(tokens, context, partials, template)
	};
	Writer.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate)
	{
		var buffer = "";
		var token, symbol, value;
		for (var i = 0, numTokens = tokens.length; i < numTokens; ++i)
		{
			value = undefined;
			token = tokens[i];
			symbol = token[0];
			if (symbol === "#") value = this.renderSection(token, context, partials, originalTemplate);
			else if (symbol === "^") value = this.renderInverted(token, context, partials, originalTemplate);
			else if (symbol === ">") value = this.renderPartial(token, context, partials, originalTemplate);
			else if (symbol === "&") value = this.unescapedValue(token, context);
			else if (symbol === "name") value = this.escapedValue(token, context);
			else if (symbol === "text") value = this.rawValue(token);
			if (value !== undefined) buffer += value
		}
		return buffer
	};
	Writer.prototype.renderSection = function renderSection(token, context, partials, originalTemplate)
	{
		var self = this;
		var buffer = "";
		var value = context.lookup(token[1]);

		function subRender(template)
		{
			return self.render(template, context, partials)
		}
		if (!value) return;
		if (isArray(value))
		{
			for (var j = 0, valueLength = value.length; j < valueLength; ++j)
			{
				buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate)
			}
		}
		else if (typeof value === "object" || typeof value === "string" || typeof value === "number")
		{
			buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate)
		}
		else if (isFunction(value))
		{
			if (typeof originalTemplate !== "string") throw new Error("Cannot use higher-order sections without the original template");
			value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);
			if (value != null) buffer += value
		}
		else
		{
			buffer += this.renderTokens(token[4], context, partials, originalTemplate)
		}
		return buffer
	};
	Writer.prototype.renderInverted = function renderInverted(token, context, partials, originalTemplate)
	{
		var value = context.lookup(token[1]);
		if (!value || isArray(value) && value.length === 0) return this.renderTokens(token[4], context, partials, originalTemplate)
	};
	Writer.prototype.renderPartial = function renderPartial(token, context, partials)
	{
		if (!partials) return;
		var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
		if (value != null) return this.renderTokens(this.parse(value), context, partials, value)
	};
	Writer.prototype.unescapedValue = function unescapedValue(token, context)
	{
		var value = context.lookup(token[1]);
		if (value != null) return value
	};
	Writer.prototype.escapedValue = function escapedValue(token, context)
	{
		var value = context.lookup(token[1]);
		if (value != null) return mustache.escape(value)
	};
	Writer.prototype.rawValue = function rawValue(token)
	{
		return token[1]
	};
	mustache.name = "mustache.js";
	mustache.version = "2.3.2";
	mustache.tags = ["{{", "}}"];
	var defaultWriter = new Writer;
	mustache.clearCache = function clearCache()
	{
		return defaultWriter.clearCache()
	};
	mustache.parse = function parse(template, tags)
	{
		return defaultWriter.parse(template, tags)
	};
	mustache.render = function render(template, view, partials)
	{
		if (typeof template !== "string")
		{
			throw new TypeError('Invalid template! Template should be a "string" ' + 'but "' + typeStr(template) + '" was given as the first ' + "argument for mustache#render(template, view, partials)")
		}
		return defaultWriter.render(template, view, partials)
	};
	mustache.to_html = function to_html(template, view, partials, send)
	{
		var result = mustache.render(template, view, partials);
		if (isFunction(send))
		{
			send(result)
		}
		else
		{
			return result
		}
	};
	mustache.escape = escapeHtml;
	mustache.Scanner = Scanner;
	mustache.Context = Context;
	mustache.Writer = Writer;
	return mustache
});
var umsappJqueryPluginUmsMustache = (function()
{
	'use strict';
	var self;

	return {
		init: function()
		{
			self = this;
			self.urls = [];
		},

		render: function(options, _callback)
		{
			try
			{
				if (options.append === true)
				{
					options.keep = true;
				}
				if ((options.keep === false) && (empty(options.target)))
				{
					options.target = options.template;
				}

				var _data = (!empty(options.data)) ? options.data :
				{};
				var _method = (!empty(options.method)) ? options.method : 'GET';

				umslib.mustache_utils.trigger('on-mustache-before', options.url);
				var loadJson = function(p_callback)
				{
					$.ajax(
						{
							url: options.url,
							type: _method,
							dataType: 'json',
							data: _data
						})
						.done(function(json)
						{
							if (options.cache)
							{
								var md5_url = jqueryumsmustache_md5(options.url);
								self.urls[md5_url] = json;
							}
							p_callback(json);
							umslib.mustache_utils.trigger('on-mustache-after', options.url, json);
						})
						.fail(function(err)
						{
							console.log('Falha na solicitação.', err);
						})
						.always(function()
						{
							umslib.mustache_utils.trigger('on-mustache-after', options.url);
						});
				};

				var processResult = function(p_json, p_callback)
				{
					var use_json = p_json;
					use_json.extra = options.extra;
					if (options.beforeRenderJson !== undefined)
					{
						use_json = options.beforeRenderJson(use_json);
					}

					if (options.beforeRenderItem !== undefined)
					{
						for (var key in use_json.data)
						{
							use_json.data[key] = options.beforeRenderItem(use_json.data[key]);
						}
					}

					var template = $(options.template).html();
					Mustache.parse(template, options.tags);
					var rendered = Mustache.render(template, use_json);
					if ((options.append !== true) && (options.replace !== true))
					{
						$(options.target).replaceWith(rendered);
					}
					else
					{
						if (options.replace === true)
						{
							$(options.target).html('');
						}
						$(options.target).append(rendered);
					}

					if ((options.keep === false) && (options.replace === false))
					{
						$(options.template).remove();
					}

					if (p_callback !== undefined)
					{
						p_callback();
					}
				};

				if (options.direct === true)
				{
					processResult(options.source, _callback);
				}
				else
				{
					var from_cache = false;
					var md5_url = jqueryumsmustache_md5(options.url);

					if (options.cache)
					{
						from_cache = (self.urls[md5_url] !== undefined);
					}

					if (!from_cache)
					{
						loadJson
							(
								function(json)
								{
									processResult(json, _callback);
								}
							);
					}
					else
					{
						processResult(self.urls[md5_url], _callback);
					}
				}
			}
			catch (err)
			{
				console.log(err);
			}
		}
	};

})();

$(document).ready(function()
{
	umsappJqueryPluginUmsMustache.init();
});

$.fn.mustache = function(p_options, p_callback)
{
	'use strict';
	var options = p_options ||
	{};
	options.template = '#' + $(this).attr('id');

	if ($(this).attr('data-source') !== undefined)
	{
		options.url = $(this).attr('data-source');
	}

	if ($(this).attr('data-target') !== undefined)
	{
		options.target = $(this).attr('data-target');
	}

	if (options.keep === undefined)
	{
		options.keep = false;
	}

	if (options.target !== undefined)
	{
		options.target = '#' + options.target;
		if ($(options.target).length === 0)
		{
			throw new Error('Target not found!');
		}
	}

	options.direct = ((options.url === undefined) && (options.source !== undefined));
	options.extra = (options.extra === undefined) ?
	{} : options.extra;
	options.cache = (options.cache === undefined) ? false : options.cache;
	options.replace = (options.replace === undefined) ? false : options.replace;
	options.tags = (options.tags === undefined) ? ['{{', '}}'] : options.tags;

	umsappJqueryPluginUmsMustache.render(options, p_callback);
};


if (typeof CjsBaseClass === 'function')
{
	/* global CjsBaseClass,CJS_DEBUG_MODE_0,CJS_DEBUG_MODE_0,CJS_DEBUG_MODE_2 */
	var umslib = umslib ||
	{};
	umslib.Tmustache_utils = function($, objname, options)
	{
		'use strict';
		var self = this;

		this.create = function()
		{
			self.events.onCreate();
		};

		this.onReady = function()
		{
			self.events.onReady();
		};

		this.start = function()
		{
			self.events.onStarted();
		};

		this.processTriggers = function() {

		};

		this.onElementsEvents = function() {

		};

		this.execute = function()
		{
			// AUTO STARTED CODE ON CLASS READY AND STARTED
		};

		CjsBaseClass.call(this, $, objname, options);
	};

	umslib.mustache_utils = new umslib.Tmustache_utils(
		window.cjsbaseclass_jquery,
		'mustache_utils',
		{
			'debug': CJS_DEBUG_MODE_0,
			'highlighted': 'auto'
		}
	);
}
else
{
	umslib = {};
	umslib.mustache_utils = {
		'trigger': function()
		{
			$(document).trigger(arguments);
		}
	};
}

// umslib.mustache_utils.trigger('example');