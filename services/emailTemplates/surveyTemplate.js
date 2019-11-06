//const keys = require("../../config/keys");

module.exports = message => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>Receipt</h3>
          ${message.body}
        </div>
      </body>
    </html>
  `;
};
