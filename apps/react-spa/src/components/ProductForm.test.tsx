import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "./ProductForm";

describe("ProductForm", () => {
  it("renders fields and calls onCreate on submit", async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<ProductForm onCreate={onCreate} authRequired />);

    await user.type(screen.getByPlaceholderText("Name"), "Test Product");
    await user.type(screen.getByPlaceholderText("Description"), "A description");
    await user.type(screen.getByPlaceholderText("Price"), "9.99");
    await user.type(screen.getByPlaceholderText("Category"), "books");
    await user.click(screen.getByRole("button", { name: /create via rest/i }));

    expect(onCreate).toHaveBeenCalledWith({
      name: "Test Product",
      description: "A description",
      price: 9.99,
      category: "books",
    });
  });
});
