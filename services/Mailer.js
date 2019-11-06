const sendgrid = require("sendgrid");
const helper = sendgrid.mail;

class Mailer extends helper.Mail {
  constructor({ body, recipient }, content) {
    super();

    this.sgApi = sendgrid(
      "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"
    );
    this.from_email = new helper.Email("no-reply@drinkcoffee.com");
    this.subject = "Invoice";
    this.body = new helper.Content("text/html", content);
    this.recipient = this.formatAddresses(recipient);

    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresses(recipient) {
    return new helper.Email(recipient);
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new helper.Personalization();

    personalize.addTo(this.recipient);

    this.addPersonalization(personalize);
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
