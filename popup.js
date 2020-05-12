//скрипт взаимодействия с ui

//Объявление переменных элементов
let startbut = document.getElementById('startbutton');
let opbut = document.getElementById('optionbutton');
let opurl = chrome.runtime.getURL('./options.html');
let hlurl = chrome.runtime.getURL('./help.html');
let hlbut = document.getElementById('helpbutton');


var power;


//"прослушка" кнопки
startbut.addEventListener("click", clbut);

//нажатие на кнопку
function clbut(){
	power = localStorage.getItem('dbpower');
	if (power == "1")
	{
		localStorage.setItem('dbpower', '0');
		startbut.value = 'start';
	}
	else if (power == "0")
	{
		localStorage.setItem('dbpower', '1');
		startbut.value = 'stop';
	}
};

//отображение состояния кнопки при первом запуске
function checkB(){
	power = localStorage.getItem('dbpower');
	if (power == "0")
	{
		startbut.value = 'start';
	}
	else if (power == "1")
	{
		startbut.value = 'stop';
	}
};
checkB();

//открытие options
opbut.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.create({"url": opurl});
});
}


hlbut.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.create({"url": hlurl});
});
}