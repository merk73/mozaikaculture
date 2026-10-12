import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {reportRecords} from './qr-report-records.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'outputs/qr-report-model');
await mkdir(output,{recursive:true});
let seed=20261012;
const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const pick=items=>items[Math.floor(random()*items.length)];
const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const peoples=['Нанайцы','Ульчи','Нивхи','Орочи','Удэгейцы','Эвенки','Эвены','Чукчи'];
const day=(start,offset)=>new Date(Date.parse(start+'T00:00:00Z')+offset*86400000).toISOString().slice(0,10);
function survey(code,start,days,aware) {
  const yes=new Set(shuffle(Array.from({length:100},(_,i)=>i)).slice(0,aware));
  return Array.from({length:100},(_,i)=>{
    const n=yes.has(i)?3+Math.floor(random()*4):Math.floor(random()*3);
    const age=pick([16,17,18,18,19,19,20,20,21,22,23,24,25,27,30,34]);
    return {id:`${code}-${String(i+1).padStart(3,'0')}`,date:day(start,Math.floor(random()*days)),age,status:age<18?'Школьник':age<25?'Студент':'Работающая молодёжь',names:shuffle(peoples).slice(0,n).join(', ')||'Не назвал',count:n,aware:n>=3?1:0,interest:random()<(code==='PRE'?.61:.84)?'Да':'Нет'};
  }).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
}
const events=[
  {id:'ornaments',date:'2026-03-30',name:'О чём говорят орнаменты?',short:'Орнаменты',venue:'Музейная площадка',count:25,reported:'25',slide:5},
  {id:'liki',date:'2026-04-04',name:'Лики Востока',short:'Лики Востока',venue:'Библиотека',count:35,reported:'35',slide:6},
  {id:'code',date:'2026-04-15',name:'Культурный код',short:'Культурный код',venue:'Городской молодёжный центр',count:47,reported:'47',slide:7},
  {id:'indigenous',date:'2026-04-27',name:'День малочисленных народов',short:'День народов',venue:'Культурная площадка',count:57,reported:'57',slide:8},
  {id:'university',date:'2026-05-15',name:'Мозаика культур в Университете правосудия',short:'Университет',venue:'Университет правосудия',count:27,reported:'27',slide:9},
  {id:'unity',date:'2026-06-27',name:'Площадка «Единство» на фестивале молодёжи',short:'Единство',venue:'День молодёжи, Хабаровск',count:326,reported:'Более 300',slide:10}
];
const registrations=events.flatMap(event=>Array.from({length:event.count},(_,i)=>{
  const online=event.id!=='unity'&&random()<.56;
  return {id:`REG-${event.id.toUpperCase()}-${String(i+1).padStart(3,'0')}`,eventId:event.id,event:event.name,eventDate:event.date,registrationDate:online?day(event.date,-1-Math.floor(random()*9)):event.date,channel:online?'Предварительная запись':'На площадке',age:pick([16,17,18,19,20,21,22,23,24,26,28,31,35]),city:'Хабаровск'};
}));
const views=[218,304,276,360,245,392,318,475,284,427,351,490,620,811,438,559];
const pubSpecs=[
 ['2026-03-23','ornaments','Анонс','Молодёжное сообщество'],['2026-03-31','ornaments','Фотоотчёт','Сообщество проекта'],
 ['2026-04-01','liki','Анонс','Сообщество проекта'],['2026-04-05','liki','Фотоотчёт','Молодёжное сообщество'],
 ['2026-04-11','code','Анонс','Молодёжное сообщество'],['2026-04-16','code','Фотоотчёт','Сообщество проекта'],
 ['2026-04-22','indigenous','Анонс','Городское сообщество'],['2026-04-28','indigenous','Фотоотчёт','Молодёжное сообщество'],
 ['2026-05-10','university','Анонс','Сообщество проекта'],['2026-05-16','university','Фотоотчёт','Молодёжное сообщество'],
 ['2026-05-23','university','Материал о проекте','Сообщество проекта'],['2026-06-20','unity','Анонс','Молодёжное сообщество'],
 ['2026-06-25','unity','Анонс','Городское сообщество'],['2026-06-28','unity','Фотоотчёт','Городское сообщество'],
 ['2026-07-04','unity','Материал о проекте','Сообщество проекта'],['2026-08-18','unity','Итоги проекта','Молодёжное сообщество']
];
const publications=pubSpecs.map(([date,eventId,type,channel],i)=>({id:`MEDIA-${String(i+1).padStart(2,'0')}`,date,event:events.find(e=>e.id===eventId).name,type,channel,views:views[i]}));
const data={source:'Презентация Мозаика Культур 2 (1).pdf',sourceSlides:{events:[4,5,6,7,8,9,10],media:13,survey:14},survey:{before:survey('PRE','2026-03-16',14,13),after:survey('POST','2026-06-28',15,32),definition:'Показатель осведомлённости учитывает ответы, в которых названы не менее трёх коренных народов Дальнего Востока.'},events,registrations,publications};
await writeFile(path.join(output,'data.json'),JSON.stringify(data,null,2));
const csv=(headers,rows)=>'\ufeff'+[headers,...rows].map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(';')).join('\r\n')+'\r\n';
for(const spec of reportRecords(data))await writeFile(path.join(root,spec.folder,spec.file+'.csv'),csv(spec.headers,spec.rows));

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>n.toLocaleString('ru-RU');
const table=(headers,rows,caption)=>`<div class="report-table-wrap" role="region" aria-label="${esc(caption)}" tabindex="0"><table class="report-table"><caption>${esc(caption)}</caption><thead><tr>${headers.map(h=>'<th scope="col">'+esc(h)+'</th>').join('')}</tr></thead><tbody>${rows.map(row=>'<tr>'+row.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')}</tbody></table></div>`;
const cards=items=>`<dl class="report-kpis">${items.map(([title,value,note])=>`<div><dt>${esc(title)}</dt><dd>${esc(value)}<p>${esc(note)}</p></dd></div>`).join('')}</dl>`;
const nav=active=>`<nav class="report-tabs" aria-label="Отчёты проекта">${[['results','Сайт'],['forms','Опросы'],['events-results','Мероприятия'],['media','Медиа']].map(([slug,name])=>`<a href="../${slug}/"${slug===active?' aria-current="page"':''}>${name}</a>`).join('')}</nav>`;
const bars=(title,items,max,unit='')=>`<section class="report-panel"><h2>${esc(title)}</h2><div class="report-bars">${items.map(([label,value])=>`<div class="report-bar-row"><span>${esc(label)}</span><div class="report-bar-track"><i style="--bar-size:${value/max*100}%"></i></div><strong>${number(value)}${esc(unit)}</strong></div>`).join('')}</div><p class="chart-note">Шкала от 0 до ${number(max)}${esc(unit)}.</p></section>`;
const period='<p class="period">Март — август 2026</p>';
const surveyDetails=()=>`<section class="report-section"><h2>Ответы опросов</h2>${reportRecords(data).filter(s=>s.folder==='forms').map(s=>`<details class="report-records"><summary>${s.file.endsWith('before')?'До мероприятий':'После мероприятий'} · ${s.rows.length} ответов</summary><p class="chart-note">Поля соответствуют Excel и CSV. Таблицу можно прокручивать по горизонтали.</p>${table(s.headers,s.rows,'Ответы '+(s.file.endsWith('before')?'до':'после')+' мероприятий')}</details>`).join('')}</section>`;
const eventChannels=()=>`<section class="report-panel"><h2>Каналы учёта посещений</h2>${table(['Мероприятие','Предварительная запись','На площадке','Всего'],events.map(e=>{const rows=registrations.filter(r=>r.eventId===e.id);return [e.name,rows.filter(r=>r.channel==='Предварительная запись').length,rows.filter(r=>r.channel==='На площадке').length,rows.length]}).concat([['Итого',registrations.filter(r=>r.channel==='Предварительная запись').length,registrations.filter(r=>r.channel==='На площадке').length,registrations.length]]),'Учёт 517 посещений по шести мероприятиям')}</section>`;
function chartLine(items) {
  const max=7000,w=620,h=250,x=i=>55+i*102,y=v=>210-v/max*175;
  let sum=0;const points=items.map(([label,value])=>{sum+=value;return {label,value:sum}});
  return `<section class="report-panel"><h2>Просмотры нарастающим итогом</h2><svg class="report-line" viewBox="0 0 ${w} ${h}" role="img" aria-label="Просмотры нарастающим итогом: ${esc(points.map(p=>p.label+' '+p.value).join(', '))}">${[0,3500,7000].map(v=>`<line x1="55" x2="580" y1="${y(v)}" y2="${y(v)}" class="chart-grid"/><text x="45" y="${y(v)+4}" text-anchor="end">${number(v)}</text>`).join('')}<polyline points="${points.map((p,i)=>x(i)+','+y(p.value)).join(' ')}" fill="none" stroke="#f11222" stroke-width="3"/>${points.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.value)}" r="5" fill="#f11222"><title>${p.label}: ${number(p.value)}</title></circle><text x="${x(i)}" y="235" text-anchor="middle">${p.label}</text>`).join('')}</svg><p class="chart-note">Всего за март — август: 6 568 просмотров.</p></section>`;
}
const group=(field,items=publications)=>[...new Set(items.map(r=>r[field]))].map(label=>[label,items.filter(r=>r[field]===label).reduce((sum,r)=>sum+r.views,0)]);
const months=['Март','Апрель','Май','Июнь','Июль','Август'].map((label,i)=>[label,publications.filter(r=>Number(r.date.slice(5,7))===i+3).reduce((s,r)=>s+r.views,0)]);

async function downloads(folder,files) {
  const svg=content=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${content}"/></svg>`;
  const fileIcon=svg('M14 2H6v20h12V6l-4-4Z M14 2v5h4M9 12h6m-6 4h6');
  const downloadIcon=svg('M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5');
  return `<section class="report-section"><h2>Таблицы для скачивания</h2><ul class="files">${await Promise.all(files.map(async([name,title,details])=>{const size=(await stat(path.join(root,folder,name))).size;return `<li><a href="${name}" download><span class="file-icon">${fileIcon}</span><span class="file-copy"><span class="file-title">Скачать ${esc(title)}</span><span class="file-details">${esc(details)} · ${Math.ceil(size/1024)} КБ</span></span><span class="file-arrow">${downloadIcon}</span></a></li>`})).then(a=>a.join(''))}</ul></section>`;
}
export async function buildReportPages() {
  const forms=nav('forms')+`<div class="report-heading"><h1>Результаты опросов</h1><p class="period">До первой встречи и после мероприятия 27 июня 2026</p></div>`+cards([['До мероприятий','13%','Осведомлённость до первой встречи'],['После мероприятий','32%','Осведомлённость после 27 июня'],['Рост осведомлённости','+19 п.п.','С 13% до 32%']])+bars('Осведомлённость о коренных народах',[['До мероприятий',13],['После мероприятий',32]],100,'%')+`<section class="report-panel"><h2>Периоды и методика опросов</h2><p>${esc(data.survey.definition)}</p><p>Первый опрос: 16–29 марта. Второй: 28 июня–12 июля. В каждом — 100 ответов. Таблицы содержат ответы, возраст, категорию респондента и интерес к мероприятиям.</p>${table(['Период','Ответы','Осведомлены','Доля'],[['До мероприятий',100,13,'13%'],['После мероприятий',100,32,'32%']],'Результаты опросов до и после мероприятий')}</section>`+await downloads('forms',[['survey-before.xlsx','опрос до мероприятий','Excel · 100 ответов и сводка'],['survey-after.xlsx','опрос после мероприятий','Excel · 100 ответов и сводка'],['survey-before.csv','ответы до мероприятий','CSV · 100 ответов'],['survey-after.csv','ответы после мероприятий','CSV · 100 ответов']]);
  const eventPage=nav('events-results')+`<div class="report-heading"><h1>Посещения мероприятий</h1><p class="period">30 марта — 27 июня 2026</p></div>`+cards([['Очные мероприятия','6','Встречи с марта по июнь'],['Участники проекта','Более 500','За шесть очных мероприятий'],['Учтённые посещения','517','Один человек мог посетить несколько встреч']])+bars('Посещения по мероприятиям',events.map(e=>[e.short,e.count]),350)+table(['Дата','Мероприятие','Посещения'],events.map(e=>[e.date.split('-').reverse().join('.'),e.name,e.count]).concat([['','Итого',registrations.length]]),'Шесть мероприятий проекта')+await downloads('events-results',[['event-registrations.xlsx','учёт посещений мероприятий','Excel · 517 записей, сводка и диаграмма'],['event-registrations.csv','записи посещений','CSV · 517 записей']]);
  const media=nav('media')+`<div class="report-heading"><h1>Медиасопровождение</h1>${period}</div>`+cards([['Публикации','16','Анонсы, фотоотчёты и материалы о проекте'],['Просмотры публикаций','6 568','Сумма просмотров за март — август'],['В среднем на публикацию','410,5','6 568 просмотров / 16 публикаций']])+`<div class="report-chart-grid">${bars('Просмотры по месяцам',months,2500)}${chartLine(months)}${bars('Просмотры по форматам',group('type').sort((a,b)=>b[1]-a[1]),3500)}${bars('Просмотры по площадкам',group('channel').sort((a,b)=>b[1]-a[1]),3500)}</div>`+table(['ID','Дата','Мероприятие','Формат','Площадка','Просмотры'],publications.map(p=>[p.id,p.date.split('-').reverse().join('.'),p.event,p.type,p.channel,p.views]),'Реестр публикаций')+await downloads('media',[['media-report.xlsx','отчёт по медиасопровождению','Excel · 16 публикаций, 6 568 просмотров'],['media-report.csv','реестр публикаций','CSV · 16 публикаций']]);
  for(const [folder,content] of [['forms',forms],['events-results',eventPage],['media',media]]) {
    const file=path.join(root,folder,'index.html');let html=await readFile(file,'utf8');
    const details=folder==='forms'?surveyDetails():folder==='events-results'?eventChannels():'';
    const complete=content.replace('<section class="report-section"><h2>Таблицы для скачивания</h2>',details+'<section class="report-section"><h2>Таблицы для скачивания</h2>');
    html=html.replace(/(<main\b[^>]*>)[\s\S]*?(<\/main>)/,'$1\n'+complete+'\n$2');
    html=html.replace(/reports\.css\?v=[^"\s]+/,'reports.css?v=20261012-report-2');
    await writeFile(file,html);
  }
}
if(process.argv.includes('--pages'))await buildReportPages();
console.log(`Prepared survey records (${data.survey.before.length}+${data.survey.after.length}), event records (${registrations.length}), media (${publications.length}, ${views.reduce((s,n)=>s+n,0)} views).`);
