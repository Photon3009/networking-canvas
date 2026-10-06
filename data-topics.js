/* Protocol layers + every remaining concept, as clickable cards. */

window.LAYERS = [
{
  id:'l5', n:5, name:'Application', unit:'message', zone:'net',
  protos:'HTTP · HTTPS · DNS · SMTP · QUIC · WebRTC · SSH',
  blurb:'What the two programs are actually saying to each other.',
  chapter:'Ch 2 · Application Layer',
  lead:'The only layer you ever consciously meet. It defines the <i>vocabulary</i> two programs use — the words, the grammar, and what each word obliges the other side to do.',
  analogy:{label:'Think of it as', text:'The language of the letter. Whether it is Hindi or English, a complaint or an invoice, is entirely between the writer and the reader. The postal system never opens it and would not understand it if it did.'},
  yours:'<code>GET /watch?v=abc HTTP/1.1</code> is the whole of it: a verb, a thing, a version. Everything underneath exists purely to deliver that one sentence intact.',
  sections:[
    {h:'Two architectures, not one', html:'<ul><li><b>Client–server</b> — one side has a permanent address and waits; the other initiates. YouTube, WhatsApp, banking, essentially everything you use.</li><li><b>Peer-to-peer</b> — every participant is both. Torrents, and the media path of a good video call. It scales beautifully because capacity grows with users, but it fights NAT constantly.</li></ul>'},
    {h:'What an application protocol must pin down', html:'<p>The message types, their syntax, their meaning, and the rules about who speaks when. HTTP is deliberately <b>stateless</b> — the server remembers nothing between requests — which is why cookies and tokens had to be invented to fake a memory on top of it.</p>'},
    {h:'The version you are probably using', html:'<ul><li><b>HTTP/1.1</b> — one request at a time per connection; browsers opened six connections to fake parallelism.</li><li><b>HTTP/2</b> — many streams multiplexed over one TCP connection, but one lost packet stalls all of them.</li><li><b>HTTP/3 (QUIC)</b> — the same idea over UDP, with encryption and the handshake fused in. YouTube and most Google properties use this with you today.</li></ul>'}
  ],
  facts:[['Unit','message'],['Addressing','names and URLs'],['Runs on','your phone and the server only'],['HTTPS port','443']]
},
{
  id:'l4', n:4, name:'Transport', unit:'segment / datagram', zone:'core',
  protos:'TCP · UDP · QUIC',
  blurb:'Gets the message to the right program, and decides whether to guarantee it arrives.',
  chapter:'Ch 3 · Transport Layer',
  lead:'The network layer delivers to a <i>machine</i>. Your phone is running forty apps. The transport layer\'s first job is to deliver to the right <b>program</b> — and its second is to decide how much it promises about delivery.',
  analogy:{label:'Think of it as', text:'The flat number, and the choice of postage. The courier gets the parcel to the building; the flat number gets it to the right door. Registered post with a signature and a re-send on failure is TCP. Dropping it in the box and walking away is UDP.'},
  yours:'Your phone can hold a YouTube stream, a WhatsApp connection and a Gmail sync at the same time over one IP address because each has a different <b>port</b>. The four-tuple — source IP, source port, destination IP, destination port — uniquely names every conversation.',
  sections:[
    {h:'TCP: the one that promises', html:'<p>Numbers every byte, acknowledges what arrives, retransmits what does not, reorders what arrives out of sequence, and slows down when the network complains. From above it looks like a clean pipe. Underneath, packets are being lost and resent constantly and you never find out.</p>'},
    {h:'UDP: the one that does not', html:'<p>Adds ports and a checksum to IP and stops there. No handshake, no retransmission, no ordering, no slowing down. That sounds useless until you want it: for a live call, a packet that arrives 400 ms late is worse than one that never arrives. DNS uses it because a whole query fits in one packet and asking again is cheaper than a handshake.</p>'},
    {h:'QUIC: the pragmatic escape', html:'<p>TCP is implemented inside operating systems, so improving it takes a decade. Google built QUIC on top of UDP instead — so it ships in the app and can be updated weekly. It gives you TCP-grade reliability plus mandatory encryption, a faster handshake, and no head-of-line blocking between streams. HTTP/3 is QUIC. Your YouTube almost certainly runs on it.</p>'}
  ],
  facts:[['Unit','segment (TCP) / datagram (UDP)'],['Addressing','port numbers, 0–65535'],['TCP header','20 bytes minimum'],['UDP header','8 bytes'],['Well-known ports','< 1024']]
},
{
  id:'l3', n:3, name:'Network', unit:'packet', zone:'access',
  protos:'IP · ICMP · BGP · OSPF · NAT',
  blurb:'Gets a packet from any machine on earth to any other, one hop at a time.',
  chapter:'Ch 4 & 5 · Network Layer',
  lead:'The layer that makes an inter-net possible: one addressing scheme that works across every kind of underlying link, so a Wi-Fi frame in Delhi and a submarine cable to Oregon are part of the same journey.',
  analogy:{label:'Think of it as', text:'The address on the envelope. It never changes anywhere along the way, even as the envelope moves from a postman\'s bag to a van to a plane to another van. Everything underneath changes at every stage; this does not.'},
  yours:'This layer makes exactly one promise: <b>best effort</b>. It will try. It may drop your packet, deliver it late, or deliver it out of order, and it will not tell you. Every guarantee you enjoy was built above this by software on your phone.',
  sections:[
    {h:'Data plane vs control plane', html:'<ul><li><b>Data plane</b> — the per-packet work. Read destination, match the longest prefix, forward. Done in hardware, nanoseconds per packet.</li><li><b>Control plane</b> — building the tables in the first place, by running OSPF and BGP with other routers. Done in software, over seconds.</li></ul><p>Chapters 4 and 5 are split along exactly this line, and it is the most useful distinction in the whole subject.</p>'},
    {h:'Longest prefix match', html:'<p>A table might hold <code>142.250.0.0/16</code> and <code>142.250.195.0/24</code>. A packet for 142.250.195.7 matches both — the router picks the <b>more specific</b> one. This lets the internet be described in broad strokes with precise exceptions, which is how a million-route table stays manageable.</p>'},
    {h:'TTL: the thing that stops loops', html:'<p>Every IP packet carries a Time To Live, decremented at each router. Hit zero and the packet is discarded and an ICMP error is returned. Without it, one misconfigured route would have packets circling forever. <b>Traceroute is a beautiful abuse of this</b>: send packets with TTL 1, 2, 3… and each router in turn is forced to identify itself.</p>'}
  ],
  facts:[['Unit','packet / datagram'],['Addressing','32-bit IPv4, 128-bit IPv6'],['Header','20 bytes minimum'],['Guarantee','best effort — none'],['Loop protection','TTL, max 255']]
},
{
  id:'l2', n:2, name:'Link', unit:'frame', zone:'home',
  protos:'Ethernet · Wi-Fi 802.11 · GPON · ARP',
  blurb:'Moves a frame across one hop — one wire, one radio, one strand of glass.',
  chapter:'Ch 6 · Link Layer and LANs',
  lead:'Each individual hop of the journey has its own rules, its own addresses and its own idea of what a packet looks like. The link layer is whatever the current hop happens to use — and it is <b>rebuilt from scratch at every single hop</b>.',
  analogy:{label:'Think of it as', text:'The sack the letter rides in, which changes at every leg. Your local postman\'s bag, then a crate on a truck, then a container on a plane. The letter inside is untouched; the sack is thrown away and replaced at each transfer point.'},
  yours:'Phone to router is an 802.11 frame. Router to splitter is a GPON frame of laser pulses. Exchange onward is Ethernet. Same IP packet inside all three, three completely different wrappers.',
  sections:[
    {h:'MAC addresses are identity, IP is location', html:'<p>A 48-bit MAC like <code>3c:5a:b4:11:8f:02</code> is burned into the hardware at the factory — the first half identifies the manufacturer. It never changes and it means nothing outside your local network. An IP address, by contrast, describes where you currently are and changes when you move. You need both for the same reason you need a name and an address.</p>'},
    {h:'Switching is learning, not routing', html:'<p>A switch starts knowing nothing. When a frame arrives, it notes "MAC X is on port 3". Unknown destination? It floods to every port and learns from the reply. Within seconds it has a table and forwards frames only where they need to go. No configuration, no protocol, no intelligence — just memory.</p>'},
    {h:'Error detection and its deliberate limits', html:'<p>Every Ethernet frame ends with a 32-bit CRC. If the maths does not work out, the frame is <b>silently discarded</b> — not repaired, not reported. On a fibre or copper link, errors are so rare that asking the sender to try again is cheaper than carrying correction codes. On a noisy wireless link the calculation flips, which is why Wi-Fi does acknowledge and retry frames itself.</p>'}
  ],
  facts:[['Unit','frame'],['Addressing','48-bit MAC'],['Ethernet payload','up to 1500 bytes'],['Error check','CRC-32, detect only'],['Scope','one hop']]
},
{
  id:'l1', n:1, name:'Physical', unit:'bits', zone:'access',
  protos:'copper · fibre · radio',
  blurb:'Turns a one into something real: a voltage, a pulse of light, a radio wave.',
  chapter:'Ch 1 · Physical Media',
  lead:'The layer where information stops being an abstraction. A bit has to become a physical phenomenon that can cross a room, a street or an ocean and still be recognisable at the other end.',
  analogy:{label:'Think of it as', text:'The van, the plane, the ship. Utterly unglamorous, completely indispensable, and the only part of the internet you can trip over.'},
  yours:'Your single tap becomes, in order: a 5 GHz radio wave, an electrical signal on copper inside your router, infrared laser pulses at 1310 nm down a glass strand, and then — if the content really is overseas — light travelling for thousands of kilometres along the seabed.',
  sections:[
    {h:'Why fibre won', html:'<ul><li><b>Bandwidth</b> — light has vastly more usable frequency than electrical signals on copper.</li><li><b>Distance</b> — copper degrades in metres, fibre in kilometres.</li><li><b>Immunity</b> — glass does not care about your microwave, a lift motor, or lightning.</li><li><b>Multiplexing</b> — many wavelengths share one strand simultaneously, which is why one fibre can carry your download and your neighbour\'s upload at once.</li></ul>'},
    {h:'Guided and unguided', html:'<p>Copper and fibre are <b>guided</b> media: the signal is trapped in a physical path, so it is predictable and private. Radio is <b>unguided</b>: it spreads everywhere, which is how your phone works untethered and also why Wi-Fi must be encrypted and must take turns. Every wireless annoyance traces back to this one property.</p>'},
    {h:'The number that governs everything', html:'<p>Light in glass: about <b>200,000 km/s</b>, two-thirds of its speed in vacuum, because glass is denser. That figure sets the floor on latency for every long-distance interaction anyone will ever have. Mumbai to Oregon and back cannot go below roughly 200 ms, no matter what is bought or built.</p>'}
  ],
  facts:[['Unit','bits / symbols'],['Copper','electrical voltage'],['Fibre','1310 & 1550 nm light'],['Wi-Fi','2.4 / 5 / 6 GHz radio'],['Speed in glass','~200,000 km/s']]
}
];

