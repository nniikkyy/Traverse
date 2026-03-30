def match_host(traveler, hosts):
    scored_hosts = []

    for host in hosts:
        score = 0

        if traveler["city"].lower() == host["city"].lower():
            score += 40
        if set(traveler["interests"]) & set(host["interests"]):
            score += 30
        if traveler["language"] in host["languages"]:
            score += 20
        if host["rating"] > 4:
            score += 10

        scored_hosts.append((host, score))

    if not scored_hosts:
        return None

    scored_hosts.sort(key=lambda x: x[1], reverse=True)
    return scored_hosts[0][0]
