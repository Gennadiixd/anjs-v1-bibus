import {
  ChangeUserByEmailBodySchema,
  ChangeUserByEmailResponsesSchema,
} from "controllers/user-management/change-email-by-user/req-res";
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { User } from "models/user";
import { UserEmail } from "models/user-email";
import { SuccessResponse, SuccessResponseWR } from "utils/responses";

export const initChangeEmailByUser = (
  app: FastifyInstance,
  path: string = "/email"
) => {
  app.post<{
    Body: FromSchema<typeof ChangeUserByEmailBodySchema>;
    Reply: FromSchema<typeof ChangeUserByEmailResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: ChangeUserByEmailBodySchema,
        response: ChangeUserByEmailResponsesSchema,
      },
    },
    async (request): Promise<SuccessResponseWR> => {
      if (!request.userId) {
        throw new Error(`UserId must exist`);
      }

      const newEmail = request.body["new-email"];

      if (
        await UserEmail.findOne({
          where: {
            value: newEmail,
          },
        })
      ) {
        throw new Error(`Email already exist`);
      }

      const user = await User.findOne(request.userId);

      if (!user) {
        throw new Error(`User must exist`);
      }

      await user.changeEmail(newEmail);
      await user.save();

      return SuccessResponse.create(request.id);
    }
  );
};