window.TOPICS = [
{
  group:'Foundations', zone:'core',
  sub:'What the thing is, before any protocol shows up.',
  items:[
  {
    id:'what-is', title:'What the internet actually is', zone:'core',
    one:'Not a company, not a place, not a cloud — about 75,000 independent networks that agreed on one address format.',
    chapter:'Ch 1 · What is the Internet?',
    lead:'There is no head office. The internet is what you get when tens of thousands of separately owned networks — Airtel, Jio, a university, Google, a datacentre in Chennai — all agree to speak IP and to carry each other\'s traffic under commercial agreements.',
    analogy:{label:'Think of it as', text:'The world\'s courier networks. India Post, DHL, a local tempo operator. Nobody owns "shipping". They interconnect, hand parcels to each other at agreed points, and settle up. A parcel from Delhi to Chile crosses four companies and you deal with one.'},
    yours:'You buy from Airtel. Airtel peers with Google, buys transit from larger carriers, and exchanges traffic at Mumbai. Your ₹800 a month bought you a seat at that table — nothing more, and nothing less.',
    sections:[
      {h:'Two ways to describe it, both true', html:'<ul><li><b>Nuts and bolts</b> — hosts, links, routers, protocols. Hardware and rules.</li><li><b>Service</b> — a platform that lets distributed applications exist. Infrastructure for programs to talk.</li></ul><p>The first explains how it works. The second explains why anyone built it.</p>'},
      {h:'A protocol is just an agreement', html:'<p>A protocol defines the format and order of messages, and the actions taken on sending or receiving them. That is the entire definition. "Hello" → "Hi" → "What time is it?" → "2 o\'clock" is a protocol. The internet works because thousands of organisations that do not trust each other implement the same agreements identically.</p>'},
      {h:'The end-to-end principle', html:'<p>The founding design decision: <b>keep the network simple and push intelligence to the edges.</b> The core only forwards packets. Reliability, encryption, ordering, retries — all at the endpoints. This is why the internet could carry the web, then video, then video calls, then whatever comes next, without the middle ever being upgraded to understand any of it.</p>'}
    ],
    facts:[['Autonomous systems','~75,000'],['Networks in India','~2,950 active'],['Common language','the IP protocol'],['Governance','IETF, ICANN, regional registries'],['Owner','nobody']]
  },
  {
    id:'edge-core', title:'Edge and core', zone:'core',
    one:'Hosts and access networks at the rim; a small number of very fast routers in the middle.',
    chapter:'Ch 1 · Edge & Core',
    lead:'Divide the internet in two and everything gets easier to reason about. The <b>edge</b> is end systems and the access networks that attach them. The <b>core</b> is the mesh of routers that carries traffic between edges.',
    analogy:{label:'Think of it as', text:'Streets and highways. Streets have houses, shops, speed bumps and complexity. Highways have none of that — no destinations of their own, just enormous throughput between cities.'},
    yours:'Your phone, TV and laptop are the edge. Your Wi-Fi, your fibre and Airtel\'s GPON are the access network. Airtel\'s national backbone and everything past the exchange is the core.',
    sections:[
      {h:'Access networks come in flavours', html:'<ul><li><b>FTTH / GPON</b> — fibre to your building, shared passively. Your Airtel connection.</li><li><b>Cable (DOCSIS)</b> — coaxial from the TV era, shared with your whole neighbourhood.</li><li><b>DSL</b> — the old telephone copper. Slow, dying.</li><li><b>Cellular</b> — 4G and 5G.</li><li><b>Enterprise Ethernet</b> — a leased line, unshared, expensive, with an actual uptime guarantee.</li></ul>'},
      {h:'Why the distinction pays off', html:'<p>Problems at the edge are yours to solve — Wi-Fi placement, a bad cable, an old router. Problems in the core are invisible and solved without you, usually in seconds, by rerouting. Knowing which half you are in saves a lot of pointless troubleshooting.</p>'}
    ],
    facts:[['Edge','hosts + access networks'],['Core','routers + long-haul links'],['Your access type','GPON fibre to the home'],['Core behaviour','store and forward']]
  },
  {
    id:'switching', title:'Packet switching vs circuit switching', zone:'core',
    one:'Why the internet beat the telephone network: nobody reserves anything.',
    chapter:'Ch 1 · The Network Core',
    lead:'The single design choice that made the modern internet possible — and it was genuinely controversial when it was made.',
    analogy:{label:'Think of it as', text:'Circuit switching is booking an entire lane of the highway from Delhi to Mumbai for your car, for the whole trip, even while you stop for tea. Packet switching is just driving, sharing every road with everyone, sometimes hitting traffic.'},
    yours:'The old landline reserved a full 64 kbps path end to end for the whole call, used or not. Your WhatsApp call sends packets only when you speak. That is why your ₹800 gives you bandwidth that would have been unthinkable to lease as a circuit.',
    sections:[
      {h:'Statistical multiplexing is the win', html:'<p>Users are bursty. You load a page, then read for two minutes doing nothing. If ten users each need 1 Mbps but only 10% of the time, a circuit network must provision 10 Mbps. A packet network can serve them comfortably on 2 Mbps, because their bursts rarely coincide. <b>Sharing the unused gaps is where all the efficiency comes from.</b></p>'},
      {h:'What you give up', html:'<p>Guarantees. With no reservation, occasionally everyone bursts at once, queues fill, and packets are dropped. A circuit never degraded — it was either up at full quality or unavailable. The internet chose "usually excellent, occasionally worse" over "always mediocre, sometimes refused", and that trade has held up for fifty years.</p>'},
      {h:'Store and forward', html:'<p>A router must receive an <i>entire</i> packet before it can start sending it on. So each hop adds a delay of packet-size ÷ link-speed. This is why very long packets are not always better, and why a 10-hop path has a floor even on an idle network.</p>'}
    ],
    facts:[['Internet uses','packet switching'],['Old phone network','circuit switching'],['Key technique','statistical multiplexing'],['Cost','no guarantees, possible loss'],['Per hop','store and forward']]
  },
  {
    id:'delay', title:'Delay, loss and throughput', zone:'core',
    one:'Four kinds of delay, only one of which you can do anything about.',
    chapter:'Ch 1 · Delay, Loss, Throughput',
    lead:'"Slow internet" is at least four different problems wearing the same coat. Separating them is the most practically useful thing in Chapter 1.',
    analogy:{label:'Think of it as', text:'A road trip. Reading the signboard is processing. Sitting in a jam is queuing. The time to get all your luggage into the car is transmission. The sheer distance to Chennai is propagation. Only the jam responds to leaving earlier.'},
    yours:'Ping a site in Mumbai and you might see 12 ms. Ping one in the US and you will see 220 ms. Upgrade your Airtel plan from 100 to 300 Mbps and both numbers stay exactly where they were — because you widened the pipe, and latency is about length.',
    sections:[
      {h:'The four delays', html:'<ul><li><b>Processing</b> — router examines the header. Microseconds. Never your problem.</li><li><b>Queuing</b> — waiting behind other packets in a buffer. Zero to enormous. <b>This is the one that varies</b>, and congestion is exactly this.</li><li><b>Transmission</b> — pushing bits onto the wire: packet size ÷ link rate. Bigger on slow links.</li><li><b>Propagation</b> — distance ÷ speed of light in the medium. Fixed by geography, permanently.</li></ul>'},
      {h:'Loss is a feature', html:'<p>When a router\'s buffer is full, arriving packets are dropped. That sounds like failure but it is the internet\'s only congestion signal: the sender notices the missing acknowledgement and slows down. A network with infinite buffers and no loss would be <i>worse</i>, because senders would never learn to back off — which is precisely the bufferbloat problem.</p>'},
      {h:'Throughput is the bottleneck, nothing else', html:'<p>End-to-end throughput equals the slowest link on the path. Your gigabit Wi-Fi, 300 Mbps fibre and Google\'s 100 Gbps uplink are all irrelevant if one hop in between is saturated at 8 Mbps. Chains, weakest links.</p>'},
      {h:'Jitter, the one video calls care about', html:'<p>Jitter is the <i>variation</i> in delay. A steady 150 ms is a fine video call. Bouncing between 30 and 300 ms is an unusable one, because the receiver cannot decide how much to buffer. Consistency beats raw speed for anything real-time.</p>'}
    ],
    facts:[['Processing delay','microseconds'],['Queuing delay','0 to hundreds of ms'],['Transmission','size ÷ link rate'],['Propagation','distance ÷ ~200,000 km/s'],['Throughput','= min(all links)'],['Loss means','buffer overflow']]
  }
]},

{
  group:'Application layer', zone:'net',
  sub:'The protocols you actually name when you talk about the internet.',
  items:[
  {
    id:'http', title:'HTTP and the web', zone:'net',
    one:'A stateless request–response protocol that accidentally became the universal API.',
    chapter:'Ch 2 · The Web and HTTP',
    lead:'One side asks for a thing by name, the other returns it or says why not. That is HTTP in full, and its refusal to be cleverer than that is exactly why it swallowed the internet.',
    analogy:{label:'Think of it as', text:'Ordering at a counter, not table service. You walk up, ask for one item, get it, and leave. The next time you come back, the person behind the counter has no memory of you — unless you show them a token you were given earlier. That token is a cookie.'},
    yours:'Opening one YouTube page fires off hundreds of these — the HTML, then scripts, styles, thumbnails, and then a continuous stream of video chunks. "Loading a page" is never one request.',
    sections:[
      {h:'The shape of it', html:'<div class="term"><span class="c">GET</span> /watch?v=abc HTTP/1.1\nHost: www.youtube.com\nUser-Agent: Mozilla/5.0 …\nAccept-Language: en-IN\n\n<span class="c">HTTP/1.1 200 OK</span>\nContent-Type: text/html\nContent-Length: 48210\nSet-Cookie: VISITOR_INFO=…</div><p>Methods: <b>GET</b> fetch, <b>POST</b> submit, <b>PUT</b> replace, <b>DELETE</b> remove. Status families: 2xx worked, 3xx moved, <b>4xx you erred</b> (404, 403), <b>5xx the server erred</b> (500, 502, 503). That 4xx/5xx split tells you whose problem it is.</p>'},
      {h:'Stateless, and the workaround', html:'<p>HTTP deliberately remembers nothing between requests, which makes servers easy to scale — any machine can answer any request. Logins therefore had to be faked on top: the server sends a <b>cookie</b>, your browser returns it with every subsequent request, and the illusion of a session is maintained entirely by that echo.</p>'},
      {h:'How video really works', html:'<p>YouTube does not send you "a video file". It sends <b>chunks of a few seconds</b>, each available at several qualities, listed in a manifest. Your player measures how fast chunks are arriving and picks the next quality accordingly. That is <b>adaptive bitrate streaming</b>, and it is why quality drifts up and down mid-video without ever stopping.</p>'}
    ],
    facts:[['Port','80 plaintext, 443 TLS'],['State','none — stateless'],['Sessions via','cookies and tokens'],['HTTP/3 runs on','QUIC over UDP'],['Video technique','adaptive bitrate chunks']]
  },
  {
    id:'dns-deep', title:'DNS, in depth', zone:'net',
    one:'A distributed database that answers billions of questions a second and has never been switched off.',
    chapter:'Ch 2 · DNS',
    lead:'Humans want names, routers need numbers. DNS bridges them — and because it decides <i>which</i> number you get, it quietly became the steering wheel for load balancing, failover and censorship alike.',
    analogy:{label:'Think of it as', text:'Directory enquiries, run as a franchise. No single office holds every number; each holds one slice and knows which office to try next. You only ever speak to your local branch, and it does the chasing.'},
    yours:'Every site you visit begins with a DNS lookup. If your internet feels like it "hangs then suddenly works", a slow or failing resolver is a prime suspect — the page cannot even start until the name resolves.',
    sections:[
      {h:'Record types worth knowing', html:'<ul><li><b>A</b> — name to IPv4. <b>AAAA</b> — name to IPv6.</li><li><b>CNAME</b> — this name is an alias for that one. How CDNs hook themselves in.</li><li><b>MX</b> — where to deliver mail for this domain.</li><li><b>NS</b> — which servers are authoritative for this zone.</li><li><b>TXT</b> — free text; used for domain ownership proofs and anti-spam records.</li></ul>'},
      {h:'It does far more than look-up', html:'<ul><li><b>Load balancing</b> — return several addresses, or rotate them.</li><li><b>Geographic steering</b> — answer differently based on where the query came from. This is how a CDN sends you to Mumbai and someone else to Frankfurt.</li><li><b>Failover</b> — stop returning the address of a datacentre that is down.</li></ul>'},
      {h:'Why it is a control point', html:'<p>Website blocking in India is usually done at the ISP resolver: ask Airtel\'s DNS for a blocked domain and you get a refusal or a redirect rather than the real address. Nothing is filtered at the packet level. Switching to <code>1.1.1.1</code> or enabling DNS-over-HTTPS often bypasses it — which tells you exactly how thin that layer of enforcement is.</p>'},
      {h:'And a weak point', html:'<p>Classic DNS is unauthenticated. <b>Cache poisoning</b> means feeding a resolver a false answer so everyone using it goes to an attacker\'s server. <b>DNSSEC</b> signs records cryptographically to prevent this; adoption is still partial, decades in.</p>'}
    ],
    facts:[['Transport','UDP 53, TCP for large'],['Structure','hierarchical, delegated'],['Cached for','the record\'s TTL'],['Encrypted','DoH / DoT'],['Signed','DNSSEC']]
  },
  {
    id:'cdn', title:'CDNs and caching', zone:'net',
    one:'The internet works at scale because most content is not where you think it is.',
    chapter:'Ch 2 · Web Caching & CDNs',
    lead:'A content delivery network is thousands of copies of the same content, spread worldwide, with DNS quietly pointing each visitor at their nearest copy. It is the single biggest reason the modern web feels fast.',
    analogy:{label:'Think of it as', text:'Regional warehouses versus one factory. Amazon does not ship your order from a single building in Bengaluru. It predicted demand and stocked a warehouse near you months ago. A CDN does the same with bytes.'},
    yours:'For you on Airtel this is not theoretical: Google racks its own caches <i>inside Airtel\'s datacentres</i>. A popular video reaches you in 5–15 ms and never touches an international link. It is also why your speed test to a Mumbai server looks great while a small foreign website still feels sluggish.',
    sections:[
      {h:'Who benefits, and why it is free', html:'<ul><li><b>You</b> — dramatically lower latency.</li><li><b>Airtel</b> — does not pay to drag the same video across an ocean ten thousand times.</li><li><b>Google</b> — controls the experience and beats anyone who cannot do this.</li></ul><p>All three interests align, so the cache hardware is usually supplied to the ISP at no cost.</p>'},
      {h:'Layers of cache before you even leave home', html:'<p>Browser cache → OS cache → your router → the ISP → the CDN edge → the origin. A request stops at the first layer that already has a fresh copy. Most requests never travel far, which is the only reason the origin servers survive.</p>'},
      {h:'What this does to the shape of the internet', html:'<p>The classic picture — a mesh where anyone reaches anyone across many hops — is increasingly wrong for consumer traffic. A large share of what you load comes from a handful of companies\' hardware sitting <i>inside</i> your ISP. The internet has flattened into content islands, and that is an economic fact as much as a technical one.</p>'}
    ],
    facts:[['Cached inside Airtel','5–15 ms'],['Google DC, Mumbai','20–40 ms'],['Overseas origin','200–250 ms'],['Steered by','DNS and anycast'],['Examples','Google GGC, Netflix Open Connect, Cloudflare']]
  },
  {
    id:'sockets', title:'Sockets, ports and P2P', zone:'net',
    one:'How one IP address serves forty apps at once, and why peer-to-peer is so hard.',
    chapter:'Ch 2 · Principles of Network Applications',
    lead:'A socket is the door between your program and the network. Everything an application does on the internet happens through one.',
    analogy:{label:'Think of it as', text:'A building with one street address and many flats. The postman needs the address to find the building; the flat number decides who actually gets the parcel. IP is the building, the port is the flat.'},
    yours:'Your phone has one address on the Wi-Fi but forty conversations open. Each is distinguished by a port number, and the combination of source IP, source port, destination IP and destination port is unique across all of them.',
    sections:[
      {h:'Ports worth recognising', html:'<ul><li><b>53</b> DNS · <b>80</b> HTTP · <b>443</b> HTTPS</li><li><b>22</b> SSH · <b>25/587</b> mail · <b>3306</b> MySQL · <b>5432</b> Postgres</li></ul><p>Anything under 1024 is "well known" and reserved. Your outgoing connections use a random high port, which the OS picks and discards afterwards.</p>'},
      {h:'Client–server versus peer-to-peer', html:'<p>Servers wait at fixed addresses; clients initiate from temporary ones. P2P makes every participant both, so capacity grows as users join instead of collapsing — which is why torrents get <i>faster</i> when a file is popular while a server gets slower.</p>'},
      {h:'And why P2P fights your router', html:'<p>NAT only builds a return path when <i>you</i> initiate. A peer who wants to connect to you first has no way in — doubly so behind Airtel\'s CGNAT. So P2P apps use <b>NAT traversal</b>: both peers connect out to a public rendezvous server (STUN), learn each other\'s external address and port, and punch through simultaneously. When even that fails, everything is relayed through a middle server (TURN), which is slower and costs the app company real money. Every video-call app you use contains this machinery.</p>'}
    ],
    facts:[['Socket identity','4-tuple'],['Port range','0–65535'],['Ephemeral ports','49152–65535'],['Traversal tools','STUN, TURN, ICE'],['CGNAT effect','inbound impossible']]
  }
]}
];

