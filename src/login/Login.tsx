import { Form, Button, Stack, Alert } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, tokenStore } from "../admin/context";
import "./Login.scss";

export function Login() {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="login">
      <Form onSubmit={(e) => {
        e.preventDefault();
        login(
          e.currentTarget['login'].value,
          e.currentTarget['password'].value
        )
          .then(() => navigate('/'))
          .catch(() => setError(true));
      }}>
        <Stack direction="vertical" gap={3}>
          {error && <Alert >Не правильный логин или пароль</Alert>}
          <Form.Group>
            <Form.Label>Логин</Form.Label>
            <Form.Control name="login" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Пароль</Form.Label>
            <Form.Control name="password" type="password" />
          </Form.Group>
          <Button type="submit" style={{ width: '100%' }}>Войти</Button>
        </Stack>
      </Form>
    </div>
  )
}