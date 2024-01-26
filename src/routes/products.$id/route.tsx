import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { getProduct } from "src/application/Product";
import { addToShoppingCart } from "src/application/ShoppingCart";
import { z } from "zod";

const schema = z.object({
  productId: z.string({ required_error: "Product ID is required" }).uuid(),
  quantity: z.number().gt(0),
});

export const loader = ({ params }: LoaderFunctionArgs) => {
  const productId = params.id;

  if (productId === undefined) {
    throw Error("id param is missing");
  }

  return getProduct(productId);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  await addToShoppingCart(
    submission.value.productId,
    submission.value.quantity
  );

  return json(submission.reply({ resetForm: true }));
};

export default function Product() {
  const product = useLoaderData<typeof loader>();

  const lastResult = useActionData<typeof action>();

  const [form, { productId, quantity }] = useForm({
    lastResult: lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    defaultValue: {
      productId: product.id,
      quantity: 1,
    },
  });

  return (
    <>
      <h1>{product.name}</h1>

      <p>{product.price}</p>

      <Form method="post" {...getFormProps(form)}>
        <input {...getInputProps(productId, { type: "hidden" })} />
        <input {...getInputProps(quantity, { type: "number" })} />
        <button type="submit">Add to Shopping Cart</button>
      </Form>

      <p>
        <Link to="/">Return to Overview</Link>
      </p>
    </>
  );
}
