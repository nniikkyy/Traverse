def detect_scam(price, avg_price):
    if price > avg_price * 1.5:
        return "Possible scam detected"
    return "Price looks fair"
