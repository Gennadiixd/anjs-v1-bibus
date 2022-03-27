import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";

import { TempToken } from "./temp-token";
import { User } from "./user";

@Entity()
export class UserEmail extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column("boolean")
  main: boolean;

  @Column("boolean")
  activated: boolean;

  @Column("text")
  value: string;

  @ManyToOne((type) => User, (user) => user.emails)
  user: User;

  @OneToMany((type) => TempToken, (token) => token.userEmail, {
    cascade: ["insert", "update"],
  })
  tempTokens: Promise<TempToken[]>;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP", nullable: true })
  updatedAt: Date;

  async lastTempToken(): Promise<TempToken | undefined> {
    return (await this.tempTokens).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )[0];
  }

  async createNewToken() {
    const token = TempToken.createByUser(this);
    await token.save();
    (await this.tempTokens).push(token);
  }

  activate() {
    this.activated = true;
  }

  setNotMain() {
    this.main = false;
  }
}
