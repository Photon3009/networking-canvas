/* The map: every box on the path from your thumb to Google's disks. */
window.WORLD = { w: 2320, h: 900 };

window.NODES = [

/* ── YOUR HOME ─────────────────────────────────────────── */
{
  id:'phone', x:140, y:330, zone:'home', kind:'device', icon:'device',
  title:'Your phone', sub:'192.168.1.7 · a host',
  chapter:'Ch 1 · The Network Edge',
  lead:'Your phone is an <b>end system</b> — a "host" in textbook language. The entire internet exists to move bytes between hosts like this one. It is not part of the network; it sits at the edge of it and asks the network for favours.',
  analogy:{label:'Think of it as', text:'A person standing at the edge of the Indian postal system. You can write letters and drop them in a box. You cannot drive the mail van, sort the mail, or choose which highway it takes — you can only address the envelope well and trust the system.'},
  yours:'Right now your phone holds a private address like <code>192.168.1.7</code> that your Airtel router invented for it. That address is meaningless outside your flat — thousands of other Airtel homes have a device on 192.168.1.7 at this exact moment.',
  sections:[
    {h:'What it actually does', html:'<p>Apps do not speak to the network directly. YouTube asks the operating system to open a <b>socket</b> — a door identified by four things: your IP, a port the OS picks at random (say <code>51343</code>), the server IP, and the server port (<code>443</code> for HTTPS). Every packet carries that four-tuple so replies find their way back to the right app.</p><p>Your phone runs the top four layers of the stack in software and the bottom one in the Wi-Fi chip. It is a tiny router too: it decides whether a packet goes over Wi-Fi, over 5G, or over a VPN.</p>'},
    {h:'Why "edge" matters', html:'<p>Chapter 1 splits the internet into <b>edge</b> (hosts, access networks) and <b>core</b> (routers that move packets between them). The edge is where the intelligence sits — retransmissions, congestion control, encryption all happen on your phone and on Google\'s server. The core is deliberately dumb and fast. That split is why the internet scaled and the old telephone network did not.</p>'}
  ],
  facts:[['Role','end system / host'],['Private address','192.168.1.7'],['Ephemeral port','49152–65535'],['Layers it runs','all 5']]
},
{
  id:'wifi', x:380, y:410, zone:'home', kind:'link', icon:'wave',
  title:'The Wi-Fi air link', sub:'802.11ax · 5 GHz · shared air',
  chapter:'Ch 7 · Wireless Links',
  lead:'The only part of your journey with no wire. Your data becomes a radio wave at around 5 GHz and travels maybe 10 metres through a wall to the router.',
  analogy:{label:'Think of it as', text:'A single room where everyone must speak one at a time. Before you talk you listen; if someone else is mid-sentence you wait a random moment and try again. That is literally the Wi-Fi rule — CSMA/CA. A wired link is a private phone line; Wi-Fi is a crowded room.'},
  yours:'Your Airtel router broadcasts two networks, one on 2.4 GHz and one on 5 GHz. 2.4 GHz punches through walls but is shared with your microwave, your neighbours and Bluetooth. 5 GHz is much faster and far cleaner, but it dies two rooms away. That is physics: higher frequency, more data, less penetration.',
  sections:[
    {h:'Why your 300 Mbps plan shows 180 Mbps on Wi-Fi', html:'<ul><li><b>It is half-duplex.</b> Only one device transmits at a time, including the router. Your "300 Mbps" link speed is a raw figure; roughly half of it disappears into taking turns, acknowledgements and headers.</li><li><b>Everyone shares.</b> Your phone, TV, laptop and your neighbour\'s router on the same channel all queue for the same air.</li><li><b>Weak signal means slow encoding.</b> Far from the router, the radio drops to a sturdier, slower modulation so bits survive the noise. Two bars is not "the same internet, weaker" — it is genuinely a slower link.</li></ul>'},
    {h:'The hidden terminal problem', html:'<p>Two devices on opposite sides of the flat can both hear the router but not each other, so both think the air is free and transmit at once. Their signals collide at the router and both are lost. Wi-Fi handles this with RTS/CTS — asking the router to reserve airtime before sending — which is also why a far-away device slows everything down for everyone.</p>'}
  ],
  facts:[['Bands','2.4 / 5 / 6 GHz'],['Access method','CSMA/CA'],['Frame carries','MAC addresses'],['Range, 5 GHz','~10–15 m indoors']]
},
{
  id:'router', x:640, y:450, zone:'home', kind:'device', icon:'router',
  title:'The white box on your wall', sub:'ONT + router + switch + AP',
  chapter:'Ch 4 · NAT and DHCP',
  lead:'Airtel calls it a router. It is really <b>four machines in one plastic case</b>, and almost every confusing thing about home networking comes from people not separating them.',
  analogy:{label:'Think of it as', text:'The reception desk of your building. It converts what arrives (light in a fibre) into what people inside use, hands out flat numbers to new residents, writes down who sent which courier so replies can be returned to the right flat, and shouts announcements down the corridor.'},
  yours:'Airtel ships models like the Nokia G2425G-A, Dragonpath 707GR1 or ZTE ZXHN F670L. Log in at <code>192.168.1.1</code> and you will find all four functions in one menu. If your plan includes a landline, there is a fifth: a voice port running VoIP.',
  sections:[
    {h:'The four machines inside', html:'<ul><li><b>ONT (Optical Network Terminal)</b> — the media converter. Laser light in the fibre becomes electrical Ethernet. This is the only part that is specific to fibre.</li><li><b>Router</b> — moves packets between your home network and Airtel, and performs NAT so your many devices share one public address.</li><li><b>Switch</b> — the 4 yellow LAN ports. It learns which MAC address lives on which port and forwards frames only there.</li><li><b>Access point</b> — the Wi-Fi radio.</li></ul>'},
    {h:'DHCP: how your phone got an address', html:'<p>When your phone joins, it knows nothing — not its own address, not the router\'s. So it shouts. <b>DISCOVER</b> broadcast to everyone, the router replies <b>OFFER</b> with a free address, the phone says <b>REQUEST</b>, the router says <b>ACK</b>. In that one exchange your phone receives its IP, the subnet mask, the default gateway and the DNS server to use. Four packets, and a stranger becomes a citizen.</p>'},
    {h:'NAT: the reason it all works', html:'<p>Your home has many devices and Airtel gives you one address. So the router rewrites every outgoing packet: source <code>192.168.1.7:51343</code> becomes <code>&lt;your WAN IP&gt;:62001</code>, and it writes that swap into a translation table. When the reply comes back to port 62001 it looks up the table and sends it to the phone. Nothing outside your home has ever heard of 192.168.1.7.</p>'}
  ],
  facts:[['Gateway address','192.168.1.1'],['LAN block','192.168.1.0/24 (RFC 1918)'],['Usable hosts','254'],['Lease time','typically 24 h'],['Roles','ONT · router · switch · AP']]
},
{
  id:'tv', x:140, y:530, zone:'home', kind:'device', icon:'device',
  title:'Smart TV', sub:'192.168.1.4 · same subnet',
  chapter:'Ch 6 · Ethernet and Switches',
  lead:'A second host on the same LAN — useful because it shows what "local" really means. Your phone can reach the TV without a single packet leaving the building.',
  analogy:{label:'Think of it as', text:'Two flats on the same floor. To pass a note you walk down the corridor. You do not post it to the sorting office in Mumbai and wait for it to come back.'},
  yours:'When you cast a video from your phone to this TV, the traffic goes phone → router → TV and stops there. Airtel never sees it. Casting works even when your internet is down, which is a good way to prove to yourself that the LAN and the internet are two different things.',
  sections:[
    {h:'How the phone knows it is local', html:'<p>The phone has address <code>192.168.1.7</code> and mask <code>255.255.255.0</code>. It ANDs the destination with the mask: if the first three octets match its own, the destination is on the same wire and it sends the frame <b>directly</b>. If not, it sends the frame to the default gateway instead. That single comparison is the whole routing decision on a host.</p>'},
    {h:'ARP: address to address', html:'<p>To build the frame it needs the TV\'s <b>MAC address</b> — a 48-bit number burned into the hardware, like <code>3c:5a:b4:11:8f:02</code>. So it broadcasts: "who has 192.168.1.4?" The TV answers with its MAC and the phone caches it for a few minutes. IP addresses are where you live; MAC addresses are who you are.</p>'}
  ],
  facts:[['Link','Ethernet or Wi-Fi'],['Frame addressing','48-bit MAC'],['Broadcast domain','your whole LAN'],['Hops to reach','1']]
},
{
  id:'laptop', x:380, y:640, zone:'home', kind:'device', icon:'device',
  title:'Laptop on a cable', sub:'Cat-6 · 1 Gbps full duplex',
  chapter:'Ch 6 · Link Layer Services',
  lead:'The control experiment. Same router, same plan, same everything — except copper instead of air. Almost always faster and far steadier.',
  analogy:{label:'Think of it as', text:'A dedicated corridor versus a shared room. Nobody else walks in it, nobody talks over you, and you can speak and listen at the same time.'},
  yours:'If you ever want to know whether your Airtel line is the problem or your Wi-Fi is, plug a laptop into a yellow LAN port and run a speed test. If the cable gives you your full plan speed and Wi-Fi does not, the fibre is fine and your radio environment is the bottleneck. This one test resolves most "Airtel is slow" complaints.',
  sections:[
    {h:'What the link layer promises', html:'<p>Ethernet gives you framing (where does a packet start and end), physical addressing, and error <i>detection</i> via a 32-bit CRC in the frame\'s trailer. Note detection, not correction: a corrupted frame is silently thrown away. Fixing it is somebody else\'s job, higher up the stack — that is layering in action.</p>'},
    {h:'Full duplex killed collisions', html:'<p>Old Ethernet shared one wire and used CSMA/CD — listen, and if two stations collide, back off. Modern switched Ethernet gives every port its own pair of wires in each direction, so a collision is impossible and the whole algorithm is dead code. Wi-Fi never got this luxury; air cannot be split into private corridors.</p>'}
  ],
  facts:[['Cable','Cat-5e / Cat-6, 4 pairs'],['Max length','100 m'],['MTU','1500 bytes'],['Error check','CRC-32 in trailer'],['Collisions','none — full duplex']]
},

/* ── CELLULAR DETOUR ───────────────────────────────────── */
{
  id:'tower', x:620, y:150, zone:'access', kind:'infra', icon:'tower',
  title:'The 4G / 5G tower', sub:'eNodeB / gNodeB · n78 band',
  chapter:'Ch 7 · Cellular Networks',
  lead:'When you walk out of your flat, your phone drops the Wi-Fi and attaches to a base station on a rooftop or a monopole — and its whole identity on the network changes in about a second.',
  analogy:{label:'Think of it as', text:'Wi-Fi is your home landline; cellular is a walkie-talkie network with thousands of relay masts. The clever part is not the radio — it is that you can walk between masts mid-call and nobody notices the handover.'},
  yours:'Airtel\'s 5G in India mostly runs on band <b>n78 around 3.5 GHz</b> for city coverage, plus <b>26 GHz mmWave</b> in a few dense pockets — enormous speed, almost no range, blocked by your own hand. Airtel launched 5G in non-standalone mode, meaning the 5G radio rides on top of the existing 4G core; Jio went standalone with a pure 5G core. Same spectrum auction, two different engineering bets.',
  sections:[
    {h:'Why coverage is drawn as hexagons', html:'<p>Each tower serves a cell. Neighbouring cells must use different frequencies or they interfere — and hexagons tile a plane with the fewest gaps and the most even distance to the centre. Frequencies are then re-used a few cells away. "Cellular" is named after this tiling, not after phones.</p>'},
    {h:'The handover', html:'<p>Your phone constantly measures the signal from nearby towers and reports it. When a neighbour gets clearly better, the network <i>tells</i> the phone to switch and forwards buffered packets to the new tower. Your IP address does not change, so your TCP connection survives. That is the single hardest problem in mobile networking, and it happens dozens of times on a drive to work.</p>'},
    {h:'Why 5G is fast', html:'<ul><li><b>More spectrum</b> — wider channels, up to 100 MHz instead of 20.</li><li><b>Massive MIMO</b> — 64 antennas beamforming at your phone specifically instead of blasting the whole sector.</li><li><b>Shorter slots</b> — the radio schedules in fractions of a millisecond, which is where the low latency comes from.</li></ul>'}
  ],
  facts:[['Airtel 5G bands','n78 (3.5 GHz), n258 (26 GHz)'],['Deployment','NSA (rides on 4G core)'],['Typical 5G latency','20–40 ms'],['Cell radius, 3.5 GHz','~300 m – 1 km'],['Handover time','tens of ms']]
},
{
  id:'mcore', x:1100, y:150, zone:'core', kind:'infra', icon:'cloud',
  title:'The mobile core', sub:'5GC / EPC · AMF · UPF',
  chapter:'Ch 7 · Cellular Networks',
  lead:'A tower is only a radio. The intelligence — who you are, what you paid for, and where your packets exit to the internet — lives in a core network in a datacentre, often hundreds of kilometres away.',
  analogy:{label:'Think of it as', text:'The tower is the security guard at the gate; the core is head office. The guard checks you in, but head office holds your file, decides your privileges, and signs off every bill.'},
  yours:'Your SIM card is the key. It holds a secret that head office also holds, and the two prove to each other they know it without ever sending it. That is why a stolen phone cannot use your number, and why a cloned SIM is such a serious attack.',
  sections:[
    {h:'The two halves', html:'<ul><li><b>Control plane</b> (AMF, SMF) — authentication, registration, setting up and tearing down your session, deciding your speed tier. Signalling only; your data never touches it.</li><li><b>Data plane</b> (UPF) — the actual packet gateway. This is where your mobile data becomes ordinary internet traffic and gets a public-facing address.</li></ul><p>Separating them is the whole point of the 5G core: the data plane can be pushed out to the edge of the network for low latency, while control stays central.</p>'},
    {h:'Why your IP follows you', html:'<p>Your packets are wrapped inside a tunnel from the tower to the UPF. When you move to a new tower, the tunnel is re-pointed but the inner address stays the same. The internet only ever sees the UPF\'s exit point, so as far as any server is concerned you have not moved at all.</p>'},
    {h:'It rejoins the same backbone', html:'<p>Broadband and mobile are different front doors into the same house. Both Airtel Xstream fibre and Airtel 5G hand their traffic to the same AS9498 backbone. From that point on, the journey is identical.</p>'}
  ],
  facts:[['4G core','EPC — MME, SGW, PGW'],['5G core','5GC — AMF, SMF, UPF'],['Your credentials','on the SIM'],['Data tunnel','GTP-U'],['Exits to internet at','the UPF / PGW']]
},

/* ── THE LAST MILE ─────────────────────────────────────── */
{
  id:'splitter', x:900, y:450, zone:'access', kind:'infra', icon:'split',
  title:'The fibre splitter', sub:'passive · 1:32 · no power',
  chapter:'Ch 1 · The Network Edge',
  lead:'Somewhere on a pole or in a green box on your street sits a small sealed unit with no electricity running to it. It takes one fibre from the exchange and splits the light into 32 strands — one of them yours.',
  analogy:{label:'Think of it as', text:'A prism, or a water main branching into 32 house connections. It is not a machine; it has no brain, no power supply and nothing to fail. That is exactly why fibre broadband became cheap enough to sell to every flat.'},
  yours:'This is the <b>P in GPON — passive</b>. Airtel runs one expensive fibre from the exchange to your locality, then splits it across your building and the ones near you. It means your bill covers 1/32nd of that fibre rather than all of it. It also means your neighbours are, physically, on your wire.',
  sections:[
    {h:'How 32 homes share one strand without chaos', html:'<p><b>Downstream</b>, the exchange simply broadcasts everything to all 32 homes on one wavelength, and each ONT is told to only unwrap the frames addressed to it — the rest are encrypted and ignored. <b>Upstream</b> would collide, so the exchange assigns each home precise time slots, microseconds long, and your ONT only fires its laser inside its slot. That is TDMA.</p><p>Two wavelengths share the same glass in opposite directions: <b>1490 nm coming down, 1310 nm going up</b>. One strand, two conversations, no interference.</p>'},
    {h:'So is it really shared?', html:'<p>Yes — GPON carries about <b>2.488 Gbps down and 1.244 Gbps up</b> across all 32 homes. If everyone streamed 4K at 3 a.m. it would matter. In practice usage is bursty and a plan of 100–300 Mbps oversubscribes comfortably. If your speeds sag every evening at 9 p.m. but the line is clean, contention on this splitter group is a fair suspect.</p>'}
  ],
  facts:[['Technology','GPON (ITU G.984)'],['Split ratio','1:32, sometimes 1:64'],['Downstream total','2.488 Gbps shared'],['Upstream total','1.244 Gbps shared'],['Downstream light','1490 nm'],['Upstream light','1310 nm'],['Power needed','none']]
},
{
  id:'olt', x:1140, y:450, zone:'access', kind:'infra', icon:'rack',
  title:'The exchange OLT', sub:'Optical Line Terminal · 2–8 km away',
  chapter:'Ch 1 · The Network Edge',
  lead:'The first Airtel-owned machine with a power cable. It sits in a local exchange building in your city, terminates the fibre from your street, and is the first point where your traffic becomes ordinary IP packets on a chassis.',
  analogy:{label:'Think of it as', text:'Your area\'s post office. Everything from the surrounding few kilometres arrives here, gets sorted, and leaves on a much bigger truck.'},
  yours:'When Airtel support says "there is an outage in your area", they usually mean this box, its uplink, or the fibre between it and you. A cut cable between the splitter and the OLT takes out exactly 32 homes — which is why your neighbour is always down at the same time as you.',
  sections:[
    {h:'What it does', html:'<ul><li>Converts light to electrical signals and back.</li><li><b>Ranging</b> — measures the exact distance to every ONT and compensates, so a home 500 m away and one 4 km away can both hit their time slot to within nanoseconds.</li><li><b>Dynamic bandwidth allocation</b> — reallocates upstream slots every couple of milliseconds based on who actually has data waiting.</li><li>Aggregates hundreds of subscribers onto 10G or 100G uplinks.</li></ul>'},
    {h:'Why distance matters here', html:'<p>Light in glass travels at about 200,000 km/s — two-thirds of the speed in vacuum. Your 4 km to the exchange costs 20 microseconds each way. It is nothing. <b>Propagation delay only starts to dominate at continental scale</b>, and that single fact explains why a cached video feels instant and an uncached one from Oregon does not.</p>'}
  ],
  facts:[['Serves','hundreds to thousands of homes'],['Uplink','10G / 100G'],['Distance to you','typically 2–8 km'],['Light speed in fibre','~200,000 km/s'],['Delay over 4 km','~20 µs']]
},
{
  id:'bng', x:1380, y:450, zone:'core', kind:'infra', icon:'gate',
  title:'BNG + CGNAT', sub:'the turnstile and the second NAT',
  chapter:'Ch 4 · NAT and DHCP',
  lead:'The Broadband Network Gateway is where you stop being a wire and start being a <b>customer</b>. It authenticates your line, applies your plan\'s speed limit, counts your usage, and — the part that will one day frustrate you — puts you behind a second layer of address translation.',
  analogy:{label:'Think of it as', text:'The turnstile at a metro station. The track was always there; the turnstile is what checks your card, decides whether you are on the ordinary pass or the premium one, and logs your entry.'},
  yours:'Your 300 Mbps plan is not a physical property of your fibre — the fibre could do gigabits. It is a number configured here, and it is why an upgrade takes effect in minutes with no engineer visit.',
  sections:[
    {h:'Carrier-Grade NAT, and the problem it causes', html:'<p>India has far more internet users than IPv4 addresses, so Airtel cannot give every home a public one. Instead your router gets an address from the <b>shared range 100.64.0.0/10</b>, and the BNG translates hundreds of customers onto one real public IP.</p><p>Consequence: your traffic is NAT\'d <b>twice</b>. Outbound is fine. Inbound is impossible — nobody on the internet can start a connection to you, because there is no unique address to aim at. This is precisely why:</p><ul><li>Your home CCTV DVR cannot be reached from your office.</li><li>Port forwarding in your router settings silently does nothing.</li><li>Hosting a game server at home fails.</li><li>Some torrent clients only ever connect passively.</li></ul><p>The fix Airtel sells is a <b>static public IP</b> as a paid add-on. The fix everyone else uses is a relay in the middle — which is what Tailscale, ngrok and every cloud CCTV app actually are.</p>'},
    {h:'Check it yourself in ten seconds', html:'<p>Open your router\'s status page and read its WAN address. If it starts with <code>100.64.</code> through <code>100.127.</code>, you are behind CGNAT. Compare it with what <code>whatismyip</code> reports — if they differ, that gap is the carrier NAT.</p>'}
  ],
  facts:[['Full name','Broadband Network Gateway'],['CGNAT range','100.64.0.0/10 (RFC 6598)'],['Session protocol','PPPoE or IPoE'],['Enforces','your plan\'s speed cap'],['Inbound connections','blocked by design']]
},

/* ── AIRTEL'S BACKBONE ─────────────────────────────────── */
{
  id:'backbone', x:1640, y:450, zone:'core', kind:'cloud', icon:'cloud',
  title:'Airtel\'s backbone', sub:'AS9498 · the network core',
  chapter:'Ch 5 · Routing Algorithms',
  lead:'A national mesh of routers and long-haul fibre joining every Airtel exchange in India. This is the "core" of Chapter 1 — a small number of very large routers whose only job is to look at a destination and pick the next hop, millions of times a second.',
  analogy:{label:'Think of it as', text:'The national highway network. Your street, your city road and the highway are all roads, but the highway has no shops on it. It exists purely to move things between cities as fast as possible.'},
  yours:'Airtel is <b>AS9498</b> — an Autonomous System, one of roughly 75,000 independently run networks that together are the internet. It peers with several thousand other networks. "The internet" is not an organisation; it is these autonomous systems agreeing to carry each other\'s traffic.',
  sections:[
    {h:'How a router decides, in the time it takes to read one header', html:'<p>A core router does not know the route to your destination. It knows only <b>the next hop</b>. It reads the destination IP, finds the longest matching prefix in its forwarding table, and pushes the packet out of that port. No memory of the packet is kept. No promise is made. That is why the core can be so fast — and why reliability has to be invented at the edges.</p><p>Inside Airtel, routes are computed by an interior protocol such as <b>OSPF</b>: every router floods a description of its own links to everyone, so all of them build the same map of the network, then each runs <b>Dijkstra\'s shortest path</b> on it. That is the link-state approach — everyone has the map and computes independently.</p>'},
    {h:'The two flavours of routing', html:'<ul><li><b>Link-state (OSPF, IS-IS)</b> — flood the map, compute the whole path. Converges fast, needs everyone to be honest. Used <i>inside</i> one company\'s network.</li><li><b>Path-vector (BGP)</b> — tell your neighbours which destinations you can reach and through which chain of networks. Used <i>between</i> companies, because it allows policy: Airtel can prefer a route that is longer but cheaper.</li></ul><p>Inside a network you optimise for speed. Between networks you optimise for money and contracts. That distinction is the real reason there are two kinds of routing protocol.</p>'},
    {h:'Where queuing delay comes from', html:'<p>If packets arrive at a router faster than the outgoing link can drain them, they wait in a buffer. If the buffer fills, packets are <b>dropped</b> — and that drop is the signal the whole internet uses to mean "slow down". Loss is not a malfunction. It is the congestion signalling mechanism.</p>'}
  ],
  facts:[['Airtel ASN','AS9498'],['Jio ASN','AS55836'],['Google ASN','AS15169'],['Interior routing','OSPF / IS-IS + MPLS'],['Exterior routing','BGP-4'],['Global routing table','~1 million IPv4 prefixes']]
},

/* ── DNS ───────────────────────────────────────────────── */
{
  id:'resolver', x:1380, y:720, zone:'core', kind:'infra', icon:'book',
  title:'Airtel\'s DNS resolver', sub:'recursive · UDP port 53',
  chapter:'Ch 2 · DNS',
  lead:'Before a single byte of video moves, your phone has to turn <code>www.youtube.com</code> into a number. It asks this machine, and this machine does all the running around on your behalf.',
  analogy:{label:'Think of it as', text:'Calling directory enquiries. You do not know the number; you know the name. You ask one helpful person, and they go and find out — checking with several offices if they must — and come back with a number. They also remember it for a while, so the next caller gets an instant answer.'},
  yours:'Your phone was told by DHCP to use <code>192.168.1.1</code>, your router, which forwards to Airtel\'s resolvers. If you set <code>8.8.8.8</code> (Google) or <code>1.1.1.1</code> (Cloudflare) instead, you are simply hiring a different directory service — and handing them your browsing history in exchange. It rarely makes video faster; it is mostly about who sees your queries and which censorship list applies.',
  sections:[
    {h:'Recursive vs authoritative', html:'<p>There are two jobs with confusingly similar names. Your <b>recursive resolver</b> knows nothing but is willing to ask around. <b>Authoritative servers</b> know one slice of the truth and never ask anyone. Every DNS lookup is one resolver doing the legwork against several authoritative servers.</p>'},
    {h:'Caching is what makes it survive', html:'<p>Every answer carries a <b>TTL</b> — how many seconds it may be remembered. Your browser caches, your OS caches, your router caches, Airtel\'s resolver caches. A popular name like youtube.com is answered from Airtel\'s memory in a millisecond; the full walk down the tree happens only for the first person to ask after the TTL expires.</p><p>The flip side: when a company changes its IP address, the old one lingers in caches worldwide for the TTL. That is why migrations are announced days ahead with the TTL dropped to 60 seconds first.</p>'},
    {h:'The uncomfortable bit', html:'<p>Classic DNS is plaintext UDP. Your ISP can see every name you look up, and blocking a website in India is usually implemented right here — the resolver simply refuses or lies. <b>DNS over HTTPS</b> encrypts the query, which is why turning it on in your browser sometimes makes a blocked site reappear.</p>'}
  ],
  facts:[['Protocol','UDP 53 (TCP for big answers)'],['Query type for an IP','A (IPv4) / AAAA (IPv6)'],['Cached answer','< 1 ms'],['Cold full lookup','30–120 ms'],['Encrypted versions','DoH, DoT']]
},
{
  id:'dnstree', x:1640, y:720, zone:'net', kind:'infra', icon:'tree',
  title:'Root · TLD · authoritative', sub:'the name hierarchy',
  chapter:'Ch 2 · DNS',
  lead:'DNS is not one database. It is a tree, deliberately split so that no single organisation has to know every name on earth — and so no single failure takes the whole thing down.',
  analogy:{label:'Think of it as', text:'Finding a person by address, not by a national phone book. "Which country?" → India. "Which state?" → Maharashtra. "Which building?" → this one. Each level only knows who to ask next, never the final answer.'},
  yours:'Read <code>www.youtube.com</code> backwards — that is the order it is resolved in. There is even an invisible dot after .com: the root.',
  sections:[
    {h:'The walk, in full', html:'<div class="term">resolver → <span class="c">root server</span>\n  "who handles .com?"\n  ← "ask a.gtld-servers.net"\n\nresolver → <span class="c">.com TLD server</span>\n  "who handles youtube.com?"\n  ← "ask ns1.google.com"\n\nresolver → <span class="c">ns1.google.com</span>\n  "what is www.youtube.com?"\n  ← "142.250.x.x, TTL 300"</div><p>Three round trips, then the answer is cached and the next million people get it instantly.</p>'},
    {h:'The root is 13 names but hundreds of machines', html:'<p>There are 13 root server <i>addresses</i> — a limit that came from fitting a reply into one 512-byte UDP packet. But each is <b>anycast</b>: the same IP is announced from hundreds of locations worldwide, and BGP naturally routes you to the nearest. NIXI hosts root server instances inside India, so your root query never leaves the country.</p>'},
    {h:'Why the answer you get is not the answer I get', html:'<p>Authoritative servers for big services reply differently depending on where the query came from. Ask for youtube.com from Airtel in India and you get the address of a Google cache <i>inside Airtel</i>. Ask from Germany and you get a German one. DNS is the steering wheel of every CDN on the internet.</p>'}
  ],
  facts:[['Root server addresses','13 (a–m.root-servers.net)'],['Actual root instances','1,900+ via anycast'],['Levels','root → TLD → authoritative'],['Record for IPv4','A'],['Record for IPv6','AAAA']]
},

/* ── THE OPEN INTERNET ─────────────────────────────────── */
{
  id:'ggc', x:1910, y:300, zone:'net', kind:'dc', icon:'cache',
  title:'Google\'s cache, inside Airtel', sub:'GGC · the plot twist',
  chapter:'Ch 2 · The Web and CDNs',
  lead:'Here is the thing the textbook diagram never shows you: <b>your YouTube video probably never leaves India, and very likely never leaves Airtel\'s network.</b> Google racks its own servers inside Airtel\'s datacentres and pre-loads them with the videos your city watches.',
  analogy:{label:'Think of it as', text:'Amul does not ship every packet of butter from one factory when you order it. They stock the kirana shop at the end of your lane. A CDN is exactly that, for bytes — and Google went one step further and put its shop inside your ISP\'s building.'},
  yours:'This is why a trending video starts in half a second while an obscure 2009 upload buffers. The popular one is 8 ms away in a rack in Mumbai. The obscure one has to be fetched from further out. Same plan, same fibre, wildly different experience — and nothing about your connection changed.',
  sections:[
    {h:'Why both sides want this', html:'<ul><li><b>Airtel</b> avoids paying for the same video to cross an expensive international link ten thousand times, and its customers get a faster service it did not have to build.</li><li><b>Google</b> gets its content closer to users than any competitor, and controls the experience end to end.</li></ul><p>Both parties win, so the hardware is usually provided free. Netflix runs the same scheme with Open Connect. This is why "the internet" behaves less like one global mesh and more like a set of content islands sitting inside consumer ISPs.</p>'},
    {h:'The numbers that matter', html:'<p>Cached in Airtel Mumbai: <b>5–15 ms</b> round trip. Google\'s Mumbai datacentre over the exchange: <b>20–40 ms</b>. Oregon over a submarine cable: <b>200–250 ms</b>. Nothing you can buy improves the third number — the speed of light is the speed of light. The only real fix is not to make the journey, which is precisely what this box is for.</p>'},
    {h:'The second-order effect', html:'<p>This is also why big platforms are hard to compete with. A startup\'s video loads from one cloud region; YouTube\'s loads from a machine in the same building as your ISP\'s router. Infrastructure, not features, is a large part of the moat.</p>'}
  ],
  facts:[['Called','Google Global Cache / Open Connect'],['Physically located','inside Airtel datacentres'],['Round trip','5–15 ms'],['What it holds','the content your region watches'],['Cost to the ISP','usually free hardware']]
},
{
  id:'ixp', x:1910, y:540, zone:'net', kind:'infra', icon:'exchange',
  title:'The internet exchange', sub:'NIXI · DE-CIX · Extreme-IX',
  chapter:'Ch 5 · BGP and Peering',
  lead:'A neutral building — in India usually in Mumbai — where hundreds of networks plug into a common switch so they can hand traffic to each other directly instead of paying a third party to carry it.',
  analogy:{label:'Think of it as', text:'A wholesale market. Instead of every shop couriering goods to every other shop across town, everyone rents a stall in one hall and simply walks the goods across the floor. Cheaper for everyone, and far faster.'},
  yours:'Before NIXI existed, an email from an Airtel user in Delhi to a BSNL user in Delhi could genuinely travel to the United States and back, because that was where the two networks met. Domestic exchanges were built to stop exactly that. India now has <b>31 internet exchange points</b>, and around 85% of the roughly 2,950 active Indian networks connect through one.',
  sections:[
    {h:'Peering vs transit — the money question', html:'<ul><li><b>Transit</b> is buying access to the whole internet from a bigger network. You pay per megabit. This is how a small ISP reaches everywhere.</li><li><b>Peering</b> is two networks swapping traffic directly, usually with <b>no money changing hands</b>, because both benefit roughly equally.</li></ul><p>A large network like Airtel peers with everyone it can and buys transit only for what is left over. Every peering session it adds makes its service faster <i>and</i> cheaper — an unusually aligned incentive.</p>'},
    {h:'What is actually in the building', html:'<p>A room full of racks, a big layer-2 switch fabric, and a lot of fibre. Each member router speaks <b>BGP</b> across it, announcing "here are the address prefixes I can reach". Take one member out and the internet reroutes around it in seconds — that is the "autonomous" in Autonomous System doing its job.</p>'},
    {h:'Mumbai\'s outsized role', html:'<p>Mumbai is India\'s internet capital, not by policy but by geography: it is where the submarine cables come ashore. Cable landings attract datacentres, datacentres attract exchanges, exchanges attract content networks, and content networks attract more cables. Roughly 17 major subsea systems land around it.</p>'}
  ],
  facts:[['IXPs in India','31 (July 2026)'],['Active Indian networks','~2,950'],['Connected via an IXP','~85%'],['Major Mumbai IXPs','NIXI, DE-CIX, Extreme-IX, AMS-IX'],['Peering cost','usually settlement-free']]
},
{
  id:'subsea', x:1910, y:780, zone:'net', kind:'link', icon:'wave',
  title:'The submarine cable', sub:'glass on the seabed',
  chapter:'Ch 1 · Physical Media',
  lead:'Not satellites. Around <b>99% of intercontinental internet traffic</b> runs through fibre-optic cables lying on the ocean floor, each about as thick as a garden hose, carrying strands of glass thinner than your hair.',
  analogy:{label:'Think of it as', text:'The sea route that container ships still use for almost everything, even in the age of air freight. Unglamorous, enormous capacity, and the thing everything else quietly depends on.'},
  yours:'Airtel is not just a customer of these — it owns some. The <b>i2i cable</b> runs 3,200 km from Chennai to Singapore and is wholly owned by Bharti Airtel. When you stream something hosted in Singapore, there is a real chance your packets travel on Airtel glass the entire way.',
  sections:[
    {h:'Why not satellites', html:'<p>A geostationary satellite sits 35,786 km up. Light needs about 120 ms just to get there and back — before anything is processed. A fibre from Mumbai to Marseille is far longer than the straight-line distance but still beats that comfortably, and carries thousands of times more data. Low-orbit constellations like Starlink change the latency maths, but not the capacity maths.</p>'},
    {h:'They break, often', html:'<p>Ship anchors and fishing trawlers cut cables regularly — well over a hundred faults a year worldwide. Repair means sending a specialised ship, grappling the cable off the seabed, and splicing it, which takes days to weeks. You almost never notice, because traffic reroutes onto other cables within seconds via BGP. When several cables in the Red Sea are damaged at once, though, India feels it.</p>'},
    {h:'The delay you cannot buy away', html:'<p>Light in glass covers about 200 km per millisecond. Mumbai to the US west coast by cable is roughly 20,000 km of route, giving about <b>200 ms round trip at the absolute physical minimum</b>. No plan upgrade touches this. It is why gamers care about which region a server is in, and why video calls to the US feel subtly different from calls within India.</p>'}
  ],
  facts:[['Share of global traffic','~99%'],['Airtel-owned example','i2i, Chennai–Singapore, 3,200 km'],['Cables landing near Mumbai','~17 major systems'],['Speed in glass','~200 km per ms'],['India ↔ US west, RTT','200–250 ms'],['Repair time','days to weeks']]
},
{
  id:'gdc', x:2170, y:540, zone:'net', kind:'dc', icon:'server',
  title:'Google\'s datacentre', sub:'asia-south1 · Mumbai',
  chapter:'Ch 2 · Network Applications',
  lead:'The destination. A building full of racks, each rack full of ordinary machines, in front of which sits a load balancer deciding which of them answers you. "The cloud" is this, and it is disappointingly physical.',
  analogy:{label:'Think of it as', text:'A giant call centre. You dial one number; you have no idea which of the ten thousand people on the floor picks up, and you do not need to. The number is the promise; the person is an implementation detail.'},
  yours:'Google runs cloud regions in Mumbai and Delhi. When an Indian app tells you it "stores your data in India", this class of building is what they mean — and under Indian data rules for payments and personal data, that location is often a legal requirement rather than a performance choice.',
  sections:[
    {h:'One address, thousands of machines', html:'<p>The IP address DNS gave you belongs to a load balancer, not a server. It terminates your TLS connection, picks a healthy backend, and forwards your request. If that machine dies mid-video, another takes over and you see nothing. <b>Anycast</b> takes it further: the very same IP is announced from datacentres worldwide, and BGP delivers you to the nearest.</p>'},
    {h:'The client–server bargain', html:'<p>Servers have permanent addresses and wait; clients have temporary addresses and initiate. That asymmetry is why you can reach Google but Google cannot reach you — and it is the same asymmetry CGNAT deepens at your end. Peer-to-peer systems exist precisely to escape it, which is why they have to work so hard at "NAT traversal".</p>'},
    {h:'What the server sees of you', html:'<p>Not your name, not your address — just a public IP that you share with hundreds of other Airtel customers, plus whatever your browser volunteers. Everything else that identifies you is built on top, in cookies and accounts, at the application layer.</p>'}
  ],
  facts:[['Google regions in India','Mumbai, Delhi'],['What answers the IP','a load balancer'],['Same IP, many sites','anycast'],['Server port','443 (HTTPS)'],['Round trip from Airtel','20–40 ms']]
},
{
  id:'origin', x:2170, y:780, zone:'net', kind:'dc', icon:'server',
  title:'The origin, overseas', sub:'us-west1 · Oregon',
  chapter:'Ch 1 · Delay and Throughput',
  lead:'Where the bytes live when nobody nearby has asked for them recently. Every cache in the world is ultimately a copy of something that started in a building like this one.',
  analogy:{label:'Think of it as', text:'The central warehouse. The kirana shop near your house is stocked from it, but if you want something obscure, someone has to go all the way there and bring it back — and you will feel every kilometre.'},
  yours:'Load an Indian news site and a small American blog side by side and watch the difference. The first is probably cached in Mumbai. The second makes the full crossing, and the ~200 ms round trip has to happen several times over — DNS, TCP, TLS, then the page, then each image. That multiplication is why distant sites feel slow out of proportion to their size.',
  sections:[
    {h:'Where time actually goes', html:'<p>Chapter 1 splits delay into four parts, and it is worth knowing which one you are fighting:</p><ul><li><b>Processing</b> — a router reading the header. Microseconds. Ignore it.</li><li><b>Queuing</b> — waiting in a buffer behind other packets. Varies wildly; this is what congestion feels like.</li><li><b>Transmission</b> — pushing the bits onto the wire. Packet size ÷ link speed. Small on fast links.</li><li><b>Propagation</b> — distance ÷ speed of light. Fixed, unavoidable, and dominant over oceans.</li></ul>'},
    {h:'Bandwidth is not speed', html:'<p>These are two different things and conflating them causes most misunderstandings about "fast internet". <b>Throughput</b> is how wide the pipe is; <b>latency</b> is how long the pipe is. Upgrading from 100 to 300 Mbps widens the pipe — it does nothing to the 200 ms crossing. A big download finishes sooner; a video call to the US feels exactly the same.</p><p>And end-to-end throughput is always the minimum of every link on the path. Your gigabit Wi-Fi does not help if the server is throttling you to 5 Mbps.</p>'}
  ],
  facts:[['Round trip from India','200–250 ms'],['Route length','~20,000 km of cable'],['Delay types','processing, queuing, transmission, propagation'],['Throughput','= the slowest link'],['Fix for distance','cache closer, not buy faster']]
}
];

