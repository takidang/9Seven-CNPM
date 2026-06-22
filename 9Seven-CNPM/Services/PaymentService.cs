using _9Seven_CNPM.Models;

namespace _9Seven_CNPM.Services
{
    public interface IPaymentService
    {
        Task<Payment> ProcessCashPaymentAsync(int invoiceId, decimal amount, string receivedBy);
        Task<Payment> ProcessBankTransferAsync(int invoiceId, decimal amount, string bankAccountNumber,
            string bankAccountName, string bankName);
        Task<Payment?> GetPaymentAsync(int paymentId);
        Task<Payment?> GetPaymentByInvoiceAsync(int invoiceId);
        Task<bool> ConfirmPaymentAsync(int paymentId, string transactionReference);
        Task<bool> CancelPaymentAsync(int paymentId);
    }

    public class PaymentService : IPaymentService
    {
        private readonly IQrCodeService _qrCodeService;
        private static List<Payment> _payments = new(); // Simulate database

        public PaymentService(IQrCodeService qrCodeService)
        {
            _qrCodeService = qrCodeService;
        }

        public async Task<Payment> ProcessCashPaymentAsync(int invoiceId, decimal amount, string receivedBy)
        {
            var payment = new Payment
            {
                InvoiceId = invoiceId,
                Amount = amount,
                PaymentMethod = PaymentMethodType.Cash,
                PaymentDate = DateTime.Now,
                Status = PaymentStatus.Completed,
                ReceivedBy = receivedBy,
                Notes = $"Cash payment received by {receivedBy}"
            };

            _payments.Add(payment);
            return await Task.FromResult(payment);
        }

        public async Task<Payment> ProcessBankTransferAsync(int invoiceId, decimal amount,
            string bankAccountNumber, string bankAccountName, string bankName)
        {
            var invoiceNumber = $"INV-{invoiceId:D6}";
            var qrCodeUrl = _qrCodeService.GenerateQrCode(bankAccountNumber, bankAccountName, amount, invoiceNumber);

            var payment = new Payment
            {
                InvoiceId = invoiceId,
                Amount = amount,
                PaymentMethod = PaymentMethodType.BankTransfer,
                PaymentDate = DateTime.Now,
                Status = PaymentStatus.Pending,
                BankAccountNumber = bankAccountNumber,
                BankAccountName = bankAccountName,
                BankName = bankName,
                QrCodeUrl = qrCodeUrl,
                Notes = $"Bank transfer pending for {bankName} account ending in {bankAccountNumber.Substring(bankAccountNumber.Length - 4)}"
            };

            _payments.Add(payment);
            return await Task.FromResult(payment);
        }

        public async Task<Payment?> GetPaymentAsync(int paymentId)
        {
            return await Task.FromResult(_payments.FirstOrDefault(p => p.Id == paymentId));
        }

        public async Task<Payment?> GetPaymentByInvoiceAsync(int invoiceId)
        {
            return await Task.FromResult(_payments.FirstOrDefault(p => p.InvoiceId == invoiceId));
        }

        public async Task<bool> ConfirmPaymentAsync(int paymentId, string transactionReference)
        {
            var payment = _payments.FirstOrDefault(p => p.Id == paymentId);
            if (payment == null)
                return await Task.FromResult(false);

            payment.Status = PaymentStatus.Completed;
            payment.TransactionReference = transactionReference;
            return await Task.FromResult(true);
        }

        public async Task<bool> CancelPaymentAsync(int paymentId)
        {
            var payment = _payments.FirstOrDefault(p => p.Id == paymentId);
            if (payment == null)
                return await Task.FromResult(false);

            payment.Status = PaymentStatus.Cancelled;
            return await Task.FromResult(true);
        }
    }
}
