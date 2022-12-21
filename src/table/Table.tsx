import { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Input, Popconfirm, Radio, Space, Table as AntTable, Tooltip } from 'antd';
import "./Table.scss"
import { JustFilter, TableFilter, TableSort, TableType } from "./types";
import FilterAndSortPng from './filter_and_sort.png';
import UpdatePng from './update.png';
import SearchPng from './search.png';
import LeftPng from './left.png';
import RightPng from './right.png';
import LoadingPng from './loading.gif';
import StrPng from './text.png';
import NumPng from './numbers.png';
import DatePng from './clock.png';
import EnumPng from './enum.jpg';
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
    <div className="table">
      <div className="table__header">
        <div className="table__settings">
          <form onSubmit={(e) => {
            e.preventDefault();
            setSearch((e.target as any).elements.search.value)
          }}>
            <Space direction="horizontal">
              <Input name="search" placeholder="Поиск" />
              <Button htmlType="submit">
                <img className="icon" src={SearchPng} alt="search" />
              </Button>
            </Space>
          </form>
          <Button onClick={renderData}>
            <img className="icon" src={UpdatePng} alt="update" />
          </Button>
        </div>
      </div>
      <div className="table__content">
        {loading
          ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', zIndex: +100 }}>
              <img style={{ width: 500 }} src={LoadingPng} alt="loading" />
            </div>
          )
          : (
            <AntTable
              columns={columns.map((column, id) => ({
                dataIndex: 'column' + id,
                title: (
                  <div
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', gap: 5 }}>
                      {column.title}
                      {column.type === 'str' && <img className="icon" src={StrPng} alt="" />}
                      {column.type === 'num' && <img className="icon" src={NumPng} alt="" />}
                      {column.type === 'date' && <img className="icon" src={DatePng} alt="" />}
                      {column.type === 'enum' && <img className="icon" src={EnumPng} alt="" />}
                    </div>
                    <Tooltip
                      placement="bottomRight"
                      color="white"
                      title={(
                        <div className="table__filter-sort-panel">
                          <Space direction="vertical" size="small" className="table__prop">
                            Сотрировка
                            <Radio.Group
                              value={getSortRadio(column.key)}
                              onChange={(e) => setSortRadio(column.key, e.target.value)}
                            >
                              <Space style={{ width: '100%' }} direction="vertical" size="small">
                                <Radio value="asc">от А до Я</Radio>
                                <Radio value="desc">от Я до А</Radio>
                                <Radio value="not">Нет</Radio>
                              </Space>
                            </Radio.Group>
                            Фильтр
                            <label>
                              <Checkbox
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
                          </Space>
                        </div>
                      )}
                    >
                      <img className="icon" src={FilterAndSortPng} alt="filterandsort" />
                    </Tooltip>
                  </div>
                ),
                key: 'column' + id,
              }))}
              pagination={false}
              dataSource={[
                ...data.map((item, itemId) => columns.reduce((acc, column, id) => ({
                  ...acc,
                  ['column' + id]: column.render(item, itemId)
                }), {})),
              ]}
            />
          )}
      </div>
      <div className="table__footer">
        <Space direction="horizontal">
          Показывать
          <Input
            type="number"
            min="0"
            max={totalRows}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
          Показаны
          <Button
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(offset - +limit, 0))}
            onDoubleClick={() => setOffset(0)}
          >
            <img className="icon" src={LeftPng} alt="prev" />
          </Button>
          {offset + 1} - {Math.min(offset + +limit, totalFiltredRows)}
          <Button
            disabled={offset === 0}
            onClick={() => setOffset(offset + +limit)}
            onDoubleClick={() => setOffset(totalFiltredRows - +limit)}
          >
            <img className="icon" src={RightPng} alt="next" />
          </Button>
          <span>
            Всего отфильтровано {totalFiltredRows} / {totalRows}
          </span>
        </Space>
      </div>
    </div>
  )
}