/* ── edges: from, to, label, zone, alt(dashed) ──────────── */
window.EDGES = [
  ['phone','wifi',    'Wi-Fi · 5 GHz',            'home'],
  ['wifi','router',   '802.11ax',   'home'],
  ['tv','router',     'Cat-6 · 1 Gbps',           'home'],
  ['laptop','router', 'Cat-6 · 1 Gbps',           'home'],
  ['phone','tower',   'LTE / 5G NR', 'access', true],
  ['tower','mcore',   'backhaul fibre',           'access'],
  ['mcore','backbone','same backbone, other door','core', true],
  ['router','splitter','fibre · 1310/1490 nm','access'],
  ['splitter','olt',  '1 fibre ÷ 32 homes','access'],
  ['olt','bng',       '10G uplink',               'access'],
  ['bng','backbone',  'speed-capped','core'],
  ['bng','resolver',  'DNS query · UDP 53',       'core', true],
  ['resolver','dnstree','root → .com → ns1.google.com','net', true],
  ['backbone','ggc',  'never leaves AS9498',      'core'],
  ['backbone','ixp',  'BGP peering',              'core'],
  ['backbone','subsea','long haul',               'core', true],
  ['ixp','gdc',       'no money changes hands',  'net'],
  ['subsea','origin', '~20,000 km · 200 ms RTT',  'net']
];

