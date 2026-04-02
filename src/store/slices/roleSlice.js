import { ROLES } from '../../constants/roles'

export const createRoleSlice = (set) => ({
  role: ROLES.ADMIN,
  setRole: (role) => set({ role }),
})