window.TOPICS.push({
  group:'Transport layer', zone:'core',
  sub:'Turning a network that promises nothing into one you can build on.',
  items:[
  {
    id:'rdt', title:'How reliability is built from nothing', zone:'core',
    one:'The network loses and reorders packets. TCP hides that with three ideas.',
    chapter:'Ch 3 · Reliable Data Transfer',
    lead:'IP makes no promises at all. Yet your file downloads byte-perfect every time. That gap is bridged by three deceptively simple mechanisms, invented in order, each fixing the previous one\'s flaw.',
    analogy:{label:'Think of it as', text:'Reading a long number to someone over a bad phone line. You number each chunk, they repeat back what they got, and if you hear nothing in a few seconds you say it again. That is the entire protocol.'},
    yours:'On your fibre, loss is rare. On Wi-Fi at the far end of the flat, or on 5G in a lift, packets vanish constantly — and you never notice, because this machinery is quietly re-sending them dozens of times a minute.',
    sections:[
      {h:'The three ideas', html:'<ul><li><b>Sequence numbers</b> — number every byte, so the receiver can reorder and spot a gap.</li><li><b>Acknowledgements</b> — the receiver reports what it has. TCP uses <i>cumulative</i> ACKs: "I have everything up to byte 5000".</li><li><b>Timeouts</b> — if no ACK arrives within an estimated round-trip time, assume loss and resend.</li></ul>'},
      {h:'Why stop-and-wait had to die', html:'<p>Send one packet, wait for the ACK, send the next. Correct, and catastrophically slow: on a 200 ms link you would manage a handful of packets per second regardless of bandwidth. The fix is <b>pipelining</b> — keep many packets in flight at once. The number allowed in flight is the <b>window</b>, and sizing that window correctly is the entire remaining problem.</p>'},
      {h:'Fast retransmit', html:'<p>Waiting for a timeout wastes a full round trip. So TCP watches for <b>three duplicate ACKs</b> — the receiver saying "still missing 5000" three times while later packets keep arriving. That is strong evidence one specific packet was lost, and the sender resends it immediately without waiting.</p>'}
    ],
    facts:[['Ordering','sequence numbers'],['Confirmation','cumulative ACKs'],['Loss detection','timeout or 3 duplicate ACKs'],['Efficiency','pipelining / sliding window']]
  },
  {
    id:'tcp', title:'TCP itself', zone:'core',
    one:'A connection, a byte stream, and a promise — built on a network that offers none.',
    chapter:'Ch 3 · TCP',
    lead:'TCP gives your application an illusion so convincing that most programmers never question it: a reliable, ordered, two-way pipe of bytes between two programs.',
    analogy:{label:'Think of it as', text:'A registered courier with signature on delivery, that also slows down when it sees the roads are jammed, and never hands you page 7 before page 6.'},
    yours:'Open your phone\'s developer tools on any site and watch the waterfall — every bar begins with a handshake you never see. On a 200 ms overseas link that handshake alone costs a fifth of a second before one useful byte moves.',
    sections:[
      {h:'The handshake, and why three steps', html:'<div class="term">phone → server   <span class="c">SYN</span>      seq=x\nserver → phone   <span class="c">SYN-ACK</span>  seq=y, ack=x+1\nphone → server   <span class="c">ACK</span>      ack=y+1</div><p>Two would not be enough: both sides must choose a starting sequence number <i>and</i> confirm the other side received theirs. Three messages is the minimum for a mutual agreement. Closing takes four, because each direction shuts independently.</p>'},
      {h:'It is a byte stream, not messages', html:'<p>TCP has no idea where your messages begin or end. Send "HELLO" then "WORLD" and the other side may read "HELLOWOR" then "LD". If your application needs message boundaries it must add them itself — with a length prefix or a delimiter. Forgetting this causes a genuinely large share of all networking bugs.</p>'},
      {h:'Flow control vs congestion control', html:'<p>Two different brakes, constantly confused:</p><ul><li><b>Flow control</b> protects the <i>receiver</i> from being overwhelmed. The receiver advertises a window: "I have room for 64 KB".</li><li><b>Congestion control</b> protects the <i>network</i> from being overwhelmed. The sender infers it from loss, because no router will ever tell it directly.</li></ul><p>The sender obeys whichever is smaller.</p>'}
    ],
    facts:[['Setup','3-way handshake'],['Teardown','4-way'],['Abstraction','ordered byte stream'],['Header','20 bytes minimum'],['Two brakes','flow + congestion']]
  },
  {
    id:'congestion', title:'Congestion control and bufferbloat', zone:'core',
    one:'Why every download starts slow, and why a big upload ruins your video call.',
    chapter:'Ch 3 · TCP Congestion Control',
    lead:'No router ever tells a sender to slow down. So every sender on earth <i>guesses</i> the network\'s capacity by pushing harder until something breaks, then backing off. Billions of independent guesses, somehow converging. It is the most remarkable thing in the subject.',
    analogy:{label:'Think of it as', text:'Driving in fog with no speedometer. You accelerate gently until you clip a kerb, then slow sharply, then start creeping up again. Everyone on the road is doing this simultaneously, and traffic still flows.'},
    yours:'Start a big upload — a backup, a video to WhatsApp — and watch a video call in the same house fall apart. Your upload has filled the buffer at Airtel\'s end of your fibre, and every call packet now waits behind it. That is bufferbloat, and it explains more home network misery than anything else.',
    figure:'sawtooth',
    sections:[
      {h:'Slow start, then AIMD', html:'<ul><li><b>Slow start</b> — begin with a tiny window and <b>double</b> it every round trip. Despite the name it is exponential and fast; it is just starting from very little.</li><li><b>Congestion avoidance</b> — past a threshold, add one packet per round trip instead of doubling. Cautious probing.</li><li><b>Loss</b> — cut the window roughly in half and resume.</li></ul><p><b>Additive increase, multiplicative decrease.</b> Creep up, drop hard. Plot it and you get a sawtooth. That sawtooth is why a video starts at 360p and sharpens after a few seconds — the sender is still discovering how much you can take.</p>'},
      {h:'Why halving is the right move', html:'<p>Additive increase with multiplicative decrease provably converges to a fair share between competing flows, without any of them communicating. Two flows on one link naturally settle near 50/50. This is an emergent property of the algorithm, not something anyone enforces.</p>'},
      {h:'Bufferbloat: too much memory is a bug', html:'<p>Cheap memory led manufacturers to fit enormous buffers. A full buffer no longer drops packets — it just <i>holds</i> them, for hundreds of milliseconds. TCP never gets its loss signal, so it never slows down, and latency for everything else on the link explodes. The cure is smarter queue management (CoDel, fq_codel) or simply capping your own upload slightly below the true line rate.</p>'},
      {h:'CUBIC and BBR', html:'<p><b>CUBIC</b> is the Linux default: a gentler curve that recovers faster on high-speed, long-distance links. <b>BBR</b>, from Google, takes a different view — it models the link\'s actual bandwidth and round-trip time rather than waiting for loss, which makes it far better on links that drop packets for reasons other than congestion, such as Wi-Fi and mobile. YouTube serves you over BBR.</p>'}
    ],
    facts:[['Start phase','slow start, exponential'],['Steady state','AIMD'],['On loss','window halved'],['Linux default','CUBIC'],['Google uses','BBR'],['Bufferbloat fix','fq_codel, CoDel']]
  },
  {
    id:'udp-quic', title:'UDP, QUIC and real-time', zone:'core',
    one:'When arriving late is worse than not arriving at all.',
    chapter:'Ch 3 · Transport-Layer Services',
    lead:'TCP\'s guarantees are not always a gift. For live audio and video, a retransmitted packet arrives after the moment it belonged to has already passed — so it is pure harm: it delayed everything behind it for nothing.',
    analogy:{label:'Think of it as', text:'A live translator versus a written translation. If the translator mishears one word, they skip it and keep up. Stopping to check would leave them a full minute behind, which is far worse than one lost word.'},
    yours:'On a weak signal your WhatsApp call goes briefly robotic and then recovers. That is UDP doing exactly the right thing — dropping the damaged moment and staying in the present. A file transfer in the same conditions would pause and resume instead, because being late is fine for a file.',
    sections:[
      {h:'What UDP gives you', html:'<p>Ports, a checksum, and nothing else. No handshake, no retransmission, no ordering, no rate control. Eight bytes of header against TCP\'s twenty. It is used for DNS (one packet, just ask again), live media, gaming, and as a foundation for building something better.</p>'},
      {h:'QUIC: rebuilding TCP where it can be changed', html:'<p>TCP lives in the operating system kernel, so improving it takes a decade to reach users. Google built QUIC in <b>userspace on top of UDP</b>, so it ships with the app and updates weekly. It provides:</p><ul><li>Reliability and congestion control, like TCP.</li><li><b>Mandatory TLS 1.3</b>, fused into the handshake — connection setup and encryption in one round trip, or zero when resuming.</li><li><b>Independent streams</b> — one lost packet stalls only its own stream, not everything else. This was HTTP/2\'s worst flaw.</li><li><b>Connection IDs</b> — your connection survives switching from Wi-Fi to 5G. TCP would have died, because its identity is the IP address itself.</li></ul>'}
    ],
    facts:[['UDP header','8 bytes'],['UDP guarantees','none'],['QUIC runs on','UDP 443'],['QUIC setup','1-RTT, or 0-RTT resumed'],['HTTP/3','= HTTP over QUIC'],['Survives network change','yes — connection IDs']]
  }
]});

