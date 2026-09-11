// Role-aware post-auth landing. Group segments disambiguate the two tab
// shells ((driver) vs (garage)) that both live at root-level URLs.
import type { UserRole } from '@/models/enums';

export function homeForRole(role: UserRole | undefined | null): string {
  return role === 'carrossier' ? '/(garage)/dashboard' : '/(driver)/home';
}
