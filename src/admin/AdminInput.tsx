import { useState } from "react";
import { Form } from "react-bootstrap";
import { agent } from "./context";
import LoadingSrc from '../table/loading.gif';

export type AdminInputParams = {
  value: string,
  actionId: string,
  row: any,
};

export function AdminInput({ value, actionId, row }: AdminInputParams) {
  const [state, setState] = useState(value);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <img className="icon" src={LoadingSrc} />
  }

  return (
    <Form.Control
      value={state}
      onChange={(e) => setState(e.target.value)}
      onBlur={() => {
        setLoading(true);
        agent
          .post('/admin/pages/components/action/' + actionId, { inputValue: state, row })
          .finally(() => setLoading(false))
      }}
    />
  )
}