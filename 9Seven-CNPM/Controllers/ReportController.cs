using _9Seven_CNPM.Models.Dtos;
using _9Seven_CNPM.Services;
using Microsoft.AspNetCore.Mvc;

namespace _9Seven_CNPM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenueReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var report = await _reportService.GetRevenueReportAsync(startDate, endDate);
            return Ok(new { success = true, data = report });
        }

        [HttpGet("payment-analytics")]
        public async Task<IActionResult> GetPaymentAnalytics()
        {
            var analytics = await _reportService.GetPaymentAnalyticsAsync();
            return Ok(new { success = true, data = analytics });
        }

        [HttpGet("invoice-insights")]
        public async Task<IActionResult> GetInvoiceInsights()
        {
            var insights = await _reportService.GetInvoiceInsightsAsync();
            return Ok(new { success = true, data = insights });
        }

        [HttpGet("trends")]
        public async Task<IActionResult> GetTrends([FromQuery] int months = 12)
        {
            if (months < 1 || months > 60)
                return BadRequest(new { success = false, message = "Months must be between 1 and 60" });

            var trends = await _reportService.GetTrendsAsync(months);
            return Ok(new { success = true, data = trends });
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummaryStatistics()
        {
            var summary = await _reportService.GetSummaryStatisticsAsync();
            return Ok(new { success = true, data = summary });
        }

        [HttpGet("comprehensive")]
        public async Task<IActionResult> GetComprehensiveReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int trendMonths = 12)
        {
            if (trendMonths < 1 || trendMonths > 60)
                return BadRequest(new { success = false, message = "TrendMonths must be between 1 and 60" });

            var revenue = await _reportService.GetRevenueReportAsync(startDate, endDate);
            var analytics = await _reportService.GetPaymentAnalyticsAsync();
            var insights = await _reportService.GetInvoiceInsightsAsync();
            var trends = await _reportService.GetTrendsAsync(trendMonths);
            var summary = await _reportService.GetSummaryStatisticsAsync();

            var comprehensiveReport = new
            {
                revenue,
                analytics,
                insights,
                trends,
                summary,
                generatedAt = DateTime.Now
            };

            return Ok(new { success = true, data = comprehensiveReport });
        }
    }
}
