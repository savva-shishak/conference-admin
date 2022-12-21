import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../table/Table';
import { agent } from './context';

export function AdminTable({ tableName }: { tableName: string }) {
  const [columns, setColumns] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setColumns(null);
    agent.get(`/table/${tableName}/columns`).then(({ data }) => {
      setColumns(data.map((column: any) => ({
        ...column,
        render(row: any) {
          if (column.type === 'date' && !!row[column.key]) {
            return moment(row[column.key]).format(column.format)
          }

          if (column.type === 'anchor' && !!row[column.key]) {
            const { href, label } = row[column.key];

            if (href.startsWith('http')) {
              return <a href={href} target="_blank">{label}</a>
            } else {
              return (
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(href);
                  }}
                >
                  {label}
                </a>
              );
            }
          }

          return row[column.key];
        }
      })))
    });
  }, [tableName]);

  return (columns ? (
    <Table
      columns={columns}
      getData={(params) => {
        return agent.post(`/table/${tableName}/get-data`, { params }).then(res => res.data);
      }} 
    />
  ) : <>Загрузка...</>)
}
