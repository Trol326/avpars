//ввод важных переменных
 var num = document.getElementById('num').value;
 var numo = num;;

//Установка "прослушки" на поля ввода кол-ва эл и частоты обн.
document.getElementById('num').addEventListener("change", check);
document.getElementById('timer').addEventListener("change", timeCheck);
document.getElementById('chatid').addEventListener("change", chatCheck);

//Выполняется, если поле обновилось. Считывает новое значение и сохраняет его в DB
function check(){
	numo = num;
	num = document.getElementById('num').value;
	console.log('get ' + num + ' now is ');
	checkForms(numo);
	chrome.storage.sync.set({'dbam': num}, function() {
				console.log('anount now is ' + num);});
}

//Получаем значения из DB
 chrome.storage.sync.get(['dbam'], function(result) { 
 num = result.dbam;
 document.getElementById('num').value = result.dbam;
 chrome.storage.sync.get(['dbtime'], function(result) { 
 let timer1 = parseInt(result.dbtime)/60000;
 document.getElementById('timer').value = timer1;});
 let c = localStorage.getItem('dbchatid');
 document.getElementById('chatid').value = c;
 constructData(num);
 constructForms(num);
 console.log('Currently amount is ' + result.dbam);
 for (var i = 0; parseInt(num) > i; i++)
 {
	 let zk = ("dbzn" +  i);
	 let frK = ("dbznfrom"+i);
	 let toK = ("dbznto"+i);
	 console.log( zk + ' getted');
	 zkg = localStorage.getItem(zk);
	 console.log('Value currently is ' + zkg);
	 document.getElementById(i).value = zkg;
	 document.getElementById('from'+i).value = localStorage.getItem(frK);
 	 document.getElementById('to'+i).value = localStorage.getItem(toK);
 }
 });
 
//получаем контейнер для списка записей
let page = document.getElementById('zaplist');


//создание форм при запуске стр
  function constructForms(num) {
	  console.log('Constructed '+ num + ' forms');
    for (var i = 0; i < parseInt(num); i++) {
      let p = document.createElement('p');
	  let form = document.createElement('input');
	  let form2 = document.createElement('input');
	  let form3 = document.createElement('input');
	  form2.type = "text";
	  form3.type = "text";
	  form2.placeholder = "Цена от";
	  form3.placeholder = "Цена до";
	  form2.id = ("from"+i);
	  form3.id = ("to"+i);
	  form.type = "text";
	  form.id = (i);
	  form.placeholder=("Поисковый запрос " + (i+1));
	  p.id = ("pid" + i);
	  p.innerHTML = "Поисковый запрос " + (i+1) + "</br>";
	  form.addEventListener("change", function(){
		  let znk = ("dbzn" +  form.id);
		  let zV = form.value;
		  localStorage.setItem(znk, zV);
		  console.log('key eq ' + znk + ' value eq ' + zV);
	});
	form2.addEventListener("change", function(){
		  let znk = ("dbzn" +  form2.id);
		  let zV = form2.value;
		  localStorage.setItem(znk, zV);
		  console.log('key eq ' + znk + ' value eq ' + zV);
	});
	form3.addEventListener("change", function(){
		  let znk = ("dbzn" +  form3.id);
		  let zV = form3.value;
		  localStorage.setItem(znk, zV);
		  console.log('key eq ' + znk + ' value eq ' + zV);
	});
	  page.appendChild(p);
      p.appendChild(form);
	  p.appendChild(form2);
	  p.appendChild(form3);
    }
  }
 
 //проверка количества форм. создание/удаление при обновлении
 function checkForms(numo){
	 console.log('getted ' + numo + ' and ' + num);
	 if (parseInt(numo) > parseInt(num))
	 {
		 console.log('was bigger');
		for (var k = parseInt(numo); k !== parseInt(num); k--)
		{
			let del = ("pid" + (k-1));
			document.getElementById(del).remove();
		}
	 } 
	 else if (parseInt(numo) < parseInt(num)) 
	 {
		 console.log('was less');
		 let n = parseInt(num) - parseInt(numo);
		 for (var i = parseInt(numo); i < parseInt(numo)+n; i++) {
 let p = document.createElement('p');
	  let form = document.createElement('input');
	  let form2 = document.createElement('input');
	  let form3 = document.createElement('input');
	  form2.type = "text";
	  form3.type = "text";
	  form2.placeholder = "Цена от";
	  form3.placeholder = "Цена до";
	  form2.id = ("from"+i);
	  form3.id = ("to"+i);
	  form.type = "text";
	  form.id = (i);
	  form.placeholder=("Поисковый запрос " + (i+1));
	  p.id = ("pid" + i);
	  p.innerHTML = "Поисковый запрос " + (i+1) + "</br>";
	  form.addEventListener("change", function(){
		  let znk = ("dbzn" +  form.id);
		  let zV = form.value;
		  localStorage.setItem(znk, zV);
		  console.log('key eq ' + znk + ' value eq ' + zV);
	});
	form2.addEventListener("change", function(){
		  let znk = ("dbzn" +  form2.id);
		  let zV = form2.value;
		  localStorage.setItem(znk, zV);
		  console.log('key eq ' + znk + ' value eq ' + zV);
	});
	form3.addEventListener("change", function(){
		  let znk = ("dbzn" +  form3.id);
		  let zV = form3.value;
		  localStorage.setItem(znk, zV);
		  console.log('key eq ' + znk + ' value eq ' + zV);
	});
	  page.appendChild(p);
      p.appendChild(form);
	  p.appendChild(form2);
	  p.appendChild(form3);
    }
	 }
 }