/* ── the journey: what actually happens on one tap ──────── */
window.JOURNEY = [
  { at:['phone'], title:'You tap play',
    text:'The YouTube app asks Android to open <code>https://www.youtube.com/watch?v=…</code>. Nothing has left your phone yet — and the app has no idea where YouTube <i>is</i>. It only knows a name.' },

  { at:['phone','router'], title:'Your phone already has an address',
    text:'Moments after joining the Wi-Fi, DHCP gave it four things: the address <code>192.168.1.7</code>, the mask <code>255.255.255.0</code>, the gateway <code>192.168.1.1</code>, and a DNS server. Without that fourth item, the next step is impossible.' },

  { move:['phone','router'], title:'Step one is a question, not a request',
    text:'The phone builds a tiny UDP packet to port 53: <b>“what is the address of www.youtube.com?”</b> It goes to the router, because that is what DHCP told it to use as its resolver.' },

  { move:['bng','resolver'], at:['resolver'], title:'Airtel’s resolver does the legwork',
    text:'The router forwards the question up the line to Airtel’s recursive resolver. If somebody else on Airtel asked for youtube.com in the last few minutes, the answer is already in memory and comes back in under a millisecond.' },

  { move:['resolver','dnstree'], title:'On a cold miss, it walks the tree',
    text:'Root server → “ask the .com servers”. The .com servers → “ask ns1.google.com”. Google’s authoritative server → an actual IP. Three questions, and the answer is deliberately chosen to be close to you.' },

  { move:['resolver','bng'], at:['phone'], title:'A number comes back',
    text:'Something like <code>142.250.195.x</code>, with a short TTL. The phone can finally address an envelope. Everything up to here was the phone book; the call has not started.' },

  { at:['phone','router'], title:'ARP: who is 192.168.1.1, physically?',
    text:'The destination is not on the local subnet, so the packet must go to the gateway. To build the frame the phone needs the router’s <b>MAC address</b>, so it broadcasts <b>“who has 192.168.1.1?”</b> The router answers, and the answer is cached for minutes.' },

  { move:['phone','router'], title:'TCP handshake — SYN, SYN-ACK, ACK',
    text:'Before any data, both ends agree to talk and exchange starting sequence numbers. One full round trip, spent entirely on saying hello. QUIC (HTTP/3), which YouTube prefers, folds this together with encryption to save a trip.' },

  { at:['phone','ggc'], title:'TLS handshake — and the padlock',
    text:'Your phone sends a ClientHello naming <code>www.youtube.com</code>. The server returns a certificate signed by a CA your phone already trusts. They derive a shared key. Only now is anything encrypted — and only now does the real request go out.' },

  { move:['phone','router'], title:'Finally: GET /watch?v=…',
    text:'The actual HTTP request, wrapped in TLS, wrapped in TCP, wrapped in IP, wrapped in a Wi-Fi frame. Five layers of envelope for one sentence.' },

  { at:['router'], title:'At the router: NAT rewrites the sender',
    text:'Source <code>192.168.1.7:51343</code> is rewritten to the router’s WAN address and a new port, and the swap is written into a table. This is the first of <b>two</b> translations your packet will suffer.' },

  { move:['router','splitter'], title:'The packet becomes light',
    text:'The ONT fires an infrared laser at 1310 nm down a glass strand — but only inside the microsecond time slot the exchange assigned it, because 31 neighbours share this fibre.' },

  { move:['splitter','olt'], title:'Through the passive splitter',
    text:'A sealed box on your street with no power combines your light with 31 other homes’ onto one fibre to the exchange. Nothing is decided here. It is a prism doing a job.' },

  { move:['olt','bng'], title:'The exchange turns it back into packets',
    text:'The OLT, two to eight kilometres away, converts light to electrical signals and hands ordinary IP packets upstream. Your 4 km cost about 20 microseconds — completely irrelevant compared to what is coming.' },

  { at:['bng'], title:'CGNAT: translated a second time',
    text:'The BNG checks your session, enforces your plan’s speed cap, and rewrites the source address again — hundreds of Airtel customers now share one public IP. <b>This is why nothing on the internet can start a connection to your home.</b>' },

  { move:['bng','backbone'], title:'A routing decision, not a route',
    text:'Each core router reads the destination, finds the longest matching prefix, and picks a next hop. Nobody along the way knows the full path. Nobody remembers your packet afterwards.' },

  { move:['backbone','ggc'], title:'The plot twist: it never leaves Airtel',
    text:'The address DNS handed you belongs to a <b>Google server racked inside an Airtel datacentre</b>. Your video was pre-loaded there because your city watches it. Round trip: 5–15 ms. No ocean involved.' },

  { at:['ggc','phone'], title:'Bytes come back, and TCP feels its way',
    text:'The sender starts cautiously and doubles its rate each round trip until a packet is lost — then halves it. That sawtooth is why a video starts at 360p and sharpens a few seconds later. Nothing is broken; that is the algorithm finding your true capacity.' },

  { at:['ixp','subsea','origin'], title:'And if it had <i>not</i> been cached…',
    text:'Over the exchange in Mumbai to Google’s Indian datacentre — 20–40 ms. Or down a submarine cable to Oregon — 200–250 ms, fixed by the speed of light. Same plan, same fibre, twenty times the wait. Distance is the one thing money cannot fix.' }
];
