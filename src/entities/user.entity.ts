import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { User } from '../interfaces/user.interface';

@Entity('users')
@Unique(['username'])
@Unique(['email'])
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  email: string;

  // UserDetails interface properties
  authorities?: any[];
  isAccountNonExpired?: boolean;
  isAccountNonLocked?: boolean;
  isCredentialsNonExpired?: boolean;
  isEnabled?: boolean;
}
