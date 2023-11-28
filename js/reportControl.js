import { clearChart, generateChart } from "./generateChart.js";
import { reformatDate } from "./helpers.js";
import { OverlayScrollbars } from "./overlayscrollbars.esm.min.js";
import { delData, getData } from "./service.js";
import { storage } from "./storage.js";
import { financeControl } from "./financeControl.js";

const typeOperation = {
  income: "доход",
  expenses: "расход",
};

let actualData = [];

const report = document.querySelector('.report');
const financeReport = document.querySelector('.finance__report');
const reportOperationList = document.querySelector('.report__operation-list');
const reportTable = document.querySelector('.report__table');
const reportDates = document.querySelector('.report__dates');
const generateChartButton = document.querySelector('#generateChartButton');

OverlayScrollbars(report, {});

const closeReport =({target}) => {
  if(
    target.closest(".report__close") ||
     (!target.closest('.report')) && target !== financeReport
  ) {
    gsap.to(report, {
      opacity: 0,
      scale: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete() {
        report.style.visibility = "hidden";
      },
    });
  document.removeEventListener('click', closeReport)
  }
}
const openReport = () => {
  report.style.visibility = "visible";

  gsap.to(report, {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease:"power2.in",
  });
  document.addEventListener('click', closeReport)
};

const renderReport = (data) => {

  reportOperationList.textContent = 'Загрузка...';

  const reportRows = data.map(({category, amount,  description, date, type, id})=>{
    const reportRow = document.createElement('tr');
  reportRow.classList.add('report__row');

  reportRow.innerHTML = ` <td class="report__cell">${category}</td>
  <td class="report__cell">${amount.toLocaleString()}&nbsp; ₽</td>
  <td class="report__cell">${description}</td>
  <td class="report__cell">${reformatDate(date)}</td>
  <td class="report__cell">${typeOperation[type]}</td>
  <td class="report__action-cell">
    <button
      class="report__button report__button_table" data-id=${id} >&#10006;</button>
  </td>`;
  return reportRow;
  })
  reportOperationList.append(...reportRows);
}; 


export const reportControl = () => {

 reportOperationList.addEventListener('click' , async ({target}) => {
    
      console.log(target.dataset.id);
const buttonDel = target.closest('.report__button_table');
console.log('buttonDel: ', buttonDel);
const reportRow = buttonDel.closest('.report__row');
console.log('reportRow : ', reportRow );
if(buttonDel){
 await delData(`/finance/${buttonDel.dataset.id}`);
      // console.log('reportRow : ', reportRow );
    reportRow.remove();
    financeControl();
    clearChart();
  
  }
    })

  reportTable.addEventListener('click',  ({target}) => {

  
   const targetSort = target.closest('[data-sort]');
      
  if(targetSort) {
   const sortField = targetSort.dataset.sort;
   console.log(sortField);

   renderReport([...storage.data].sort((a,b)=> {
    if(targetSort.dataset.dir === 'up'){
      [a, b] = [b, a];
      };
    if(sortField === 'amount'){
      return parseFloat(a[sortField]) < parseFloat(b[sortField]) ? -1 : 1;
    } 
    return a[sortField] < b[sortField] ? -1 : 1;
   }),
   );
   if(targetSort.dataset.dir === 'up'){
    targetSort.dataset.dir = "down";
   } else {
    targetSort.dataset.dir = 'up';
   }
  }
   
  });

  
  financeReport.addEventListener('click', async () => {
    const textContent = financeReport.textContent;
    financeReport.textContent = 'Загрузка';
    financeReport.disabled = true;
    
    actualData = await getData('/finance');
    storage.data = actualData;
 
  
    financeReport.textContent = textContent;
    financeReport.disabled = false;
  
    renderReport(actualData);
    openReport();
  });
  
  reportDates.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = Object.fromEntries(new FormData(reportDates));
  
  const searchParams = new URLSearchParams();
  
  if(formData.startDate){
    searchParams.append('startDate', formData.startDate)
  }
  
  if(formData.endDate){
    searchParams.append('endDate', formData.endDate)
  }
  
  const queryString = searchParams.toString();
  const url = queryString ? `/finance?${queryString}` : '/finance';
  
  actualData = await getData(url);
  renderReport(actualData);
  clearChart();
  });
};

generateChartButton.addEventListener('click', () => {
  generateChart(actualData);
})