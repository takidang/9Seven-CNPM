# Report & Statistics API Documentation

## Endpoints

### 1. Revenue Report
**Endpoint:** `GET /api/report/revenue`

**Description:** Get revenue report for a date range with breakdown by invoice status

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601 format)
- `endDate` (optional): End date (ISO 8601 format)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 7800000,
    "paidRevenue": 7800000,
    "pendingRevenue": 800000,
    "totalInvoices": 4,
    "paidInvoices": 3,
    "pendingInvoices": 1,
    "cancelledInvoices": 0,
    "reportGeneratedAt": "2024-06-23T10:30:00",
    "byStatus": {
      "paid": 7800000,
      "pending": 800000,
      "cancelled": 0
    }
  }
}
```

---

### 2. Payment Analytics
**Endpoint:** `GET /api/report/payment-analytics`

**Description:** Get payment analytics including breakdown by method and status

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPaymentAmount": 7800000,
    "totalPayments": 3,
    "successRate": 100,
    "byMethod": {
      "cashAmount": 1500000,
      "cashCount": 1,
      "bankTransferAmount": 6300000,
      "bankTransferCount": 2
    },
    "byStatus": {
      "completedAmount": 7800000,
      "completedCount": 3,
      "pendingAmount": 0,
      "pendingCount": 0,
      "failedAmount": 0,
      "failedCount": 0,
      "cancelledAmount": 0,
      "cancelledCount": 0
    }
  }
}
```

---

### 3. Invoice Insights
**Endpoint:** `GET /api/report/invoice-insights`

**Description:** Get insights about invoices including top customers and device type breakdown

**Response:**
```json
{
  "success": true,
  "data": {
    "totalInvoices": 4,
    "averageInvoiceAmount": 2075000,
    "minInvoiceAmount": 800000,
    "maxInvoiceAmount": 3500000,
    "topCustomers": {
      "customers": [
        {
          "customerName": "Nguyen Van A",
          "invoiceCount": 2,
          "totalAmount": 6000000,
          "paidAmount": 6000000
        },
        {
          "customerName": "Tran Thi B",
          "invoiceCount": 1,
          "totalAmount": 1500000,
          "paidAmount": 1500000
        }
      ]
    },
    "byDeviceType": {
      "devices": [
        {
          "deviceType": "iPhone 12",
          "count": 1,
          "totalAmount": 2500000,
          "averageAmount": 2500000
        },
        {
          "deviceType": "iPhone 13",
          "count": 1,
          "totalAmount": 800000,
          "averageAmount": 800000
        }
      ]
    }
  }
}
```

---

### 4. Trends
**Endpoint:** `GET /api/report/trends`

**Description:** Get monthly revenue trends and payment patterns for specified months

**Query Parameters:**
- `months` (optional): Number of months to include (1-60, default: 12)

**Response:**
```json
{
  "success": true,
  "data": {
    "monthlyTrends": [
      {
        "year": 2024,
        "month": 3,
        "totalRevenue": 2500000,
        "invoiceCount": 1,
        "averageInvoiceAmount": 2500000
      },
      {
        "year": 2024,
        "month": 4,
        "totalRevenue": 1500000,
        "invoiceCount": 1,
        "averageInvoiceAmount": 1500000
      }
    ],
    "paymentPatterns": [
      {
        "paymentMethod": "BankTransfer",
        "totalAmount": 6000000,
        "transactionCount": 2,
        "averageTransactionAmount": 3000000
      },
      {
        "paymentMethod": "Cash",
        "totalAmount": 1500000,
        "transactionCount": 1,
        "averageTransactionAmount": 1500000
      }
    ]
  }
}
```

---

### 5. Summary Statistics
**Endpoint:** `GET /api/report/summary`

**Description:** Get high-level business statistics and KPIs

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOutstandingAmount": 800000,
    "outstandingInvoiceCount": 1,
    "totalPaidAmount": 7800000,
    "paidInvoiceCount": 3,
    "averageRepairCost": 2075000,
    "medianRepairCost": 2000000,
    "mostCommonDeviceType": "iPhone 12",
    "topPaymentMethod": "BankTransfer"
  }
}
```

---

### 6. Comprehensive Report
**Endpoint:** `GET /api/report/comprehensive`

**Description:** Get all reports combined in a single request

**Query Parameters:**
- `startDate` (optional): Start date for revenue report
- `endDate` (optional): End date for revenue report
- `trendMonths` (optional): Number of months for trends (1-60, default: 12)

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": { /* RevenueReport */ },
    "analytics": { /* PaymentAnalytics */ },
    "insights": { /* InvoiceInsights */ },
    "trends": { /* Trends */ },
    "summary": { /* SummaryStatistics */ },
    "generatedAt": "2024-06-23T10:30:00"
  }
}
```

---

## Example Requests

### Get Revenue Report for Last 3 Months
```
GET /api/report/revenue?startDate=2024-03-23&endDate=2024-06-23
```

### Get 6-Month Trends
```
GET /api/report/trends?months=6
```

### Get Comprehensive Report
```
GET /api/report/comprehensive?trendMonths=12
```

---

## Integration Notes

- All endpoints use **GET** methods for read-only operations
- Dates should be in **ISO 8601 format** (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)
- If no date range is specified, revenue report includes all data
- Success rate in payment analytics is calculated as: (Completed Payments / Total Payments) × 100
- All monetary amounts are in VND (Vietnamese Dong)

---

## Future Enhancements

1. **Database Integration**: Replace static lists with EF Core DbContext
2. **Caching**: Implement report caching to improve performance
3. **Export**: Add CSV/Excel export functionality
4. **Scheduling**: Add scheduled report generation and email delivery
5. **Filters**: Add more granular filters (by customer, device type, payment method)
6. **Forecasting**: Add revenue forecasting based on trends
