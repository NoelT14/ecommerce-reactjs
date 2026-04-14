import { useEffect } from 'react'
import { useAppDispatch } from './useAppDispatch'
import { clearMessages } from '../../store/auth/slice'

export function useClearAuthMessages() {
  const dispatch = useAppDispatch()
  useEffect(() => () => { dispatch(clearMessages()) }, [dispatch])
}
