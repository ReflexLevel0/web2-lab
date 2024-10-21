using DataModel;
using LinqToDB;
using QRCoder;

class DbHelper : IDbHelper
{
    TicketsDb _db;
    string _webServerUrl;

    public DbHelper(TicketsDb db, string webServerUrl)
    {
        _db = db;
        _webServerUrl = webServerUrl;
    }

    public Task<int> GetTicketCount()
    {
        return _db.Tickets.CountAsync();
    }

    public async Task<byte[]> AddTicket(TicketInput input)
    {
        int userTicketCount = await (from t in _db.Tickets
                                     where string.CompareOrdinal(t.Vatin, input.Vatin) == 0
                                     select t).CountAsync();

        if (input.Vatin == null)
        {
            throw new MissingFieldException("Vatin input field is empty");
        }
        else if (input.FirstName == null)
        {
            throw new MissingFieldException("FirstName input field is empty");
        }
        else if (input.LastName == null)
        {
            throw new MissingFieldException("LastName input field is empty");
        }
        else if (userTicketCount >= 3)
        {
            throw new TooManyTicketsException(input.Vatin);
        }

        var ticket = new Ticket()
        {
            Id = Guid.NewGuid(),
            GeneratedTime = DateTime.Now,
            Vatin = input.Vatin,
            FirstName = input.FirstName,
            LastName = input.LastName,
        };

        int rowsChanged = await _db.InsertAsync(ticket);
        if (rowsChanged == 0)
        {
            throw new Exception("SERVER ERROR: ticket could not be added");
        }

        var qrGenerator = new QRCodeGenerator();
        var qrCodeData = qrGenerator.CreateQrCode($"{_webServerUrl}/ticket/{ticket.Id}", QRCodeGenerator.ECCLevel.Default);
        var qrCode = new PngByteQRCode(qrCodeData);
        var qrCodeImage = qrCode.GetGraphic(20);
        return qrCodeImage;
    }

    public async Task<Ticket?> GetTicket(Guid ticketId)
    {
        return await _db.Tickets.FindAsync(ticketId);
    }
}