window.TOPICS.push({
  group:'Network layer', zone:'access',
  sub:'Addresses, and the global argument about how to reach them.',
  items:[
  {
    id:'ip-addr', title:'IP addresses, subnets and CIDR', zone:'access',
    one:'32 bits, split into "which network" and "which machine" — and the split moves.',
    chapter:'Ch 4 · IP Addressing',
    lead:'An IPv4 address is just a 32-bit number written as four bytes for human comfort. The important part is not the number but where you draw the line inside it.',
    analogy:{label:'Think of it as', text:'A postal address read right to left. "Flat 7, Building A, Andheri, Mumbai". Routers far away only read "Mumbai" and send it in that direction. Only the last router in the chain cares about "Flat 7". Nobody needs the whole address until the end.'},
    yours:'<code>192.168.1.7 / 255.255.255.0</code> means the first 24 bits name your home network and the last 8 name the device. That leaves 254 usable addresses — plenty for a flat, and the reason your router hands out .2 through .254.',
    sections:[
      {h:'Reading CIDR notation', html:'<p><code>192.168.1.0/24</code> — the /24 says the first 24 bits are the network. So:</p><ul><li><b>/24</b> → 256 addresses, 254 usable. A home or small office.</li><li><b>/16</b> → 65,536. A campus.</li><li><b>/8</b> → 16.7 million. A very large organisation or an early allocation.</li><li><b>/32</b> → exactly one address. Used for a single host route.</li></ul><p>Two per block are never assignable: the all-zeros network address and the all-ones broadcast address.</p>'},
      {h:'Private ranges, and why they exist', html:'<ul><li><code>10.0.0.0/8</code> — 16.7 million addresses, common in companies.</li><li><code>172.16.0.0/12</code> — the one nobody remembers.</li><li><code>192.168.0.0/16</code> — home routers, universally.</li><li><code>100.64.0.0/10</code> — carrier-grade NAT. If your Airtel router\'s WAN address is in here, you are sharing a public IP with hundreds of strangers.</li></ul><p>These are never routed on the public internet. Every home on earth can reuse them, which is the trick that kept IPv4 alive.</p>'},
      {h:'We genuinely ran out', html:'<p>4.3 billion addresses sounds enormous; it is fewer than the number of people with a phone. Every regional registry exhausted its free pool years ago, and IPv4 addresses are now traded commercially. NAT and CGNAT are the load-bearing workarounds.</p>'},
      {h:'IPv6: 128 bits and no NAT', html:'<p>340 undecillion addresses — enough to give every grain of sand its own /64. Written as <code>2401:4900:1c80::1</code>. Every device gets a genuine public address, so NAT becomes unnecessary and peer-to-peer becomes straightforward again. India is actually a world leader in IPv6 adoption, largely because Jio built mobile IPv6-first. Your phone is likely using it right now without your knowing.</p>'}
    ],
    facts:[['IPv4','32 bits, ~4.3 billion'],['IPv6','128 bits'],['Home LAN','192.168.0.0/16'],['CGNAT','100.64.0.0/10'],['Loopback','127.0.0.1'],['Lookup rule','longest prefix match']]
  },
  {
    id:'nat', title:'NAT, CGNAT and why you cannot host anything', zone:'access',
    one:'The hack that saved IPv4 — and the reason your home CCTV will not open from the office.',
    chapter:'Ch 4 · NAT',
    lead:'Network Address Translation lets many devices share one public address by rewriting the source address and port on the way out, and reversing it on the way back. It was meant as a stopgap in the 1990s. It is now load-bearing infrastructure for the entire consumer internet.',
    analogy:{label:'Think of it as', text:'A company switchboard. Everyone inside dials out and the world sees one number. Calls coming <i>in</i> are the problem: the operator needs an extension to transfer to, and without one the call simply cannot be completed.'},
    yours:'On Airtel broadband this happens twice — once in your router, once in Airtel\'s BNG. Two switchboards in series. That is why port forwarding in your router settings quietly achieves nothing.',
    figure:'doublenat',
    sections:[
      {h:'The translation table', html:'<div class="term">inside                    outside\n192.168.1.7:51343   →     100.x.x.x:62001\n192.168.1.4:44012   →     100.x.x.x:62002</div><p>A reply to port 62001 is looked up and forwarded to the phone. Entries expire after a few minutes of silence — which is exactly why chat apps send tiny keepalive packets, and why that costs battery.</p>'},
      {h:'What CGNAT specifically breaks', html:'<ul><li>Reaching your <b>home CCTV or NVR</b> from outside.</li><li><b>Port forwarding</b> of any kind — it is configured, it looks right, it does nothing.</li><li>Hosting a <b>game server</b> for friends.</li><li>Running anything self-hosted at home.</li><li>Torrents connect but only passively, so they are slower.</li></ul>'},
      {h:'The four ways around it', html:'<ol><li><b>Buy a static public IP</b> from Airtel as a paid add-on. The clean fix.</li><li><b>Use a relay</b> — Tailscale, ngrok, Cloudflare Tunnel, or the vendor cloud your CCTV app already uses. All are doing the same thing: something in the middle with a real address that both sides dial out to.</li><li><b>Use IPv6</b>, if your ISP gives it to you. No NAT, so the problem disappears.</li><li><b>Hole punching</b> — both sides connect out simultaneously to a rendezvous server. Works behind ordinary NAT, often fails behind CGNAT.</li></ol>'},
      {h:'The accidental firewall', html:'<p>NAT was never a security device, but it behaves like one: with no translation entry, unsolicited inbound traffic has nowhere to go and is dropped. Your home devices are shielded from the internet by pure accident of address arithmetic. It is real protection — just do not mistake it for a policy.</p>'}
    ],
    facts:[['Rewrites','source IP + port'],['Table lifetime','a few minutes idle'],['Airtel translations','two — router + BNG'],['Inbound','impossible by design'],['Clean fix','static IP, or IPv6']]
  },
  {
    id:'dhcp', title:'DHCP', zone:'access',
    one:'Four broadcast packets turn a device that knows nothing into a working network citizen.',
    chapter:'Ch 4 · DHCP',
    lead:'A device joining a network faces a chicken-and-egg problem: to ask for an address it needs an address. DHCP solves it by shouting to everyone at once.',
    analogy:{label:'Think of it as', text:'Walking into a hotel you have never visited. "Any rooms?" you call out to the lobby. Reception offers 304. You accept. They confirm and hand you a key that expires on checkout day — and if you stay longer, you renew it.'},
    yours:'Every device in your house did this within a second of connecting. It is also the reason your phone gets a different IP after a router reboot, and why "just restart the router" fixes a surprising number of things — it reissues every lease from scratch.',
    sections:[
      {h:'DORA', html:'<ul><li><b>DISCOVER</b> — the client broadcasts, from address 0.0.0.0, to everyone.</li><li><b>OFFER</b> — the server proposes an address.</li><li><b>REQUEST</b> — the client formally asks for it (and tells any other servers it declined them).</li><li><b>ACK</b> — confirmed, with a lease time.</li></ul>'},
      {h:'You get four things, not one', html:'<p>The address, the subnet mask, the <b>default gateway</b>, and the <b>DNS server</b>. The last two matter most. Without a gateway you can talk only to your own LAN; without DNS you can reach any site by IP but none by name — which produces the classic "connected but no internet" symptom.</p>'},
      {h:'Leases and reservations', html:'<p>Addresses are lent, not given. Your router renews at half the lease time. A <b>DHCP reservation</b> ties a specific MAC address to a fixed IP — worth setting for a printer, an NVR or a home server, so their address never moves under them.</p>'}
    ],
    facts:[['Exchange','DISCOVER, OFFER, REQUEST, ACK'],['Client starts at','0.0.0.0'],['Ports','UDP 67 server, 68 client'],['Typical lease','24 hours'],['Also delivers','gateway + DNS']]
  },
  {
    id:'routing', title:'Routing algorithms', zone:'access',
    one:'Nobody knows the whole path. Everybody knows the next hop.',
    chapter:'Ch 5 · Routing Algorithms',
    lead:'There is no map of the internet anywhere. Each router holds only a table of "for this destination, send it that way", and those tables are built by routers gossiping with their neighbours.',
    analogy:{label:'Think of it as', text:'Asking directions in a strange town. Nobody hands you the full route. Each person points you one street further, to someone else who knows the next bit. You arrive anyway, and nobody ever held the whole plan.'},
    yours:'Run <code>traceroute youtube.com</code> and you will watch this happen — each line is one router that was forced to admit its own name. Watch how few hops it takes before you are already at Google. Usually under ten.',
    sections:[
      {h:'Link-state: everyone gets the map', html:'<p>Each router floods a description of its own directly attached links to every other router. Everyone ends up with an identical picture of the network, then each independently runs <b>Dijkstra\'s shortest path algorithm</b> on it. Fast to converge, consistent, but it needs every participant to be trustworthy — so it only works inside one organisation. <b>OSPF</b> and IS-IS work this way.</p>'},
      {h:'Distance-vector: everyone gossips', html:'<p>Each router tells its neighbours only "here is my distance to everywhere", and each updates its own table from what it hears. Much less information to send, but it converges slowly and suffers the <b>count-to-infinity</b> problem, where a failed link takes ages to be recognised because routers keep believing each other\'s stale news. RIP works this way and is largely historical.</p>'},
      {h:'Why there are two levels', html:'<p>You cannot run one algorithm over 75,000 independently owned networks. So routing is hierarchical: an <b>interior</b> protocol inside each autonomous system, optimising for speed and latency, and an <b>exterior</b> protocol between them, optimising for contracts and money. Airtel runs OSPF or IS-IS internally and BGP at its borders.</p>'}
    ],
    facts:[['Link-state','OSPF, IS-IS — Dijkstra'],['Distance-vector','RIP — Bellman-Ford'],['Between networks','BGP, path vector'],['A router knows','the next hop only'],['Reveal the path','traceroute']]
  },
  {
    id:'bgp', title:'BGP, autonomous systems and peering', zone:'access',
    one:'The protocol that glues 75,000 networks together, held up largely by trust.',
    chapter:'Ch 5 · OSPF and BGP',
    lead:'BGP is how Airtel tells the rest of the world which addresses it can reach, and how it learns everyone else\'s. It is the closest thing the internet has to a constitution, and it runs on agreements rather than authority.',
    analogy:{label:'Think of it as', text:'Courier companies negotiating at the border. "I cover all of western India — hand me anything for Mumbai." "Fine, and you hand me everything for Europe." No central regulator writes these deals; each pair negotiates, and the global network is whatever emerges.'},
    yours:'Airtel is <b>AS9498</b>. It announces its address blocks to peers worldwide; if it stopped, your home would vanish from the internet within minutes — the fibre still lit, the router still blinking, and nobody able to find you.',
    sections:[
      {h:'Path vector, and why policy beats distance', html:'<p>A BGP announcement carries the full <b>AS_PATH</b>: "to reach this prefix, go through AS9498, then AS15169". This prevents loops (a network rejects any path already containing itself) and, crucially, lets a network apply <i>policy</i>. Airtel might prefer a four-hop settlement-free peering route over a two-hop route it has to pay for. <b>The shortest path is frequently not chosen, and that is deliberate.</b></p>'},
      {h:'The money underneath', html:'<ul><li><b>Transit</b> — you pay a bigger network for access to everywhere. Metered per megabit.</li><li><b>Peering</b> — two networks of similar size swap traffic directly for free, because both gain.</li><li><b>Paid peering</b> — direct connection, but one side pays. Common between big ISPs and big content companies.</li></ul><p>Every routing decision on the internet has an invoice behind it.</p>'},
      {h:'It runs on trust, and that is the problem', html:'<p>BGP largely believes what it is told. If a network wrongly announces "I am Google", traffic flows to it. This has happened repeatedly — a Pakistani ISP took YouTube offline globally in 2008 by announcing a more specific route for it, and a similar misconfiguration in 2021 briefly redirected a slice of Indian traffic. <b>RPKI</b> cryptographically signs which network is entitled to announce which prefix, and adoption is finally becoming widespread.</p>'}
    ],
    facts:[['Type','path vector'],['Runs over','TCP port 179'],['Carries','AS_PATH'],['Airtel / Jio / Google','AS9498 / AS55836 / AS15169'],['Global table','~1 million prefixes'],['Security','RPKI signing']]
  }
]});

