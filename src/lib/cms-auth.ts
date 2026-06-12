export const CMS_SESSION_COOKIE = 'cms_session';
export const CMS_SESSION_VALUE = 'active';

export const cmsDemoUser = {
  fullName: 'CMS Admin',
  email: 'admin@cms.local',
  password: 'password123'
};

export function isCmsAuthenticated(cookieValue?: string) {
  return cookieValue === CMS_SESSION_VALUE;
}
