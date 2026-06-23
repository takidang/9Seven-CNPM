using _9Seven_CNPM.Models;
using _9Seven_CNPM.Models.Dtos;

namespace _9Seven_CNPM.Services
{
    public interface IReportService
    {
        Task<RevenueReportResponse> GetRevenueReportAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<PaymentAnalyticsResponse> GetPaymentAnalyticsAsync();
        Task<InvoiceInsightsResponse> GetInvoiceInsightsAsync();
        Task<TrendsResponse> GetTrendsAsync(int months = 12);
        Task<SummaryStatisticsResponse> GetSummaryStatisticsAsync();
    }

    public class ReportService : IReportService
    {
        // Temporary: Using static lists from PaymentService for demo
        // In production, inject IDbContext and use EF Core
        private static List<Invoice> _invoices = new();
        private static List<Payment> _payments = new();

        public ReportService()
        {
            InitializeSampleData();
        }

        public async Task<RevenueReportResponse> GetRevenueReportAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            startDate ??= DateTime.MinValue;
            endDate ??= DateTime.MaxValue;

            var invoices = _invoices.Where(i => i.CreatedDate >= startDate && i.CreatedDate <= endDate).ToList();

            var report = new RevenueReportResponse
            {
                ReportGeneratedAt = DateTime.Now,
                TotalInvoices = invoices.Count,
                TotalRevenue = invoices.Sum(i => i.Amount),
                PaidInvoices = invoices.Count(i => i.Status == InvoiceStatus.Paid),
                PaidRevenue = invoices.Where(i => i.Status == InvoiceStatus.Paid).Sum(i => i.Amount),
                PendingInvoices = invoices.Count(i => i.Status == InvoiceStatus.Pending),
                PendingRevenue = invoices.Where(i => i.Status == InvoiceStatus.Pending).Sum(i => i.Amount),
                CancelledInvoices = invoices.Count(i => i.Status == InvoiceStatus.Cancelled),
                ByStatus = new RevenueByStatusResponse
                {
                    Paid = invoices.Where(i => i.Status == InvoiceStatus.Paid).Sum(i => i.Amount),
                    Pending = invoices.Where(i => i.Status == InvoiceStatus.Pending).Sum(i => i.Amount),
                    Cancelled = invoices.Where(i => i.Status == InvoiceStatus.Cancelled).Sum(i => i.Amount)
                }
            };

            return await Task.FromResult(report);
        }

        public async Task<PaymentAnalyticsResponse> GetPaymentAnalyticsAsync()
        {
            var payments = _payments.ToList();
            var completedPayments = payments.Where(p => p.Status == PaymentStatus.Completed).ToList();
            var cashPayments = payments.Where(p => p.PaymentMethod == PaymentMethodType.Cash).ToList();
            var bankPayments = payments.Where(p => p.PaymentMethod == PaymentMethodType.BankTransfer).ToList();

            var totalAmount = payments.Sum(p => p.Amount);
            var successRate = payments.Count > 0
                ? (decimal)completedPayments.Count / payments.Count * 100
                : 0;

            var response = new PaymentAnalyticsResponse
            {
                TotalPaymentAmount = totalAmount,
                TotalPayments = payments.Count,
                SuccessRate = successRate,
                ByMethod = new PaymentMethodBreakdownResponse
                {
                    CashAmount = cashPayments.Sum(p => p.Amount),
                    CashCount = cashPayments.Count,
                    BankTransferAmount = bankPayments.Sum(p => p.Amount),
                    BankTransferCount = bankPayments.Count
                },
                ByStatus = new PaymentStatusBreakdownResponse
                {
                    CompletedAmount = payments.Where(p => p.Status == PaymentStatus.Completed).Sum(p => p.Amount),
                    CompletedCount = payments.Count(p => p.Status == PaymentStatus.Completed),
                    PendingAmount = payments.Where(p => p.Status == PaymentStatus.Pending).Sum(p => p.Amount),
                    PendingCount = payments.Count(p => p.Status == PaymentStatus.Pending),
                    FailedAmount = payments.Where(p => p.Status == PaymentStatus.Failed).Sum(p => p.Amount),
                    FailedCount = payments.Count(p => p.Status == PaymentStatus.Failed),
                    CancelledAmount = payments.Where(p => p.Status == PaymentStatus.Cancelled).Sum(p => p.Amount),
                    CancelledCount = payments.Count(p => p.Status == PaymentStatus.Cancelled)
                }
            };

            return await Task.FromResult(response);
        }

