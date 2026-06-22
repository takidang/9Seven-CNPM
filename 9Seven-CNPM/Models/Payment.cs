namespace _9Seven_CNPM.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public Invoice? Invoice { get; set; }

        public decimal Amount { get; set; }
        public PaymentMethodType PaymentMethod { get; set; }
        public DateTime PaymentDate { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        // For bank transfers
        public string? QrCodeUrl { get; set; }
        public string? BankAccountNumber { get; set; }
        public string? BankAccountName { get; set; }
        public string? BankName { get; set; }

        // For cash
        public string? ReceivedBy { get; set; }

        public string? Notes { get; set; }
        public string? TransactionReference { get; set; }
    }

    public enum PaymentStatus
    {
        Pending,
        Completed,
        Failed,
        Cancelled
    }
}
