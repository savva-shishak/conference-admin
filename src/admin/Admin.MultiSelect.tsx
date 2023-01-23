import { useState } from "react";
import { Form, ListGroup, OverlayTrigger, Popover, Button } from "react-bootstrap";
import { agent } from "./context";
import LoadingSrc from '../table/loading.gif';

export type AdminMultiSelectParams = {
  value: string[],
  actionId: string,
  row: any,
  options: { text: string, value: string }[]
};

export function AdminMultiSelect({ value, actionId, row, options }: AdminMultiSelectParams) {
  const [state, setState] = useState(value);
  const [loading, setLoading] = useState<string[]>([]);

  return (
    <OverlayTrigger
      trigger="click"
      placement="left"
      overlay={
        <Popover id="popover-basic">
          <Popover.Body>
            <ListGroup style={{ width: 250 }}>
              {options.map(({ value, text }) => (
                <ListGroup.Item key={value}>
                  {loading.includes(value) 
                    ? <img className="icon" src={LoadingSrc} />
                    : <Form.Check
                        checked={state.includes(value)}
                        label={text}
                        onChange={() => {
                          setLoading(loading => [...loading, value]);
                          agent
                            .post(
                              '/admin/pages/components/action/' + actionId,
                              {
                                inputValue: state.includes(value)
                                  ? state.filter(item => item !== value)
                                  : [...state, value],
                                row
                              })
                            .then(() => {
                              setState(state => (
                                state.includes(value)
                                  ? state.filter(item => item !== value)
                                  : [...state, value]
                                )
                              );
                            })
                            .finally(() => setLoading(loading => loading.filter(item => item !== value)))
                        }}
                      />}
                  </ListGroup.Item>
                )
              )}
            </ListGroup>
          </Popover.Body>
        </Popover>
      }
    >
      <Button>{state.length} элемент(ов)</Button>
    </OverlayTrigger>
  )
}