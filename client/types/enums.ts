export enum TicketStatus {
  WAITING = "Waiting",
  USED = "Used", 
  CANCELED = "Canceled"
}

export const getStatusTranslation = (status: string): string => {
  switch (status) {
    case TicketStatus.WAITING:
      return "En attente";
    case TicketStatus.USED:
      return "Utilisé";
    case TicketStatus.CANCELED:
      return "Annulé";
    default:
      return "Inconnu";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case TicketStatus.WAITING:
      return "#FFA500"; // Orange
    case TicketStatus.USED:
      return "#4CAF50"; // Vert
    case TicketStatus.CANCELED:
      return "#F44336"; // Rouge
    default:
      return "#9E9E9E"; // Gris
  }
}; 