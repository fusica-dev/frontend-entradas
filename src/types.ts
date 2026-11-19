export type TicketType = "utec" | "guest";

export interface UtecTicket {
  id: string;
  name: string;
}

export type DocumentType = "DNI" | "Pasaporte" | "CE";

export interface GuestTicket {
  id: string;
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  licensePlate: string;
}

export type BingoNameUpdater = (previous: string[]) => string[];
