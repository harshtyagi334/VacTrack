# VacTrack

Healthcare records shouldn't be this hard to keep track of.

**Live:** https://harshtyagi334.github.io/VacTrack/

## The problem

Multi-dose vaccinations are a pain to manage. Rabies PEP alone can mean five doses spread across weeks, and in that time people forget dates, lose paper records, switch hospitals mid-treatment, or just have no idea a government scheme exists that would've covered the cost. VacTrack is my attempt at putting all of that — tracking, reminders, records, hospital lookup, and benefit discovery — into one place.

## What it does

**Vaccination tracking.** See completed, upcoming, and overdue doses at a glance. For something like Rabies PEP, it lays out the full schedule so you're not guessing what comes next.

**Reminders.** The demo includes a simulated date system — you can move the clock forward and watch a dose go from upcoming, to due, to overdue. No SMS integration needed to show how the reminder logic works.

**Cross-hospital patient search.** Hospitals can pull up a patient by name, phone number, or ID. Useful for the very common case of someone getting dose 2 at a different clinic than dose 1.

**Personal health record.** Blood group, vaccination history, medical history, appointments — one portal instead of five different paper folders.

**Tamper-evident records.** Each record links to the one before it via a SHA-256 hash chain. Edit an old record and the chain breaks, which is enough to flag that something changed. I went with a hash chain instead of a full blockchain setup — didn't need the overhead for what this actually does.

**Batch verification.** When a hospital logs a vaccine, the system checks the batch and expiry. Expired batch, no record — it just refuses and tells you why.

**QR record access.** Scan, verify, view. In a real deployment this would sit behind proper consent and access controls, which the current build doesn't implement.

**Emergency care.** Pick a situation — snake bite, animal bite, allergic reaction — and get pointed toward nearby facilities that might handle it. Right now this runs on demo data, not live hospital feeds.

**Nearby hospitals + reviews.** Map-based search with distance, services, and vaccine availability, plus patient reviews for the ones you're deciding between.

**Hospital dashboard.** Patient search, dose recording, vaccine inventory, doctor and ambulance status — the operational side hospitals actually need day to day.

**Government healthcare benefits.** This is the one I care about most. A lot of people qualify for schemes like Ayushman Bharat PM-JAY, CGHS, or PMBJP and never find out. This section surfaces them — what they cover, who qualifies, how to apply — without pretending to make the eligibility call itself. That's still on the government body.

**Appointments and notifications**, both currently backed by demo data.

**English and Hindi**, because a healthcare tool that only works in English isn't actually accessible to the people who need it most.

## Design

Skipped the usual hospital blue-and-white. Went with terracotta, indigo, and mustard gold instead — warmer, still trustworthy, not sterile.

| Color | Hex |
|---|---|
| Deep Terracotta | `#E05D3F` |
| Deep Indigo | `#2E2A5E` |
| Mustard Gold | `#F2A93B` |
| Warm Gray | `#F6F4F1` |
| White | `#FFFFFF` |
| Deep Charcoal | `#231F20` |

Responsive across phones, tablets, and desktop — no horizontal scroll, no broken layouts on small screens.

## Stack

- **Frontend:** React / Next.js, JavaScript, HTML, CSS
- **Backend:** Node.js / Express (or FastAPI)
- **Database:** SQLite for now; PostgreSQL is the obvious swap for production
- **Integrity:** SHA-256 hash chain
- **Maps:** Leaflet.js

```
                    VacTrack
                       │
        ┌──────────────┴──────────────┐
   Patient Portal              Hospital Portal
        └──────────────┬──────────────┘
                    Backend
                       │
             ┌─────────┴─────────┐
          Database        Hash Chain (integrity)
```

## Trying the demo

1. Register a demo patient
2. Start a treatment (e.g. Rabies PEP) and generate the schedule
3. Record a dose, including batch/expiry check
4. Push the simulated date forward — watch a dose go due, then overdue
5. Search for that same patient from a different hospital login
6. Try editing an old record and watch the hash chain flag it
7. Check Nearby Hospitals, Emergency Care, and Government Benefits

## What's demo data right now

Patient records, hospital info, reviews, appointments, ambulance/doctor status, and most notifications are placeholder data for this build. Government scheme details should be double-checked against the official source before anyone relies on them. This isn't a replacement for an actual doctor, hospital, or emergency service — for a real emergency, call one.

## Where this could go

Real SMS/WhatsApp reminders, live hospital and ambulance data, more Indian languages, stronger identity verification, consent-based record sharing, offline support, and tighter integration with existing government healthcare systems. I'd also want to properly stress-test whether the hash-chain approach holds up before calling it production-ready, and revisit the blockchain question only if there's an actual reason for it — not because it sounds good on a slide.

## Privacy note

The current build demonstrates the concepts — role-based access, record integrity, controlled sharing — but a real deployment needs real authentication, encryption, audit logging, and compliance work that this prototype doesn't attempt yet.

---

**VacTrack** — track it, don't lose it.
