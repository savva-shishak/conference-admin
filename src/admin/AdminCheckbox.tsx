import { useState } from "react";
import { Form } from "react-bootstrap";
import { agent } from "./context";
import LoadingSrc from '../table/loading.gif';

export function AdminCheckbox({ value, actionId, row }: { value: boolean, actionId: string, row: any }) {
  const [state, setState] = useState(value);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <img className="icon" src={LoadingSrc} />
  }

  return (
    <Form.Check
      type="checkbox"
      checked={state}
      onChange={() => {
        setLoading(true);
        agent
          .post('/admin/pages/components/action/' + actionId, { inputValue: !state, row })
          .then((res) => {
            if (res.data === 'ok') {
              setState(!state);
            }
          })
          .finally(() => setLoading(false))
      }}
    />
  )
}