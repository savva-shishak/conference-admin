import { useState } from "react";
import { Form } from "react-bootstrap";
import { agent } from "./context";
import LoadingSrc from '../table/loading.gif';

export type AdminSelectParams = {
  value: string,
  actionId: string,
  row: any,
  options: { text: string, value: string }[]
};

export function AdminSelect({ value, actionId, row, options }: AdminSelectParams) {
  const [state, setState] = useState(value);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <img className="icon" src={LoadingSrc} />
  }

  return (
    <Form.Select
      value={state}
      onChange={(e) => {
        setLoading(true);
        agent
          .post('/admin/pages/components/action/' + actionId, { inputValue: e.target.value, row })
          .then(() => {
            setState(e.target.value);
          })
          .finally(() => setLoading(false))
      }}
    >
      {options.map((option) => <option key={option.value} value={option.value}>{option.text}</option>)}
    </Form.Select>
  )
}