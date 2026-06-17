import Navbar from "../Utils/Navbar";
import { Button, Chip, Container } from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HelpCenterOutlinedIcon from "@mui/icons-material/HelpCenterOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

const contactOptions = [
  {
    title: "Discord",
    value: "ScalpCentral Community",
    description:
      "Best for quick questions about products, orders, account help and general support.",
    action: "Join Discord",
    href: "https://discord.gg/scalpcentral",
    icon: (
      <svg aria-hidden="true" className="h-7 w-7 fill-current" viewBox="0 0 20 19">
        <use href="/icons.svg#discord-icon" />
      </svg>
    ),
  },
  {
    title: "Email",
    value: "support@scalpcentral.nl",
    description:
      "Best for order issues, account questions, refunds and anything that needs a clear written answer.",
    action: "Send email",
    href: "mailto:support@scalpcentral.nl",
    icon: <AlternateEmailIcon fontSize="large" />,
  },
];

const supportNotes = [
  {
    title: "Response time",
    description: "We try to respond within 1-2 business days.",
    icon: <AccessTimeIcon />,
  },
  {
    title: "Order questions",
    description: "Include your order number so we can help faster.",
    icon: <HelpCenterOutlinedIcon />,
  },
  {
    title: "Privacy",
    description: "Never share passwords or payment details in Discord.",
    icon: <ShieldOutlinedIcon />,
  },
];

export function ContactPage() {
  return (
    <main className="min-h-screen bg-offWhite">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <section className="mb-8">
          <Chip
            label="Contact"
            sx={{
              mb: 2,
              backgroundColor: "var(--lightPokeYellow)",
              fontWeight: 700,
            }}
          />
          <h1 className="text-lightBlue">Contact ScalpCentral</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
            Need help with an order, product, account or marketplace question?
            Use Discord for quick support or send an email for detailed help.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {contactOptions.map((option) => (
            <article
              key={option.title}
              className="flex h-full flex-col justify-between bg-white p-5 shadow-sm"
            >
              <div>
                <div className="mb-4 flex items-center gap-3 text-lightBlue">
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-lightYellow">
                    {option.icon}
                  </div>
                  <div>
                    <h2 className="font-bold text-lightBlue">{option.title}</h2>
                    <p className="text-sm font-semibold text-slate-900">
                      {option.value}
                    </p>
                  </div>
                </div>
                <p className="leading-7 text-slate-700">{option.description}</p>
              </div>

              <Button
                href={option.href}
                target={option.title === "Discord" ? "_blank" : undefined}
                rel={option.title === "Discord" ? "noreferrer" : undefined}
                endIcon={option.title === "Discord" ? <OpenInNewIcon /> : undefined}
                sx={{
                  alignSelf: "flex-start",
                  mt: 4,
                  backgroundColor: "var(--pokeYellow)",
                  color: "black",
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "var(--darkPokeYellow)",
                  },
                }}
                variant="contained"
              >
                {option.action}
              </Button>
            </article>
          ))}
        </section>

        <section className="mt-6 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-bold text-lightBlue">Before you contact us</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {supportNotes.map((note) => (
              <article key={note.title} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-lightYellow text-lightBlue">
                  {note.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{note.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {note.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
