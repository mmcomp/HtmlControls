var tmp_val='';
function underThous(inpp)
{
	var out = '';
	var addad_small = {1:'یک',2:'دو',3:'سه',4:'چهار',5:'پنج',6:'شش',7:'هفت',8:'هشت',9:'نه'};
	var addad_middle = {10:'ده',11:'یازده',12:'دوازده',13:'سیزده',14:'چهارده',15:'پانزده',16:'شانزده',17:'هفده',18:'هجده',19:'نوزده',20:'بیست',30:'سی',40:'چهل',50:'پنجاه',60:'شصت',70:'هفتاد',80:'هشتاد',90:'نود',100:'صد'};
	var addad_large = {100:'صد',200:'دویست',300:'سیصد',400:'چهارصد',500:'پانصد',600:'ششصد',700:'هفتصد',800:'هشتصد',900:'نهصد',1000:'هزار'};
	if(inpp < 1000)
	{
		var out_arr = [];
		var kharej = inpp - (inpp % 100);
		if(typeof addad_large[kharej] != 'undefined')
			out_arr.push(addad_large[kharej]);
		inpp -= kharej;
		if(inpp > 20)
			var kharej = inpp - (inpp % 10);
		else
			var kharej = inpp;
		if(typeof addad_middle[kharej] != 'undefined')
			out_arr.push(addad_middle[kharej]);
		if(inpp > 20 || inpp < 10)
		{
			if(inpp > 20)
				inpp -= kharej;
			if(typeof addad_small[inpp] != 'undefined')
				out_arr.push(addad_small[inpp]);
		}
		out = out_arr.join(' و ');
	}
	return(out);
}
function addad(inp)
{
	var addad_level = ['','هزار','میلیون','میلیارد','تریلیارد'];
	var out = '';
	var inp = parseInt(inp,10);
	if(typeof inp != 'undefined' && !isNaN(inp))
	{
		var maxLevel = 0;
		var maxLevelFound = false;
		for(var i = 0 ; i < 5 && !maxLevelFound; i++)
		{
			var kharej = parseInt(inp/Math.pow(10,i*3),10);
			if(kharej == 0)
			{
				maxLevel = (i>0)?i-1:0;
				maxLevelFound = true;
			}
		}
		var inp_tmp = inp;
		var out_arr = [];
		for(var i = maxLevel; i >= 0; i--)
		{
			var kharej = parseInt(inp_tmp/Math.pow(10,i*3),10);
			inp_tmp -= kharej*Math.pow(10,i*3);
			out_arr.push(underThous(kharej)+' '+addad_level[i]);
		}
		out = out_arr.join(' و ');
	}
	return(out);
}
function formatMoney(n,c,d,t){
	var c = isNaN(c = Math.abs(c)) ? 2 : c,
	d = d == undefined ? "." : d,
	t = t == undefined ? "," : t,
	s = n < 0 ? "-" : "",
	i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
function killNoneNumber(e)
{
	e = e || window.event;
	var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
	var charStr = String.fromCharCode(charCode);
	var conf = fetchConfig(e.target.title);
	if (!/\d/.test(charStr) && !e.altKey && !e.ctrlKey && charStr!=conf.block_sep) {
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
	if(conf == 'C' || conf == 'c')
	{
		blocks = [((conf=='C')?-1:-2)];
		block_sep = ',';
	}
	else
	{
		var inp = conf.replace(/#/g,'');
		var inp = inp.replace(/@/g,'');
		block_sep = inp.split('')[0];
		var tmp = conf.split(block_sep);
		blocks = [];
		for(var i = 0;i < tmp.length;i++)
			blocks.push((tmp[i]!='@')?tmp[i].length:0);
	}
	return({
		"blocks" : blocks,
		"block_sep" : block_sep
	});
}
function removeHoroof(matchClass)
{
	var elems = document.getElementsByTagName('*'), i;
	for(i in elems)
		if((' ' + elems[i].className + ' ').indexOf(' ' + matchClass + ' ')> -1)
			elems[i].parentElement.removeChild(elems[i]);
}
function checkInputForNumber(obj,conf)
{
	var blocks = conf.blocks;
	var block_sep = conf.block_sep;
	var out = false;
	if(obj)
	{
		if(blocks[0] < 0)
		{
			var val = obj.value;
			var tmp = val.replace(/,/g , '');
			out = true;
			obj.value = formatMoney(tmp,0, '.', ',');
			if(blocks[0]==-1)
			{
				var parentGuest = obj;
				var childGuest = document.createElement("span");
				childGuest.className = "adad_horoof";
				childGuest.innerHTML = addad(tmp);
				removeHoroof("adad_horoof");
				if (parentGuest.nextSibling) {
				  parentGuest.parentNode.insertBefore(childGuest, parentGuest.nextSibling);
				}
				else {
				  parentGuest.parentNode.appendChild(childGuest);
				}
			}
		}
		else
		{
			var val = obj.value;
			var tmp = val.split(block_sep);
			if(tmp.length <= blocks.length)
			{
				out = true;
				for(var i = 0;i < tmp.length;i++)
				{
					var tmp_num = parseInt(tmp[i],10);
//					if(isNaN(tmp_num))
//						out = false;
//					else
						if(blocks[i] > 0)
							if(tmp[i].length > blocks[i])
								out = false;
				}
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
function validateInputKeyDown(e)
{
        var stat = true;
        e = e || window.event;
        var chrCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
	var charStr = String.fromCharCode(chrCode);
        var conf = fetchConfig(e.target.title);
	console.log(e);
	if(chrCode == 229)
		return false;
	if (!/\d/.test(charStr) && !e.altKey && !e.ctrlKey) {
                return false;
        }
	if(stat)
	{
		console.log(conf);
		stat = false;
		var tmp = e.target.value.split(conf.block_sep);
		var blocks = conf.blocks;
		if(tmp.length <= conf.blocks.length)
		{
			var index = tmp.length-1;
			console.log(index);
			console.log(blocks[index]);
			if(blocks[index] > 0)
			{
				console.log(tmp[index],tmp[index].length);
				if(tmp[index].length>blocks[index])
				{
					console.log('error');
					if(index < blocks.length-1)
					{
						e.target.value += conf.block_sep;
					}
				}
				e.target.value += charStr;
			}
			else
				stat = true;
		}
		//console.log(e.target.value+charStr);
		//if(validateInput(e.target))
			//e.target.value += charStr;
	}
        //stat = validateInput(e.target);
        //if(!stat)
                //e.target.value = tmp_val;
	return stat;
}
