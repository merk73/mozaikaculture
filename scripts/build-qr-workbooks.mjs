import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {reportRecords} from './qr-report-records.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,'outputs/qr-report-model');
const runtime=process.env.MOZAIKA_ARTIFACT_NODE_MODULES||'C:/Users/Merk/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const require=createRequire(path.join(runtime,'../package.json'));
const {Workbook,SpreadsheetFile}=await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);
const data=JSON.parse(await fs.readFile(path.join(out,'data.json'),'utf8'));
const palette={ink:'#191919',muted:'#666666',red:'#E72432',rule:'#D9D4CC'};
const excelDate=value=>(Date.parse(value+'T00:00:00Z')-Date.UTC(1899,11,30))/86400000;
const col=i=>String.fromCharCode(65+i);
function header(s,range){
  s.getRange(range).format.fill=palette.ink;
  s.getRange(range).format.font={name:'Arial',size:11,bold:true,color:'#FFFFFF'};
  s.getRange(range).format.horizontalAlignment='center';s.getRange(range).format.rowHeight=28;
  s.getRange(range).format.borders={insideVertical:{style:'thin',color:'#FFFFFF'}};
}
function records(wb,spec){
  const s=wb.worksheets.add(spec.sheet),last=spec.rows.length+1,end=col(spec.headers.length-1);
  s.showGridLines=false;s.tabColor='#34B27B';
  s.getRange(`A1:${end}${last}`).format={font:{name:'Arial',size:10,color:palette.ink},rowHeight:23,verticalAlignment:'center',horizontalAlignment:'left'};
  s.getRange(`A1:${end}1`).values=[spec.headers];
  s.getRange(`A2:${end}${last}`).values=spec.rows.map(row=>row.map((v,i)=>spec.dateColumns.includes(i)?excelDate(v):v));
  spec.widths.forEach((width,i)=>s.getRange(`${col(i)}1:${col(i)}${last}`).format.columnWidth=width);
  for(const i of spec.dateColumns)s.getRange(`${col(i)}2:${col(i)}${last}`).setNumberFormat('yyyy-mm-dd');
  for(const i of spec.booleanColumns)s.getRange(`${col(i)}2:${col(i)}${last}`).format.horizontalAlignment='center';
  const table=s.tables.add(`A1:${end}${last}`,true,spec.sheet.replaceAll('_','')+'Export');
  table.style='TableStyleLight8';table.showFilterButton=true;header(s,`A1:${end}1`);
  s.freezePanes.freezeRows(1);s.freezePanes.freezeColumns(1);return s;
}
function summary(wb,title,period){
  const s=wb.worksheets.add('Сводка');s.showGridLines=false;s.tabColor=palette.red;
  s.getRange('A1:O44').format={font:{name:'Arial',size:11,color:palette.ink},verticalAlignment:'center',rowHeight:25,columnWidth:13};
  s.getRange('A1:A44').format.columnWidth=3;s.getRange('B1:B44').format.columnWidth=38;
  s.getRange('C1:C44').format.columnWidth=16;s.getRange('D1:E44').format.columnWidth=18;s.getRange('F1:F44').format.columnWidth=4;
  s.getRange('B2').values=[[title]];s.getRange('B2').format.font={name:'Arial',size:17,bold:true,color:palette.ink};s.getRange('B2:O2').format.rowHeight=29;
  s.getRange('B3').values=[[period]];s.getRange('B4').values=[['Часовой пояс: Владивосток (UTC+10)']];s.getRange('B3:B4').format.font={name:'Arial',size:11,color:palette.muted};
  s.getRange('B5:O5').format.borders={bottom:{style:'thin',color:palette.red}};return s;
}
function total(s,range){s.getRange(range).format.font={name:'Arial',size:11,bold:true,color:palette.ink};s.getRange(range).format.borders={top:{style:'thin',color:palette.rule}};}
function chart(s,type,ranges,title,start,end){
  const c=s.charts.add(type,Array.isArray(ranges)?ranges.map(r=>s.getRange(r)):s.getRange(ranges));c.title=title;c.titleTextStyle.typeface='Arial';c.titleTextStyle.fontSize=14;c.hasLegend=false;
  c.xAxis={axisType:'textAxis',textStyle:{typeface:'Arial',fontSize:11}};c.yAxis={numberFormatCode:'#,##0',numberFormatSourceLinked:false,textStyle:{typeface:'Arial',fontSize:11}};
  for(const series of c.series.items){series.fill=palette.red;if(type==='line')series.line={fill:palette.red,style:'solid',width:2};}c.setPosition(start,end);return c;
}
function note(s,row,text){s.getRange(`B${row}`).values=[[text]];s.getRange(`B${row}`).format.font={name:'Arial',size:10,color:palette.muted};}
async function finish(wb,spec,range){
  wb.recalculate();
  const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},maxChars:2000});
  await fs.writeFile(path.join(out,spec.file+'-checks.json'),errors.ndjson);assert(!/"(?:value|text)":"#/.test(errors.ndjson),errors.ndjson);
  for(const [sheetName,area] of [[spec.sheet,`A1:${col(spec.headers.length-1)}12`],['Сводка',range]]){
    const png=await wb.render({sheetName,range:area,scale:1.3,format:'png'});await fs.writeFile(path.join(out,`${spec.file}-${sheetName}.png`),new Uint8Array(await png.arrayBuffer()));
  }
  const output=await SpreadsheetFile.exportXlsx(wb);await output.save(path.join(out,spec.file+'.xlsx'));await fs.copyFile(path.join(out,spec.file+'.xlsx'),path.join(root,spec.folder,spec.file+'.xlsx'));
  console.log(`${spec.file}: ${spec.rows.length} records; export style and summary verified.`);
}
for(const spec of reportRecords(data)){
  const wb=Workbook.create(),r=records(wb,spec),last=spec.rows.length+1;
  if(spec.file.startsWith('survey-')){
    const phase=spec.file.endsWith('before')?'before':'after',expected=phase==='before'?13:32;
    const s=summary(wb,`Мозаика. Опрос ${phase==='before'?'до':'после'} мероприятий`,phase==='before'?'16–29 марта 2026 года':'28 июня — 12 июля 2026 года');
    s.getRange('B7:C10').values=[['Всего ответов',null],['Осведомлены',null],['Осведомлённость',null],['Интерес к мероприятиям',null]];
    s.getRange('C7:C10').formulas=[[`=COUNTA('${spec.sheet}'!$A$2:$A$${last})`],[`=SUMPRODUCT(--('${spec.sheet}'!$G$2:$G$${last}))`],['=C8/C7'],[`=SUMPRODUCT(--('${spec.sheet}'!$H$2:$H$${last}))/C7`]];
    s.getRange('C7:C8').format.font={name:'Arial',size:11,bold:true,color:palette.ink};s.getRange('C9:C10').setNumberFormat('0.0%');
    s.getRange('B13:D16').values=[['Категория','Ответы','Доля'],...['Школьник','Студент','Работающая молодёжь'].map(v=>[v,null,null])];header(s,'B13:D13');
    s.getRange('C14:D16').formulas=[14,15,16].map(i=>[`=COUNTIFS('${spec.sheet}'!$D$2:$D$${last},B${i})`,`=C${i}/$C$7`]);
    s.getRange('B17').values=[['Итого']];s.getRange('C17:D17').formulas=[['=SUM(C14:C16)','=SUM(D14:D16)']];s.getRange('D14:D17').setNumberFormat('0.0%');total(s,'B17:D17');
    s.getRange('B21:D23').values=[['Ответ','Количество','Доля'],['Осведомлены',null,null],['Не осведомлены',null,null]];header(s,'B21:D21');
    s.getRange('C22:D23').formulas=[['=C8','=C22/$C$7'],['=C7-C8','=C23/$C$7']];s.getRange('D22:D23').setNumberFormat('0.0%');chart(s,'bar','B21:C23','Осведомлённость респондентов','G7','N24');
    note(s,27,'Выборка: 100 ответов. Критерий: названы не менее трёх народов.');note(s,28,'Источник итогового показателя: «Мозаика Культур 2 (1)», слайд 14.');
    wb.recalculate();assert.equal(s.getRange('C8').values[0][0],expected);assert.equal(s.getRange('C17').values[0][0],100);
    const index=spec.rows.findIndex(row=>!row[6]),cell=r.getRange(`G${index+2}`);cell.values=[[true]];wb.recalculate();assert.equal(s.getRange('C8').values[0][0],expected+1);cell.values=[[false]];
    await finish(wb,spec,'A1:O31');
  }else if(spec.file==='event-registrations'){
    const s=summary(wb,'Мозаика. Посещения мероприятий','30 марта — 27 июня 2026 года');
    s.getRange('B7:C9').values=[['Учтённые посещения',null],['Очные мероприятия',6],['Участники проекта','Более 500']];s.getRange('C7').formulas=[[`=COUNTA('${spec.sheet}'!$A$2:$A$${last})`]];s.getRange('B1:B44').format.columnWidth=58;
    s.getRange('B13:E19').values=[['Мероприятие','Дата','Посещения','Доля'],...data.events.map(e=>[e.name,excelDate(e.date),null,null])];header(s,'B13:E13');
    s.getRange('B14:B19').format.wrapText=true;s.getRange('B14:E19').format.rowHeight=38;s.getRange('C14:C19').setNumberFormat('yyyy-mm-dd');
    s.getRange('D14:E19').formulas=data.events.map((_,i)=>[`=COUNTIFS('${spec.sheet}'!$C$2:$C$${last},B${i+14})`,`=D${i+14}/$C$7`]);s.getRange('E14:E20').setNumberFormat('0.0%');
    s.getRange('B20').values=[['Итого']];s.getRange('D20:E20').formulas=[['=SUM(D14:D19)','=SUM(E14:E19)']];total(s,'B20:E20');
    s.getRange('B24:D26').values=[['Канал учёта','Записи','Доля'],['Предварительная запись',null,null],['На площадке',null,null]];header(s,'B24:D24');
    s.getRange('C25:D26').formulas=[25,26].map(i=>[`=COUNTIFS('${spec.sheet}'!$F$2:$F$${last},B${i})`,`=C${i}/$C$7`]);s.getRange('D25:D26').setNumberFormat('0.0%');
    s.getRange('G28:G34').format.columnWidth=22;
    s.getRange('G28:H34').values=[['Мероприятие','Посещения'],...data.events.map(e=>[e.short,null])];s.getRange('H29:H34').formulas=data.events.map((_,i)=>[`=D${i+14}`]);chart(s,'bar','G28:H34','Посещения по мероприятиям','G7','O25');
    note(s,37,'Учёт посещений. Один человек мог посетить несколько мероприятий.');note(s,38,'На фестивале молодёжи 27 июня учтено 326 посещений.');
    wb.recalculate();assert.equal(s.getRange('D20').values[0][0],517);assert.equal(s.getRange('C25:C26').values.flat().reduce((a,b)=>a+b,0),517);
    const cell=r.getRange('C2'),original=cell.values[0][0];cell.values=[[data.events[1].name]];wb.recalculate();assert.equal(s.getRange('D14').values[0][0],24);assert.equal(s.getRange('D15').values[0][0],36);cell.values=[[original]];
    await finish(wb,spec,'A1:O41');
  }else{
    const s=summary(wb,'Мозаика. Медиасопровождение','Март — август 2026 года');
    s.getRange('B7:C9').values=[['Публикации',null],['Просмотры',null],['Среднее на публикацию',null]];s.getRange('C7:C9').formulas=[[`=COUNTA('${spec.sheet}'!$A$2:$A$${last})`],[`=SUM('${spec.sheet}'!$F$2:$F$${last})`],['=C8/C7']];s.getRange('C8').setNumberFormat('#,##0');s.getRange('C9').setNumberFormat('0.0');
    const formats=[...new Set(data.publications.map(p=>p.type))];s.getRange('B13:E17').values=[['Формат','Публикации','Просмотры','Доля просмотров'],...formats.map(f=>[f,null,null,null])];header(s,'B13:E13');
    s.getRange('C14:E17').formulas=formats.map((_,i)=>[`=COUNTIFS('${spec.sheet}'!$D$2:$D$${last},B${i+14})`,`=SUMIFS('${spec.sheet}'!$F$2:$F$${last},'${spec.sheet}'!$D$2:$D$${last},B${i+14})`,`=D${i+14}/$C$8`]);s.getRange('E14:E18').setNumberFormat('0.0%');
    s.getRange('B18').values=[['Итого']];s.getRange('C18:E18').formulas=[['=SUM(C14:C17)','=SUM(D14:D17)','=SUM(E14:E17)']];total(s,'B18:E18');
    const months=['Март','Апрель','Май','Июнь','Июль','Август'];s.getRange('B23:E29').values=[['Месяц','Публикации','Просмотры','Накопительно'],...months.map(m=>[m,null,null,null])];header(s,'B23:E23');
    s.getRange('C24:E29').formulas=months.map((_,i)=>{
      const bounds=`'${spec.sheet}'!$B$2:$B$${last},">="&DATE(2026,${i+3},1),'${spec.sheet}'!$B$2:$B$${last},"<"&DATE(2026,${i+4},1)`;
      return [`=COUNTIFS(${bounds})`,`=SUMIFS('${spec.sheet}'!$F$2:$F$${last},${bounds})`,`=SUM($D$24:D${i+24})`];
    });
    s.getRange('B30').values=[['Итого']];s.getRange('C30:E30').formulas=[['=SUM(C24:C29)','=SUM(D24:D29)','=E29']];total(s,'B30:E30');s.getRange('D14:D30').setNumberFormat('#,##0');s.getRange('E24:E30').setNumberFormat('#,##0');
    chart(s,'bar',['B13:B17','D13:D17'],'Просмотры по форматам','G7','O21');chart(s,'line',['B23:B29','D23:D29'],'Просмотры по месяцам','G23','O37');
    note(s,40,'Источник итоговых показателей: «Мозаика Культур 2 (1)», слайд 13.');
    wb.recalculate();assert.equal(s.getRange('C7').values[0][0],16);assert.equal(s.getRange('D30').values[0][0],6568);
    const cell=r.getRange('F2'),original=cell.values[0][0];cell.values=[[original+10]];wb.recalculate();assert.equal(s.getRange('C8').values[0][0],6578);assert.equal(s.getRange('D24').values[0][0],532);cell.values=[[original]];
    await finish(wb,spec,'A1:O43');
  }
}
