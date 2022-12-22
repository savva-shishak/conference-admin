import { Route, Routes, Link } from 'react-router-dom';
import { AdminTable } from './admin/AdminTable';
import RoomsIcon from './assets/rooms.jpg';
import UsersIcon from './assets/users.png';
import MessagesIcon from './assets/messages.png';
import RegistrationsIcon from './assets/registry.png';
import OperatorIcon from './assets/operator.png';
import { Login } from './login/Login';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'grid', gridTemplateColumns: '200px 1fr', gridTemplateRows: '100%', overflow: 'hidden' }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <>
              <div>
                <div
                  style={{
                    display: 'flex',
                    width: '200px',
                    height: '200px',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <img
                    style={{ width: 150, height: 150 }}
                    src={OperatorIcon}
                  />
                </div>
                <div className="link"><img src={RoomsIcon} className="icon" alt=""/> <Link to="/rooms">Комнаты</Link></div>
                <div className="link"><img src={UsersIcon} className="icon" alt=""/> <Link to="/peers">Участники</Link></div>
                <div className="link"><img src={MessagesIcon} className="icon" alt=""/> <Link to="/messages">Сообщения</Link></div>
                <div className="link"><img src={RegistrationsIcon} className="icon" alt=""/> <Link to="/users">Регистрации</Link></div>
              </div>
              <div style={{ borderLeft: '1px solid grey', width: '100%', height: '100%' }}>
                <Routes>
                  <Route path="/rooms" element={<AdminTable tableName="rooms" />} />
                  <Route path="/peers" element={<AdminTable tableName="peers" />} />
                  <Route path="/messages" element={<AdminTable tableName="messages" />} />
                  <Route path="/users" element={<AdminTable tableName="users" />} />
                </Routes>
              </div>
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
