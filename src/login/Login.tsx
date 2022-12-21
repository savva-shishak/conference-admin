import { Input, Button, Space } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, tokenStore } from "../admin/context";
import "./Login.scss";

export function Login() {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="login">
      <form onSubmit={(e) => {
        e.preventDefault();
        login(
          e.currentTarget['login'].value,
          e.currentTarget['password'].value
        )
          .then((token) => {
            tokenStore.update(() => ({ token }));
            navigate('/')
          })
          .catch(() => setError(true));
      }}>
        <Space direction="vertical" size="small">
          {error && <div style={{ color: 'red' }}>Не правильный логин или пароль</div>}
          <Input name="login" placeholder="Логин" />
          <Input.Password name="password" placeholder="Пароль" />
          <Button htmlType="submit" style={{ width: '100%' }}>Войти</Button>
        </Space>
      </form>
    </div>
  )
}