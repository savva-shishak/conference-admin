import { Button } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../table/Table';
import CopyIcon from './copy.png';
import DownloadIcon from './download.png';
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
          if (!row[column.key]) {
            return null;
          }

          if (column.type === 'date') {
            return moment(row[column.key]).format(column.format)
          }

          if (column.type === 'anchor') {
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

          if (column.type === 'img') {
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={row[column.key]} alt={column.key} style={{ height: 50, width: 'auto' }} />
                <a href={row[column.key]} target="_blank">
                  <Button size="small">
                    <img src={DownloadIcon} className="icon" />
                  </Button>
                </a>
              </div>
            )
          }

          if (column.type === 'key') {
            return (
              <div>
                <Button style={{ marginRight: 10 }} size="small" onClick={() => navigator.clipboard.writeText(row[column.key])}>
                  <img src={CopyIcon} className="icon" />
                </Button>
                {row[column.key].slice(0, 5)}
                ...
              </div>
            )
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
