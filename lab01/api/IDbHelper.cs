using DataModel;

public interface IDbHelper
{
	Task<int> GetTicketCount();
	Task<byte[]> AddTicket(TicketInput input);
	Task<Ticket?> GetTicket(Guid ticketId);
}
