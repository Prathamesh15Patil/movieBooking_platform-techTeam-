const OFFER = {
  name: "Navratri Offer",
  percent: 20,                                      
  start: new Date("2026-10-11T00:00:00+05:30"),      
  end: new Date("2026-10-20T23:59:59+05:30"),
};

export const calculatePrice = (ticketPrice, seatCount) => {
  const now = new Date();
  const active = now >= OFFER.start && now <= OFFER.end;

  const subtotal = ticketPrice * seatCount;
  const discount = active ? Math.round((subtotal * OFFER.percent) / 100) : 0;

  return {
    subtotal,
    discount,
    total: subtotal - discount,
    offer: active ? OFFER.name : null,
  };
};