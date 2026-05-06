#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive demo data generator for Ucetni_kniha_v4.html.

Produces FULL schema matching all 26 renderers - so the public demo
actually displays values on every page (not just empty cards).

Output:
  finance-data-v4.json   - standalone snapshot
  Ucetni_kniha_v4.html   - in-place embed of the snapshot

Deterministic via seed=42.
"""
from __future__ import annotations
import sys, json, random, re
from datetime import datetime, date, timedelta
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

random.seed(42)

DEMO_DIR = Path(__file__).resolve().parent.parent  # finance/demo
HTML_PATH = DEMO_DIR / "Ucetni_kniha_v4.html"
JSON_PATH = DEMO_DIR / "finance-data-v4.json"

TODAY = date.today()
NOW_ISO = datetime.now().isoformat(timespec="seconds")

# ============================================================
# DEMO PROFILE (anonymous)
# ============================================================
NAME = "Jan Novák"
BIRTH = date(1968, 3, 15)
AGE = TODAY.year - BIRTH.year - ((TODAY.month, TODAY.day) < (BIRTH.month, BIRTH.day))
RETIREMENT_AGE = 65
YEARS_TO_GOAL = max(1, RETIREMENT_AGE - AGE)
GOAL = 5_000_000

# ============================================================
# Helpers
# ============================================================
def rnd(a, b, ndigits=0):
    v = random.uniform(a, b)
    return round(v, ndigits) if ndigits else int(round(v))

def mk_period_label(key, start, end):
    if key == "L12M": return "Posledních 12 měsíců"
    if key == "L6M": return "Posledních 6 měsíců"
    if key == "L3M": return "Posledních 3 měsíce"
    if key == "ALL": return "Vše (od 2020)"
    if key == "YTD": return f"YTD {start[:4]}"
    return f"Rok {key}"

# ============================================================
# Periods + KPIs
# ============================================================
def mk_periods():
    today = TODAY.isoformat()
    keys = {
        "L12M": ((TODAY - timedelta(days=365)).isoformat(), today),
        "L6M":  ((TODAY - timedelta(days=183)).isoformat(), today),
        "L3M":  ((TODAY - timedelta(days=90)).isoformat(),  today),
        "2025": ("2025-01-01", "2025-12-31"),
        str(TODAY.year): (f"{TODAY.year}-01-01", today),
        "ALL":  ("2020-01-01", today),
    }
    return {k: {"start": s, "end": e, "label": mk_period_label(k, s, e)} for k, (s, e) in keys.items()}

def mk_kpis(periods):
    """All renderer accesses kpis[period].{income, provozni, operating_cashflow, investice, months}."""
    base = {
        "L12M":  {"months": 12, "income": 624_000, "provozni": 384_000, "investice": 132_000},
        "L6M":   {"months": 6,  "income": 318_000, "provozni": 187_200, "investice": 72_000},
        "L3M":   {"months": 3,  "income": 162_000, "provozni": 91_500,  "investice": 36_000},
        "2025":  {"months": 12, "income": 606_000, "provozni": 397_200, "investice": 120_000},
        "ALL":   {"months": 72, "income": 3_441_600, "provozni": 2_224_800, "investice": 720_000},
    }
    base[str(TODAY.year)] = {"months": TODAY.month, "income": 54_200 * TODAY.month,
                              "provozni": 31_800 * TODAY.month, "investice": 11_000 * TODAY.month}
    out = {}
    for k, p in periods.items():
        b = base.get(k, base["L12M"])
        cf = b["income"] - b["provozni"]
        out[k] = {
            "period_start": p["start"], "period_end": p["end"],
            "income": b["income"], "provozni": b["provozni"],
            "investice": b["investice"], "months": b["months"],
            "operating_cashflow": cf,
            # keep original generator names too in case anything reads them:
            "monthly_income_net": round(b["income"]/b["months"]),
            "monthly_expenses_op": round(b["provozni"]/b["months"]),
            "monthly_savings": round(cf/b["months"]),
            "savings_rate_pct": round(cf/b["income"]*100, 1) if b["income"] else 0,
        }
    return out

# ============================================================
# Bank accounts + transactions
# ============================================================
BANKS = [
    {"id":"acc_a_main",    "cislo":"123456789/0100", "role":"Hlavní účet (mzda + výdaje)",        "banka":"Demo Banka A", "typ":"běžný"},
    {"id":"acc_a_savings", "cislo":"234567890/0100", "role":"Spořicí účet (4.5% p.a.)",            "banka":"Demo Banka A", "typ":"spořicí"},
    {"id":"acc_a_loan",    "cislo":"345678901/0100", "role":"Úvěr (zbývá 22 splátek)",             "banka":"Demo Banka A", "typ":"úvěrový"},
    {"id":"acc_b_main",    "cislo":"456789012/2010", "role":"Sekundární (online platby)",          "banka":"Demo Banka B", "typ":"běžný"},
    {"id":"acc_b_savings", "cislo":"567890123/2010", "role":"Životní rezerva (5.2% p.a.)",         "banka":"Demo Banka B", "typ":"spořicí"},
]

CATEGORIES = [
    ("Mzda",       "Demo s.r.o. - výplata",    "income"),
    ("Mzda",       "Bonus / odměna",            "income"),
    ("Vraceni",    "Vrácení zálohy",            "income"),
    ("Vraceni",    "Refundace e-shop",          "income"),
    ("Bydleni",    "Nájem",                     "expense"),
    ("Bydleni",    "Energie ČEZ",               "expense"),
    ("Bydleni",    "SVJ poplatek",              "expense"),
    ("Bydleni",    "Internet O2",               "expense"),
    ("Jidlo",      "Albert nákup",              "expense"),
    ("Jidlo",      "Lidl nákup",                "expense"),
    ("Jidlo",      "Restaurace",                "expense"),
    ("Doprava",    "MHD karta",                 "expense"),
    ("Doprava",    "Benzín",                    "expense"),
    ("Doprava",    "Servis auta",               "expense"),
    ("Zabava",     "Netflix / HBO",             "expense"),
    ("Zabava",     "Kino",                      "expense"),
    ("Zabava",     "Restaurace s přáteli",      "expense"),
    ("Zdravi",     "Lékárna",                   "expense"),
    ("Zdravi",     "Pojištění zdraví",          "expense"),
    ("Investice",  "Převod na XTB",             "expense"),
    ("Investice",  "Převod na T212",            "expense"),
    ("Investice",  "Penzijko Generali",         "expense"),
    ("Sporeni",    "Převod na spořicí účet",    "expense"),
    ("Sporeni",    "Životní rezerva převod",    "expense"),
]

def mk_transactions(n=320):
    txs = []
    for i in range(n):
        cat, sub, ttype = random.choice(CATEGORIES)
        # pick account: salary always goes to acc_a_main
        if cat == "Mzda":
            acct = "acc_a_main"
            amt = rnd(48000, 62000)
        else:
            if cat in ("Investice", "Sporeni"):
                acct = "acc_a_main"
            elif cat == "Bydleni":
                acct = "acc_a_main"
            else:
                acct = random.choice(["acc_a_main","acc_b_main","acc_b_main"])
            amt = rnd(150, 12000)
            if cat == "Vraceni":
                amt = rnd(80, 4500)
        amt = -amt if ttype == "expense" else amt
        d = TODAY - timedelta(days=random.randint(0, 365))
        txs.append({
            "tx_id": f"DEMO-{i:04d}",
            "date": d.isoformat(),
            "amount": amt,
            "currency": "CZK",
            "category": cat,
            "subcategory": sub,
            "account": acct,
            "tx_type": ttype,
            "note": sub,
        })
    txs.sort(key=lambda x: x["date"], reverse=True)
    return txs

def enrich_bank_accounts(banks, txs):
    by_acct = {}
    for t in txs:
        by_acct.setdefault(t["account"], []).append(t)
    out = []
    for b in banks:
        ts = by_acct.get(b["id"], [])
        incoming = sum(t["amount"] for t in ts if t["amount"] > 0)
        outgoing = sum(-t["amount"] for t in ts if t["amount"] < 0)
        last = max((t["date"] for t in ts), default="")
        out.append({**b,
                    "tx_count": len(ts),
                    "last_date": last or None,
                    "incoming": incoming,
                    "outgoing": outgoing,
                    "net_flow": incoming - outgoing,
                    # legacy
                    "name": f"{b['banka']} - {b['typ']}",
                    "iban": "CZ" + b["cislo"].split("/")[0],
                    "currency": "CZK",
                    "balance": rnd(15000, 95000) if b["typ"] != "úvěrový" else -85000,
                    "transactions": []})
    return out

# ============================================================
# Crypto holdings
# ============================================================
def mk_crypto():
    coins = [
        ("BTC", 0.085,  158000, 24500, "Demo HW Wallet"),
        ("ETH", 0.92,    74800, -5200, "Demo HW Wallet"),
        ("ADA", 1500.0,  15600,  -800, "Demo Exchange"),
        ("SOL", 8.5,     39400, 11200, "Demo Exchange"),
        ("DOT", 120.0,   16700,  -300, "Demo Exchange"),
    ]
    return [{"coin": c, "amount": a, "value_czk": v, "pl_czk": pl, "platform": p,
             "symbol": c, "value_kc": v, "value_usd": round(v/23.5, 0)}
            for c, a, v, pl, p in coins]

# ============================================================
# Lock-in 3y + Position tracker
# ============================================================
TICKERS = [
    ("VWCE","ETF","Globální ETF",      "Globalni"),
    ("CSPX","ETF","S&P 500 ETF",       "USA"),
    ("EUNL","ETF","World ETF",         "Globalni"),
    ("IWDA","ETF","World ETF",         "Globalni"),
    ("VOO","ETF","S&P 500 ETF",        "USA"),
    ("SPY","ETF","S&P 500 ETF",        "USA"),
    ("QQQ","ETF","Nasdaq 100",         "USA"),
    ("AAPL","Akcie","Apple",           "USA"),
    ("MSFT","Akcie","Microsoft",       "USA"),
    ("GOOGL","Akcie","Alphabet",       "USA"),
    ("AMZN","Akcie","Amazon",          "USA"),
    ("META","Akcie","Meta",            "USA"),
    ("NVDA","Akcie","NVIDIA",          "USA"),
    ("TSLA","Akcie","Tesla",           "USA"),
    ("JPM","Akcie","JPMorgan",         "USA"),
    ("BAC","Akcie","Bank of America",  "USA"),
    ("V","Akcie","Visa",               "USA"),
    ("MA","Akcie","Mastercard",        "USA"),
    ("JNJ","Akcie","Johnson & Johnson","USA"),
    ("PFE","Akcie","Pfizer",           "USA"),
    ("MRK","Akcie","Merck",            "USA"),
    ("KO","Akcie","Coca-Cola",         "USA"),
    ("PEP","Akcie","Pepsi",            "USA"),
    ("PG","Akcie","Procter & Gamble",  "USA"),
    ("WMT","Akcie","Walmart",          "USA"),
    ("HD","Akcie","Home Depot",        "USA"),
    ("MCD","Akcie","McDonald's",       "USA"),
    ("DIS","Akcie","Disney",           "USA"),
    ("XOM","Akcie","Exxon Mobil",      "USA"),
    ("CVX","Akcie","Chevron",          "USA"),
    ("T","Akcie","AT&T",               "USA"),
    ("VZ","Akcie","Verizon",           "USA"),
    ("INTC","Akcie","Intel",           "USA"),
    ("AMD","Akcie","AMD",              "USA"),
    ("CSCO","Akcie","Cisco",           "USA"),
    ("ORCL","Akcie","Oracle",          "USA"),
    ("CRM","Akcie","Salesforce",       "USA"),
    ("NFLX","Akcie","Netflix",         "USA"),
    ("ADBE","Akcie","Adobe",           "USA"),
    ("PYPL","Akcie","PayPal",          "USA"),
    ("BRK.B","Akcie","Berkshire Hath.","USA"),
    ("UNH","Akcie","UnitedHealth",     "USA"),
    ("ABBV","Akcie","AbbVie",          "USA"),
    ("MRNA","Akcie","Moderna",         "USA"),
    ("SHOP","Akcie","Shopify",         "Globalni"),
    ("ZM","Akcie","Zoom",              "USA"),
    ("SXR8","ETF","S&P 500 EUR",       "USA"),
    ("ABNB","Akcie","Airbnb",          "USA"),
    ("UBER","Akcie","Uber",            "USA"),
    ("SQ","Akcie","Block",             "USA"),
]

SECTOR_MAP = {
    "AAPL":"Tech","MSFT":"Tech","GOOGL":"Tech","AMZN":"Tech","META":"Tech","NVDA":"Tech",
    "INTC":"Tech","AMD":"Tech","CSCO":"Tech","ORCL":"Tech","CRM":"Tech","NFLX":"Tech",
    "ADBE":"Tech","PYPL":"Tech","SHOP":"Tech","ZM":"Tech","ABNB":"Tech","UBER":"Tech","SQ":"Tech",
    "JNJ":"Healthcare","PFE":"Healthcare","MRK":"Healthcare","UNH":"Healthcare","ABBV":"Healthcare","MRNA":"Healthcare",
    "JPM":"Financials","BAC":"Financials","V":"Financials","MA":"Financials","BRK.B":"Financials",
    "KO":"Consumer","PEP":"Consumer","PG":"Consumer","WMT":"Consumer","HD":"Consumer","MCD":"Consumer","DIS":"Consumer","TSLA":"Consumer",
    "XOM":"Energy","CVX":"Energy",
    "T":"Telecom","VZ":"Telecom",
    "VWCE":"ETF","CSPX":"ETF","EUNL":"ETF","IWDA":"ETF","VOO":"ETF","SPY":"ETF","QQQ":"ETF","SXR8":"ETF",
}

PLATFORMS_FOR = {
    "ETF": ["XTB CZ","XTB EUR","Trading 212"],
    "Akcie": ["XTB EUR","XTB USD","Trading 212","eToro","IB"],
}

def mk_lock_in_and_tracker():
    positions = []
    tracker_positions = []
    by_broker_pos = {}
    today_dt = TODAY
    for sym, kind, name, region in TICKERS:
        days_ago = random.randint(120, 1100)
        buy = today_dt - timedelta(days=days_ago)
        free = buy + timedelta(days=3*365 + 1)
        days_left = (free - today_dt).days
        if days_left <= 0: status = "OSVOBOZENO"
        elif days_left <= 90: status = "BLIZKO"
        elif days_left <= 365: status = "STREDNE"
        else: status = "DALEKO"
        ks = round(random.uniform(0.5, 18), 2)
        cost_per = round(random.uniform(80, 2400), 2)
        gain = random.uniform(-0.18, 0.65)
        cur_per = round(cost_per * (1 + gain), 2)
        cost_kc = round(ks * cost_per, 2)
        value_kc = round(ks * cur_per, 2)
        pl_kc = round(value_kc - cost_kc, 2)
        platform = random.choice(PLATFORMS_FOR[kind])
        positions.append({
            "asset": sym, "platforma": platform,
            "datum_nakupu": buy.isoformat(),
            "osvobozeno_od": free.isoformat(),
            "days_left": days_left,
            "pocet_ks": ks,
            "aktualni_hodnota": value_kc,
            "otevreny_pl": pl_kc,
            "doporuceni": "Lze prodat bez daně" if status == "OSVOBOZENO" else "Držet do osvobození",
            "status": status,
        })
        sector = SECTOR_MAP.get(sym, "Other")
        dividends_total = round(value_kc * random.uniform(0.005, 0.04), 0) if kind == "Akcie" else 0
        tp = {
            "symbol": sym, "broker": platform, "sector": sector,
            "pieces": ks, "cost_kc": cost_kc, "value_kc": value_kc,
            "pl_kc": pl_kc, "pl_pct": round((pl_kc / cost_kc * 100) if cost_kc else 0, 2),
            "days_held": days_ago,
            "dividends_total": dividends_total,
            "yield_on_cost_pct": round((dividends_total / cost_kc * 100) if cost_kc else 0, 2),
        }
        tracker_positions.append(tp)
        by_broker_pos.setdefault(platform, []).append(tp)

    # Stats for lock_in
    counts = {"osvobozeno": 0, "do_roka": 0, "dele_jak_rok": 0, "celkem_pozic": len(positions),
              "OSVOBOZENO": 0, "BLIZKO": 0, "STREDNE": 0, "DALEKO": 0,
              "value_osvobozeno": 0, "value_do_roka": 0, "value_dale": 0}
    for p in positions:
        counts[p["status"]] += 1
        if p["days_left"] <= 0:
            counts["osvobozeno"] += 1; counts["value_osvobozeno"] += p["aktualni_hodnota"]
        elif p["days_left"] <= 365:
            counts["do_roka"] += 1; counts["value_do_roka"] += p["aktualni_hodnota"]
        else:
            counts["dele_jak_rok"] += 1; counts["value_dale"] += p["aktualni_hodnota"]

    # Position tracker aggregates
    total_value = sum(p["value_kc"] for p in tracker_positions)
    total_pl = sum(p["pl_kc"] for p in tracker_positions)
    total_cost = sum(p["cost_kc"] for p in tracker_positions)
    total_div = sum(p["dividends_total"] for p in tracker_positions)
    sorted_by_pl_kc = sorted(tracker_positions, key=lambda p: p["pl_kc"], reverse=True)
    gainers = sorted_by_pl_kc[:10]
    losers = sorted_by_pl_kc[-10:][::-1]
    sector_counts = {}
    for p in tracker_positions:
        sector_counts.setdefault(p["sector"], {"sector": p["sector"], "value_kc": 0, "pocet": 0})
        sector_counts[p["sector"]]["value_kc"] += p["value_kc"]
        sector_counts[p["sector"]]["pocet"] += 1
    sector_breakdown = sorted(sector_counts.values(), key=lambda x: x["value_kc"], reverse=True)
    days_bins = [{"bin": "< 90 dní", "count": 0}, {"bin": "90-365 dní", "count": 0},
                 {"bin": "1-3 roky", "count": 0}, {"bin": "> 3 roky", "count": 0}]
    for p in tracker_positions:
        d = p["days_held"]
        if d < 90: days_bins[0]["count"] += 1
        elif d < 365: days_bins[1]["count"] += 1
        elif d < 1095: days_bins[2]["count"] += 1
        else: days_bins[3]["count"] += 1
    top10_value = sum(p["value_kc"] for p in sorted(tracker_positions, key=lambda x: x["value_kc"], reverse=True)[:10])
    concentration = round(top10_value / total_value * 100, 1) if total_value else 0

    return {
        "lock_in": {"positions": positions,
                    "stats": {**counts, "recalculated": NOW_ISO}},
        "tracker": {
            "positions": tracker_positions,
            "gainers_top10": gainers, "losers_top10": losers,
            "sector_breakdown": sector_breakdown,
            "days_held_bins": days_bins,
            "total_value": round(total_value, 0),
            "total_pl": round(total_pl, 0),
            "total_pl_pct": round(total_pl/total_cost*100, 2) if total_cost else 0,
            "total_dividends": round(total_div, 0),
            "concentration_top10_pct": concentration,
            "fx_rates_implied": {"USD/CZK": "23.5", "EUR/CZK": "25.2", "GBP/CZK": "29.8"},
        },
        "by_broker_pos": by_broker_pos,
    }

# ============================================================
# Brokers
# ============================================================
def mk_brokers(by_broker_pos):
    out = []
    broker_meta = {
        "XTB CZ":  {"platform":"XTB", "currency":"CZK"},
        "XTB EUR": {"platform":"XTB", "currency":"EUR"},
        "XTB USD": {"platform":"XTB", "currency":"USD"},
        "Trading 212": {"platform":"T212", "currency":"EUR"},
        "eToro":   {"platform":"eToro","currency":"USD"},
        "IB":      {"platform":"Interactive Brokers","currency":"USD"},
    }
    for name, meta in broker_meta.items():
        positions = by_broker_pos.get(name, [])
        cur_value = sum(p["value_kc"] for p in positions)
        unreal = sum(p["pl_kc"] for p in positions)
        positions_sorted = sorted(positions, key=lambda p: p["value_kc"], reverse=True)
        top10 = []
        for p in positions_sorted[:10]:
            top10.append({
                "Symbol": p["symbol"], "Typ": "Akcie" if p["sector"] != "ETF" else "ETF",
                "Objem": p["pieces"], "Tržní cena": round(p["value_kc"]/p["pieces"], 2),
                "Hodnota Kč": p["value_kc"], "P/L Kč": p["pl_kc"],
            })
        recent_closed = []
        for _ in range(min(8, max(2, len(positions)//4))):
            sym = random.choice(positions)["symbol"] if positions else "DEMO"
            buy = round(random.uniform(80, 1500), 2)
            sell = round(buy * random.uniform(0.85, 1.5), 2)
            obj = random.randint(1, 20)
            recent_closed.append({
                "Symbol": sym, "Objem": obj,
                "Nákup": buy, "Prodej": sell,
                "P/L Kč": round((sell-buy)*obj*23.5, 0),
            })
        recent_dividends = []
        for _ in range(min(8, max(2, len(positions)//5))):
            sym = random.choice(positions)["symbol"] if positions else "AAPL"
            d = TODAY - timedelta(days=random.randint(0, 365))
            recent_dividends.append({
                "Datum": d.isoformat(),
                "Symbol": sym, "Typ": "Cash",
                "Částka Kč": round(random.uniform(80, 1200), 0),
            })
        dividends = sum(d["Částka Kč"] for d in recent_dividends) * random.uniform(2, 5)
        out.append({
            "name": name, "platform": meta["platform"], "currency": meta["currency"],
            "current_value": round(cur_value, 0),
            "positions_open": len(positions),
            "positions_closed": len(recent_closed) * 3,
            "realized_pl": round(random.uniform(-15000, 75000), 0),
            "unrealized_pl": round(unreal, 0),
            "dividends": round(dividends, 0),
            "deposits": round(random.uniform(80000, 250000), 0),
            "withdrawals": round(random.uniform(0, 30000), 0),
            "positions_top10": top10,
            "recent_closed": recent_closed,
            "recent_dividends": recent_dividends,
        })
    return out

# ============================================================
# Pasky (payslips)
# ============================================================
def mk_pasky():
    out = []
    for i in range(12):
        d = TODAY.replace(day=15) - timedelta(days=30*i)
        gross = rnd(76000, 82000)
        soc = round(gross*0.071, 0)
        zdr = round(gross*0.045, 0)
        dan = round(gross*0.15 - 2570, 0)
        net = gross - soc - zdr - dan
        out.append({
            "month": d.strftime("%Y-%m"), "datum": d.isoformat(),
            "hruba_mzda": gross, "soc_pojisteni": soc,
            "zdrav_pojisteni": zdr, "zaloha_dan": dan,
            "cista_mzda": net, "vyplaceno": net,
            "zamestnavatel": "Demo s.r.o.", "matched_bank_tx": True,
        })
    out.reverse()
    return out

# ============================================================
# Portfolio (items_classified) + totals_breakdown + goal
# ============================================================
def mk_portfolio(crypto, banks_enriched, lock_total_value):
    items = []
    # Investice items (broker-aggregated)
    items.append({"name":"XTB účty (akcie/ETF)", "value": round(lock_total_value*0.55,0),
                  "asset_class":"akcie_etf", "in_investments": True, "in_savings": False, "in_reserve": False,
                  "liquidity_level":"high", "risk_level":"medium"})
    items.append({"name":"Trading 212", "value": round(lock_total_value*0.18,0),
                  "asset_class":"akcie_etf", "in_investments": True, "in_savings": False, "in_reserve": False,
                  "liquidity_level":"high", "risk_level":"medium"})
    items.append({"name":"eToro / IB", "value": round(lock_total_value*0.27,0),
                  "asset_class":"akcie_etf", "in_investments": True, "in_savings": False, "in_reserve": False,
                  "liquidity_level":"high", "risk_level":"medium"})
    crypto_sum = sum(c["value_czk"] for c in crypto)
    items.append({"name":"Krypto (HW + burzy)", "value": crypto_sum,
                  "asset_class":"crypto", "in_investments": True, "in_savings": False, "in_reserve": False,
                  "liquidity_level":"medium", "risk_level":"very_high"})
    items.append({"name":"Penzijní spoření Generali", "value": 175_000,
                  "asset_class":"penzijko", "in_investments": True, "in_savings": False, "in_reserve": False,
                  "liquidity_level":"low", "risk_level":"low"})
    items.append({"name":"Zlato fyzické", "value": 80_000,
                  "asset_class":"zlato", "in_investments": True, "in_savings": False, "in_reserve": False,
                  "liquidity_level":"medium", "risk_level":"low"})
    items.append({"name":"Demo P2P (Fingood-style)", "value": 45_000,
                  "asset_class":"p2p_business_loans", "in_investments": True, "in_savings": False, "in_reserve": False,
                  "liquidity_level":"low", "risk_level":"high"})
    # Spoření / rezerva
    items.append({"name":"Spořicí účet Demo Banka A (4.5%)", "value": 90_000,
                  "asset_class":"savings", "in_investments": False, "in_savings": True, "in_reserve": False,
                  "liquidity_level":"high", "risk_level":"very_low"})
    items.append({"name":"Životní rezerva Demo Banka B (5.2%)", "value": 55_000,
                  "asset_class":"reserve", "in_investments": False, "in_savings": False, "in_reserve": True,
                  "liquidity_level":"high", "risk_level":"very_low"})
    items.append({"name":"Hotovost na hl. účtu", "value": 25_000,
                  "asset_class":"cash", "in_investments": False, "in_savings": False, "in_reserve": True,
                  "liquidity_level":"very_high", "risk_level":"very_low"})

    total_assets = sum(i["value"] for i in items)
    reserve = sum(i["value"] for i in items if i["in_reserve"])
    savings = sum(i["value"] for i in items if i["in_savings"])
    investments = sum(i["value"] for i in items if i["in_investments"])

    # Legacy by_class for old code paths
    by_class = []
    for ac, color in [("akcie_etf","#3b82f6"),("crypto","#f59e0b"),("penzijko","#10b981"),
                     ("savings","#8b5cf6"),("reserve","#a855f7"),("zlato","#eab308"),
                     ("p2p_business_loans","#ef4444"),("cash","#6b7280")]:
        v = sum(i["value"] for i in items if i["asset_class"]==ac)
        if v > 0:
            by_class.append({"name": ac, "value": v,
                            "pct": round(v/total_assets*100,1), "color": color})

    return {
        "total": total_assets,
        "total_value": total_assets,    # legacy
        "goal": GOAL,
        "items_classified": items,
        "items": items,                  # legacy alias
        "totals_breakdown": {
            "total_assets": total_assets,
            "reserve": reserve,
            "savings": savings,
            "investments": investments,
        },
        "by_class": by_class,
        "by_platform": [
            {"name": "XTB",       "value": round(lock_total_value*0.55,0), "currency":"USD/EUR"},
            {"name": "Trading 212","value": round(lock_total_value*0.18,0), "currency":"EUR"},
            {"name": "eToro/IB",  "value": round(lock_total_value*0.27,0), "currency":"USD"},
            {"name": "Krypto",    "value": crypto_sum, "currency":"BTC/ETH"},
            {"name": "Penzijko",  "value": 175_000, "currency":"CZK"},
            {"name": "Spoření",   "value": 145_000, "currency":"CZK"},
            {"name": "Zlato",     "value": 80_000,  "currency":"Au"},
            {"name": "P2P",       "value": 45_000,  "currency":"CZK"},
            {"name": "Cash",      "value": 25_000,  "currency":"CZK"},
        ],
    }

# ============================================================
# Series (monthly) + dividends
# ============================================================
def mk_monthly_series():
    out = []
    base_inc, base_op, base_inv = 52000, 32000, 11000
    for i in range(24):
        d = (TODAY.replace(day=1) - timedelta(days=30*(23-i)))
        inc = base_inc + rnd(-3000, 6000)
        op = base_op + rnd(-2500, 5000)
        inv = base_inv + rnd(-3000, 4000)
        out.append({"month": d.strftime("%Y-%m"), "income": inc, "provozni": op,
                    "investice": inv, "value": inc - op})
    return out

def mk_networth_series(start=820_000, target_today=1_350_000):
    out = []
    base = start
    step = (target_today - start) / 23
    for i in range(24):
        d = (TODAY.replace(day=1) - timedelta(days=30*(23-i)))
        base += step + random.randint(-15000, 25000)
        out.append({"month": d.strftime("%Y-%m"), "value": round(base, 0)})
    return out

def mk_dividends_by_month():
    out = []
    for i in range(24):
        d = (TODAY.replace(day=15) - timedelta(days=30*(23-i)))
        out.append({"month": d.strftime("%Y-%m"),
                    "amount": round(random.uniform(150, 1800), 0),
                    "amount_czk": round(random.uniform(150, 1800), 0)})
    return out

def mk_expense_categories():
    return [
        {"category":"Bydleni","value":12500,"pct":39.3},
        {"category":"Jidlo","value":8200,"pct":25.8},
        {"category":"Doprava","value":3800,"pct":12.0},
        {"category":"Zabava","value":2900,"pct":9.1},
        {"category":"Zdravi","value":1800,"pct":5.7},
        {"category":"Ostatni","value":2600,"pct":8.2},
    ]

# ============================================================
# Allocations
# ============================================================
def mk_allocations(total):
    return {
        "currency": [
            {"label":"CZK","value": round(total*0.45,0)},
            {"label":"USD","value": round(total*0.35,0)},
            {"label":"EUR","value": round(total*0.20,0)},
        ],
        "geography": [
            {"label":"USA","value": round(total*0.50,0)},
            {"label":"Evropa","value": round(total*0.30,0)},
            {"label":"Globální","value": round(total*0.20,0)},
        ],
        "asset_type": [
            {"label":"Akcie & ETF","value": round(total*0.47,0)},
            {"label":"Krypto","value": round(total*0.15,0)},
            {"label":"Penzijko","value": round(total*0.14,0)},
            {"label":"Spoření","value": round(total*0.12,0)},
            {"label":"Zlato","value": round(total*0.07,0)},
            {"label":"P2P","value": round(total*0.04,0)},
            {"label":"Cash","value": round(total*0.02,0)},
        ],
        # legacy by_currency etc
        "by_currency": [{"currency":"CZK","pct":45},{"currency":"USD","pct":35},{"currency":"EUR","pct":20}],
        "by_region": [{"region":"USA","pct":50},{"region":"Evropa","pct":30},{"region":"Globální","pct":20}],
        "by_sector": [{"sector":"Tech","pct":28},{"sector":"Healthcare","pct":18},{"sector":"Financials","pct":15},
                      {"sector":"Consumer","pct":14},{"sector":"Energy","pct":10},{"sector":"Other","pct":15}],
    }

# ============================================================
# IOLDP (state pension)
# ============================================================
def mk_ioldp():
    zb = {}
    periods = []
    cur = date(1986, 9, 1)
    end = date(TODAY.year - 1, 12, 31)
    while cur < end:
        nxt = date(cur.year+1, cur.month, cur.day) if cur.month != 2 or cur.day < 28 else date(cur.year+1, 3, 1)
        if nxt > end: nxt = end
        days = (nxt - cur).days
        year = cur.year
        if year < 1990:
            base = rnd(28000, 45000)
            druh = "zaměstnání"; nahr = False
        elif year < 2000:
            base = rnd(85000, 180000)
            druh = "zaměstnání"; nahr = False
        elif year < 2010:
            # Some gap years
            if random.random() < 0.3:
                base = 0; druh = "neevidováno"; nahr = False
            else:
                base = rnd(220000, 380000); druh = "OSVČ"; nahr = False
        elif year < 2015:
            base = rnd(380000, 580000); druh = "zaměstnání"; nahr = False
        elif year < 2022:
            base = rnd(620000, 780000); druh = "zaměstnání"; nahr = False
        else:
            base = rnd(820000, 950000); druh = "zaměstnání Demo s.r.o."; nahr = False
        if base > 0:
            zb[str(year)] = zb.get(str(year), 0) + base
            periods.append({"from": cur.isoformat(), "to": nxt.isoformat(),
                            "days": days, "druh": druh, "is_nahradni": nahr,
                            "vymerovaci_zaklad": base, "vd_vylucene": rnd(0, 5)})
        cur = nxt + timedelta(days=1)
    evid_dnu = sum(p["days"] for p in periods if not p["is_nahradni"])
    return {
        "document_date": "2026-04-15",
        "evidovane_let": round(evid_dnu/365, 1),
        "evidovane_dnu": evid_dnu,
        "nahradni_let": 0.4,
        "nahradni_dnu": 146,
        "neevidovane_let": 8.5,
        "celkem_pojisteni_let": round(evid_dnu/365 + 0.4, 1),
        "vymerovaci_zaklady_by_year": zb,
        "periods": periods,
    }

# ============================================================
# Tax module
# ============================================================
def mk_tax_module():
    return {
        "rok": 2025,
        "celkem": {"daňový_základ_§10": 48500},
        "vypocet_dane": {
            "zaklad_dane_celkem_kc": 62300,
            "dan_15p_pred_kreditem": 9345,
            "kredit_zahr_srazkova": -2480,
            "dan_po_kreditu": 6865,
            "metoda_parovani": "FIFO",
        },
        "sekce_10_obchodovani": [
            {"category":"Akcie/ETF (< 3 roky test)", "amount": 32500},
            {"category":"Krypto (< 3 roky)",         "amount": 18000},
            {"category":"CFD spekulační ztráta",     "amount": -2000},
        ],
        "sekce_8_dividendy": [
            {"category":"Dividendy USA (hrubé)",      "amount": 12500},
            {"category":"Srážková daň USA již odvedená","amount": -1875},
            {"category":"Úroky spořicí účet",         "amount": 4200},
            {"category":"Dividendy EU",               "amount": 1800},
        ],
    }

# ============================================================
# Goal scenarios
# ============================================================
def mk_goal_scenarios(portfolio_total):
    base_pmt = 22000
    n = YEARS_TO_GOAL * 12
    out = []
    for label, rate in [("Konzervativní 3% p.a.", 0.03),
                        ("Vyvážený 5% p.a.", 0.05),
                        ("Dynamický 7% p.a.", 0.07)]:
        r = rate/12
        fv_pv = portfolio_total * (1+r)**n
        fv_pmt = base_pmt * (((1+r)**n - 1) / r)
        fv = fv_pv + fv_pmt
        # required pmt to reach GOAL given current PV
        deficit = GOAL - fv_pv
        req_pmt = max(0, deficit / (((1+r)**n - 1) / r))
        out.append({
            "name": label, "label": label, "rate": round(rate*100, 1),
            "fv_at_current_pmt": round(fv, 0),
            "reaches_goal": fv >= GOAL,
            "required_pmt_for_goal": round(req_pmt, 0),
            "target_value": round(fv, 0),
            "shortfall_pct": round((1 - fv/GOAL)*100, 1) if fv < GOAL else 0,
        })
    return out

# ============================================================
# Main mk_data
# ============================================================
def mk_data():
    periods = mk_periods()
    kpis = mk_kpis(periods)
    bank_raw = BANKS
    txs = mk_transactions(320)
    banks = enrich_bank_accounts(bank_raw, txs)
    crypto = mk_crypto()
    li_track = mk_lock_in_and_tracker()
    lock_in = li_track["lock_in"]
    tracker = li_track["tracker"]
    brokers = mk_brokers(li_track["by_broker_pos"])
    portfolio = mk_portfolio(crypto, banks, tracker["total_value"])
    monthly = mk_monthly_series()
    networth = mk_networth_series(target_today=portfolio["total"])
    pasky = mk_pasky()
    expenses = mk_expense_categories()
    div_month = mk_dividends_by_month()
    allocations = mk_allocations(portfolio["total"])
    ioldp = mk_ioldp()
    tax = mk_tax_module()
    goal_sc = mk_goal_scenarios(portfolio["total"])

    return {
        "meta": {
            "generated": NOW_ISO, "today": TODAY.isoformat(), "version": "4.11-demo",
            "name": NAME, "birth": BIRTH.isoformat(), "age": AGE,
            "years_to_goal": YEARS_TO_GOAL, "goal": GOAL,
            "last_verify": NOW_ISO,
            "data_through": (TODAY - timedelta(days=2)).isoformat(),
            "demo": True,
            "demo_note": "Toto jsou anonymní ukázková data pro web showcase. Generováno deterministicky se seed=42.",
        },
        "periods": periods,
        "kpis": kpis,
        "portfolio": portfolio,
        "debt": {"total": 85000, "loans": [{"name":"Demo Loan A","balance":85000,"rate":8.9,"monthly":4200,"remaining_months":22}]},
        "krypto_holdings": crypto,
        "tax": {"year": 2025, "dap_required": True, "celkovy_zaklad": 62300},
        "tax_module": tax,
        "penzijko_history": [{"year": y, "vklady": 36000, "stat_prispevek": 4080, "zhodnoceni": 5500}
                             for y in range(2020, 2026)],
        "dividendy_by_month": div_month,
        "monthly_series": monthly,
        "networth_series": networth,
        "expense_categories": expenses,
        "goal_scenarios": goal_sc,
        "goal_baseline_pmt": 22000,
        "semafor": [
            {"category":"Životní rezerva","status":"yellow","value":"55 000 Kč (1.7× výdajů)","note":"Cíl 3-6× provoz. výdajů"},
            {"category":"Operativní cashflow","status":"green","value":"+22 400 Kč/měs","note":"Zdravá úspora"},
            {"category":"Dluhy (D/E)","status":"yellow","value":"85 000 Kč (D/E 0.07)","note":"Zvládnutelné"},
            {"category":"Krypto alokace","status":"yellow","value":"15.0% portfolia","note":"Nad doporučení"},
            {"category":"Daně 2025","status":"green","value":"DAP připraveno","note":"Předběžný odhad 6 865 Kč"},
            {"category":"Savings rate","status":"green","value":"41.3%","note":"Nad doporučených 20%"},
            {"category":"Shoda portfolia","status":"green","value":"Match 100%","note":"Demo - vše v pořádku"},
        ],
        "alerts": [
            {"level":"high","title":"Krypto převáženo","message":"Krypto 15% portfolia. Pro 57letý cíl: <12%. Zvaž rebalancing."},
            {"level":"medium","title":"Splátka pojistky","message":f"Demo pojišťovna - splatka {(TODAY+timedelta(days=8)).isoformat()}, 2 500 Kč"},
            {"level":"low","title":"Lock-in pozice","message":"Z lock-in trackeru: 3 pozice mají <90 dní do osvobození od daně"},
        ],
        "data_quality": {"total_tx": len(txs), "unclassified": 0, "duplicates": 0,
                         "suspicious_count": 2, "verified": len(txs), "duplicate_list": []},
        "transactions": txs,
        "sheets": {
            "Pasky_2025": [
                ["měsíc","hrubá","sociální","zdravotní","záloha daň","čistá"],
                *[[p["month"], p["hruba_mzda"], p["soc_pojisteni"], p["zdrav_pojisteni"], p["zaloha_dan"], p["cista_mzda"]] for p in mk_pasky()]
            ],
            "Portfolio_snap": [
                ["položka","hodnota","třída","riziko"],
                *[[i["name"], i["value"], i["asset_class"], i["risk_level"]] for i in portfolio["items_classified"]]
            ],
        },
        "pasky": pasky,
        "pasky_annual": {"hruba_celkem": sum(p["hruba_mzda"] for p in pasky),
                         "cista_celkem": sum(p["cista_mzda"] for p in pasky)},
        "pasky_match_counts": {"matched": 12, "missing": 0},
        "pasky_missing_months": [],
        "bank_accounts": banks,
        "accounting_checks": [
            {"check":"Mzda <-> bank tx","result":"OK 12/12","status":"ok","impact":"high","doporuceni":"Beze změn",
             "note":"12/12 matched"},
            {"check":"Investice <-> portfolio","result":"OK","status":"ok","impact":"medium","doporuceni":"Beze změn",
             "note":"Match"},
            {"check":"Duplicity tx","result":"OK 0","status":"ok","impact":"low","doporuceni":"Beze změn",
             "note":"0 duplikátů"},
            {"check":"Lock-in tracking","result":"OK 50/50","status":"ok","impact":"medium","doporuceni":"Beze změn",
             "note":"Všechny pozice mají datum nákupu"},
        ],
        "brokers": brokers,
        "lock_in_3y": lock_in,
        "allocations": allocations,
        "ioldp": ioldp,
        "position_tracker": tracker,
        "knowledge_base": {
            "updated": f"{TODAY.isoformat()} (demo)",
            "source": "Demo dataset",
            "deadlines_2026": [
                {"date": "2026-04-15", "akce":"Demo pojistka - roční","castka":5500,"status":"ZAPLACENO"},
                {"date": (TODAY+timedelta(days=8)).isoformat(),"akce":"Auto pojistka - čtvrtletní","castka":2500,"status":"BLÍŽÍ SE"},
                {"date":"2026-04-01","akce":"Daňové přiznání 2025","castka":None,"status":"HOTOVO"},
            ],
            "tax_rates_2026": {"sazba_15":"do 1 582 812 Kč","sazba_23":"nad 1 582 812 Kč"},
            "pension_info": {"nutnost_let_pojisteni":35,"vek_duchodu":65,"predcasne_zalo_let":40},
            "urgent_actions": [
                {"priority":"low","akce":"Pojistka zaplacena","do_kdy":"OK"},
                {"priority":"medium","akce":"Připravit DAP do 1.7","do_kdy":"01.07.2026"},
            ],
        },
        "tax_thresholds_2026": {
            "rok": 2026, "datum_aktualizace": TODAY.isoformat(),
            "krypto": {
                "hodnotovy_test_limit_kc":100000,
                "ytd_prodeje_kc":0,
                "ytd_prodeje_hrube_kc":0,
                "ytd_prodeje_pl_kc":0,
                "ytd_prodeje_pocet":0,
                "ytd_prodeje_per_ucet":[],
                "zbyva_bez_dane_kc":100000,
                "pravidlo":"Příjem z prodeje krypta < 100 000 Kč/rok = bez daně, bez DAP.",
                "pravidlo_kratsi":"<100k = bez daně",
                "casovy_test":"3 roky držby → osvobozeno do limitu 40M Kč/rok.",
                "aktualni_drzba_total_kc": sum(c["value_czk"] for c in crypto),
                "akcni_doporuceni":"Lze prodat až 100k bez DAP.",
                "hodnotovy_test_pravidlo":"<100k Kč/rok hrubé příjmy → osvobozeno",
            },
            "akcie_etf": {
                "casovy_test_3_roky": True,
                "limit_40m_zruseny": True,
                "pozice_osvobozene_pocet": lock_in["stats"]["osvobozeno"],
                "pozice_osvobozene_value_kc": lock_in["stats"]["value_osvobozeno"],
                "pozice_do_roka_pocet": lock_in["stats"]["do_roka"],
                "pozice_do_roka_value_kc": lock_in["stats"]["value_do_roka"],
                "pozice_2_3_roky_pocet": lock_in["stats"].get("STREDNE", 0),
                "pozice_dale_pocet": lock_in["stats"]["dele_jak_rok"],
                "pozice_dale_value_kc": lock_in["stats"]["value_dale"],
            },
        },
        "audit_log": [{
            "ts": NOW_ISO, "today": TODAY.isoformat(),
            "changes": [
                {"field":"meta.today","from":"2026-04-29","to":TODAY.isoformat()},
                {"field":"periods.L12M.end","from":"2026-04-29","to":TODAY.isoformat()},
                {"field":"lock_in_3y.AAPL.status","from":"DALEKO","to":"STŘEDNĚ","days_left":320},
                {"field":"deadlines.Demo pojistka","from":"BLÍŽÍ SE","to":"ZAPLACENO"},
            ],
        }],
    }

# ============================================================
# Replace embedded JSON in HTML
# ============================================================
def replace_embedded(html_path, data):
    text = html_path.read_text(encoding="utf-8")
    marker = "window.__FINANCE__="
    start = text.find(marker)
    if start < 0:
        raise RuntimeError("marker not found")
    json_start = start + len(marker)
    if text[json_start] != "{":
        raise RuntimeError("unexpected char after marker")
    depth, in_str, esc, i, json_end = 0, False, False, json_start, -1
    while i < len(text):
        ch = text[i]
        if in_str:
            if esc: esc = False
            elif ch == "\\": esc = True
            elif ch == '"': in_str = False
        else:
            if ch == '"': in_str = True
            elif ch == "{": depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0: json_end = i + 1; break
        i += 1
    if json_end < 0:
        raise RuntimeError("JSON end not found")
    new_json = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    new_text = text[:json_start] + new_json + text[json_end:]
    html_path.write_text(new_text, encoding="utf-8", newline="")
    return len(new_json)

def main():
    print(f"[demo] Generating full demo dataset (seed=42, today={TODAY.isoformat()})...")
    DEMO_DIR.mkdir(exist_ok=True)
    data = mk_data()
    JSON_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8", newline="\n")
    print(f"[demo] {JSON_PATH.name} ({JSON_PATH.stat().st_size:,} bytes)")
    if HTML_PATH.exists():
        size = replace_embedded(HTML_PATH, data)
        print(f"[demo] {HTML_PATH.name} ({HTML_PATH.stat().st_size:,} bytes, embedded {size:,} bytes JSON)")
    print("[demo] DONE")

if __name__ == "__main__":
    main()
