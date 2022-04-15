import { render, screen } from "@testing-library/react";
import { Feed } from "./Feed";

describe("Feed component", () => {
  it("has correct Next.js theming section link", () => {
    render(<Feed />);
    expect(screen.getByText("this guide")).toHaveAttribute(
      "href",
      "https://mantine.dev/theming/next/"
    );
  });
});
