import { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Table } from '../table/Table';
import CopyIcon from './copy.png';
import DownloadIcon from './download.png';
import { agent } from './context';
import { Column } from './types';
import { onUpdate } from '../App';
import { AdminCheckbox } from './AdminCheckbox';
import { AdminSelect } from './AdminSelect';
import { AdminMultiSelect } from './Admin.MultiSelect';
import { AdminInput } from './AdminInput';

export function AdminTable({ id, columns }: { id: string, columns: Column<any>[] }) {
  const navigate = useNavigate();
  const ref = useRef(() => {})

  useEffect(() => {
    const sub = onUpdate.subscribe(() => {
      ref.current();
    });

    return () => sub.unsubscribe();
  }, []);

  return (columns ? (
    <Table
      itemRef={ref}
      columns={columns.map((column: any) => ({
        key: column.key as any,
        title: column.title,
        type: ['anchor', 'password'].includes(column.type) ? 'str' : column.type as any,
        values: column.values,
        render(row: any) {
          if (row[column.key] === null || row[column.key] === undefined) {
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
                  <Button variant="light" size="sm">
                    <img src={DownloadIcon} className="icon" />
                  </Button>
                </a>
              </div>
            )
          }

          if (column.type === 'key') {
            return (
              <div>
                <Button variant="light" style={{ marginRight: 10 }} size="sm" onClick={() => navigator.clipboard.writeText(row[column.key])}>
                  <img src={CopyIcon} className="icon" />
                </Button>
                {row[column.key].slice(0, 5)}
                ...
              </div>
            )
          }

          if (column.type === 'checkbox') {
            return (
              <AdminCheckbox value={row[column.key]} row={row} actionId={column.onChange} />
            );
          }

          if (column.type === 'select') {
            return (
              <AdminSelect options={column.options} value={row[column.key]} row={row} actionId={column.onChange} />
            );
          }

          if (column.type === 'multiselect') {
            return (
              <AdminMultiSelect options={column.options} value={row[column.key]} row={row} actionId={column.onChange} />
            );
          }

          if (column.type === 'input') {
            return (
              <AdminInput value={row[column.key]} row={row} actionId={column.onChange} />
            );
          }

          if (column.type === 'html') {
            return <div dangerouslySetInnerHTML={{ __html: row[column.key] }} />;
          }

          return row[column.key];
        }
      }))}
      getData={(params) => {
        return agent.post(`/admin/pages/components/get-data`, { params, id }).then(res => res.data);
      }} 
    />
  ) : <>Загрузка...</>)
}
