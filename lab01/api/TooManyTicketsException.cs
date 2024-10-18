public class TooManyTicketsException(string vatin) : Exception($"Too many tickets purchased for vatin {vatin}");
