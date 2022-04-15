export type CommandOrQueryBaseMeta = {
  transactionId: string;
  createdAt: Date;
  userId: string | null;
  parentTransactionId?: string;
};

export type CommandOrQuery<
  Type extends string,
  Data extends Record<string, any>,
  R
> = {
  _result?: R;
  type: Type;
  data: Data;
  meta: CommandOrQueryBaseMeta;
};

export type CommandQueryHandler<CQ extends CommandOrQuery<any, any, any>> = (
  cq: CQ
) => CQ extends CommandOrQuery<any, any, infer R> ? Promise<R> : never;

export type Command<
  Type extends string,
  Data extends Record<string, any>
> = CommandOrQuery<Type, Data, void>;
export type Query<
  Type extends string,
  Data extends Record<string, any>,
  R
> = CommandOrQuery<Type, Data, R>;
export type ExceptionCommand<
  Type extends string,
  Data extends Record<string, any>,
  R
> = CommandOrQuery<Type, Data, R>;
