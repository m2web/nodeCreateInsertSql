const path = require('path');
const { stdout } = require('process');
const parse = require('csv-parse');
const transform = require('stream-transform');
const fs = require('fs');

const DELAY_TIME = 500;
const CSV_FILE = 'gfcStaff.csv';
const parser = parse({ delimiter: ',' });
const staffListPath = path.join(__dirname, CSV_FILE);
const input = fs.createReadStream(staffListPath);
let iterator = 1;

const createInserts = (record, callback) => {
  const [name, position] = record;
  
  //parse the name to create an email address:
  //remove space between first/last name
  //make lowercase
  //contactentate the email domain
  var email = name.replace(/\s/g, '').toLowerCase().concat('@graceky.org');

  //if deacon or only elder positin do not create an email address
  //as they are not "on staff" and do not have a church email address
  if(position === "Deacon" || position === "Elder"){
    email = "";
  }

  let message = `INSERT INTO public.churchstaff (id, name, position, emailaddress) VALUES (${iterator}, '${name}','${position}','${email}');`;
  iterator += 1;
  
  setTimeout(() => {
    // build ouput here
    callback(null, `${message}\n`);
  }, DELAY_TIME);
  count =+ 1;
};

const transformer = transform(createInserts);

input
  .pipe(parser)
  .pipe(transformer)
  .pipe(stdout);
