import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

import { UserEmail } from "./user-email";

@Entity()
export class TempToken extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column("boolean")
  used: boolean;

  @ManyToOne((type) => UserEmail, (userEmail) => userEmail.tempTokens)
  userEmail: UserEmail;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP", nullable: true })
  updatedAt: Date;

  static createByUser(userEmail: UserEmail): TempToken {
    const token = new TempToken();
    token.id = v4();
    token.used = false;
    token.userEmail = userEmail;
    token.createdAt = new Date();

    return token;
  }

  use() {
    this.used = true;
  }

  isExpired(): boolean {
    return new Date(Date.now() - 24 * 60 * 60 * 1000) > this.createdAt;
  }
}
