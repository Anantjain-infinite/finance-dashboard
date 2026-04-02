import useAppStore from '../store/useAppStore'

/**
 renders children only when the current role is in allowedRoles.
 
 */
export default function RoleGuard({ allowedRoles = [], children, fallback = null }) {
  const role = useAppStore((s) => s.role)
  if (!allowedRoles.includes(role)) return fallback
  return children
}
