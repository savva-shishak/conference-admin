import moment from 'moment';
import { GetDataParams } from "./table/types";

const dictionary = ['First enum', 'second enum', 'other enum'];

const data = new Array(100).fill(null).map((_, index) => ({
  id: index + 1,
  str: `String № ${Math.random() * 5 >> 0}`,
  num: Math.random() * 1000 >> 0,
  date: moment(new Date()).add(Math.random() * 30 >> 0, 'day').toDate(),
  enum: ['First enum', 'second enum', 'other enum'][Math.random() * 3 >> 0]
}));

let idCount = data.length;

export async function getDictionary() {
  await new Promise(r => setTimeout(r, 1000));
  return dictionary;
}

export async function addItem(item: Omit<typeof data[0], 'id'>) {
  await new Promise(r => setTimeout(r, 1000));
  data.unshift({ ...item, id: ++idCount });
}

export async function updateItem(item: typeof data[0]) {
  await new Promise(r => setTimeout(r, 1000));
  
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === item.id) {
      data[i] = item;
    }
  }
}

export async function removeItem(id: number) {
  await new Promise(r => setTimeout(r, 1000));
  const index = data.findIndex((item) => item.id === id);

  if (index !== -1) {
    data.splice(index, 1);
  }
}

export async function getData({ limit, offset, search, sort, filter: filterArray }: GetDataParams) {
  await new Promise(r => setTimeout(r, 1000))
  const resultLessLimitAndOffset = data
    .filter((item) => item.str.includes(search) || item.enum.includes(search))
    .filter((item: any) => {
      for (const { columnKey, filter } of filterArray) {
        const value = item[columnKey];
        if (!value && value !== 0 && value !== '0') {
          continue;
        }
        if (filter.name === 'str' && (!value.includes(filter.search) || (!!filter.notInclude || value.includes(filter.notInclude)))) {
          return false;
        }
        if (filter.name === 'num' && ((!filter.from || value < filter.from) || (!filter.to || value > filter.to))) {
          return false;
        }
        if (filter.name === 'date' && ((!filter.from || moment(value).isAfter(filter.from)) || (!filter.to || moment(value).isBefore(filter.to)))) {
          return false;
        }
        if (filter.name === 'enum' && (!filter.filter.length || !filter.filter.includes(value))) {
          return false;
        }
      }
      return true;
    });

  return {
    totalFiltredRows: resultLessLimitAndOffset.length,
    totalRows: data.length,
    data: resultLessLimitAndOffset
      .sort((a: any, b: any) => {      
        for (const { columnKey, desc } of sort) {
          if (a[columnKey] === b[columnKey]) {
            continue;
          } else {          
            const val = desc ? (a[columnKey] > b[columnKey]) : (a[columnKey] < b[columnKey]);

            return (val) ? -1 : 1;
          }
        }

        return 0;
      })
      .filter((_, id) => id >= offset)
      .filter((_, id) => id < limit)
  };
}