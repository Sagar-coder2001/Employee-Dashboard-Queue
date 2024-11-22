import { configureStore } from '@reduxjs/toolkit'
import Tokenslice  from '../Features/Tokenslice'

export const Store = configureStore({
  reducer: {
    token: Tokenslice,
  },
})

