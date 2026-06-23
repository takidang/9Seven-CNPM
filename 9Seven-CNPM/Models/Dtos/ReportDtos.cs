namespace _9Seven_CNPM.Models.Dtos
{
    public class RevenueReportRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class RevenueReportResponse
    {
        public decimal TotalRevenue { get; set; }
        public decimal PaidRevenue { get; set; }
        public decimal PendingRevenue { get; set; }
        public int TotalInvoices { get; set; }
        public int PaidInvoices { get; set; }
        public int PendingInvoices { get; set; }
        public int CancelledInvoices { get; set; }
        public DateTime ReportGeneratedAt { get; set; }
        public RevenueByStatusResponse? ByStatus { get; set; }
    }

    public class RevenueByStatusResponse
    {
        public decimal Paid { get; set; }
        public decimal Pending { get; set; }
        public decimal Cancelled { get; set; }
    }

    public class PaymentAnalyticsResponse
    {
        public decimal TotalPaymentAmount { get; set; }
        public int TotalPayments { get; set; }
        public PaymentMethodBreakdownResponse? ByMethod { get; set; }
        public PaymentStatusBreakdownResponse? ByStatus { get; set; }
        public decimal SuccessRate { get; set; }
    }

    public class PaymentMethodBreakdownResponse
    {
        public decimal CashAmount { get; set; }
        public int CashCount { get; set; }
        public decimal BankTransferAmount { get; set; }
        public int BankTransferCount { get; set; }
    }

    public class PaymentStatusBreakdownResponse
    {
        public decimal CompletedAmount { get; set; }
        public int CompletedCount { get; set; }
        public decimal PendingAmount { get; set; }
        public int PendingCount { get; set; }
        public decimal FailedAmount { get; set; }
        public int FailedCount { get; set; }
        public decimal CancelledAmount { get; set; }
        public int CancelledCount { get; set; }
    }

    public class InvoiceInsightsResponse
    {
        public int TotalInvoices { get; set; }
        public decimal AverageInvoiceAmount { get; set; }
        public decimal MinInvoiceAmount { get; set; }
        public decimal MaxInvoiceAmount { get; set; }
        public TopCustomersResponse? TopCustomers { get; set; }
        public DeviceTypeBreakdownResponse? ByDeviceType { get; set; }
    }

    public class TopCustomersResponse
    {
        public List<CustomerSummary>? Customers { get; set; } = new();
    }

    public class CustomerSummary
    {
        public string CustomerName { get; set; } = string.Empty;
        public int InvoiceCount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
    }

    public class DeviceTypeBreakdownResponse
    {
        public List<DeviceTypeSummary>? Devices { get; set; } = new();
    }

    public class DeviceTypeSummary
    {
        public string DeviceType { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal AverageAmount { get; set; }
    }

    public class TrendsResponse
    {
        public List<MonthlySummary>? MonthlyTrends { get; set; } = new();
        public List<PaymentPatternSummary>? PaymentPatterns { get; set; } = new();
    }

    public class MonthlySummary
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal TotalRevenue { get; set; }
        public int InvoiceCount { get; set; }
        public decimal AverageInvoiceAmount { get; set; }
    }

    public class PaymentPatternSummary
    {
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public int TransactionCount { get; set; }
        public decimal AverageTransactionAmount { get; set; }
    }

    public class SummaryStatisticsResponse
    {
        public decimal TotalOutstandingAmount { get; set; }
        public int OutstandingInvoiceCount { get; set; }
        public decimal TotalPaidAmount { get; set; }
        public int PaidInvoiceCount { get; set; }
        public decimal AverageRepairCost { get; set; }
        public decimal MedianRepairCost { get; set; }
        public string MostCommonDeviceType { get; set; } = string.Empty;
        public string TopPaymentMethod { get; set; } = string.Empty;
    }
}
