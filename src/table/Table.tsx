import { useCallback, useEffect, useState } from "react";
import { Button, Form, Stack, Table as BootstrapTable, OverlayTrigger, Popover } from 'react-bootstrap';
import "./Table.scss"
import { JustFilter, TableFilter, TableSort, TableType } from "./types";
import FilterAndSortPng from './filter_and_sort.png';
import UpdatePng from './update.png';
import SearchPng from './search.png';
import LeftPng from './left.png';
import RightPng from './right.png';
import LoadingPng from './loading.gif';
import { DateFilterForm, EnumFilterForm, NumberFilterForm, StringFilterForm } from "./filters";

export function Table<Data = any>({ columns, getData, itemRef }: TableType<Data>) {
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
    if (itemRef) {
      itemRef.current = renderData;
    };    
  }, [])

  const inputFiltersProps = (columnKey: string) => {
    const column = columns.find(column => column.key === columnKey);
    const filterValue: any = filter.find(item => item.columnKey)?.filter;
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

  const getSortRadio = (columnKey: string) => {
    const sortParam = sort.find((item) => item.columnKey === columnKey);

    if (sortParam) {
      return sortParam.desc ? 'desc' : 'asc'
    }

    return 'not';
  }

  const setSortRadio = (columnKey: string, value: 'not' | 'desc' | 'asc') => {
    setSort(
      sort
        .filter((item) => item.columnKey !== columnKey)
        .concat(value !== 'not'
          ? [{ columnKey, desc: value === 'desc' }]
          : []
        )
    )
  }

  return (
    <div className="table-container">
      <div className="table__header">
        <div className="table__settings">
          <form onSubmit={(e) => {
            e.preventDefault();
            setSearch((e.target as any).elements.search.value)
          }}>
            <Stack direction="horizontal" gap={1}>
              <Form.Control name="search" placeholder="Поиск" />
              <Button size="sm" variant="light" type="submit">
                <img className="icon" src={SearchPng} alt="search" />
              </Button>
            </Stack>
          </form>
          <Button size="sm" variant="light" onClick={renderData}>
            <img className="icon" src={UpdatePng} alt="update" />
          </Button>
        </div>
      </div>
      <div className="table__content">
        <BootstrapTable style={{ tableLayout: 'fixed' }} striped bordered hover>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}  style={{ width: column.width }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {column.title}
                    <OverlayTrigger
                      trigger="click"
                      placement="left"
                      overlay={(
                        <Popover id={column.key}>
                          <Popover.Body>
                            <div className="table__filter-sort-panel">
                              <Stack direction="vertical" gap={1} className="table__prop">
                                Сотрировка
                                <Stack style={{ width: '100%' }} direction="vertical" gap={1}>
                                  <Form.Check
                                    type="radio"
                                    checked={getSortRadio(column.key) === 'asc'}
                                    onClick={() => setSortRadio(column.key, 'asc')}
                                    label="от А до Я"
                                  />
                                  <Form.Check
                                    type="radio"
                                    checked={getSortRadio(column.key) === 'desc'}
                                    onClick={() => setSortRadio(column.key, 'desc')}
                                    label="от Я до А"
                                  />
                                  <Form.Check
                                    type="radio"
                                    checked={getSortRadio(column.key) === 'not'}
                                    onClick={() => setSortRadio(column.key, 'not')}
                                    label="Нет"
                                  />
                                </Stack>
                                Фильтр
                                <label>
                                  <Form.Check
                                    type="checkbox"
                                    checked={!excludeNull.includes(column.key)}
                                    onClick={() => {
                                      setExcludeNull(
                                        excludeNull.includes(column.key)
                                          ? excludeNull.filter(item => item !== column.key)
                                          : [...excludeNull, column.key]
                                      )
                                    }}
                                    style={{ marginRight: 5 }}
                                  />
                                  Показать пустые
                                </label>
                                {['str', 'password'].includes(column.type) && (
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
                              </Stack>
                            </div>
                          </Popover.Body>
                        </Popover>

                      )}
                    >
                      <Button
                        size="sm"
                        variant={(
                          sort.concat(filter as any).some(item => item.columnKey === column.key)
                            ? "success"
                            : "light"
                        )}
                      >
                        <img className="icon" src={FilterAndSortPng} alt="filterandsort" />
                      </Button>
                    </OverlayTrigger>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {!loading && (
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key} style={{ width: column.width }}>
                      {column.render(item, index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </BootstrapTable>
        {loading
          && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', zIndex: +100 }}>
              <img style={{ height: 300 }} src={LoadingPng} alt="loading" />
            </div>
          )}
      </div>
      <div className="table__footer">
        Показывать
        <Form.Control
          style={{ width: '60px' }}
          type="number"
          min="0"
          max={totalRows}
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
        Показаны
        <Button
          size="sm"
          variant="light"
          disabled={offset === 0}
          onClick={() => setOffset(Math.max(offset - +limit, 0))}
          onDoubleClick={() => setOffset(0)}
        >
          <img className="icon" src={LeftPng} alt="prev" />
        </Button>
        <div>
          {offset + 1} - {Math.min(offset + +limit, totalFiltredRows)}
        </div>
        <Button
          size="sm"
          variant="light"
          disabled={totalFiltredRows <= +offset + +limit}
          onClick={() => setOffset(offset + +limit)}
          onDoubleClick={() => setOffset(totalFiltredRows - +limit)}
        >
          <img className="icon" src={RightPng} alt="next" />
        </Button>
        <span>
          Всего отфильтровано {totalFiltredRows} из {totalRows}
        </span>
      </div>
    </div>
  )
}