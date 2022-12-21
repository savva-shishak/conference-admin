import { Route, Routes, Link } from 'react-router-dom';
import { AdminTable } from './admin/AdminTable';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'grid', gridTemplateColumns: '200px 1fr', overflow: 'hidden' }}>
      <ul>
        <li><Link to="/rooms">Комнаты</Link></li>
        <li><Link to="/peers">Участники</Link></li>
        <li><Link to="/messages">Сообщения</Link></li>
      </ul>
      <div style={{ borderLeft: '1px solid grey', width: '100%', height: '100%' }}>
        <Routes>
          <Route path="/rooms" element={<AdminTable tableName="rooms" />} />
          <Route path="/peers" element={<AdminTable tableName="peers" />} />
          <Route path="/messages" element={<AdminTable tableName="messages" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