window.TOPICS.push({
  group:'Link layer and LANs', zone:'home',
  sub:'One hop at a time, inside your own four walls.',
  items:[
  {
    id:'mac-arp', title:'MAC addresses and ARP', zone:'home',
    one:'Who you are versus where you are — and the shouted question that connects the two.',
    chapter:'Ch 6 · Link Layer Services',
    lead:'Two addressing systems sit on top of each other and people conflate them constantly. A MAC address identifies a piece of hardware forever. An IP address describes where that hardware currently sits.',
    analogy:{label:'Think of it as', text:'Your name and your current address. Your name never changes and is useless for delivering a parcel. Your address changes when you move and is the only thing the courier cares about. Both are needed, for different reasons.'},
    yours:'Run <code>arp -a</code> on your laptop and you will see your router\'s MAC cached against 192.168.1.1. That mapping was learned by shouting, and it expires within minutes.',
    sections:[
      {h:'The shape of a MAC', html:'<p>48 bits, written as <code>3c:5a:b4:11:8f:02</code>. The first 24 bits are the <b>OUI</b>, assigned to the manufacturer — so the first half tells you it is an Apple or a TP-Link device. This is exactly why phones now randomise their MAC per network: an unchanging hardware ID broadcast constantly is a tracking beacon in every shop you walk into.</p>'},
      {h:'ARP: one broadcast, one answer', html:'<div class="term">phone  → <span class="c">everyone</span>  "who has 192.168.1.1?"\nrouter → phone     "that is me, 3c:5a:b4:11:8f:02"</div><p>The answer is cached for a few minutes. Every device on the LAN hears the question, which is fine for a home and a real design constraint in a large office.</p>'},
      {h:'What changes at every hop', html:'<p>As your packet crosses the internet, the <b>IP addresses stay identical from end to end</b>, while the MAC addresses are stripped and rewritten at <b>every single hop</b>. Grasp this one sentence and the relationship between layers 2 and 3 stops being confusing permanently.</p>'},
      {h:'And the attack it enables', html:'<p>ARP has no authentication whatsoever. Anyone on your Wi-Fi can answer "I am 192.168.1.1" and become the router as far as your phone is concerned — <b>ARP spoofing</b>, the foundation of most café-Wi-Fi attacks. It is also exactly why HTTPS matters: the attacker gets your packets, but not their contents.</p>'}
    ],
    facts:[['MAC length','48 bits'],['First 24 bits','manufacturer OUI'],['ARP cache','minutes'],['IP across the path','unchanged'],['MAC across the path','rewritten every hop'],['Authentication','none']]
  },
  {
    id:'switching-lan', title:'Switches, hubs and broadcast domains', zone:'home',
    one:'How the yellow ports on your router know where to send things, with no configuration at all.',
    chapter:'Ch 6 · Ethernet and Switches',
    lead:'A switch is the most self-sufficient device in networking. Plug it in, configure nothing, and within seconds it has worked out the topology of everything attached to it — purely by watching.',
    analogy:{label:'Think of it as', text:'A new receptionist. On day one she calls out every name down the whole corridor. Within a week she has learned who sits in which room and walks straight there. Nobody trained her; she simply noticed who replied from where.'},
    yours:'Copying a file from your laptop to your TV over the LAN runs at gigabit speed and never touches Airtel. The switch inside your router sends those frames out exactly one port.',
    sections:[
      {h:'Learning, forwarding, flooding', html:'<ol><li>A frame arrives on port 3 from MAC X → note "X is on port 3".</li><li>Destination MAC is known → send out only that port.</li><li>Destination unknown → flood to every port, then learn from the reply.</li></ol><p>That is the entire algorithm. No protocol, no configuration, no central authority.</p>'},
      {h:'Why hubs died', html:'<p>A hub repeated every bit to every port — one shared collision domain, everyone fighting for the same air, and anyone could read everyone else\'s traffic. A switch gives every port its own full-duplex path, so collisions vanish and traffic is no longer broadcast to everybody. Cheap switching silicon killed the hub around 2000 and made packet sniffing on a wired LAN much harder.</p>'},
      {h:'Two domains, easily confused', html:'<ul><li><b>Collision domain</b> — devices that can interfere with each other. On modern switched Ethernet, one per port. On Wi-Fi, everyone on the channel.</li><li><b>Broadcast domain</b> — devices that hear a broadcast. Your whole LAN. A router is the boundary: broadcasts never cross it, which is the only reason the internet is not drowning in ARP.</li></ul><p><b>VLANs</b> split one physical switch into several logical broadcast domains — how an office puts guests, staff and CCTV on the same hardware without letting them see each other.</p>'}
    ],
    facts:[['Learns','MAC → port'],['Unknown destination','flood'],['Collision domain','one per port'],['Broadcast domain','stops at the router'],['Logical split','VLANs']]
  }
]});

