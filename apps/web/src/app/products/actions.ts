"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth";
import { createProductViaApi } from "@/lib/api";

export interface ProductFormState {
  ok: boolean;
  message: string;
}

export async function createProductAction(
  _prev: ProductFormState | null,
  formData: FormData
): Promise<ProductFormState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;

  const token = (await cookies()).get(AUTH_COOKIE)?.value ?? null;

  try {
    await createProductViaApi({ name, description, price, category }, token);
    revalidatePath("/products");
    revalidateTag("products");
    return { ok: true, message: "Product created! List updated via revalidatePath." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create product";
    return { ok: false, message };
  }
}
