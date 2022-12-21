import { useCallback, useEffect, useState } from "react";
import "./Table.scss"
import { JustFilter, TableFilter, TableSort, TableType } from "./types";
import ArrowPng from './arrow.png';
import { DateFilterForm, EnumFilterForm, NumberFilterForm, StringFilterForm } from "./filters";

export function Table<Data = any>({ columns, getData, ref }: TableType<Data>) {
  const [totalRows, setTotalRows] = useState(0);
  const [totalFiltredRows, setTotalFiltredRows] = useState(0);
  const [data, setData] = useState<Data[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TableFilter[]>([]);
  const [excludeNull, setExcludeNull] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState<string | number>(10);
  const [sort, setSort] = useState<TableSort[]>([]);
  const [loading, setLoading] = useState(false);

  const renderData = useCallback(async () => {
    setLoading(true);
    const { totalRows, totalFiltredRows, data } = await getData({
      limit: +limit,
      offset,
      sort,
      filter: [
        ...filter,
        ...excludeNull.map((columnKey) => ({
          columnKey,
          filter: { name: 'not-null' as 'not-null' }
        }))
      ],
      search,
    });
    setData(data);
    setTotalRows(totalRows);
    setTotalFiltredRows(totalFiltredRows);
    setLoading(false);
  }, [limit, offset, sort, filter, search, excludeNull]);

  useEffect(() => {
    renderData();
  }, [renderData]);

  useEffect(() => {
    setOffset(0);
  }, [limit, totalFiltredRows]);

  useEffect(() => {
    if (ref) ref.current = renderData;
  }, [])

  const inputFiltersProps = (columnKey: string) => {
    const column = columns.find(column => column.key === columnKey);
    const filterValue = filter.find(item => item.columnKey)?.filter;
    return ({
      value: (column?.type === "enum")
        ? (filterValue || { name: 'enum', filter: [], values: column.values })
        : filterValue as any,
      setValue: (value: JustFilter) => {
        setFilter(
          filter
            .filter(item => item.columnKey !== columnKey)
            .concat([{ columnKey: columnKey, filter: value }])
        );
      },
      onClear() {
        setFilter(filter.filter(item => item.columnKey !== columnKey));
      }
    })
  }

  return (
    <div className="table">
      <div className="table__header">
        <div className="table__settings">
          <form onSubmit={(e) => {
            e.preventDefault();
            setSearch((e.target as any).elements.search.value)
          }}>
            <input name="search" placeholder="Поиск" />
            <button type="submit">
              Найти
            </button>
          </form>
          <button onClick={renderData}>Обновить данные</button>
        </div>
      </div>
      <div className="table__content">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.title}
                  <div
                    className={
                      "table__filter-sort" + ((
                        sort.some((item) => item.columnKey === column.key)
                        || filter.some((item) => item.columnKey === column.key)
                      ) ? ' table__filter-sort-active' : '')
                    }
                  >
                    <img src={ArrowPng} alt="arrow" />
                    <div className="table__filter-sort-panel">
                      <div className="table__prop">
                        Сотрировка
                        <div>
                          <input
                            name={'sort-' + column.key}
                            type="radio"
                            checked={sort.some(({ columnKey, desc }) => !desc && columnKey === column.key)}
                            onClick={() => {
                              setSort(
                                sort
                                  .filter(({ columnKey }) => columnKey !== column.key)
                                  .concat([{ desc: false, columnKey: column.key }])
                              );
                            }}
                          />
                          От А до Я
                        </div>
                        <div>
                          <input
                            name={'sort-' + column.key}
                            type="radio"
                            checked={sort.some(({ columnKey, desc }) => desc && columnKey === column.key)}
                            onClick={() => {
                              setSort(
                                sort
                                  .filter(({ columnKey }) => columnKey !== column.key)
                                  .concat([{ desc: true, columnKey: column.key }])
                              );
                            }}
                          />
                          От Я до А
                        </div>
                        <div>
                          <input
                            name={'sort-' + column.key}
                            type="radio"
                            checked={sort.every(({ columnKey }) => columnKey !== column.key)}
                            onClick={() => {
                              setSort(
                                sort.filter(({ columnKey }) => columnKey !== column.key)
                              );
                            }}
                          />
                          Нет
                        </div>
                        Фильтр
                        <br />
                        <label>
                          <input
                            type="checkbox"
                            checked={!excludeNull.includes(column.key)}
                            onClick={() => {
                              setExcludeNull(
                                excludeNull.includes(column.key)
                                  ? excludeNull.filter(item => item !== column.key)
                                  : [...excludeNull, column.key]
                              )
                            }}
                          />
                          Показать пустые
                        </label>
                        {column.type === 'str' && (
                          <StringFilterForm {...inputFiltersProps(column.key)} />
                        )}
                        {column.type === 'num' && (
                          <NumberFilterForm {...inputFiltersProps(column.key)} />
                        )}
                        {column.type === 'date' && (
                          <DateFilterForm {...inputFiltersProps(column.key)} />
                        )}
                        {column.type === 'enum' && (
                          <EnumFilterForm {...inputFiltersProps(column.key)} />
                        )}
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ opacity: loading ? 0.3 : 1 }}>
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td>{column.render(item, index)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table__footer">
        <div className="table__paginator">
          Показывать
          <input
            type="number"
            min="0"
            max={totalRows}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
          Показаны
          <button
            disabled={offset === 0}
            onClick={() => setOffset(0)}
          >
            {'<<'}
          </button>
          <button
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(offset - +limit, 0))}
          >
            {'<'}
          </button>
          {offset + 1} - {Math.min(offset + +limit, totalFiltredRows)}
          <button
            disabled={offset > totalFiltredRows - 1 - +limit}
            onClick={() => setOffset(offset + +limit)}
          >
            {'>'}
          </button>
          <button
            disabled={offset > totalFiltredRows - 1 - +limit}
            onClick={() => setOffset(totalFiltredRows - +limit)}
          >
            {'>>'}
          </button>
          Всего:
          <span>
            с фильтами {totalFiltredRows}
          </span>
          <span>
            исходно {totalRows}
          </span>
        </div>
      </div>
    </div>
  )
}