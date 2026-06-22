namespace _9Seven_CNPM.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime DueDate { get; set; }

        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;

        public string DeviceType { get; set; } = string.Empty; // e.g., "iPhone 12", "Samsung S20"
        public string RepairDescription { get; set; } = string.Empty;
        public decimal Amount { get; set; }

        public InvoiceStatus Status { get; set; } = InvoiceStatus.Pending;
        public Payment? Payment { get; set; }
    }

    public enum InvoiceStatus
    {
        Pending,
        Paid,
        Cancelled
    }
}
