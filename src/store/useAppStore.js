import { create } from 'zustand'
import { createRoleSlice } from './slices/roleSlice'
import { createThemeSlice } from './slices/themeSlice'
import { createFilterSlice } from './slices/filterSlice'
import { createSidebarSlice } from './slices/sidebarSlice'

const useAppStore = create((set, get) => ({
  ...createRoleSlice(set, get),
  ...createThemeSlice(set, get),
  ...createFilterSlice(set, get),
  ...createSidebarSlice(set, get),
}))

export default useAppStore