window.TOPICS.push({
  group:'Wireless and mobile', zone:'access',
  sub:'Everything gets harder once you remove the wire.',
  items:[
  {
    id:'wifi-deep', title:'Wi-Fi, properly', zone:'access',
    one:'Why the same router is brilliant in one room and useless in the next.',
    chapter:'Ch 7 · Wireless Links',
    lead:'Wireless breaks three assumptions that wired networking takes for granted: that the medium is private, that signal strength is constant, and that you can send and receive at the same time. Every Wi-Fi frustration comes from one of those three.',
    analogy:{label:'Think of it as', text:'A crowded room versus a phone line. On a phone line you both talk freely. In a room you must wait for a gap, you might be drowned out, and someone across the room may not hear you at all even though you can both hear the host.'},
    yours:'Your Airtel router broadcasts 2.4 GHz and 5 GHz. Most people leave everything on 2.4 GHz out of habit and wonder why speeds are poor. Move anything that sits within a couple of rooms onto the 5 GHz network — it is usually the single biggest improvement available for free.',
    sections:[
      {h:'The bands, and the trade', html:'<ul><li><b>2.4 GHz</b> — good through walls, long range, but only three non-overlapping channels and it is shared with microwaves, Bluetooth and every neighbour. Slow and congested.</li><li><b>5 GHz</b> — many more channels, far less interference, much higher speeds, but walls hurt it badly.</li><li><b>6 GHz (Wi-Fi 6E / 7)</b> — enormous clean spectrum, shortest range, and it requires new hardware at both ends.</li></ul><p>Higher frequency always means more capacity and less penetration. There is no way around that; it is the physics of the wave, not a limitation of the product.</p>'},
      {h:'CSMA/CA: listen, wait, hope', html:'<p>Wi-Fi cannot detect collisions while transmitting (its own signal drowns out everything), so it <i>avoids</i> them instead: listen first, wait a random backoff, transmit, and wait for an explicit acknowledgement. Every successful frame therefore costs at least two transmissions. This overhead is why a "300 Mbps" link realistically delivers around half that.</p>'},
      {h:'Why one weak device slows down everyone', html:'<p>A device at the far end of the flat negotiates a slow, sturdy modulation. Since the air is shared and time is the resource, its slow frames occupy the channel for far longer — starving everyone else. One phone in a far bedroom can genuinely halve the throughput of a laptop sitting beside the router.</p>'},
      {h:'Practical fixes, in order of effect', html:'<ol><li>Put the router <b>high, central and in the open</b> — not in a cupboard, not on the floor, not behind the TV.</li><li>Move capable devices to the <b>5 GHz</b> network.</li><li>Pick a clean 2.4 GHz channel: <b>1, 6 or 11</b>, never anything between.</li><li>Keep it away from the microwave and from large metal objects.</li><li>For a big or multi-storey home, use <b>mesh nodes or a wired access point</b>. A repeater halves throughput because it receives and resends on the same radio.</li></ol>'}
    ],
    facts:[['Access method','CSMA/CA'],['Duplex','half — one at a time'],['2.4 GHz channels','1, 6, 11 only'],['Real throughput','~50% of link rate'],['Wi-Fi 6','802.11ax'],['Security','WPA3, or WPA2 at minimum']]
  },
  {
    id:'cellular-deep', title:'4G, 5G and staying connected while moving', zone:'access',
    one:'The hard part was never speed. It was handing you between towers without dropping anything.',
    chapter:'Ch 7 · Cellular Networks',
    figure:'handover',
    lead:'A mobile network has to solve a problem no fixed network faces: the subscriber moves, continuously, at up to 300 km/h, and expects the connection to survive.',
    analogy:{label:'Think of it as', text:'A relay race where the baton is your live video call and the runners are rooftop towers. If the handoff is even slightly fumbled, everybody notices immediately.'},
    yours:'Airtel 5G in India mostly uses <b>n78 around 3.5 GHz</b>, with <b>26 GHz mmWave</b> in a few dense locations. Airtel deployed in non-standalone mode — the 5G radio riding on a 4G core — while Jio built a standalone 5G core. Same auction, two different bets on cost versus capability.',
    sections:[
      {h:'Radio access network and core', html:'<p>The <b>RAN</b> is towers and radios. The <b>core</b> is the brain: authentication, session setup, policy, billing, and the gateway to the internet. 5G separates the control plane from the user plane so the data path can be pushed to the network edge while control stays central — which is what makes low-latency edge computing possible at all.</p>'},
      {h:'Handover, the actual achievement', html:'<p>Your phone constantly measures neighbouring cells and reports back. When a neighbour is convincingly better, <i>the network</i> orders the switch and forwards buffered packets to the new tower. Your IP is unchanged, so your TCP connections never notice. This happens repeatedly on any drive and you have never once seen it.</p>'},
      {h:'Where 5G speed comes from', html:'<ul><li><b>Wider channels</b> — up to 100 MHz versus 20 MHz on 4G.</li><li><b>Massive MIMO</b> — 64+ antenna elements forming a beam aimed at your phone rather than illuminating the whole sector.</li><li><b>Shorter scheduling slots</b> — sub-millisecond, which is where the latency improvement comes from.</li><li><b>mmWave</b> — gigabit speeds over about 200 metres, blocked by a wall, a tree, or your own hand.</li></ul>'},
      {h:'Why your indoor 5G is sometimes worse than 4G', html:'<p>3.5 GHz penetrates concrete considerably worse than the 900 MHz and 1800 MHz bands 4G leans on. Standing indoors at the edge of a cell, a 5G icon can genuinely deliver a worse experience than 4G would have. That is not a fault; it is the same frequency-versus-range trade that governs Wi-Fi.</p>'}
    ],
    facts:[['Airtel 5G bands','n78 3.5 GHz, n258 26 GHz'],['Airtel mode','non-standalone'],['Jio mode','standalone'],['4G latency','40–70 ms'],['5G latency','20–40 ms'],['Your credentials','on the SIM']]
  }
]});

