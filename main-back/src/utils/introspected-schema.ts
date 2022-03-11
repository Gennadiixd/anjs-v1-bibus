/* tslint:disable */
/* eslint-disable */

export type JwtTokenTableId = string;
export type JwtTokenTableLogoutDate = Date | null;
export type JwtTokenTableBanDate = Date | null;
export type JwtTokenTableCreatedAt = Date;
export type JwtTokenTableUpdatedAt = Date | null;
export type JwtTokenTableUserId = string | null;

export type JwtTokenTable = {
  id: JwtTokenTableId;
  logoutDate: JwtTokenTableLogoutDate;
  banDate: JwtTokenTableBanDate;
  createdAt: JwtTokenTableCreatedAt;
  updatedAt: JwtTokenTableUpdatedAt;
  userId: JwtTokenTableUserId;
};

export const JwtTokenTableName = "jwt_token";

export const JwtTokenTableColumnNames = {
  id: "id",
  logoutDate: "logoutDate",
  banDate: "banDate",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId",
};

export type TempTokenTableId = string;
export type TempTokenTableUsed = boolean;
export type TempTokenTableCreatedAt = Date;
export type TempTokenTableUpdatedAt = Date | null;
export type TempTokenTableUserEmailId = string | null;

export type TempTokenTable = {
  id: TempTokenTableId;
  used: TempTokenTableUsed;
  createdAt: TempTokenTableCreatedAt;
  updatedAt: TempTokenTableUpdatedAt;
  userEmailId: TempTokenTableUserEmailId;
};

export const TempTokenTableName = "temp_token";

export const TempTokenTableColumnNames = {
  id: "id",
  used: "used",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userEmailId: "userEmailId",
};

export type TypeormMetadataTableType = string;
export type TypeormMetadataTableDatabase = string | null;
export type TypeormMetadataTableSchema = string | null;
export type TypeormMetadataTableTable = string | null;
export type TypeormMetadataTableName = string | null;
export type TypeormMetadataTableValue = string | null;

export type TypeormMetadataTable = {
  type: TypeormMetadataTableType;
  database: TypeormMetadataTableDatabase;
  schema: TypeormMetadataTableSchema;
  table: TypeormMetadataTableTable;
  name: TypeormMetadataTableName;
  value: TypeormMetadataTableValue;
};

export const TypeormMetadataTableName = "typeorm_metadata";

export const TypeormMetadataTableColumnNames = {
  type: "type",
  database: "database",
  schema: "schema",
  table: "table",
  name: "name",
  value: "value",
};

export type UserTableId = string;
export type UserTableRole = "admin" | "user";
export type UserTableCreatedAt = Date;
export type UserTableUpdatedAt = Date | null;

export type UserTable = {
  id: UserTableId;
  role: UserTableRole;
  createdAt: UserTableCreatedAt;
  updatedAt: UserTableUpdatedAt;
};

export const UserTableName = "user";

export const UserTableColumnNames = {
  id: "id",
  role: "role",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

export type UserEmailTableId = string;
export type UserEmailTableMain = boolean;
export type UserEmailTableActivated = boolean;
export type UserEmailTableValue = string;
export type UserEmailTableCreatedAt = Date;
export type UserEmailTableUpdatedAt = Date | null;
export type UserEmailTableUserId = string | null;

export type UserEmailTable = {
  id: UserEmailTableId;
  main: UserEmailTableMain;
  activated: UserEmailTableActivated;
  value: UserEmailTableValue;
  createdAt: UserEmailTableCreatedAt;
  updatedAt: UserEmailTableUpdatedAt;
  userId: UserEmailTableUserId;
};

export const UserEmailTableName = "user_email";

export const UserEmailTableColumnNames = {
  id: "id",
  main: "main",
  activated: "activated",
  value: "value",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId",
};
