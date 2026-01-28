import { getDateFormat, getTimeFormat } from "@/utils/dateTimeAction";

export const ticketHmtl = ({
    transactionId,
    lotName,
    lotLocation,
    plateNumber,
    amount,
    status,
    startTime,
    endTime
}: {
    transactionId: string,
    lotName: string,
    lotLocation: string,
    plateNumber: string,
    amount: number,
    status: string,
    startTime: string,
    endTime: string
})=> {
    if (
        !transactionId ||
        !lotName ||
        !lotLocation ||
        !plateNumber ||
        !amount ||
        !status ||
        !startTime ||
        !endTime
    ) return null;

    return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        html, body {
                            height: 100%;
                            width: 100%;
                        }
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                            padding: 60px 40px;
                            background: #f5f5f5;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .ticket {
                            background: white;
                            border: 2px solid #e0e0e0;
                            border-radius: 20px;
                            padding: 60px;
                            max-width: 600px;
                            width: 100%;
                            margin: 0 auto;
                        }
                        .qr-section {
                            text-align: center;
                            padding: 10px 0 50px 0;
                            border-bottom: 2px dashed #ccc;
                            margin-bottom: 50px;
                            position: relative;
                        }
                        .qr-section::before,
                        .qr-section::after {
                            content: '';
                            position: absolute;
                            bottom: -28px;
                            width: 64px;
                            height: 64px;
                            background: #f5f5f5;
                            border-radius: 50%;
                        }
                        .qr-section::before { left: -90px }
                        .qr-section::after { right: -90px }
                        .info-container {
                            display: flex;
                            gap: 40px;
                        }
                        .info-column {
                            flex: 1;
                        }
                        .info-item {
                            margin-bottom: 16px;
                        }
                        .label {
                            color: #666;
                            font-size: 16px;
                            margin-bottom: 8px;
                        }
                        .value {
                            font-size: 20px;
                            font-weight: 600;
                            color: #000;
                        }
                        .total-section {
                            margin-top: 24px;
                        }
                        .total-label {
                            color: #666;
                            font-size: 14px;
                            font-weight: 700;
                            margin-bottom: 8px;
                        }
                    </style>
                </head>
                <body>
                    <div class="ticket">
                        <div class="qr-section">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(transactionId)}" 
                                 alt="QR Code" width="300" height="300" />
                        </div>
                        <div class="info-container">
                            <div class="info-column">
                                <div class="info-item">
                                    <div class="label">Name</div>
                                    <div class="value">${lotName}</div>
                                </div>
                                <div class="info-item">
                                    <div class="label">Location</div>
                                    <div class="value">${lotLocation}</div>
                                </div>
                                <div class="info-item">
                                    <div class="label">Arrival Date</div>
                                    <div class="value">${getDateFormat(new Date(startTime))}</div>
                                </div>
                                <div class="info-item">
                                    <div class="label">Arrival Time</div>
                                    <div class="value">${getTimeFormat(new Date(startTime))}</div>
                                </div>
                            </div>
                            <div class="info-column">
                                <div class="info-item">
                                    <div class="label">Vehicle Number</div>
                                    <div class="value">${plateNumber}</div>
                                </div>
                                <div class="info-item">
                                    <div class="label">Payment Status</div>
                                    <div class="value">${status}</div>
                                </div>
                                <div class="info-item">
                                    <div class="label">Exit Date</div>
                                    <div class="value">${getDateFormat(new Date(endTime))}</div>
                                </div>
                                <div class="info-item">
                                    <div class="label">Exit Time</div>
                                    <div class="value">${getTimeFormat(new Date(endTime))}</div>
                                </div>
                                <div class="total-section">
                                    <div class="total-label">Total Payment</div>
                                    <div class="value">$ ${amount}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `;
}