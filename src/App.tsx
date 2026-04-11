import './App.css'
import AuthModal from './features/auth/components/AuthModal'
import { useAppDispatch } from './hooks/useAppDispatch'
import { openModal } from './store/auth/slice'

function App() {
  const dispatch = useAppDispatch()

  return (
    <>
      <AuthModal />
      {/* Dev trigger — remove when real nav is in place */}
      <div className="flex min-h-screen items-center justify-center">
        <button
          onClick={() => dispatch(openModal('login'))}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Open Auth
        </button>
      </div>
    </>
  )
}

export default App