        public async Task<InvoiceInsightsResponse> GetInvoiceInsightsAsync()
        {
            var invoices = _invoices.ToList();

            var topCustomers = invoices
                .GroupBy(i => i.CustomerName)
                .Select(g => new CustomerSummary
                {
                    CustomerName = g.Key,
                    InvoiceCount = g.Count(),
                    TotalAmount = g.Sum(i => i.Amount),
                    PaidAmount = g.Where(i => i.Status == InvoiceStatus.Paid).Sum(i => i.Amount)
                })
                .OrderByDescending(c => c.TotalAmount)
                .Take(10)
                .ToList();

            var deviceTypes = invoices
                .GroupBy(i => i.DeviceType)
                .Select(g => new DeviceTypeSummary
                {
                    DeviceType = g.Key,
                    Count = g.Count(),
                    TotalAmount = g.Sum(i => i.Amount),
                    AverageAmount = g.Average(i => i.Amount)
                })
                .OrderByDescending(d => d.Count)
                .ToList();

            var response = new InvoiceInsightsResponse
            {
                TotalInvoices = invoices.Count,
                AverageInvoiceAmount = invoices.Count > 0 ? invoices.Average(i => i.Amount) : 0,
                MinInvoiceAmount = invoices.Count > 0 ? invoices.Min(i => i.Amount) : 0,
                MaxInvoiceAmount = invoices.Count > 0 ? invoices.Max(i => i.Amount) : 0,
                TopCustomers = new TopCustomersResponse { Customers = topCustomers },
                ByDeviceType = new DeviceTypeBreakdownResponse { Devices = deviceTypes }
            };

            return await Task.FromResult(response);
        }

        public async Task<TrendsResponse> GetTrendsAsync(int months = 12)
        {
            var invoices = _invoices.ToList();
            var payments = _payments.ToList();

            var startDate = DateTime.Now.AddMonths(-months);
            var relevantInvoices = invoices.Where(i => i.CreatedDate >= startDate).ToList();
            var relevantPayments = payments.Where(p => p.PaymentDate >= startDate).ToList();

            var monthlyTrends = new List<MonthlySummary>();
            for (int i = 0; i < months; i++)
            {
                var currentMonth = DateTime.Now.AddMonths(-months + i);
                var monthInvoices = relevantInvoices
                    .Where(inv => inv.CreatedDate.Year == currentMonth.Year && inv.CreatedDate.Month == currentMonth.Month)
                    .ToList();

                if (monthInvoices.Count > 0)
                {
                    monthlyTrends.Add(new MonthlySummary
                    {
                        Year = currentMonth.Year,
                        Month = currentMonth.Month,
                        TotalRevenue = monthInvoices.Sum(i => i.Amount),
                        InvoiceCount = monthInvoices.Count,
                        AverageInvoiceAmount = monthInvoices.Average(i => i.Amount)
                    });
                }
            }

            var paymentPatterns = relevantPayments
                .GroupBy(p => p.PaymentMethod.ToString())
                .Select(g => new PaymentPatternSummary
                {
                    PaymentMethod = g.Key,
                    TotalAmount = g.Sum(p => p.Amount),
                    TransactionCount = g.Count(),
                    AverageTransactionAmount = g.Average(p => p.Amount)
                })
                .ToList();

            var response = new TrendsResponse
            {
                MonthlyTrends = monthlyTrends,
                PaymentPatterns = paymentPatterns
            };

            return await Task.FromResult(response);
        }