window.TOPICS.push({
  group:'Network security', zone:'net',
  sub:'What the padlock actually promises, and what it quietly does not.',
  items:[
  {
    id:'tls', title:'TLS, HTTPS and the padlock', zone:'net',
    one:'What your ISP can still see about you even when everything is encrypted.',
    chapter:'Ch 8 · TLS and Securing the Web',
    lead:'TLS gives you three separate things, and it is worth being precise about them: <b>confidentiality</b> (nobody can read it), <b>integrity</b> (nobody can alter it undetected), and <b>authentication</b> (you are talking to who you think). Most people assume it also gives privacy. It does not.',
    analogy:{label:'Think of it as', text:'A sealed, tamper-evident envelope with a verified sender. The postman cannot read it and cannot alter it without you noticing. He still knows exactly who you write to, how often, and how thick the letters are.'},
    yours:'Airtel cannot read your WhatsApp messages or see which YouTube video you watched. Airtel <i>can</i> see that you connected to youtube.com, at what time, and how many megabytes moved. Traffic analysis survives encryption, which is why a VPN changes who sees that metadata rather than eliminating it.',
    sections:[
      {h:'The handshake', html:'<ol><li><b>ClientHello</b> — your phone offers cipher suites and names the site it wants, in <b>SNI</b>.</li><li><b>Certificate</b> — the server presents one, signed by a Certificate Authority your device already trusts.</li><li><b>Verification</b> — your phone checks the signature chain, the expiry, and that the name matches.</li><li><b>Key agreement</b> — both derive a shared secret that an eavesdropper who recorded everything still cannot compute.</li></ol><p>TLS 1.3 does all of this in one round trip, or zero when resuming a previous session.</p>'},
      {h:'Why certificates are believable at all', html:'<p>Your device ships with a list of root CAs. A chain from the site\'s certificate up to one of those roots is what turns "this server claims to be youtube.com" into something you can rely on. The weakness is structural: <b>any</b> trusted CA can issue for <b>any</b> domain, so the system is only as strong as its weakest member. Certificate Transparency logs exist so that mis-issuance is at least publicly visible.</p>'},
      {h:'What still leaks', html:'<ul><li><b>The domain name</b>, via SNI in the very first message, which is plaintext. Encrypted Client Hello is fixing this, slowly.</li><li><b>The destination IP</b> — unavoidable; routing requires it.</li><li><b>Timing and volume</b> — enough to identify which video you are streaming, in published research.</li><li><b>DNS</b>, unless you have enabled DoH.</li></ul>'},
      {h:'And the padlock does not mean "safe"', html:'<p>It means the connection is encrypted and the name matches the certificate. A phishing site can obtain a valid certificate in minutes for free. The padlock tells you nobody is listening — never that the person you are talking to is honest.</p>'}
    ],
    facts:[['Gives you','confidentiality, integrity, authentication'],['Does not give','privacy from your ISP'],['Current version','TLS 1.3'],['Handshake','1-RTT, or 0-RTT resumed'],['Leaks','SNI, IP, timing, volume']]
  },
  {
    id:'firewall', title:'Firewalls, NAT and intrusion detection', zone:'net',
    one:'What is actually protecting your home network — and how little of it was designed to.',
    chapter:'Ch 8 · Firewalls and IDS',
    lead:'A firewall decides which traffic is permitted past a boundary. Your home has one whether or not you know it, and a second accidental one you never asked for.',
    analogy:{label:'Think of it as', text:'A building security desk. A packet filter checks ID against a list. A stateful firewall also remembers that you left ten minutes ago and lets you back in. An intrusion detection system is the CCTV operator who notices that someone has tried forty different doors.'},
    yours:'On Airtel broadband, inbound connections are blocked twice over — by your router\'s NAT and by the carrier\'s CGNAT. Genuinely effective protection, arrived at entirely by accident of address arithmetic rather than by any security decision.',
    sections:[
      {h:'The three kinds', html:'<ul><li><b>Packet filter</b> — judges each packet alone by address and port. Fast, stateless, easily fooled.</li><li><b>Stateful</b> — tracks connections, so a reply to something you initiated is allowed while an unsolicited packet on the same port is not. This is what your router does.</li><li><b>Application gateway</b> — actually understands HTTP or SQL and can block a malicious request that is perfectly valid at the packet level. What a web application firewall is.</li></ul>'},
      {h:'Detection versus prevention', html:'<p>An <b>IDS</b> watches and alerts. An <b>IPS</b> watches and blocks. Signature-based systems catch known attacks and miss novel ones; anomaly-based systems catch the unusual and produce enormous numbers of false alarms. Almost every real deployment runs both and spends most of its effort on tuning.</p>'},
      {h:'The attacks worth recognising', html:'<ul><li><b>DDoS</b> — overwhelm a target from thousands of compromised machines. Often <i>amplified</i>: send a small forged DNS or NTP query and have the server send a large reply to the victim.</li><li><b>Man in the middle</b> — sit between two parties. On a LAN, usually via ARP spoofing. Defeated by TLS.</li><li><b>Packet sniffing</b> — read traffic on a shared medium. Trivial on open Wi-Fi.</li><li><b>Spoofing</b> — forge a source address. The root of amplification attacks, and why networks should filter outbound traffic that cannot legitimately be theirs.</li></ul>'},
      {h:'Actually useful at home', html:'<ol><li><b>Change the router admin password.</b> The default is printed on the box and on the internet.</li><li>Use <b>WPA3</b>, or WPA2 if that is all you have. Never WEP, never open.</li><li>Disable <b>WPS</b> — its PIN is brute-forceable.</li><li>Disable remote management of the router from the WAN side.</li><li>Update the firmware occasionally. Nobody does this; it matters.</li><li>Put IoT devices and cameras on the <b>guest network</b>, away from your laptop and phone.</li></ol>'}
    ],
    facts:[['Your router','stateful firewall + NAT'],['Airtel adds','CGNAT'],['IDS','detects and alerts'],['IPS','detects and blocks'],['Wi-Fi security','WPA3 preferred'],['Biggest home risk','default admin password']]
  }
]});

