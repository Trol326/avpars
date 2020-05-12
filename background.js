
var powr;
var work;
var data = [];
var savData = new Object();
var num;
var timerTime;
var chatID;
var obn=0;
var l = 0;

chrome.runtime.onInstalled.addListener(function() {
localStorage.setItem('dbpower', '0');
localStorage.setItem('dbwork', '0');
});

function checkPow(){
	powr = localStorage.getItem('dbpower');
	work = localStorage.getItem('dbwork');
	chatID = localStorage.getItem('dbchatid');
	if ((powr == '0') && (work == '0'))
	{
		console.log('not working');
		setTimeout(checkPow, 2000);
	}
	else if ((powr == '1') && (work == '0'))
	{
		console.log('Starting a work...');
		localStorage.setItem('dbwork', '1');
		getData();
	}
	else if ((powr == '1') && (work == '1'))
	{
		console.log('working...')
		setTimeout(checkPow, 2500);
	}
	else if ((powr == '0') && (work == '1'))
	{
		console.log('power of...');
		localStorage.setItem('dbwork', '0');
	}
};


function startWork(act){
	console.log('starting ' + act[0]);
	if (((act[0] == 'datGetted') || (data[0]=='datGetted'))&& powr == '1')
	{
		console.log('amount ' + num + ' timer ' + timerTime);
		if ((data.length != 1)&& (powr == '1'))
		{
		let pageUrl;
		let zapr = data.pop();
		if (((localStorage.getItem('dbznfrom'+(parseInt(data.length)-1)))!= null)||((localStorage.getItem('dbznto'+(parseInt(data.length)-1)))!= null))
		{
			if (((localStorage.getItem('dbznfrom'+(parseInt(data.length)-1)))!= null)&&((localStorage.getItem('dbznto'+(parseInt(data.length)-1)))!= null)){
				let zMax = (localStorage.getItem('dbznto'+(parseInt(data.length)-1)));
				let zMin = (localStorage.getItem('dbznfrom'+(parseInt(data.length)-1)));
				pageUrl =('https://avito.ru/moskva?pmax='+ zMax +'&pmin='+zMin+'&q='+zapr);
			}
			else if((localStorage.getItem('dbznfrom'+(parseInt(data.length)-1)))!= null){
				let zMin = localStorage.getItem('dbznfrom'+(parseInt(data.length)-1));
				pageUrl = ('https://avito.ru/moskva?pmin='+ zMin +'&q='+zapr);
			}else{
				let zMax = localStorage.getItem('dbznto'+(parseInt(data.length)-1));
				pageUrl = ('https://avito.ru/moskva?pmax='+ zMax + '&q=' + zapr);
			}
			
		}else {
		console.log('opening ' + zapr);
		pageUrl = ('https://avito.ru/moskva?q=' + zapr);
		}
		data[0] = 'urlOpened';
		chrome.tabs.create({'url': pageUrl});
		}else 
		{
			console.log('end of list. Restarting after ' + timerTime + 'ms');
			localStorage.setItem('dbwork', '0');
			endCicle();
		}
	}
	else if (((act[0] == 'urlOpened')||(data[0] == 'urlOpened'))&& powr == '1')
	{
		console.log('page parsed');
	}
};

function getData() {
chrome.storage.sync.get(['dbam'], function(result) { 
 num = result.dbam;
 chrome.storage.sync.get(['dbtime'], function(result) { 
	timerTime = result.dbtime;
	for (var i = 0; i < parseInt(num); i++)
	{
		let zapKey = ('dbzn'+i);
		let zap = localStorage.getItem(zapKey);
		console.log('getted ' + zapKey + ' as ' + zap);
		data[i+1] = zap;
	}
	data[0] = 'datGetted';
	startWork(data); 	
	});});	
};

chrome.extension.onMessage.addListener(function(request, sender, f_callback){
if(request[0] == 'parsedData'){
	if (obn != 0)
	{
		obn = 0;
		setTimeout(closeTab, 2000);
	}else {
		obn = 1;
	savData = request;
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	tabId = tabs[0].id;
	chrome.tabs.remove(tabId);
	});}
	saveData(savData);
	f_callback('saved!');
}else if(request[0] == 'power'){
	if (powr == '1')
	{
		f_callback('on');
	}else if (powr == '0')
	{
		f_callback('off');
	}
}
});

