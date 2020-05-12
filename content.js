
var data = [];
var prData = [];
var timeData = [];
var urlData = [];
var sost;



function parsing(){
	data[0] = 'power';
	chrome.extension.sendMessage(data, function(backMessage){
			if(backMessage == 'on')
			{
	let elem = document.querySelectorAll('div.item_table-wrapper');
	let price = document.querySelectorAll('span.snippet-price');
	let snipTitle = document.querySelectorAll('h3.snippet-title');
	let snipTime = document.querySelectorAll('div.snippet-date-info');
	console.log('getted ' + price.length + ' prices. ' + snipTitle.length + ' titles.' + ' PublTime ' + snipTime.length);
	//извлечение и сохранение в массив ссылок на объявление
	snipTitle.forEach(function callback(curr, inx, arr){
		//console.log('getted '+ curr.firstElementChild.href);
		urlData[inx+1] = curr.firstElementChild.href;
	});
	prData[0] = 'prices';
	timeData[0] = 'time';
	urlData[0] = 'urls';
	//извлечение и сохранение в массив даты и времени обн. объявления
	snipTime.forEach(function callback(curr, inx, arr){
		let atr = curr.getAttribute('data-tooltip');
		//console.log('getted '+ atr);
		timeData[inx+1] = atr;
	});
	//извлечение и сохранение в массив цен
	price.forEach(function callback(curr, inx, arr){
		//console.log('price no '+ inx + ' eq ' + curr.innerHTML);
		prData[inx+1] = curr.innerHTML;
	});
	//console.log('getted prices ' + prData.length);
	data[0] = 'parsedData';
	data[1] = urlData;
	data[2] = prData;
	data[3] = timeData;
	saveData(data);
	}});
};

function saveData(data){
	console.log(data.length + ' ready to save. ' + data[1].length + ' urls. ' + data[2].length + ' prices. ' + data[3].length + ' datas.');
	chrome.extension.sendMessage(data, function(backMessage){
			if(backMessage == 'saved!')
			{
				console.log('end.');
			}else {console.log('error')};
	});
}

parsing();
