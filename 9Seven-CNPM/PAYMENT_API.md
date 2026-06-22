# Payment System API Documentation

## Overview
This payment system handles invoice payments for phone repair services with support for both cash and bank transfer payments. Bank transfers include QR code generation for easy scanning.

## API Endpoints

### 1. Process Cash Payment
**Endpoint:** `POST /api/payment/cash`

**Description:** Records a cash payment for an invoice.

**Request Body:**
```json
{
  "invoiceId": 1,
  "amount": 500000,
  "receivedBy": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "invoiceId": 1,
    "amount": 500000,
    "paymentMethod": "Cash",
    "status": "Completed",
    "paymentDate": "2026-06-22T10:30:00",
    "notes": "Cash payment received by John Doe"
  },
  "message": "Cash payment processed successfully"
}
```

### 2. Process Bank Transfer
**Endpoint:** `POST /api/payment/bank-transfer`

**Description:** Creates a bank transfer payment request with QR code generation.

**Request Body:**
```json
{
  "invoiceId": 1,
  "amount": 500000,
  "bankAccountNumber": "1234567890",
  "bankAccountName": "Phone Repair Shop",
  "bankName": "Vietcombank"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "invoiceId": 1,
    "amount": 500000,
    "paymentMethod": "BankTransfer",
    "status": "Pending",
    "paymentDate": "2026-06-22T10:30:00",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=...",
    "bankInfo": "Vietcombank - Phone Repair Shop",
    "notes": "Bank transfer pending for Vietcombank account ending in 7890"
  },
  "message": "Bank transfer request created with QR code"
}
```

### 3. Get Payment Details
**Endpoint:** `GET /api/payment/{paymentId}`

**Description:** Retrieves details of a specific payment.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "invoiceId": 1,
    "amount": 500000,
    "paymentMethod": "Cash",
    "status": "Completed",
    "paymentDate": "2026-06-22T10:30:00",
    "notes": "Cash payment received by John Doe"
  }
}
```

### 4. Get Payment by Invoice
**Endpoint:** `GET /api/payment/invoice/{invoiceId}`

**Description:** Retrieves the payment associated with an invoice.

**Response:** Same as Get Payment Details

### 5. Confirm Bank Transfer Payment
**Endpoint:** `POST /api/payment/confirm`

**Description:** Marks a bank transfer payment as confirmed after money has been received.

**Request Body:**
```json
{
  "paymentId": 2,
  "transactionReference": "TRX20260622001234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully"
}
```

### 6. Cancel Payment
**Endpoint:** `POST /api/payment/cancel/{paymentId}`

**Description:** Cancels a pending payment.

**Response:**
```json
{
  "success": true,
  "message": "Payment cancelled successfully"
}
```

## Data Models

### PaymentMethodType
- `Cash` - Cash payment
- `BankTransfer` - Bank transfer payment

### PaymentStatus
- `Pending` - Payment awaiting confirmation (mainly for bank transfers)
- `Completed` - Payment has been received and confirmed
- `Failed` - Payment processing failed
- `Cancelled` - Payment was cancelled

### Payment Object
```csharp
{
  "id": int,
  "invoiceId": int,
  "amount": decimal,
  "paymentMethod": PaymentMethodType,
  "status": PaymentStatus,
  "paymentDate": DateTime,
  "qrCodeUrl": string (for bank transfers),
  "bankAccountNumber": string,
  "bankAccountName": string,
  "bankName": string,
  "receivedBy": string (for cash payments),
  "transactionReference": string,
  "notes": string
}
```

## Implementation Details

### QR Code Generation
- QR codes are generated using QR Server API: `https://api.qrserver.com/`
- QR code data format: `VND|accountNumber|accountName|amount|invoiceNumber`
- QR code size: 300x300 pixels

### Service Architecture
- **PaymentService**: Handles payment processing logic
- **QrCodeService**: Generates QR codes for bank transfers
- **PaymentController**: Exposes REST API endpoints

### Current Implementation Notes
- Payments are stored in memory (in the PaymentService)
- For production use, integrate with a real database (Entity Framework Core with SQL Server, PostgreSQL, etc.)
- Consider adding payment gateway integration (VNPay, Momo, etc.) for real bank transfers

## Usage Example (C#)

```csharp
// Cash payment
var cashRequest = new ProcessCashPaymentRequest
{
    InvoiceId = 1,
    Amount = 500000,
    ReceivedBy = "John Doe"
};

// Bank transfer
var bankRequest = new ProcessBankTransferRequest
{
    InvoiceId = 1,
    Amount = 500000,
    BankAccountNumber = "1234567890",
    BankAccountName = "Phone Repair Shop",
    BankName = "Vietcombank"
};

// Confirm payment after receiving bank transfer
var confirmRequest = new ConfirmPaymentRequest
{
    PaymentId = 2,
    TransactionReference = "TRX20260622001234"
};
```

## Integration with Invoice System
1. When an invoice is created, its status is set to "Pending"
2. When a payment is processed:
   - For cash: Invoice status immediately becomes "Paid"
   - For bank transfer: Invoice status becomes "Pending" until ConfirmPayment is called
3. Once ConfirmPayment is called, invoice status becomes "Paid"

## Future Enhancements
- Database integration (Entity Framework Core)
- Payment webhook handling for automatic confirmation
- Integration with Vietnamese payment gateways (VNPay, Momo)
- Email notifications for payment requests and confirmations
- Payment receipt generation and delivery
- Refund handling
- Multiple payment method support (E-wallet, credit card, etc.)
