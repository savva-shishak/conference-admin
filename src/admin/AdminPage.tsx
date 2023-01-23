import React, { useLayoutEffect, useState, ReactNode, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Column } from './types';
import { AdminTable } from './AdminTable';
import LoadingPng from '../table/loading.gif';
import { agent } from './context';

type HtmlComponent = {
  type: 'html',
  payload: string,
};

type TableComponent = {
  type: 'table',
  columns: Column<any>[],
  id: string,
};

type PageComponent = HtmlComponent | TableComponent;

let cashLoadedPath: string | null = '';

export function AdminPage({ path }: { path: string }) {
  const [components, setComponents] = useState<ReactNode[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(document.createElement('div'));

  const params = useParams();
  console.log(path);

  useLayoutEffect(() => {    
    if (cashLoadedPath === path) return;
    cashLoadedPath = path;
    setLoading(true);
    
    agent.post('/admin/pages/load', { path, params }).then(({ data: { content, title } }) => {
      document.title = title;
      
      setComponents(
        content
          .map((item: PageComponent, id: number) => {
            if (item.type === 'html') {
              return <div dangerouslySetInnerHTML={{ __html: item.payload }} />;
            }

            if (item.type === 'table') {
              return <AdminTable columns={item.columns} id={item.id} />;
            }

            return <React.Fragment key={id}/>;
          })
          .map((item: any, id: number) => <div key={id} style={{ marginBottom: 35 }}>{item}</div>)
      );
      setLoading(false);
      setTimeout(() => {
        const inputs = Array.from(ref.current?.querySelectorAll('input[type="file"]') || []) as HTMLInputElement[];
        
        for (const input of inputs) {
          const value = input.attributes.getNamedItem('value')?.value || '';
          if (value) {
            fetch(value)
              .then((res) => res.blob())
              .then((blob) => {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(new File([blob], value.split('/').at(-1) || 'file'));
                input.files = dataTransfer.files;
              })
          }
        }
      }, 100);
    });
  }, [path]);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridAutoRows: 'max-content',
        padding: 20
      }}
    >
      {loading
        ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img style={{ width: 500 }} src={LoadingPng} alt="loading" />
          </div>
        )
        : components
      }
    </div>
  )
}