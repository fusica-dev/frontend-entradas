import { Minus, Plus, Trash2, Ticket, Users, Grid3X3, ShoppingBag } from "lucide-react";
import type { ChangeEvent, Dispatch, SetStateAction, InputHTMLAttributes } from "react";
import type { BingoAssignment, GuestTicket, TicketType, UtecTicket } from "../types";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Field({ label, ...props }: Readonly<FieldProps>) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-sky-700">{label}</span>
      <input {...props} className="form-input" />
    </label>
  );
}

interface TicketCardProps {
  ticket: UtecTicket | GuestTicket;
  index: number;
  type: TicketType;
  onUpdate: (
    type: TicketType,
    id: string,
    field: "name" | "documentType" | "documentNumber" | "licensePlate",
    value: string,
  ) => void;
  onRemove: (type: TicketType, id: string) => void;
}

function TicketCard({ ticket, index, type, onUpdate, onRemove }: Readonly<TicketCardProps>) {
  const guestTicket = type === "guest" ? ticket as GuestTicket : null;
  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-black text-sky-950">Entrada {index + 1}</p>
        <button type="button" onClick={() => onRemove(type, ticket.id)} className="icon-button" aria-label="Eliminar entrada">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <Field
          label="Nombre completo"
          value={ticket.name}
          onChange={(event) => onUpdate(type, ticket.id, "name", event.target.value)}
          placeholder="Ej. Ana Torres"
          required
        />
        {type === "guest" && (
          <>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-sky-700">Tipo de documento</span>
              <select
                className="form-input"
                value={guestTicket?.documentType}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  onUpdate(type, ticket.id, "documentType", event.target.value)}
              >
                <option>DNI</option>
                <option>Pasaporte</option>
                <option>CE</option>
              </select>
            </label>
            <Field
              label="Número de documento"
              value={guestTicket?.documentNumber ?? ""}
              onChange={(event) => onUpdate(type, ticket.id, "documentNumber", event.target.value)}
              placeholder="Número"
              required
            />
            <Field
              label="Placa de vehículo"
              value={guestTicket?.licensePlate ?? ""}
              onChange={(event) => onUpdate(type, ticket.id, "licensePlate", event.target.value)}
              placeholder="Opcional, ej. ABC-123"
            />
          </>
        )}
      </div>
    </div>
  );
}

interface TicketBuilderProps {
  utecTickets: UtecTicket[];
  guestTickets: GuestTicket[];
  bingoQty: number;
  bingoAssignments: BingoAssignment[];
  total: number;
  onAddTicket: (type: TicketType) => void;
  onRemoveTicket: (type: TicketType, id: string) => void;
  onUpdateTicket: TicketCardProps["onUpdate"];
  onSetBingoAssignments: Dispatch<SetStateAction<BingoAssignment[]>>;
  onContinue: () => void;
}

