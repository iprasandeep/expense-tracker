import AWS  from 'aws-sdk';
import puppeteer from 'puppeteer'; 
import fs from 'fs';
import User from '../models/User.js'; 

//AWS SDK credentials
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'us-east-1', 
});

const s3 = new AWS.S3();

export const generateExpenseReport = async (req, res) => {
  const expenses = req.body.expenses;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const userName = user.name;
    console.log("Name:", userName);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const content = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Expensify - ${userName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          h1 {
            text-align: center;
            color: #007bff; /* Blue color for the title */
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2; 
          }
          tbody tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .category::first-letter{
            text-transform: uppercase;
          }
          tfoot {
            font-weight: bold;
          }
          .footer {
            text-align: right;
            font-size: 12px;
            margin-top: 10px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <h1>Expensify - ${userName}</h1>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Expense</th>
            </tr>
          </thead>
          <tbody>
            ${expenses
              .map(
                (expense) => `
                <tr>
                  <td>${new Date(expense.createdAt).toLocaleDateString()}</td>
                  <td  class='category' >${expense.category}</td>
                  <td>${expense.details}</td>
                  <td>₹${expense.amount.toFixed(2)}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total Expenses:</td>
              <td>₹${expenses.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <div class="footer">Generated on ${new Date().toLocaleDateString()}</div>
      </body>
      </html>
    `;

    await page.setContent(content);
    await page.waitForSelector('table');
  
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      headerTemplate: `<h1>Expensify - ${userName}</h1>`,
      footerTemplate: '<p class="footer">Page {{page}}</p>',
    });

    await browser.close();

    const uniqueKey = `expense_report_${Date.now()}.pdf`;
    const params = {
      Bucket: 'testingexpense',
      Key: uniqueKey, 
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading to S3:', err);
        return res.status(500).json({ error: 'Error uploading to S3' });
      }

      const s3Url = data.Location;
      res.json({ message: 'Expense report generated and uploaded to S3', s3Url });
    });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    return res.status(500).json({ error: 'Error generating PDF report' });
  }
};


export default generateExpenseReport;