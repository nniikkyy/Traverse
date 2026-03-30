def match_host(traveler, hosts):
    scored_hosts = []

    for host in hosts:
        score = 0

        if traveler.city == host.city:
            score += 40
        if set(traveler.interests) & set(host.interests):
            score += 30
        if traveler.language in host.languages:
            score += 20
        if host.rating > 4:
            score += 10

        scored_hosts.append((host, score))

    return sorted(scored_hosts, key=lambda x: x[1], reverse=True)[0] if scored_hosts else None
