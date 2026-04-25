import fs from "fs"; 
import PDFDocument from "pdfkit"; 

// ─── Brand colors ─────────────────────────────────────────────── 
const C = { 
  primary:   "#1A1A2E", 
  accent:    "#E94560", 
  light:     "#F5F5F5", 
  white:     "#FFFFFF", 
  text:      "#2D2D2D", 
  muted:     "#777777", 
  border:    "#DDDDDD", 
}; 

// ─── Layout constants ──────────────────────────────────────────── 
const PAGE_W     = 595.28; 
const PAGE_H     = 841.89; 
const MARGIN     = 50; 
const CONTENT_W  = PAGE_W - MARGIN * 2; 

// Table column positions - adjusted for better alignment
const COL = { 
  product:  50,      // X position
  unitPrice: 220,    
  qty:      310,     
  discount: 360,     
  total:    440,     
};

const COL_WIDTH = {
  product:   170,
  unitPrice: 80,
  qty:       50,
  discount:  70,
  total:     100,
};

// ──────────────────────────────────────────────────────────────── 
export function createInvoice(invoice, filePath) { 
  const doc = new PDFDocument({ size: "A4", margin: 0, bufferPages: true }); 
  doc.pipe(fs.createWriteStream(filePath)); 

  drawHeader(doc, invoice); 
  drawMetaSection(doc, invoice); 
  drawItemsTable(doc, invoice); 
  drawSummary(doc, invoice); 
  drawFooter(doc); 

  doc.end(); 
} 

// ─── 1. Header ─────────────────────────────────────────────────── 
function drawHeader(doc, invoice) { 
  doc.rect(0, 0, PAGE_W, 90).fill(C.primary); 

  doc
    .fillColor(C.white)
    .fontSize(22).font("Helvetica-Bold")
    .text("🛍 E-Commerce App", MARGIN, 28, { lineBreak: false }); 

  doc
    .fillColor(C.accent)
    .fontSize(9).font("Helvetica")
    .text("Cairo, Egypt • support@ecommerce.app", MARGIN, 58, { lineBreak: false }); 

  doc.rect(0, 90, PAGE_W, 5).fill(C.accent); 
} 

// ─── 2. Invoice meta ─────────────────────────────────────────── 
function drawMetaSection(doc, invoice) { 
  const top = 115; 

  doc
    .fillColor(C.primary)
    .fontSize(28).font("Helvetica-Bold")
    .text("INVOICE", MARGIN, top); 

  const metaX = PAGE_W - MARGIN - 180; 
  const metaTop = top; 

  // Fix: Properly format invoice ID (take first 12 chars of ObjectId)
  let invoiceId = "N/A";
  if (invoice.invoice_nr) {
    invoiceId = invoice.invoice_nr.toString().slice(0, 12);
  } else if (invoice._id) {
    invoiceId = invoice._id.toString().slice(0, 12);
  }

  // Fix: Proper date formatting
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  labelValue(doc, "Invoice ID:", invoiceId, metaX, metaTop); 
  labelValue(doc, "Date:", formattedDate, metaX, metaTop + 22); 
  labelValue(doc, "Payment:", invoice.paymentMethod || "Cash", metaX, metaTop + 44); 

  // Divider 
  doc.moveTo(MARGIN, top + 85).lineTo(PAGE_W - MARGIN, top + 85)
    .strokeColor(C.border).lineWidth(1).stroke(); 

  // Shipping info 
  const shipTop = top + 100; 
  doc
    .fillColor(C.muted).fontSize(8).font("Helvetica-Bold")
    .text("SHIP TO", MARGIN, shipTop); 

  const customerName = invoice.shipping?.name || invoice.userName || "Customer";
  const customerAddress = invoice.shipping?.address || invoice.address || "N/A";
  const customerCountry = invoice.shipping?.country || "Egypt";

  doc
    .fillColor(C.text).fontSize(11).font("Helvetica-Bold")
    .text(customerName, MARGIN, shipTop + 14); 

  doc
    .fillColor(C.text).fontSize(9).font("Helvetica")
    .text(customerAddress, MARGIN, shipTop + 30)
    .text(customerCountry, MARGIN, shipTop + 44); 

  // Coupon badge 
  const couponName = invoice.couponName || invoice.coupon?.name;
  if (couponName) { 
    doc
      .roundedRect(PAGE_W - MARGIN - 130, shipTop + 10, 130, 28, 5)
      .fill(C.accent); 

    doc
      .fillColor(C.white).fontSize(9).font("Helvetica-Bold")
      .text(`COUPON: ${couponName}`, PAGE_W - MARGIN - 124, shipTop + 19, {
        width: 118, align: "center",
      }); 
  } 
} 

