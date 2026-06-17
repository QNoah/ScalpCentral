import Navbar from "../Utils/Navbar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqSections = [
  {
    title: "Orders",
    items: [
      {
        question: "How do I place an order?",
        answer:
          "Search for a product, open the product page, add it to your cart and continue to checkout. You can review your items before confirming the order.",
      },
      {
        question: "Can I change my order after checkout?",
        answer:
          "If your order has not been processed yet, contact support with your order number. Once an order is packed or shipped, changes may no longer be possible.",
      },
      {
        question: "Where can I find my order confirmation?",
        answer:
          "After checkout you will see an order confirmation page. If you are logged in, your order can also be linked to your account history.",
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        question: "Are product prices always up to date?",
        answer:
          "Prices are shown from the current product data in ScalpCentral. Prices can change when product information is updated by the shop manager.",
      },
      {
        question: "What does stock mean?",
        answer:
          "Stock shows how many items are available in the webshop. If a product is out of stock, it cannot be ordered until new stock is added.",
      },
      {
        question: "Can I filter cards by set or series?",
        answer:
          "Yes. The search page includes filters for product type, set and series, plus price and stock options.",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        question: "Do I need an account to use ScalpCentral?",
        answer:
          "You can browse products without an account. An account helps with login, order details and future profile functionality.",
      },
      {
        question: "What should I do if I forgot my password?",
        answer:
          "Use the reset password page from the login flow. Follow the steps there to update your password.",
      },
      {
        question: "How is my account information used?",
        answer:
          "Account information is used for authentication, order handling and contact details related to purchases.",
      },
    ],
  },
  {
    title: "Shipping and returns",
    items: [
      {
        question: "When will my order be shipped?",
        answer:
          "Orders are prepared after checkout. Shipping timing depends on the shop process and availability of the selected products.",
      },
      {
        question: "What if something is wrong with my order?",
        answer:
          "Contact support with your order number and a clear description of the issue so the order can be checked.",
      },
      {
        question: "Can I return a product?",
        answer:
          "Return options depend on the product condition and order status. Contact support before sending anything back.",
      },
    ],
  },
];

export function FAQPage() {
  return (
    <main className="min-h-screen bg-offWhite">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <section className="mb-8">
          <Chip
            label="Support"
            sx={{
              mb: 2,
              backgroundColor: "var(--lightPokeYellow)",
              fontWeight: 700,
            }}
          />
          <h1 className="text-lightBlue">Frequently Asked Questions</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
            Find quick answers about orders, products, accounts and shipping.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-bold text-lightBlue">Categories</h2>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              {faqSections.map((section) => (
                <a
                  key={section.title}
                  href={`#${section.title.toLowerCase().replaceAll(" ", "-")}`}
                  className="rounded bg-lightYellow px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-pokeYellow"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </aside>

          <div className="flex flex-col gap-6">
            {faqSections.map((section) => (
              <section
                key={section.title}
                id={section.title.toLowerCase().replaceAll(" ", "-")}
                className="bg-white p-4 shadow-sm"
              >
                <h2 className="mb-4 font-bold text-lightBlue">{section.title}</h2>
                <div className="flex flex-col gap-3">
                  {section.items.map((item) => (
                    <Accordion key={item.question} disableGutters>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <span className="font-semibold">{item.question}</span>
                      </AccordionSummary>
                      <AccordionDetails>
                        <p className="leading-7 text-slate-700">{item.answer}</p>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
