import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFetcher } from "@remix-run/react";
import { ReactEventHandler, useEffect, useRef } from "react";
import { ShoppingCartItemModel } from "src/application/ShoppingCart";
import { Intent, action, schema } from "../shoppingCart.items.$id/route";
import { type loader } from "./route";

interface ShoppingCartProps {
  open: boolean;
  onClose: () => void;
}

export const ShoppingCart = (props: ShoppingCartProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (props.open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [props.open]);

  const fetcher = useFetcher<typeof loader>();

  useEffect(() => {
    if (props.open && fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/shoppingCart");
    }
  }, [fetcher, props.open]);

  const shoppingCart = fetcher.data;

  const handleClose: ReactEventHandler<HTMLDialogElement> = () => {
    props.onClose();
  };

  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <h2>Shopping Cart</h2>
      <button onClick={props.onClose}>Close</button>
      {shoppingCart === undefined ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {shoppingCart.items.map((item) => (
              <li key={item.id + item.quantity}>
                <ShoppingCartItem item={item} />
              </li>
            ))}
          </ul>
          <p>{shoppingCart.totalPrice}</p>
        </>
      )}
    </dialog>
  );
};

type ShoppingCartItemProps = {
  item: ShoppingCartItemModel;
};

const ShoppingCartItem = ({ item }: ShoppingCartItemProps) => {
  const fetcher = useFetcher<typeof action>();

  const [form, { quantity, shoppingCartItemId }] = useForm({
    lastResult: fetcher.data,
    onValidate: ({ formData }) => parseWithZod(formData, { schema: schema }),
    defaultValue: {
      shoppingCartItemId: item.id,
      quantity: item.quantity,
    },
  });

  return (
    <fetcher.Form
      method="post"
      action={`shoppingCart/items/${item.id}}`}
      {...getFormProps(form)}
    >
      <article>
        <h4>{item.name}</h4>
        <p>{item.price}</p>

        <input {...getInputProps(shoppingCartItemId, { type: "hidden" })} />
        <input {...getInputProps(quantity, { type: "number" })} />
        <span id={quantity.errorId}>{quantity.errors?.at(0)}</span>
        <button type="submit" name="intent" value={Intent.ChangeQuantity}>
          Change Quantity
        </button>
        <button type="submit" name="intent" value={Intent.Remove}>
          Remove
        </button>
      </article>
    </fetcher.Form>
  );
};
