namespace _9Seven_CNPM.Services
{
    public interface IQrCodeService
    {
        string GenerateQrCode(string bankAccountNumber, string bankAccountName, decimal amount, string invoiceNumber);
    }

    public class QrCodeService : IQrCodeService
    {
        public string GenerateQrCode(string bankAccountNumber, string bankAccountName, decimal amount, string invoiceNumber)
        {
            // Format: VND|bankAccountNumber|bankAccountName|amount|invoiceNumber
            string qrData = $"VND|{bankAccountNumber}|{bankAccountName}|{amount:F0}|{invoiceNumber}";

            // Use a third-party QR code API (can be replaced with a local library)
            // For this example, we'll use QR Server API
            string qrCodeUrl = $"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={Uri.EscapeDataString(qrData)}";

            return qrCodeUrl;
        }
    }
}
