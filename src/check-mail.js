const Imap = require('imap');
const { simpleParser } = require('mailparser');
require('dotenv').config();

const imapConfig = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD.replace(/^"|"$/g, ''),
  host: 'imap.titan.email',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: true }
};

const imap = new Imap(imapConfig);

function openInbox(cb) {
  imap.openBox('INBOX', false, cb);
}

imap.once('ready', () => {
  openInbox((err, box) => {
    if (err) throw err;
    
    // Search for all messages in the last hour
    const since = new Date();
    since.setHours(since.getHours() - 1);
    
    imap.search(['ALL', ['SINCE', since]], (err, results) => {
      if (err) throw err;
      
      if (!results || !results.length) {
        console.log('No new messages found');
        imap.end();
        return;
      }

      const f = imap.fetch(results, {
        bodies: '',
        struct: true
      });

      f.on('message', (msg, seqno) => {
        console.log('Message #%d', seqno);
        
        msg.on('body', stream => {
          simpleParser(stream, (err, parsed) => {
            if (err) throw err;
            console.log('From:', parsed.from?.text);
            console.log('Subject:', parsed.subject);
            console.log('Date:', parsed.date);
            console.log('Text Content:', parsed.text);
            console.log('HTML Content:', parsed.html);
            console.log('------------------');
          });
        });
      });

      f.once('error', err => {
        console.log('Fetch error: ' + err);
      });

      f.once('end', () => {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
  });
});

imap.once('error', err => {
  console.log('IMAP Error:', err);
});

imap.once('end', () => {
  console.log('Connection ended');
});

imap.connect();
