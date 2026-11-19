import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import EventDetails from "./components/EventDetails";
import TicketBuilder from "./components/TicketBuilder";
import PaymentView from "./components/PaymentView";
import SuccessView from "./components/SuccessView";
import type { DocumentType, GuestTicket, TicketType, UtecTicket } from "./types";

const makeId = () => `UTEC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export default function App() {
  const [utecTickets, setUtecTickets] = useState<UtecTicket[]>([]);
  const [guestTickets, setGuestTickets] = useState<GuestTicket[]>([]);
  const [bingoQty, setBingoQty] = useState(0);
  const [bingoShared, setBingoShared] = useState(true);
  const [bingoNames, setBingoNames] = useState<string[]>([]);
  const [view, setView] = useState<"builder" | "payment" | "success">("builder");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    setBingoNames((previous) => {
      const next = Array.from({ length: bingoQty }, (_, index) => previous[index] ?? "");
      return next;
    });
  }, [bingoQty]);

  const total =
    utecTickets.length * 3 +
    guestTickets.length * 5 +
    bingoQty * 2;

  const addTicket = (type: TicketType) => {
    if (type === "utec") {
      setUtecTickets((items) => [...items, { id: crypto.randomUUID(), name: "" }]);
    } else {
      setGuestTickets((items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          name: "",
          documentType: "DNI",
          documentNumber: "",
          licensePlate: "",
        },
      ]);
    }
  };

  const removeTicket = (type: TicketType, id: string) => {
    if (type === "utec") setUtecTickets((items) => items.filter((item) => item.id !== id));
    else setGuestTickets((items) => items.filter((item) => item.id !== id));
  };

  const updateTicket = (
    type: TicketType,
    id: string,
    field: "name" | "documentType" | "documentNumber" | "licensePlate",
    value: string,
  ) => {
    if (type === "utec") {
      setUtecTickets((items: UtecTicket[]) =>
        items.map((item) => (
          item.id === id && field === "name" ? { ...item, name: value } : item
        )),
      );
      return;
    }
    setGuestTickets((items: GuestTicket[]) =>
      items.map((item) => {
        if (item.id !== id) return item;
        if (field === "name") return { ...item, name: value };
        if (field === "documentNumber") return { ...item, documentNumber: value };
        if (field === "licensePlate") return { ...item, licensePlate: value };
        return { ...item, documentType: value as DocumentType };
      }),
    );
  };

  const validateBuilder = () => {
    if (total === 0) return "Agrega al menos un producto para continuar.";
    if (utecTickets.some((ticket) => !ticket.name.trim())) {
      return "Completa el nombre de todas las entradas UTEC.";
    }
    if (guestTickets.some((ticket) =>
      !ticket.name.trim() || !ticket.documentNumber.trim())) {
      return "Completa nombre y documento de todas las entradas externas.";
    }
    if (bingoQty > 0) {
      const requiredNames = bingoShared
        ? bingoNames.slice(0, 1)
        : bingoNames.slice(0, bingoQty);
      if (requiredNames.some((name) => !name.trim())) {
        return "Completa el nombre del responsable asignado a cada cartilla.";
      }
    }
    return "";
  };

  const handleContinue = () => {
    const error = validateBuilder();
    if (error) {
      window.alert(error);
      return;
    }
    setView("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = (submittedOrderId: string) => {
    setOrderId(submittedOrderId || makeId());
    setView("success");
  };

  const handleBackToBuilder = () => {
    setView("builder");
    window.requestAnimationFrame(() => {
      document.querySelector("#comprar")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div className="min-h-screen">
      {view === "builder" && <Header />}
      {view === "builder" && (
        <main>
          <Hero />
          <EventDetails />
          <TicketBuilder
            utecTickets={utecTickets}
            guestTickets={guestTickets}
            bingoQty={bingoQty}
            bingoShared={bingoShared}
            bingoNames={bingoNames}
            total={total}
            onAddTicket={addTicket}
            onRemoveTicket={removeTicket}
            onUpdateTicket={updateTicket}
            onSetBingoQty={setBingoQty}
            onSetBingoShared={setBingoShared}
            onSetBingoNames={setBingoNames}
            onContinue={handleContinue}
          />
        </main>
      )}
      {view === "payment" && (
        <PaymentView
          utecTickets={utecTickets}
          guestTickets={guestTickets}
          bingoQty={bingoQty}
          bingoShared={bingoShared}
          bingoNames={bingoNames}
          total={total}
          onBack={handleBackToBuilder}
          onSuccess={handleSuccess}
        />
      )}
      {view === "success" && <SuccessView orderId={orderId} />}
    </div>
  );
}
