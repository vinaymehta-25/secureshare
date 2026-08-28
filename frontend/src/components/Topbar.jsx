import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Topbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand-dot" />
        secureshare
      </div>
      <div className="topbar-user">
        <button className="btn-ghost" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  )
}