export default function TicketBuilder({
  utecTickets,
  guestTickets,
  bingoQty,
  bingoAssignments,
  total,
  onAddTicket,
  onRemoveTicket,
  onUpdateTicket,
  onSetBingoAssignments,
  onContinue,
}: Readonly<TicketBuilderProps>) {
  const addBingoAssignment = () => {
    onSetBingoAssignments((previous) => [
      ...previous,
      { id: crypto.randomUUID(), name: "", quantity: 1 },
    ]);
  };

  const updateBingoAssignment = (
    id: string,
    field: "name" | "quantity",
    value: string | number,
  ) => {
    onSetBingoAssignments((previous) =>
      previous.map((assignment) =>
        assignment.id === id ? { ...assignment, [field]: value } : assignment,
      ),
    );
  };

  const removeBingoAssignment = (id: string) => {
    onSetBingoAssignments((previous) =>
      previous.filter((assignment) => assignment.id !== id),
    );
  };

  return (
    <section id="comprar" className="mx-auto max-w-7xl px-5 pb-28 pt-24 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Entradas disponibles</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-sky-950 sm:text-5xl">Arma tu pedido</h2>
        <p className="mx-auto mt-4 max-w-xl text-sky-700">Selecciona tus entradas y completa los datos de cada asistente.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <article className="product-card">
            <div className="product-heading">
              <span className="product-icon bg-sky-100 text-sky-700"><Users size={24} /></span>
              <div className="flex-1">
                <h3>Comunidad UTEC</h3>
                <p>Estudiantes, profesores y trabajadores</p>
              </div>
              <strong className="price">S/ 3.00</strong>
            </div>
            <button type="button" className="add-button" onClick={() => onAddTicket("utec")}>
              <Plus size={18} /> Agregar entrada
            </button>
            {utecTickets.length > 0 && (
              <div className="mt-5 space-y-3">
                {utecTickets.map((ticket, index) => (
                  <TicketCard key={ticket.id} ticket={ticket} index={index} type="utec"
                    onUpdate={onUpdateTicket} onRemove={onRemoveTicket} />
                ))}
              </div>
            )}
          </article>

          <article className="product-card">
            <div className="product-heading">
              <span className="product-icon bg-orange-100 text-orange-600"><Ticket size={24} /></span>
              <div className="flex-1">
                <h3>Externos / Invitados</h3>
                <p>Entrada general para invitados</p>
              </div>
              <strong className="price">S/ 5.00</strong>
            </div>
            <button type="button" className="add-button" onClick={() => onAddTicket("guest")}>
              <Plus size={18} /> Agregar entrada
            </button>
            {guestTickets.length > 0 && (
              <div className="mt-5 space-y-3">
                {guestTickets.map((ticket, index) => (
                  <TicketCard key={ticket.id} ticket={ticket} index={index} type="guest"
                    onUpdate={onUpdateTicket} onRemove={onRemoveTicket} />
                ))}
              </div>
            )}
          </article>

          <article className="product-card">
            <div className="product-heading">
              <span className="product-icon bg-yellow-100 text-yellow-700"><Grid3X3 size={24} /></span>
              <div className="flex-1">
                <h3>Cartillas de Bingo</h3>
                <p>Elige cuántas cartillas necesitas</p>
              </div>
              <strong className="price">S/ 2.00</strong>
            </div>
            <button type="button" className="add-button" onClick={addBingoAssignment}>
              <Plus size={18} /> Agregar responsable
            </button>

            {bingoAssignments.length > 0 && (
              <div className="mt-5 space-y-3">
                {bingoAssignments.map((assignment, index) => (
                  <div key={assignment.id} className="grid items-end gap-3 rounded-2xl border border-sky-100 bg-sky-50/40 p-4 sm:grid-cols-[1fr_150px_auto]">
                    <Field
                      label={`Responsable ${index + 1}`}
                      value={assignment.name}
                      onChange={(event) => updateBingoAssignment(assignment.id, "name", event.target.value)}
                      placeholder="Nombre completo"
                      required
                    />
                    <label className="block">
                      <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-sky-700">Cartillas</span>
                      <div className="flex h-[46px] items-center justify-between rounded-xl border border-sky-200 bg-white px-2">
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => updateBingoAssignment(
                            assignment.id,
                            "quantity",
                            Math.max(1, assignment.quantity - 1),
                          )}
                          aria-label={`Quitar cartilla a ${assignment.name || `responsable ${index + 1}`}`}
                        >
                          <Minus size={16} />
                        </button>
                        <strong className="text-lg text-sky-950">{assignment.quantity}</strong>
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => updateBingoAssignment(
                            assignment.id,
                            "quantity",
                            assignment.quantity + 1,
                          )}
                          aria-label={`Agregar cartilla a ${assignment.name || `responsable ${index + 1}`}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeBingoAssignment(assignment.id)}
                      className="icon-button mb-[6px]"
                      aria-label={`Eliminar responsable ${assignment.name || index + 1}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl bg-sky-950 px-4 py-3 text-white">
                  <span className="font-bold">Total de cartillas</span>
                  <strong className="text-lg">{bingoQty}</strong>
                </div>
              </div>
            )}
          </article>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-6 rounded-3xl bg-sky-950 p-6 text-white shadow-2xl shadow-sky-950/20">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-800"><ShoppingBag size={19} /></span>
              <h3 className="font-black">Resumen del pedido</h3>
            </div>
            <div className="space-y-3 py-5 text-sm">
              <SummaryRow label="Entradas UTEC" qty={utecTickets.length} value={utecTickets.length * 3} />
              <SummaryRow label="Entradas externas" qty={guestTickets.length} value={guestTickets.length * 5} />
              <SummaryRow label="Cartillas" qty={bingoQty} value={bingoQty * 2} />
            </div>
            <div className="flex items-end justify-between border-t border-white/10 pt-5">
              <span className="text-sm font-bold text-sky-200">Total a pagar</span>
              <strong className="text-3xl text-orange-300">S/ {total.toFixed(2)}</strong>
            </div>
            <button type="button" onClick={onContinue} className="mt-6 w-full rounded-xl bg-orange-400 px-5 py-4 font-black text-sky-950 transition hover:bg-orange-300">
              Continuar al pago
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

interface SummaryRowProps {
  readonly label: string;
  readonly qty: number;
  readonly value: number;
}

function SummaryRow({ label, qty, value }: Readonly<SummaryRowProps>) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sky-200">{label} <b className="ml-1 text-white">× {qty}</b></span>
      <span className="font-bold">S/ {value.toFixed(2)}</span>
    </div>
  );
}
