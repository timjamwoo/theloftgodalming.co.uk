// scripts/fetch-airbnb-calendar.js
import fs from 'fs';
import fetch from 'node-fetch';
import ICAL from 'ical.js';

const AIRBNB_ICAL_URL = process.env.AIRBNB_ICAL_URL;
const OUTPUT_FILE = 'data/airbnb-calendar.json';

async function main() {
    console.log('Fetching Airbnb iCal feed from ' + AIRBNB_ICAL_URL);
    const res = await fetch(AIRBNB_ICAL_URL);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const text = await res.text();

    console.log('Parsing iCal...');
    const jcal = ICAL.parse(text);
    const comp = new ICAL.Component(jcal);
    const vevents = comp.getAllSubcomponents('vevent');

    const bookings = vevents.map(v => {
        const ev = new ICAL.Event(v);
        return {
            start: ev.startDate.toJSDate().toISOString(),
            end: ev.endDate.toJSDate().toISOString(),
            summary: ev.summary
        };
    });

    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(bookings, null, 2));
    console.log(`Saved ${bookings.length} bookings to ${OUTPUT_FILE}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});