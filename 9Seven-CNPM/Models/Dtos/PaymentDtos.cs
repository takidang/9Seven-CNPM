namespace _9Seven_CNPM.Models.Dtos
{
    public class ProcessCashPaymentRequest
    {
        public int InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public string ReceivedBy { get; set; } = string.Empty;
    }

    public class ProcessBankTransferRequest
    {
        public int InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public string BankAccountNumber { get; set; } = string.Empty;
        public string BankAccountName { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
    }

    public class PaymentResponse
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
        public string? QrCodeUrl { get; set; }
        public string? BankInfo { get; set; }
        public string? Notes { get; set; }
    }

    public class ConfirmPaymentRequest
    {
        public int PaymentId { get; set; }
        public string TransactionReference { get; set; } = string.Empty;
    }
}