        public async Task<SummaryStatisticsResponse> GetSummaryStatisticsAsync()
        {
            var invoices = _invoices.ToList();

            var outstandingAmount = invoices.Where(i => i.Status == InvoiceStatus.Pending).Sum(i => i.Amount);
            var paidAmount = invoices.Where(i => i.Status == InvoiceStatus.Paid).Sum(i => i.Amount);

            var amounts = invoices.Select(i => i.Amount).OrderBy(a => a).ToList();
            var medianAmount = amounts.Count > 0
                ? amounts.Count % 2 == 0
                    ? (amounts[amounts.Count / 2 - 1] + amounts[amounts.Count / 2]) / 2
                    : amounts[amounts.Count / 2]
                : 0;

            var mostCommonDevice = invoices
                .GroupBy(i => i.DeviceType)
                .OrderByDescending(g => g.Count())
                .FirstOrDefault()?.Key ?? "N/A";

            var topPaymentMethod = _payments
                .GroupBy(p => p.PaymentMethod.ToString())
                .OrderByDescending(g => g.Count())
                .FirstOrDefault()?.Key ?? "N/A";

            var response = new SummaryStatisticsResponse
            {
                TotalOutstandingAmount = outstandingAmount,
                OutstandingInvoiceCount = invoices.Count(i => i.Status == InvoiceStatus.Pending),
                TotalPaidAmount = paidAmount,
                PaidInvoiceCount = invoices.Count(i => i.Status == InvoiceStatus.Paid),
                AverageRepairCost = invoices.Count > 0 ? invoices.Average(i => i.Amount) : 0,
                MedianRepairCost = medianAmount,
                MostCommonDeviceType = mostCommonDevice,
                TopPaymentMethod = topPaymentMethod
            };

            return await Task.FromResult(response);
        }

        private void InitializeSampleData()
        {
            // Sample invoices
            _invoices = new List<Invoice>
            {
                new Invoice { Id = 1, InvoiceNumber = "INV-000001", CustomerName = "Nguyen Van A", CustomerPhone = "0901234567", CustomerEmail = "a@example.com", DeviceType = "iPhone 12", RepairDescription = "Screen replacement", Amount = 2500000, Status = InvoiceStatus.Paid, CreatedDate = DateTime.Now.AddMonths(-3) },
                new Invoice { Id = 2, InvoiceNumber = "INV-000002", CustomerName = "Tran Thi B", CustomerPhone = "0902345678", CustomerEmail = "b@example.com", DeviceType = "Samsung S20", RepairDescription = "Battery replacement", Amount = 1500000, Status = InvoiceStatus.Paid, CreatedDate = DateTime.Now.AddMonths(-2) },
                new Invoice { Id = 3, InvoiceNumber = "INV-000003", CustomerName = "Le Van C", CustomerPhone = "0903456789", CustomerEmail = "c@example.com", DeviceType = "iPhone 13", RepairDescription = "Charging port repair", Amount = 800000, Status = InvoiceStatus.Pending, CreatedDate = DateTime.Now.AddDays(-10) },
                new Invoice { Id = 4, InvoiceNumber = "INV-000004", CustomerName = "Nguyen Van A", CustomerPhone = "0901234567", CustomerEmail = "a@example.com", DeviceType = "iPad", RepairDescription = "Screen replacement", Amount = 3500000, Status = InvoiceStatus.Paid, CreatedDate = DateTime.Now.AddMonths(-1) }
            };

            _payments = new List<Payment>
            {
                new Payment { Id = 1, InvoiceId = 1, Amount = 2500000, PaymentMethod = PaymentMethodType.BankTransfer, PaymentDate = DateTime.Now.AddMonths(-3), Status = PaymentStatus.Completed, TransactionReference = "TRX001" },
                new Payment { Id = 2, InvoiceId = 2, Amount = 1500000, PaymentMethod = PaymentMethodType.Cash, PaymentDate = DateTime.Now.AddMonths(-2), Status = PaymentStatus.Completed, ReceivedBy = "Staff 1" },
                new Payment { Id = 3, InvoiceId = 4, Amount = 3500000, PaymentMethod = PaymentMethodType.BankTransfer, PaymentDate = DateTime.Now.AddMonths(-1), Status = PaymentStatus.Completed, TransactionReference = "TRX002" }
            };
        }
    }
}