// ─── 3. Items table ─────────────────────────────────────────── 
function drawItemsTable(doc, invoice) { 
  const tableTop = 260; 

  // Table header background
  doc.rect(MARGIN, tableTop, CONTENT_W, 25).fill(C.primary); 

  // Header labels
  const headerY = tableTop + 8;
  doc.fillColor(C.white).fontSize(9).font("Helvetica-Bold");
  doc.text("PRODUCT", COL.product, headerY, { width: COL_WIDTH.product });
  doc.text("UNIT PRICE", COL.unitPrice, headerY, { width: COL_WIDTH.unitPrice, align: "right" });
  doc.text("QTY", COL.qty, headerY, { width: COL_WIDTH.qty, align: "right" });
  doc.text("DISCOUNT", COL.discount, headerY, { width: COL_WIDTH.discount, align: "right" });
  doc.text("TOTAL", COL.total, headerY, { width: COL_WIDTH.total, align: "right" });

  // Items
  const items = invoice.items || [];
  let currentY = tableTop + 25;

  items.forEach((item, i) => {
    const rowHeight = 28;
    const isEven = i % 2 === 0;
    
    // Row background
    doc.rect(MARGIN, currentY, CONTENT_W, rowHeight)
      .fill(isEven ? C.white : C.light);

    const textY = currentY + 9;
    doc.fillColor(C.text).fontSize(9).font("Helvetica");

    // Product name
    const productName = item.name || item.productId?.name || "Product";
    doc.text(productName, COL.product, textY, { width: COL_WIDTH.product });
    
    // Unit price
    const unitPrice = item.unitPrice || item.finalUnitPrice || 0;
    doc.text(fmt(unitPrice), COL.unitPrice, textY, { width: COL_WIDTH.unitPrice, align: "right" });
    
    // Quantity
    const quantity = item.quantity || 1;
    doc.text(String(quantity), COL.qty, textY, { width: COL_WIDTH.qty, align: "right" });
    
    // Discount
    const discount = item.productDiscount || 0;
    doc.text(discount ? `${discount}%` : "—", COL.discount, textY, { width: COL_WIDTH.discount, align: "right" });

    // Line total
    const lineTotal = item.lineTotal || (unitPrice * quantity * (1 - discount / 100));
    doc.fillColor(C.primary).font("Helvetica-Bold");
    doc.text(fmt(lineTotal), COL.total, textY, { width: COL_WIDTH.total, align: "right" });
    doc.font("Helvetica").fillColor(C.text);

    currentY += rowHeight;
  });

  // Table bottom border
  doc.rect(MARGIN, currentY, CONTENT_W, 1).fill(C.border);
  
  // Store for summary
  doc._tableBottom = currentY;
}

// ─── 4. Summary block ───────────────────────────────────────── 
function drawSummary(doc, invoice) { 
  const startY = (doc._tableBottom || 500) + 20; 
  const labelX = PAGE_W - MARGIN - 220; 
  const valueX = PAGE_W - MARGIN - 100; 
  const valW   = 100; 

  const subtotal = invoice.subtotal || 0;
  const discount = invoice.discount || 0;
  const total = invoice.total || invoice.totalPrice || subtotal - discount;

  // Subtotal
  summaryRow(doc, "Subtotal", fmt(subtotal), labelX, valueX, valW, startY, false); 

  let rowsUsed = 1;
  
  // Discount
  if (discount > 0) { 
    summaryRow(doc, "Discount", `- ${fmt(discount)}`, labelX, valueX, valW, startY + (rowsUsed * 24), false); 
    rowsUsed++;
  } 

  // Shipping
  summaryRow(doc, "Shipping", "Free", labelX, valueX, valW, startY + (rowsUsed * 24), false); 
  rowsUsed++;

  // Total - highlighted
  const totalY = startY + (rowsUsed * 24) + 10;
  doc.rect(labelX - 10, totalY - 6, PAGE_W - MARGIN - labelX + 10, 32).fill(C.primary); 
  doc
    .fillColor(C.white).fontSize(12).font("Helvetica-Bold")
    .text("TOTAL", labelX, totalY + 2, { width: 110 }) 
    .fillColor(C.accent)
    .text(fmt(total), valueX, totalY + 2, { width: valW, align: "right" }); 
} 

// ─── 5. Footer ──────────────────────────────────────────────── 
function drawFooter(doc) { 
  doc.rect(0, PAGE_H - 45, PAGE_W, 5).fill(C.accent); 

  doc
    .fillColor(C.muted).fontSize(9).font("Helvetica")
    .text(
      "Thank you for your purchase! Questions? support@ecommerce.app",
      MARGIN,
      PAGE_H - 34,
      { align: "center", width: CONTENT_W }
    ); 
} 

// ─── Helpers ────────────────────────────────────────────────── 
function labelValue(doc, label, value, x, y) { 
  doc.fillColor(C.muted).fontSize(8).font("Helvetica").text(label, x, y); 
  doc.fillColor(C.text).fontSize(10).font("Helvetica-Bold").text(value, x + 85, y); 
} 

function summaryRow(doc, label, value, labelX, valueX, valW, y, bold) { 
  const font = bold ? "Helvetica-Bold" : "Helvetica";
  doc
    .fillColor(C.muted).fontSize(9).font(font)
    .text(label, labelX, y, { width: 110 }); 
  doc
    .fillColor(C.text).fontSize(9).font(font)
    .text(value, valueX, y, { width: valW, align: "right" }); 
} 

function fmt(amount) { 
  if (amount === undefined || amount === null) return "0.00 EGP"; 
  return Number(amount).toFixed(2) + " EGP"; 
} 

export default createInvoice;