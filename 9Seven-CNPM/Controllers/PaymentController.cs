using _9Seven_CNPM.Models;
using _9Seven_CNPM.Models.Dtos;
using _9Seven_CNPM.Services;
using Microsoft.AspNetCore.Mvc;

namespace _9Seven_CNPM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("cash")]
        public async Task<IActionResult> ProcessCashPayment([FromBody] ProcessCashPaymentRequest request)
        {
            if (request.Amount <= 0)
                return BadRequest("Amount must be greater than 0");

            if (string.IsNullOrWhiteSpace(request.ReceivedBy))
                return BadRequest("ReceivedBy is required");

            var payment = await _paymentService.ProcessCashPaymentAsync(
                request.InvoiceId,
                request.Amount,
                request.ReceivedBy
            );

            var response = MapToResponse(payment);
            return Ok(new { success = true, data = response, message = "Cash payment processed successfully" });
        }

        [HttpPost("bank-transfer")]
        public async Task<IActionResult> ProcessBankTransfer([FromBody] ProcessBankTransferRequest request)
        {
            if (request.Amount <= 0)
                return BadRequest("Amount must be greater than 0");

            if (string.IsNullOrWhiteSpace(request.BankAccountNumber))
                return BadRequest("Bank account number is required");

            if (string.IsNullOrWhiteSpace(request.BankAccountName))
                return BadRequest("Bank account name is required");

            if (string.IsNullOrWhiteSpace(request.BankName))
                return BadRequest("Bank name is required");

            var payment = await _paymentService.ProcessBankTransferAsync(
                request.InvoiceId,
                request.Amount,
                request.BankAccountNumber,
                request.BankAccountName,
                request.BankName
            );

            var response = MapToResponse(payment);
            return Ok(new { success = true, data = response, message = "Bank transfer request created with QR code" });
        }

        [HttpGet("{paymentId}")]
        public async Task<IActionResult> GetPayment(int paymentId)
        {
            var payment = await _paymentService.GetPaymentAsync(paymentId);

            if (payment == null)
                return NotFound("Payment not found");

            var response = MapToResponse(payment);
            return Ok(new { success = true, data = response });
        }

        [HttpGet("invoice/{invoiceId}")]
        public async Task<IActionResult> GetPaymentByInvoice(int invoiceId)
        {
            var payment = await _paymentService.GetPaymentByInvoiceAsync(invoiceId);

            if (payment == null)
                return NotFound("No payment found for this invoice");

            var response = MapToResponse(payment);
            return Ok(new { success = true, data = response });
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.TransactionReference))
                return BadRequest("Transaction reference is required");

            var success = await _paymentService.ConfirmPaymentAsync(request.PaymentId, request.TransactionReference);

            if (!success)
                return NotFound("Payment not found");

            return Ok(new { success = true, message = "Payment confirmed successfully" });
        }

        [HttpPost("cancel/{paymentId}")]
        public async Task<IActionResult> CancelPayment(int paymentId)
        {
            var success = await _paymentService.CancelPaymentAsync(paymentId);

            if (!success)
                return NotFound("Payment not found");

            return Ok(new { success = true, message = "Payment cancelled successfully" });
        }

        private PaymentResponse MapToResponse(Payment payment)
        {
            return new PaymentResponse
            {
                Id = payment.Id,
                InvoiceId = payment.InvoiceId,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod.ToString(),
                Status = payment.Status.ToString(),
                PaymentDate = payment.PaymentDate,
                QrCodeUrl = payment.QrCodeUrl,
                BankInfo = payment.PaymentMethod == PaymentMethodType.BankTransfer
                    ? $"{payment.BankName} - {payment.BankAccountName}"
                    : null,
                Notes = payment.Notes
            };
        }
    }
}