function saveData(savData){
	if ((data[0] == 'urlOpened')&& (powr == '1'))
	{
		data[0] = 'parsip';
		let keyP = ('dbDataPrice'+(parseInt(data.length)-1));
		let keyU = ('dbDataURL'+(parseInt(data.length)-1));
		let keyT = ('dbDataTime'+(parseInt(data.length)-1));
	if( (localStorage.getItem(keyU)) != null){
		let uO = (localStorage.getItem(keyU)).split(',');
		console.log('keyP eq ' + keyP);
		console.log('keyU eq ' + keyU);
		console.log('keyT eq ' + keyT);
		console.log(savData.length + ' ready to save(getted). ' + savData[1].length + ' urls, ' + savData[2].length + ' prices, ' + savData[3].length + ' datas.');

			let k = 1;
			
			while((uO[1] != savData[1][k]) && (k<21))
			{
				console.log(k + ' not eq. was '+uO[1] +' now ' + savData[1][k]);
				k++;
			}
			if(k>20)
			{
				console.log('big upd');
				allRewr();
			}else if (k>1) {
				console.log((k-1) + ' new elements');
				notifNew(k);
			}else {
				console.log('new elements not founded');
				restartWork();
			}
	if (savData[1][1] !== undefined){
		localStorage.setItem(keyP, savData[2]);
		localStorage.setItem(keyU, savData[1]);
		localStorage.setItem(keyT, savData[3]);
	}
		}else
		{
			if (savData[1][1] !== undefined){
				console.log(savData[1][1]);
		localStorage.setItem(keyP, savData[2]);
		localStorage.setItem(keyU, savData[1]);
		localStorage.setItem(keyT, savData[3]);
			}
			allRewr();
		}
	}
};

function notifNew(am){
	console.log(am + ' new elements');
	console.log(savData.length + ' ready to save(getted). ' + savData[1].length + ' urls, ' + savData[2].length + ' prices, ' + savData[3].length + ' datas.');
	let urs = savData[1];
	let urs1 = savData[2];
let tex1 = urs1.slice(1, am);
let tex = urs.slice(1, am);
let text = ' ';
for (var q = 0; q < tex.length; q++)
{
	text = text + (q+1) + ') цена: ' + tex1[q] + '. Ссылка: ' + tex[q] + ' ';
}	
	let mesText1 = ((am-1) + ' новых объявлений в запросе номер '+ data.length + '. ' + text);
	let ur = ('https://api.telegram.org/bot<Место для ID бота>/sendMessage?chat_id='+ chatID +'&text=' + mesText1)
	chrome.tabs.create({'url': ur});
	console.log('opened');
	setTimeout(restartWork, 4000);
};

function closeTab(){
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	tabId = tabs[0].id;
	chrome.tabs.remove(tabId);
	});
};

function allRewr ()
{
	if (savData[1][1] !== undefined){
	let urs = savData[1];
	let urs1 = savData[2];
	let tex1 = urs1.slice(1, 21);
	let tex = urs.slice(1, 21);
	let text = ' ';
	for (var q = 0; q < tex.length; q++)
{
	text = text + (q+1) + ') цена: ' + tex1[q] + '. Ссылка: ' + tex[q] + ' ';
}
	let mesText1 = ('Получено множество(20 и более) новых объявлений в запросе номер '+data.length + '. Краткая информация(20 первых): '+text);
	let ur = ('https://api.telegram.org/bot<Место для ID бота>/sendMessage?chat_id='+ chatID +'&text=' + mesText1);
	console.log(mesText1);
	chrome.tabs.create({'url': ur});
	console.log('opened');}
	setTimeout(restartWork, 4000);

};

function restartWork(){
	obn = 0;
	console.log('restarting...');
	data[0] = 'datGetted';
	startWork(data);
};

function endCicle(){
	l++;
	if (l < 5){
	let mesText1 = ('Всё в порядке('+l+')');	
	let ur = ('https://api.telegram.org/bot<Место для ID бота>/sendMessage?chat_id='+ chatID +'&text=' + mesText1);
	console.log(mesText1);
	chrome.tabs.create({'url': ur});
	console.log('opened');

	}else if (l==5){		
	let mesText1 = ('В дальнейшем оповещения о работе будут приходить раз в 50 иттераций('+l+')');
	
	let ur = ('https://api.telegram.org/bot<Место для ID бота>/sendMessage?chat_id='+ chatID +'&text=' + mesText1);
	console.log(mesText1);
	chrome.tabs.create({'url': ur});
	console.log('opened');

	}else if (l == 55)
	{
		let mesText1 = ('Всё в порядке('+(l-5)+')');
		l=5;		
	let ur = ('https://api.telegram.org/bot<Место для ID бота>/sendMessage?chat_id='+ chatID +'&text=' + mesText1);
	console.log(mesText1);
	chrome.tabs.create({'url': ur});
	console.log('opened');
	}
	
	setTimeout(checkPow, timerTime);
}

checkPow();