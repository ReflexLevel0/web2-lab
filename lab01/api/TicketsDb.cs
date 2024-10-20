// ---------------------------------------------------------------------------------------------------
// <auto-generated>
// This code was generated by LinqToDB scaffolding tool (https://github.com/linq2db/linq2db).
// Changes to this file may cause incorrect behavior and will be lost if the code is regenerated.
// </auto-generated>
// ---------------------------------------------------------------------------------------------------

using LinqToDB;
using LinqToDB.Data;

#pragma warning disable 1573, 1591
#nullable enable

namespace DataModel
{
	public partial class TicketsDb : DataConnection
	{
		public TicketsDb()
		{
			InitDataContext();
		}

		public TicketsDb(string configuration)
			: base(configuration)
		{
			InitDataContext();
		}

		public TicketsDb(DataOptions<TicketsDb> options)
			: base(options.Options)
		{
			InitDataContext();
		}

		partial void InitDataContext();

		public ITable<Ticket> Tickets => this.GetTable<Ticket>();
	}

	public static partial class ExtensionMethods
	{
		#region Table Extensions
		public static Ticket? Find(this ITable<Ticket> table, Guid id)
		{
			return table.FirstOrDefault(e => e.Id == id);
		}

		public static Task<Ticket?> FindAsync(this ITable<Ticket> table, Guid id, CancellationToken cancellationToken = default)
		{
			return table.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
		}
		#endregion
	}
}