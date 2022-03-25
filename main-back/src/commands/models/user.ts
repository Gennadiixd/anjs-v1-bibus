import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { v4, validate } from "uuid";

import { JwtToken } from "./jwt-token";
import { TempToken } from "./temp-token";
import { UserEmail } from "./user-email";

export type UserId = string & { readonly UserId: unique symbol };
export const UserId = {
  ofString: (value: string) => {
    if (!validate(value)) {
      throw new Error(`${value} is not valid uuid`);
    }

    return value as UserId;
  },
  new: () => {
    return v4() as UserId;
  },
};

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export const _UserRole = {
  ofString: (userRole: string): UserRole => {
    if (!Object.values(UserRole)?.includes(userRole as UserRole)) {
      throw new Error("Not valid UserRole");
    }

    return userRole as UserRole;
  },
};

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: UserId;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany((type) => UserEmail, (email) => email.user, {
    eager: true,
    cascade: ["insert", "update"],
  })
  emails: UserEmail[];

  @OneToMany((type) => JwtToken, (token) => token.user, {
    eager: true,
    cascade: ["insert", "update"],
  })
  jwtTokens: JwtToken[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP", nullable: true })
  updatedAt: Date;

  lastJwtToken() {
    return this.jwtTokens.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )[0];
  }

  mainEmail(): UserEmail {
    const email = this.emails.filter((email) => email.main)[0];

    if (!email) {
      throw new Error(`There is no main email`);
    }

    return email;
  }

  async jwtTokenById(id: string) {
    return this.jwtTokens.filter((token) => token.id === id)[0];
  }

  lastTempToken() {
    const mainEmail = this.mainEmail();

    if (!mainEmail) {
      throw new Error("No main email");
    }

    return mainEmail.lastTempToken();
  }

  async createNewToken() {
    await this.mainEmail().createNewToken();
  }

  async logout() {
    const jwtToken = this.lastJwtToken();
    jwtToken.logout();
    await jwtToken.save();
  }

  async loginByTempToken(token: TempToken) {
    if (token.used) {
      throw new Error(`Already used`);
    }

    if (token.isExpired()) {
      throw new Error("Token is expired");
    }

    // . Activate email if it hasn't been
    {
      this.mainEmail().activate();
    }

    // . Create new JWT token
    this.jwtTokens.push(JwtToken.createNew(this));

    // . Make temp token used
    token.use();
    await token.save();
  }

  async updateData(newUserData: User, whoEditing: User) {
    // . Update role
    if (newUserData.role !== this.role) {
      if (whoEditing.role !== UserRole.ADMIN) {
        throw new Error(`Permission denied`);
      }

      if (
        newUserData.role !== UserRole.ADMIN &&
        newUserData.role !== UserRole.USER
      ) {
        throw new Error(`Inappropriate role`);
      }

      this.role = newUserData.role;
    }
  }
}
