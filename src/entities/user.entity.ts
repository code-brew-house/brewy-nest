import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { User as UserInterface } from '../interfaces/user.interface';

@Entity('users')
@Unique(['email'])
@Unique(['username'])
export class UserEntity implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  // UserDetails interface properties
  authorities?: any[];
  isAccountNonExpired?: boolean;
  isAccountNonLocked?: boolean;
  isCredentialsNonExpired?: boolean;
  isEnabled?: boolean;
}
