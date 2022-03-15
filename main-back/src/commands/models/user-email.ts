import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { v4 } from "uuid";

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

  static async createByUser(email: string, user: User) {
    const userEmail = new UserEmail();
    userEmail.id = v4();
    userEmail.main = true;
    userEmail.activated = false;
    userEmail.user = user;
    userEmail.value = email;

    const tempToken = TempToken.createByUser(userEmail);

    (await userEmail.tempTokens).push(tempToken);

    return userEmail;
  }

  static async checkEmailExist(email: string): Promise<boolean> {
    const userEmail = await UserEmail.find({
      value: email,
    });

    return !!userEmail.length;
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