window.TOPICS.push({
  group:'See it yourself', zone:'core',
  sub:'Six commands that turn all of the above into something you can watch happening.',
  items:[
  {
    id:'tools', title:'Run these on your own connection', zone:'core',
    one:'Every concept on this page can be observed from your laptop in under a minute.',
    chapter:'All chapters · practical',
    lead:'Reading about routing is one thing. Watching your own packet get handed between eight routers on its way to Google is another. Open a terminal — Command Prompt on Windows, Terminal on Mac — and try these.',
    analogy:{label:'Think of it as', text:'The difference between reading a map of your city and walking the route. Same information, completely different understanding.'},
    yours:'The CGNAT check in particular is worth doing right now. It tells you in ten seconds whether you will ever be able to reach your home devices from outside.',
    sections:[
      {h:'1. See the whole path', html:'<div class="term">traceroute youtube.com     <span class="c"># mac / linux</span>\ntracert youtube.com        <span class="c"># windows</span></div><p>Every line is a real router that was forced to identify itself by an expiring TTL. Watch the latency climb, then notice how few hops it takes to reach Google — often under ten, because the content is inside Airtel. Lines showing <code>* * *</code> are routers configured not to reply; the packet still passed through them.</p>'},
      {h:'2. Measure the speed of light', html:'<div class="term">ping google.com\nping bbc.co.uk</div><p>Compare the two. The difference is very nearly pure distance. No plan upgrade moves either number.</p>'},
      {h:'3. Watch DNS do its work', html:'<div class="term">dig youtube.com\ndig youtube.com <span class="c">@8.8.8.8</span>\nnslookup youtube.com       <span class="c"># windows</span></div><p>Note the TTL on the answer, and try a second time to see it counting down inside your resolver\'s cache. Compare Airtel\'s answer with Google\'s — the addresses will often differ, because each is steering you to a different nearby cache.</p>'},
      {h:'4. Find out whether you are behind CGNAT', html:'<div class="term">curl ifconfig.me</div><p>Compare that with your router\'s WAN address on its status page. If the router shows something starting <code>100.64.</code> to <code>100.127.</code> and the two do not match, you are behind carrier-grade NAT — and no amount of port forwarding will ever work.</p>'},
      {h:'5. Inspect your own machine', html:'<div class="term">ipconfig /all            <span class="c"># windows</span>\nifconfig <span class="c">or</span> ip addr        <span class="c"># mac / linux</span>\narp -a\nnetstat -an</div><p>Your IP, mask, gateway and DNS from DHCP; the ARP cache showing MAC addresses learned by shouting; and every socket currently open on your machine with its four-tuple.</p>'},
      {h:'6. Look up who owns an address', html:'<div class="term">whois 142.250.195.78\nnslookup -type=NS youtube.com</div><p>You will see the autonomous system and the organisation behind it. Do it for your own public IP and you will find AS9498, Bharti Airtel.</p>'},
      {h:'And if you want to go further', html:'<p><b>Wireshark</b> shows you every frame, header by header, on your own machine. Filter to <code>dns</code> and reload a page to watch the lookup. Filter to <code>tcp.flags.syn==1</code> to watch handshakes. It is the single fastest way to make layering stop being abstract — everything on the Protocol layers tab becomes something you can literally click open.</p>'}
    ],
    facts:[['Path','traceroute / tracert'],['Latency','ping'],['Name resolution','dig / nslookup'],['Your public IP','curl ifconfig.me'],['CGNAT tell','WAN starts 100.64–100.127'],['Full detail','Wireshark']]
  }
]});
