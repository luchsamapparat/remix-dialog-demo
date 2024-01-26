import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import {
  changeShoppingCartItemQuantity,
  removeShoppingCartItem,
} from "../../application/ShoppingCart";

export const Intent = {
  ChangeQuantity: "changeQuantity",
  Remove: "remove",
} as const;

export const schema = z.object({
  intent: z.enum([Intent.ChangeQuantity, Intent.Remove]),
  shoppingCartItemId: z
    .string({ required_error: "Shopping cart item ID is required" })
    .uuid(),
  quantity: z.number().gt(0),
});

export type ShoppingCartItemActionPayload = z.infer<typeof schema>;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  if (submission.value.intent === Intent.ChangeQuantity) {
    await changeShoppingCartItemQuantity(
      submission.value.shoppingCartItemId,
      submission.value.quantity
    );
  } else if (submission.value.intent === Intent.Remove) {
    await removeShoppingCartItem(submission.value.shoppingCartItemId);
  }

  return json(submission);
};