//время
function timeCheck(){
	var time = (parseInt(document.getElementById('timer').value)*60000);
	chrome.storage.sync.set({'dbtime': time}, function() {
		localStorage.setItem('dbtime', time);
		console.log('now time is ' + time + ' mins');});
}

function chatCheck(){
	var chat = document.getElementById('chatid').value;
	localStorage.setItem('dbchatid', chat);
	console.log('now chatid is ' + chat);
}

//получаем контейнер для таблицы значений
let page2 = document.getElementById('datget');

//генерит таблицу с инфой
function constructData(data1){
	let tabl = document.createElement('table');
	let tr0 = document.createElement('tr');
	let th1 = document.createElement('th');
	let th2 = document.createElement('th');
	let th3 = document.createElement('th');
	tr0.id = 'tr0';
	th1.id = 'th01';
	th2.id = 'th02';
	th3.id = 'th03';
	th1.innerHTML = 'Цена';
	th2.innerHTML = 'Ссылка';
	th3.innerHTML = 'Дата';
	tabl.classList.add("table");
	page2.appendChild(tabl);
	tabl.appendChild(tr0);
	tr0.appendChild(th1);
	tr0.appendChild(th2);
	tr0.appendChild(th3);
	
	for (var i = 0; i<data1; i++)
  {
		let pk = ('dbDataPrice' + i);
		let uk = ('dbDataURL' + i);
		let tk = ('dbDataTime' + i);
		if (localStorage.getItem(pk)!= null)
		{
		let p = (localStorage.getItem(pk)).split(',');
		let u = (localStorage.getItem(uk)).split(',');
		let t = (localStorage.getItem(tk)).split(',');
		let trB = document.createElement('tr');
		let tdB = document.createElement('td');
		let tdB1 = document.createElement('td');
		let tdB2 = document.createElement('td');
		tdB.colSpan = 3;
		tdB.align = 'center';
		tdB.innerHTML = ('<b>'+(localStorage.getItem('dbzn'+i))+'</b>');
		tabl.appendChild(trB);
		trB.appendChild(tdB);
		for (var l = 1; l < u.length; l++)
		{
			let tr00 = document.createElement('tr');
			let td10 = document.createElement('td');
			let td20 = document.createElement('td');
			let td30 = document.createElement('td');
			tr00.id = ('tr'+i+l);
			td10.id = ('th0'+i+l);
			td20.id = ('th1'+i+l);
			td30.id = ('th2'+i+l);
			td10.innerHTML = p[l];
			let a = document.createElement('a');
			a.href = u[l];
			a.innerHTML = 'Ссылка';
			td20.appendChild(a);
			td30.innerHTML = t[l];
			tabl.appendChild(tr00);
			tr00.appendChild(td10);
			tr00.appendChild(td20);
			tr00.appendChild(td30);
		}
	}
  }
}
	