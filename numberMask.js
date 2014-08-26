var tmp_val='';
function killNoneNumber(e)
{
	e = e || window.event;
	var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
	var charStr = String.fromCharCode(charCode);
	if (!/\d/.test(charStr) && !e.altKey && !e.ctrlKey) {
		return false;
	}
	if(validateInput(e.target))
		tmp_val = e.target.value;
	else
		return false;
}
function fetchConfig(conf)
{
	var blocks = [];
	var block_sep = '';
	var inp = conf.replace(/#/g,'');
	var inp = inp.replace(/@/g,'');
	block_sep = inp.split('')[0];
	var tmp = conf.split(block_sep);
	blocks = [];
	for(var i = 0;i < tmp.length;i++)
		blocks.push((tmp[i]!='@')?tmp[i].length:0);
	return({
		"blocks" : blocks,
		"block_sep" : block_sep
	});
}
function checkInputForNumber(obj,conf)
{
	var blocks = conf.blocks;
	var block_sep = conf.block_sep;
	var out = false;
	if(obj)
	{
		var val = obj.value;
		var tmp = val.split(block_sep);
		if(tmp.length == blocks.length)
		{
			out = true;
			for(var i = 0;i < tmp.length;i++)
			{
				var tmp_num = parseInt(tmp[i],10);
				if(isNaN(tmp_num))
					out = false;
				else
					if(blocks[i] > 0)
						if(tmp[i].length > blocks[i])
							out = false;
			}
		}
	}
	return out;
}
function validateInput(obj)
{
	var out = false;
	var formt = obj.title;
	if(formt)
	{
		var conf = fetchConfig(formt);
		out = checkInputForNumber(obj,conf);
	}
	return out;
}
function validateInputKeyPress(e)
{
	var stat = true;
	e = e || window.event;
	var chrCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
	stat = validateInput(e.target);
	if(!stat)
		e.target.value = tmp_val;
}

