export interface User {
  id?: number;
  username: string;
  password: string;
  email: string;

  // UserDetails interface methods (optional in TypeScript)
  authorities?: any[];
  isAccountNonExpired?: boolean;
  isAccountNonLocked?: boolean;
  isCredentialsNonExpired?: boolean;
  isEnabled?: boolean;
}
