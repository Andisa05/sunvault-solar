"use client";
import { useState } from "react";

export default function QuoteForm() {
  const [sent, setSent] = useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <div className="full"><label htmlFor="name">Full name</label><input id="name" required defaultValue="Lerato Dlamini" /></div>
      <div><label htmlFor="phone">Phone</label><input id="phone" type="tel" required defaultValue="082 000 4410" /></div>
      <div><label htmlFor="suburb">Suburb</label><input id="suburb" defaultValue="Randburg" /></div>
      <div><label htmlFor="bill">Monthly electricity bill</label>
        <select id="bill" defaultValue="R1,500 – R3,000"><option>Under R1,500</option><option>R1,500 – R3,000</option><option>R3,000 – R5,000</option><option>Over R5,000</option></select></div>
      <div><label htmlFor="pkg">Interested in</label>
        <select id="pkg" defaultValue="Home Hybrid"><option>Backup Basic</option><option>Home Hybrid</option><option>Off-Grid Ready</option><option>Not sure yet</option></select></div>
      <button className="btn btn-amber" type="submit">Request my free assessment</button>
      {sent && <div className="ok" role="status">This is a demo site, so nothing was sent. A live version would email the team and log the lead in a CRM.</div>}
    </form>
  );
}
