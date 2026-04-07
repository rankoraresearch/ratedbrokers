// ============================
// REGULATOR DATA — 30 regulators
// ============================
export const REGULATORS = [
  {
    slug: "fca",
    name: "FCA",
    fullName: "Financial Conduct Authority",
    country: "United Kingdom",
    code: "GB",
    tier: 1,
    established: 2013,
    website: "https://www.fca.org.uk",
    licenseCheck: "https://register.fca.org.uk",
    investorProtection: "FSCS \u2014 \u00A385,000 per person",
    leverageLimit: "1:30 (retail)",
    supervisedFirms: "~58,000",
    overview: [
      "The Financial Conduct Authority (FCA) is widely regarded as the gold standard in financial regulation. Established in 2013 as the successor to the Financial Services Authority (FSA), the FCA regulates over 58,000 financial services firms in the United Kingdom, including all forex and CFD brokers operating in the country.",
      "FCA-regulated brokers must maintain strict capital adequacy requirements, segregate client funds from company assets, and participate in the Financial Services Compensation Scheme (FSCS). This provides traders with up to \u00A385,000 in protection per person if their broker becomes insolvent.",
      "The FCA is known for its proactive enforcement approach, regularly fining firms for misconduct and revoking licenses when necessary. It also enforces ESMA-aligned leverage limits of 1:30 for retail traders and mandates negative balance protection."
    ],
    requirements: [
      "Minimum capital requirement of \u00A3730,000 for market makers, \u00A3125,000 for matched principal firms",
      "Client funds must be held in segregated accounts at approved banks",
      "Mandatory participation in FSCS compensation scheme",
      "Negative balance protection for all retail clients",
      "Maximum leverage 1:30 for retail (major pairs), 1:20 (minor pairs)",
      "Standardized risk warnings on all marketing materials",
      "Regular financial reporting and annual audits",
      "Complaints handling procedures and access to Financial Ombudsman Service"
    ],
    history: "The FCA was established on 1 April 2013 under the Financial Services Act 2012, replacing the Financial Services Authority (FSA). The FSA had been criticized for its role in the 2008 financial crisis, and the FCA was created with a stronger mandate for consumer protection and market integrity. Since its founding, the FCA has issued over \u00A31 billion in fines and has become a model for financial regulators worldwide.",
    faq: [
      { q: "How do I verify if a broker is FCA-regulated?", a: "Visit the FCA Financial Services Register at register.fca.org.uk and search for the broker by name or FRN (Firm Reference Number). The register shows the firm's authorization status, permitted activities, and any restrictions." },
      { q: "What happens if my FCA-regulated broker goes bankrupt?", a: "If your broker is declared insolvent, the FSCS protects eligible clients up to \u00A385,000 per person. Claims can be filed online at fscs.org.uk and are typically processed within 7 days for straightforward cases." },
      { q: "Does FCA regulation apply to all account types?", a: "FCA rules apply to all retail client accounts. Professional clients may opt out of certain protections (like negative balance protection and FSCS coverage) in exchange for higher leverage. However, they must meet strict eligibility criteria." },
      { q: "Can non-UK residents use FCA-regulated brokers?", a: "Many FCA-regulated brokers accept international clients, but they may route non-UK clients through a different entity regulated in another jurisdiction. Always check which entity you are opening an account with." }
    ],
  },
  {
    slug: "asic",
    name: "ASIC",
    fullName: "Australian Securities and Investments Commission",
    country: "Australia",
    code: "AU",
    tier: 1,
    established: 1991,
    website: "https://www.asic.gov.au",
    licenseCheck: "https://connectonline.asic.gov.au/RegistrySearch",
    investorProtection: "CSLR \u2014 A$150,000 per claim",
    leverageLimit: "1:30 (retail)",
    supervisedFirms: "~4,500 AFS licensees",
    overview: [
      "The Australian Securities and Investments Commission (ASIC) is Australia's primary financial regulator, responsible for overseeing all financial services firms including forex and CFD brokers. ASIC has earned a Tier-1 reputation through its rigorous licensing requirements and active enforcement.",
      "In 2021, ASIC introduced product intervention orders that aligned Australia's retail leverage limits with European standards, capping leverage at 1:30 for major forex pairs. This was a significant shift from the previously unregulated leverage environment that had attracted many international traders.",
      "ASIC-regulated brokers must hold an Australian Financial Services License (AFSL) and comply with strict capital adequacy, client money handling, and dispute resolution requirements. The Compensation Scheme of Last Resort (CSLR), introduced in 2024, provides up to A$150,000 per claim."
    ],
    requirements: [
      "Australian Financial Services License (AFSL) required",
      "Minimum net tangible assets of A$1 million (or 10% of adjusted liabilities, whichever is greater)",
      "Client funds held in segregated trust accounts with Australian ADIs",
      "Membership in Australian Financial Complaints Authority (AFCA)",
      "Maximum leverage 1:30 for major pairs, 1:20 for minors",
      "Product Disclosure Statement (PDS) mandatory for all clients",
      "Risk management systems and compliance arrangements required",
      "Annual audit and financial reporting obligations"
    ],
    history: "ASIC was established in 1991 as the Australian Securities Commission, and rebranded to its current name in 1998 when its mandate expanded to include consumer protection in financial services. Australia became a major hub for forex brokers due to its historically liberal leverage rules. The 2021 product intervention order marked a turning point, bringing leverage limits in line with ESMA and reducing the appeal for leverage-seeking traders, but strengthening consumer protection.",
    faq: [
      { q: "How do I check if a broker holds an AFSL?", a: "Search the ASIC Professional Register at connectonline.asic.gov.au. Enter the broker's name or AFSL number to verify their license status, authorized services, and any conditions or restrictions." },
      { q: "Are my funds protected with an ASIC-regulated broker?", a: "Yes. Brokers must segregate client funds in trust accounts. Since 2024, the Compensation Scheme of Last Resort (CSLR) provides up to A$150,000 per eligible claim for losses caused by broker misconduct." },
      { q: "What leverage limits apply to ASIC-regulated accounts?", a: "Since March 2021, retail clients are limited to 1:30 on major pairs, 1:20 on minor pairs and gold, 1:10 on other commodities, 1:5 on shares and indices, and 1:2 on crypto. Professional clients may access higher leverage." },
      { q: "Can international clients use ASIC-regulated brokers?", a: "Some ASIC-regulated brokers accept international clients under their AFSL, but many route offshore clients through entities in other jurisdictions (e.g., Seychelles, Bahamas) to offer higher leverage." }
    ],
  },
  {
    slug: "nfa",
    name: "NFA",
    fullName: "National Futures Association",
    country: "United States",
    code: "US",
    tier: 1,
    established: 1982,
    website: "https://www.nfa.futures.org",
    licenseCheck: "https://www.nfa.futures.org/basicnet",
    investorProtection: "CFTC oversight \u2014 strict capital requirements",
    leverageLimit: "1:50 (major pairs)",
    supervisedFirms: "~3,400 member firms",
    overview: [
      "The National Futures Association (NFA) is the self-regulatory organization for the U.S. derivatives industry, working under the oversight of the Commodity Futures Trading Commission (CFTC). Together, NFA and CFTC regulate all forex trading in the United States with the most stringent requirements in the world.",
      "U.S. forex regulation is unique in several ways: brokers must maintain minimum net capital of $20 million, FIFO rules require closing positions in the order they were opened, hedging is prohibited on the same account, and leverage is capped at 1:50 for major pairs. These strict rules mean very few brokers operate in the U.S. market.",
      "Despite these restrictions, NFA/CFTC regulation provides exceptional trader protection. The regulatory framework's transparency, combined with the NFA's BASIC system for background checks and the CFTC's enforcement capabilities, make it one of the safest environments for forex trading globally."
    ],
    requirements: [
      "Minimum adjusted net capital of $20 million for Retail Foreign Exchange Dealers (RFEDs)",
      "Registration as Futures Commission Merchant (FCM) or RFED",
      "FIFO (First In, First Out) rule for position closing",
      "No hedging allowed on same account",
      "Maximum leverage 1:50 for major pairs, 1:20 for minors",
      "Mandatory disclosure of percentage of profitable/unprofitable accounts",
      "Annual certified financial statements required",
      "Background checks for all principals and associated persons"
    ],
    history: "The NFA was designated as a registered futures association by the CFTC in 1982 and began regulatory operations in 1982. It was originally created to regulate commodity futures markets but its mandate expanded to cover forex trading after the CFMA 2000 and the Dodd-Frank Act of 2010. The $20 million capital requirement (raised from $5 million) and strict operational rules have resulted in only a handful of NFA-registered forex brokers remaining in the U.S. market.",
    faq: [
      { q: "How many forex brokers are NFA-registered?", a: "As of 2026, fewer than 10 firms are registered as Retail Foreign Exchange Dealers (RFEDs) with the NFA. The extremely high capital requirements and strict rules have led most brokers to exit the U.S. market." },
      { q: "What is the BASIC system?", a: "BASIC (Background Affiliation Status Information Center) is the NFA's online registration and background check system. You can search any NFA member firm or individual to view their registration status, disciplinary history, and financial data." },
      { q: "Why can't I hedge positions with a U.S. broker?", a: "The NFA prohibits hedging (holding simultaneous long and short positions in the same currency pair) under its no-hedging rule implemented in 2009. This was designed to prevent brokers from charging double spreads on offsetting positions." },
      { q: "Is forex trading in the U.S. more expensive?", a: "Not necessarily. While fewer competitors exist, the remaining NFA-registered brokers offer competitive spreads. The absence of commission on standard accounts and the strict spread-only model can be cost-effective for average-volume traders." }
    ],
  },
  {
    slug: "finma",
    name: "FINMA",
    fullName: "Swiss Financial Market Supervisory Authority",
    country: "Switzerland",
    code: "CH",
    tier: 1,
    established: 2009,
    website: "https://www.finma.ch",
    licenseCheck: "https://www.finma.ch/en/authorisation/self-regulatory-organisations-and-financial-intermediaries/",
    investorProtection: "esisuisse \u2014 CHF 100,000 per client",
    leverageLimit: "No statutory limit (broker-set)",
    supervisedFirms: "~300 banks and securities dealers",
    overview: [
      "The Swiss Financial Market Supervisory Authority (FINMA) regulates banks, insurance companies, and securities dealers in Switzerland. FINMA-regulated forex brokers are licensed as banks or securities dealers, which subjects them to some of the strictest financial oversight in the world.",
      "Switzerland's reputation for financial stability and privacy makes FINMA regulation highly prestigious. Brokers regulated by FINMA must hold a banking license, which requires significantly more capital than typical forex broker licenses. This creates a high barrier to entry that ensures only well-capitalized firms can operate.",
      "Unlike ESMA-aligned regulators, FINMA does not impose statutory leverage limits for forex trading. Instead, individual brokers set their own leverage policies. Client deposits are protected by the esisuisse depositor protection scheme up to CHF 100,000 per client."
    ],
    requirements: [
      "Banking license or securities dealer license required",
      "Minimum capital CHF 1.5 million for securities dealers, CHF 10 million for banks",
      "Mandatory membership in esisuisse depositor protection",
      "Client asset segregation and detailed reporting",
      "Anti-money laundering compliance under AMLA",
      "Fit and proper requirements for management and board",
      "Annual external audits by FINMA-approved auditors",
      "Risk management framework and internal controls"
    ],
    history: "FINMA was established on 1 January 2009 through the merger of three predecessor agencies: the Swiss Federal Banking Commission (SFBC), the Federal Office of Private Insurance (FOPI), and the Swiss Anti-Money Laundering Control Authority. Switzerland's long history of banking regulation and the country's political neutrality have made FINMA-regulated brokers particularly attractive to high-net-worth traders seeking stability and confidentiality.",
    faq: [
      { q: "Why is FINMA regulation considered prestigious?", a: "FINMA requires brokers to hold banking licenses, which involves meeting extremely high capital requirements (CHF 10 million for banks). This, combined with Switzerland's reputation for financial stability, makes FINMA regulation among the most trusted globally." },
      { q: "Does FINMA cap leverage?", a: "No. Unlike ESMA or ASIC, FINMA does not impose statutory leverage limits. Swiss-regulated brokers set their own leverage policies, though most cap retail leverage at 1:100 to 1:200 as a risk management measure." },
      { q: "How is depositor protection handled?", a: "Client deposits are protected up to CHF 100,000 per client under the esisuisse scheme. Additionally, FINMA requires client funds to be segregated from the broker's own funds." },
      { q: "Are FINMA-regulated brokers more expensive?", a: "Generally, yes. The cost of maintaining a Swiss banking license is passed on to clients through higher minimum deposits (often CHF 1,000+) and sometimes wider spreads. However, the trade-off is significantly higher safety." }
    ],
  },
  {
    slug: "bafin",
    name: "BaFin",
    fullName: "Federal Financial Supervisory Authority",
    country: "Germany",
    code: "DE",
    tier: 1,
    established: 2002,
    website: "https://www.bafin.de",
    licenseCheck: "https://portal.mvp.bafin.de/database/InstInfo/",
    investorProtection: "EdB \u2014 \u20AC100,000 per depositor",
    leverageLimit: "1:30 (retail, ESMA)",
    supervisedFirms: "~6,400 institutions",
    overview: [
      "The Bundesanstalt f\u00FCr Finanzdienstleistungsaufsicht (BaFin) is Germany's integrated financial regulator, overseeing banks, insurance companies, and securities firms. As Europe's largest economy, Germany's financial regulation is among the most robust in the EU.",
      "BaFin-regulated brokers benefit from Germany's strong legal framework and the European Union's MiFID II directive, which provides a harmonized regulatory environment across the EU. This means BaFin-regulated firms can passport their services throughout the European Economic Area.",
      "Investor protection in Germany is provided through the Entsch\u00E4digungseinrichtung der Wertpapierhandelsunternehmen (EdW) for securities trading firms, offering up to \u20AC20,000 in protection, or through the Entsch\u00E4digungseinrichtung deutscher Banken (EdB) for banking entities, offering up to \u20AC100,000."
    ],
    requirements: [
      "MiFID II compliance required for investment services",
      "Minimum initial capital \u20AC750,000 for dealing on own account",
      "Client funds segregation under German banking law",
      "Membership in investor compensation scheme (EdW or EdB)",
      "ESMA-aligned leverage limits: 1:30 major pairs, 1:20 minors",
      "Mandatory negative balance protection for retail clients",
      "Best execution obligations under MiFID II",
      "Transaction reporting to BaFin and ESMA"
    ],
    history: "BaFin was established on 1 May 2002 through the merger of three predecessor agencies: the Federal Banking Supervisory Office (BAKred), the Federal Insurance Supervisory Office (BAV), and the Federal Securities Supervisory Office (BAWe). Germany's tradition of strict financial regulation dates back to the Reichsbank era, and BaFin continues this tradition as one of Europe's most influential regulators.",
    faq: [
      { q: "Does BaFin regulation cover the entire EU?", a: "BaFin-licensed firms can passport their services throughout the European Economic Area (EEA) under MiFID II. However, local registration may be required in some member states." },
      { q: "What compensation is available to German traders?", a: "Securities trading firms are covered by the EdW scheme (up to \u20AC20,000). Banking entities are covered by the EdB scheme (up to \u20AC100,000). Always check which scheme applies to your broker." },
      { q: "How do I verify a BaFin-regulated broker?", a: "Use BaFin's company database at portal.mvp.bafin.de/database/InstInfo/ to search for registered firms by name or BaFin ID number." },
      { q: "Are BaFin regulations stricter than other EU regulators?", a: "BaFin follows the same ESMA/MiFID II framework as other EU regulators but is known for more proactive enforcement. BaFin also took extra steps like banning CFDs with additional payment obligations before ESMA mandated it EU-wide." }
    ],
  },
  {
    slug: "mas",
    name: "MAS",
    fullName: "Monetary Authority of Singapore",
    country: "Singapore",
    code: "SG",
    tier: 1,
    established: 1971,
    website: "https://www.mas.gov.sg",
    licenseCheck: "https://eservices.mas.gov.sg/fid",
    investorProtection: "SDIC \u2014 S$75,000 per depositor",
    leverageLimit: "1:20 (retail)",
    supervisedFirms: "~1,200 financial institutions",
    overview: [
      "The Monetary Authority of Singapore (MAS) serves as both the central bank and financial regulator of Singapore. Established in 1971, MAS has built a reputation as one of Asia's most respected financial regulators, combining strict oversight with a business-friendly approach.",
      "Forex brokers in Singapore must hold a Capital Markets Services (CMS) license from MAS. The regulator enforces leverage limits of 1:20 for retail forex traders, among the most conservative in Asia. MAS also requires brokers to maintain substantial base capital and comply with comprehensive risk management frameworks.",
      "Singapore's status as a global financial hub means MAS-regulated brokers meet some of the highest standards for operational integrity, anti-money laundering, and client fund protection. The Singapore Deposit Insurance Corporation (SDIC) provides protection up to S$75,000 for deposits with MAS-regulated banking entities."
    ],
    requirements: [
      "Capital Markets Services (CMS) license required",
      "Minimum base capital of S$1 million for licensed CMS holders",
      "Client money held in segregated trust accounts",
      "Maximum leverage 1:20 for retail forex trading",
      "Fit and proper criteria for directors and representatives",
      "Comprehensive AML/CFT compliance framework",
      "Business conduct rules and fair dealing obligations",
      "Regular MAS inspections and reporting"
    ],
    history: "MAS was established on 1 January 1971 to oversee all monetary, banking, and financial aspects of Singapore's economy. Under MAS's regulation, Singapore has grown from a regional financial center to a global hub handling over $700 billion in daily forex volume. MAS's approach balances strict consumer protection with innovation-friendly policies, which has attracted major financial institutions to establish their Asia-Pacific headquarters in Singapore.",
    faq: [
      { q: "How do I verify a MAS-licensed broker?", a: "Use the MAS Financial Institutions Directory at eservices.mas.gov.sg/fid to search for licensed firms. You can verify a broker's CMS license status, licensed activities, and any regulatory actions." },
      { q: "What leverage is available in Singapore?", a: "MAS limits retail forex leverage to 1:20 across all currency pairs. Accredited investors (meeting specific wealth/income thresholds) may access higher leverage as they are exempt from certain retail restrictions." },
      { q: "Is Singapore a safe place to trade forex?", a: "Yes. Singapore is consistently ranked as one of the world's most stable and transparent financial centers. MAS's strict regulatory framework, combined with Singapore's rule of law, makes it one of the safest jurisdictions for forex trading." },
      { q: "Do MAS-regulated brokers accept international clients?", a: "Some do, but MAS primarily regulates firms serving the Singapore and Asian markets. International clients should verify whether they are being served under the MAS-licensed entity or a different offshore entity." }
    ],
  },
  {
    slug: "cbi",
    name: "CBI",
    fullName: "Central Bank of Ireland",
    country: "Ireland",
    code: "IE",
    tier: 1,
    established: 1943,
    website: "https://www.centralbank.ie",
    licenseCheck: "https://registers.centralbank.ie/FirmSearchPage.aspx",
    investorProtection: "IICF \u2014 \u20AC20,000 per eligible client",
    leverageLimit: "1:30 (retail, ESMA)",
    supervisedFirms: "~10,000 regulated entities",
    overview: [
      "The Central Bank of Ireland (CBI) is Ireland's central bank and financial regulator. As a member of the European System of Central Banks and the Single Supervisory Mechanism, the CBI applies EU-wide financial regulations while adding its own supervisory expectations for firms based in Ireland.",
      "Ireland has become a significant hub for forex and CFD brokers in the EU, particularly after Brexit led many UK-based firms to establish EU entities in Dublin. CBI-regulated brokers operate under MiFID II and can passport their services throughout the European Economic Area.",
      "The CBI is known for its assertive supervisory approach and has imposed significant fines on financial services firms for compliance failures. Client funds are protected under the Investor Compensation Scheme Ireland (IICF), which provides up to \u20AC20,000 per eligible client."
    ],
    requirements: [
      "MiFID II authorization for investment firms",
      "Minimum capital requirements per MiFID II/CRR framework",
      "Client asset segregation under CBI's Client Asset Regulations",
      "ESMA-aligned leverage limits and negative balance protection",
      "Consumer protection obligations under Consumer Protection Code",
      "Fitness and probity regime for senior personnel",
      "Annual compliance reporting and PCF role approvals",
      "Anti-money laundering compliance under Criminal Justice Act"
    ],
    history: "The Central Bank of Ireland was established in 1943 under the Central Bank Act. Its regulatory mandate expanded significantly following Ireland's EU membership and the 2008 financial crisis. After Brexit in 2020, Ireland became a preferred location for financial firms seeking EU market access, leading to a substantial increase in CBI-regulated investment firms. The CBI has responded by strengthening its supervisory capacity and enforcement capabilities.",
    faq: [
      { q: "Why did many brokers move to Ireland after Brexit?", a: "After the UK left the EU, UK-regulated firms lost their EU passporting rights. Ireland, as an English-speaking EU member with a strong regulatory framework, became the preferred location for establishing EU-authorized entities." },
      { q: "How does CBI regulation compare to FCA?", a: "Both are Tier-1 regulators. CBI operates under the same EU/MiFID II framework. Key differences include investor compensation (\u20AC20,000 vs \u00A385,000 with FCA/FSCS) and the CBI's dual role as central bank and regulator." },
      { q: "How do I check if a broker is CBI-regulated?", a: "Search the CBI's Register of Regulated Firms at registers.centralbank.ie. You can search by firm name, reference number, or activity type." },
      { q: "Does CBI regulation cover crypto trading?", a: "The CBI regulates crypto asset service providers under the EU's MiCA framework. However, crypto CFDs were already regulated under MiFID II as derivatives, so CBI-regulated brokers offering crypto CFDs have been supervised for this activity." }
    ],
  },
  {
    slug: "knf",
    name: "KNF",
    fullName: "Polish Financial Supervision Authority",
    country: "Poland",
    code: "PL",
    tier: 1,
    established: 2006,
    website: "https://www.knf.gov.pl",
    licenseCheck: "https://www.knf.gov.pl/en/ENTITIES",
    investorProtection: "BFG \u2014 \u20AC100,000 per depositor",
    leverageLimit: "1:30 (retail, ESMA)",
    supervisedFirms: "~2,700 supervised entities",
    overview: [
      "The Polish Financial Supervision Authority (Komisja Nadzoru Finansowego, KNF) is the integrated financial regulator of Poland, overseeing banking, capital markets, insurance, and pension funds. As an EU member state, KNF applies MiFID II regulations and ESMA guidelines to all investment firms.",
      "Poland has become an increasingly important market for retail forex trading in Central Europe. KNF has taken a proactive stance on consumer protection, implementing additional measures beyond ESMA requirements to safeguard retail traders.",
      "KNF-regulated brokers benefit from the EU passporting system and are backed by Poland's Banking Guarantee Fund (Bankowy Fundusz Gwarancyjny, BFG), which provides depositor protection up to \u20AC100,000. XTB, one of the largest publicly-traded forex brokers globally, is headquartered in Warsaw under KNF supervision."
    ],
    requirements: [
      "MiFID II authorization for investment services",
      "Minimum initial capital per EU CRR/CRD requirements",
      "Client funds segregation per KNF guidelines",
      "ESMA-aligned leverage limits and product governance",
      "Polish language client documentation where required",
      "KNF pre-approval for significant shareholding changes",
      "Compliance with Polish Anti-Money Laundering Act",
      "Regular reporting to KNF and participation in compensation scheme"
    ],
    history: "KNF was established on 21 July 2006, merging the functions of the Securities and Exchange Commission, Insurance and Pension Funds Supervisory Commission, and Banking Supervision Commission. Poland's rapid economic growth and EU accession in 2004 fueled the expansion of its financial services sector. KNF has gained respect for its balanced approach, promoting market development while maintaining robust consumer protection standards.",
    faq: [
      { q: "Which major brokers are KNF-regulated?", a: "The most notable KNF-regulated broker is XTB (X-Trade Brokers), which is publicly traded on the Warsaw Stock Exchange. Several international brokers also hold KNF authorization to serve Polish clients." },
      { q: "How does KNF compare to CySEC?", a: "Both operate under the same EU/MiFID II framework. KNF is generally considered stricter in enforcement and has imposed higher penalties for violations. Poland's BFG scheme also offers higher protection (\u20AC100,000) compared to CySEC's ICF (\u20AC20,000)." },
      { q: "Can KNF-authorized brokers serve all EU clients?", a: "Yes. Under MiFID II passporting, KNF-authorized investment firms can provide services throughout the European Economic Area without additional authorization." },
      { q: "How do I file a complaint against a KNF-regulated broker?", a: "Complaints should first be directed to the broker. If unresolved, you can file a complaint with the KNF or seek resolution through the Financial Ombudsman (Rzecznik Finansowy) in Poland." }
    ],
  },
  {
    slug: "cysec",
    name: "CySEC",
    fullName: "Cyprus Securities and Exchange Commission",
    country: "Cyprus (EU)",
    code: "CY",
    tier: 1,
    established: 2001,
    website: "https://www.cysec.gov.cy",
    licenseCheck: "https://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/",
    investorProtection: "ICF \u2014 \u20AC20,000 per eligible client",
    leverageLimit: "1:30 (retail, ESMA)",
    supervisedFirms: "~300 Cyprus Investment Firms (CIFs)",
    overview: [
      "The Cyprus Securities and Exchange Commission (CySEC) is the financial regulatory authority of Cyprus, an EU member state. CySEC has become one of the most popular regulators for forex and CFD brokers due to Cyprus's favorable tax regime, EU membership, and efficient licensing process.",
      "As an EU regulator, CySEC enforces MiFID II regulations, providing the same level of regulatory oversight as other European financial authorities. CySEC-regulated brokers can passport their services throughout the European Economic Area, making Cyprus a gateway to the entire EU market.",
      "CySEC has significantly tightened its supervision in recent years, moving beyond its earlier reputation as a lenient regulator. The authority has imposed substantial fines, revoked licenses, and actively cooperated with ESMA on pan-European investor protection measures including leverage limits and negative balance protection."
    ],
    requirements: [
      "Cyprus Investment Firm (CIF) license required",
      "Minimum initial capital \u20AC750,000 for market makers, \u20AC150,000 for STP brokers",
      "Client funds segregated in EU-based banks",
      "Participation in Investor Compensation Fund (ICF)",
      "ESMA leverage limits: 1:30 major pairs, 1:20 minors",
      "Negative balance protection mandatory",
      "Local office with qualified compliance officer in Cyprus",
      "Quarterly and annual reporting to CySEC"
    ],
    history: "CySEC was established in 2001 and gained significant prominence after Cyprus joined the European Union in 2004. The EU membership allowed CySEC-licensed firms to passport throughout Europe, triggering a wave of forex broker registrations in Cyprus. After criticism for lax oversight, CySEC underwent a major transformation from 2016 onwards, increasing staff, imposing large fines, and revoking licenses of non-compliant firms.",
    faq: [
      { q: "Is CySEC regulation safe?", a: "Yes. CySEC is a full EU regulator operating under MiFID II. It enforces the same leverage limits, negative balance protection, and client fund rules as regulators in Germany, France, and other EU states. The ICF provides up to \u20AC20,000 in compensation per client." },
      { q: "Why do so many brokers choose Cyprus?", a: "Cyprus offers a combination of EU membership (passporting), competitive corporate tax (12.5%), English-speaking workforce, strategic timezone between Europe and Asia, and a well-established financial services ecosystem." },
      { q: "How do I verify a CySEC license?", a: "Visit cysec.gov.cy and search the register of authorized Cyprus Investment Firms. You can find firms by name or CIF number and verify their authorized services." },
      { q: "What is the ICF and how does it work?", a: "The Investor Compensation Fund (ICF) protects eligible clients of CySEC-regulated brokers up to \u20AC20,000 if the firm is unable to meet its obligations. Coverage applies to retail clients only; professional clients are not covered." }
    ],
  },
  {
    slug: "dfsa",
    name: "DFSA",
    fullName: "Dubai Financial Services Authority",
    country: "UAE (DIFC)",
    code: "AE",
    tier: 2,
    established: 2004,
    website: "https://www.dfsa.ae",
    licenseCheck: "https://www.dfsa.ae/public-register",
    investorProtection: "None \u2014 no statutory compensation scheme",
    leverageLimit: "Risk-based (broker-set)",
    supervisedFirms: "~500 firms in DIFC",
    overview: [
      "The Dubai Financial Services Authority (DFSA) is the independent regulator of financial services conducted in or from the Dubai International Financial Centre (DIFC). The DFSA regulates a broad range of financial activities including forex trading, banking, and asset management within the DIFC free zone.",
      "The DFSA has built a strong reputation as a competent, internationally-recognized financial regulator. It follows a principles-based regulatory approach inspired by best practices from the FCA, ASIC, and other Tier-1 regulators. DFSA-regulated firms operate within the DIFC's English common law framework, separate from UAE federal law.",
      "While the DFSA does not have a formal investor compensation scheme, it enforces strict capital adequacy requirements and client money handling rules. The DIFC's independent judicial system, including its own courts and arbitration center, provides an additional layer of protection for clients."
    ],
    requirements: [
      "DFSA license for relevant financial service activities",
      "Minimum base capital of $500,000 for Category 3A (dealing) firms",
      "Client money held in segregated accounts",
      "Physical office and compliance presence in DIFC required",
      "Anti-money laundering compliance under DIFC AML regime",
      "Fit and proper requirements for authorized individuals",
      "Ongoing prudential returns and risk reporting",
      "Business conducted in accordance with DFSA Conduct of Business rules"
    ],
    history: "The DFSA was established in 2004 alongside the creation of the Dubai International Financial Centre. The DIFC was conceived as an on-shore financial hub bridging the time zone gap between London and Hong Kong. The DFSA has grown from a small start-up regulator to an internationally recognized authority, gaining associate membership of IOSCO and signing cooperation agreements with over 80 regulators worldwide.",
    faq: [
      { q: "What is the difference between DFSA and SCA regulation in the UAE?", a: "The DFSA regulates firms operating within the DIFC free zone only. The Securities and Commodities Authority (SCA) regulates financial services in the broader UAE. They are separate regulators with different frameworks." },
      { q: "Is there investor compensation in the DIFC?", a: "No. Unlike the UK's FSCS or EU's ICF schemes, the DIFC does not have a statutory investor compensation fund. However, DFSA-regulated firms must maintain adequate capital and segregate client funds." },
      { q: "How do I verify a DFSA-licensed firm?", a: "Search the DFSA Public Register at dfsa.ae/public-register. You can find firms by name and verify their licensed activities, status, and any enforcement actions." },
      { q: "Can DFSA-regulated brokers serve clients outside the UAE?", a: "DFSA-regulated firms primarily serve clients in the DIFC and the Middle East/North Africa region. Some also accept international clients, but passporting rights similar to the EU do not exist." }
    ],
  },
  {
    slug: "fma",
    name: "FMA",
    fullName: "Financial Markets Authority",
    country: "New Zealand",
    code: "NZ",
    tier: 2,
    established: 2011,
    website: "https://www.fma.govt.nz",
    licenseCheck: "https://www.fma.govt.nz/business/compliance/licensed-providers/",
    investorProtection: "None \u2014 no statutory compensation scheme",
    leverageLimit: "No statutory cap",
    supervisedFirms: "~1,800 licensed providers",
    overview: [
      "The Financial Markets Authority (FMA) is New Zealand's financial services regulator, responsible for overseeing capital markets, financial services providers, and derivatives trading. The FMA was established in 2011 following a review of New Zealand's financial regulatory framework.",
      "New Zealand has historically been a popular domicile for forex brokers due to its relatively accessible licensing requirements and the country's strong rule of law. The FMA does not impose statutory leverage limits, making it attractive for brokers seeking to offer higher leverage to clients.",
      "In recent years, the FMA has strengthened its regulatory framework, introducing a licensing regime for derivatives issuers in 2021. This requires all firms offering CFDs and forex to New Zealand clients to hold a derivatives issuer license, raising the bar for market entry."
    ],
    requirements: [
      "Derivatives Issuer License required (since 2021)",
      "Minimum solvency and capital requirements",
      "Client money and property handling per FMC Act",
      "Fair dealing obligations and responsible financial benchmarks",
      "Membership in independent dispute resolution scheme",
      "Fit and proper person requirements for directors and senior managers",
      "AML/CFT compliance under New Zealand's AML regime",
      "Regular compliance and financial reporting to FMA"
    ],
    history: "The FMA was established on 1 May 2011, replacing the Securities Commission. The 2021 introduction of the derivatives issuer licensing regime was a landmark moment, requiring all existing forex and CFD providers to apply for a new license or cease operations. This resulted in several firms leaving New Zealand and established the FMA as a more credible supervisor of the derivatives market.",
    faq: [
      { q: "Does the FMA cap forex leverage?", a: "No. Unlike ESMA or ASIC, the FMA does not impose statutory leverage limits. Leverage levels are set by individual brokers, though the FMA expects firms to manage leverage risk appropriately." },
      { q: "Is there investor compensation in New Zealand?", a: "No. New Zealand does not have an investor compensation scheme like the UK's FSCS or the EU's ICF. However, client funds must be held in trust accounts and cannot be used by the broker for its own purposes." },
      { q: "How has FMA regulation changed recently?", a: "The 2021 introduction of derivatives issuer licensing was the biggest change. Previously, forex brokers only needed Financial Service Provider (FSP) registration, which had much lower requirements. The new regime requires proper licensing with capital, compliance, and reporting obligations." },
      { q: "How do I check if a broker is FMA-licensed?", a: "Visit the FMA's Financial Service Providers Register at fma.govt.nz. Search by company name to verify their license type, status, and any warnings or enforcement actions." }
    ],
  },
  {
    slug: "fsca",
    name: "FSCA",
    fullName: "Financial Sector Conduct Authority",
    country: "South Africa",
    code: "ZA",
    tier: 2,
    established: 2018,
    website: "https://www.fsca.co.za",
    licenseCheck: "https://www.fsca.co.za/Fais/Search_FSP.htm",
    investorProtection: "None \u2014 no statutory compensation scheme",
    leverageLimit: "No statutory cap",
    supervisedFirms: "~10,600 authorized FSPs",
    overview: [
      "The Financial Sector Conduct Authority (FSCA) is South Africa's market conduct regulator for financial institutions, established in 2018 under the Financial Sector Regulation Act. It replaced the Financial Services Board (FSB) and operates alongside the Prudential Authority (under the South African Reserve Bank) in a Twin Peaks regulatory model.",
      "South Africa is Africa's largest and most developed financial market, and FSCA regulation is considered the most credible in the continent. Forex brokers must obtain a Financial Service Provider (FSP) license under the Financial Advisory and Intermediary Services (FAIS) Act to offer over-the-counter derivatives.",
      "The FSCA has been progressively strengthening its oversight of the retail forex market, introducing new regulations for OTC derivative providers and increasing enforcement against unlicensed operators. While it does not impose leverage limits or offer investor compensation, its licensing requirements and conduct standards provide meaningful protection."
    ],
    requirements: [
      "Financial Service Provider (FSP) license under FAIS Act",
      "OTC Derivative Provider (ODP) authorization for forex/CFD brokers",
      "Minimum capital requirements based on business model",
      "Key Individual and Representative registration",
      "Client asset protection under FAIS subordinate legislation",
      "Compliance officer appointment mandatory",
      "FICA (AML/CFT) compliance requirements",
      "Annual compliance reports and financial statements to FSCA"
    ],
    history: "The FSCA was established on 1 April 2018 as part of South Africa's Twin Peaks regulatory reform. Its predecessor, the Financial Services Board, had regulated the financial services industry since 1990. The reform was prompted by the 2008 financial crisis and aimed to create a dedicated market conduct regulator separate from prudential supervision. The FSCA has since taken a more active role in regulating the growing retail forex market in South Africa.",
    faq: [
      { q: "Is FSCA regulation trustworthy?", a: "Yes. The FSCA is Africa's most credible financial regulator, operating within a sophisticated legal framework. While it doesn't offer the same level of protection as Tier-1 regulators (no compensation scheme, no leverage caps), it does enforce conduct standards and capital requirements." },
      { q: "Does the FSCA cap leverage?", a: "No. The FSCA does not impose statutory leverage limits for retail forex trading. Brokers set their own leverage policies, and many FSCA-regulated brokers offer leverage up to 1:500." },
      { q: "How do I verify an FSCA-licensed broker?", a: "Search the FSCA's FSP register at fsca.co.za/Fais/Search_FSP.htm. Enter the company name or FSP number to verify their license status and authorized categories of service." },
      { q: "Is there compensation if my FSCA broker fails?", a: "No. South Africa does not have an investor compensation scheme for retail forex clients. However, the FSCA requires brokers to maintain adequate capital and handle client assets properly under FAIS regulations." }
    ],
  },
  {
    slug: "efsa",
    name: "EFSA",
    fullName: "Estonian Financial Supervision Authority",
    country: "Estonia",
    code: "EE",
    tier: 2,
    established: 2002,
    website: "https://www.fi.ee",
    licenseCheck: "https://www.fi.ee/en/investment/licensed-investment-firms",
    investorProtection: "Guarantee Fund \u2014 \u20AC20,000 per investor",
    leverageLimit: "1:30 (retail, ESMA)",
    supervisedFirms: "~100 licensed firms",
    overview: [
      "The Estonian Financial Supervision Authority (Finantsinspektsioon, EFSA) is Estonia's financial regulator, operating under the central bank (Eesti Pank). As an EU member state, Estonia applies MiFID II and ESMA regulations, providing the same level of regulatory framework as larger EU countries.",
      "Estonia has gained attention in the fintech space due to its e-Residency program and digital-first approach to government services. Some forex brokers have established operations in Estonia to benefit from the EU passporting system and the country's innovative business environment.",
      "EFSA-regulated brokers operate under the full suite of EU investor protection measures, including ESMA leverage limits, negative balance protection, and access to the Estonian Guarantee Fund, which covers up to \u20AC20,000 per investor in case of broker insolvency."
    ],
    requirements: [
      "MiFID II investment firm authorization",
      "Minimum initial capital per EU CRR requirements",
      "Client fund segregation per Estonian Securities Market Act",
      "Participation in Estonian Guarantee Fund",
      "ESMA-aligned leverage limits and product governance",
      "Local management and compliance presence in Estonia",
      "AML/CFT compliance under Estonian Money Laundering Act",
      "Regular prudential reporting to EFSA"
    ],
    history: "The Estonian Financial Supervision Authority was established in 2002 as part of Estonia's preparation for EU accession (achieved in 2004). Estonia's advanced digital infrastructure and pro-business environment have attracted fintech companies, though the number of EFSA-regulated forex brokers remains relatively small compared to Cyprus or Ireland.",
    faq: [
      { q: "Is EFSA a credible regulator?", a: "Yes. As an EU regulator, EFSA enforces the same MiFID II framework as larger EU authorities. Estonia's Guarantee Fund provides up to \u20AC20,000 in investor protection, matching the CySEC ICF scheme." },
      { q: "Can EFSA-licensed firms serve all EU clients?", a: "Yes. Under MiFID II passporting, EFSA-authorized investment firms can provide services throughout the European Economic Area without additional authorization." },
      { q: "How do I verify an EFSA-licensed broker?", a: "Visit fi.ee and check the list of licensed investment firms. You can verify a firm's license status, authorized activities, and any regulatory actions." },
      { q: "Why do some brokers choose Estonia over Cyprus?", a: "Estonia offers a highly digital business environment, competitive operating costs, and access to the EU single market. Some firms prefer Estonia's reputation for innovation and transparency over the crowded Cyprus market." }
    ],
  },
  {
    slug: "fsa",
    name: "FSA",
    fullName: "Financial Services Authority (Seychelles)",
    country: "Seychelles",
    code: "SC",
    tier: 3,
    established: 2013,
    website: "https://www.fsaseychelles.sc",
    licenseCheck: "https://www.fsaseychelles.sc/regulated-entities/securities-dealer",
    investorProtection: "None",
    leverageLimit: "No statutory cap",
    supervisedFirms: "~200 securities dealers",
    overview: [
      "The Financial Services Authority of Seychelles (FSA) regulates non-bank financial services in this Indian Ocean island nation. The Seychelles has become one of the most popular offshore jurisdictions for forex brokers due to its low barriers to entry, minimal capital requirements, and no leverage restrictions.",
      "FSA regulation is classified as Tier 3 because it lacks the robust consumer protection measures found in Tier 1 and Tier 2 jurisdictions. There is no investor compensation scheme, no mandatory leverage limits, and limited enforcement capabilities compared to regulators like the FCA or ASIC.",
      "Many international brokers use the Seychelles as a secondary licensing jurisdiction to offer higher leverage and more flexible terms to clients outside of regulated markets like the EU, UK, or Australia. Traders choosing FSA-regulated entities should be aware of the reduced protections."
    ],
    requirements: [
      "Securities Dealer License from FSA",
      "Minimum paid-up capital of $50,000",
      "Annual audited financial statements",
      "Compliance officer appointment",
      "Basic AML/KYC procedures",
      "Fit and proper requirements for directors",
      "Local registered office in Seychelles",
      "Annual license renewal fee"
    ],
    history: "The FSA Seychelles was established in 2013 under the Financial Services Authority Act. The Seychelles quickly became a popular domicile for offshore forex brokers due to its competitive licensing costs (significantly lower than Tier-1 jurisdictions), absence of leverage restrictions, and simplified regulatory requirements.",
    faq: [
      { q: "Is FSA Seychelles regulation safe?", a: "FSA Seychelles provides basic regulatory oversight but significantly less protection than Tier-1 regulators. There is no investor compensation scheme, limited enforcement resources, and no leverage restrictions. It's best suited for experienced traders who understand the risks." },
      { q: "Why do major brokers have FSA Seychelles entities?", a: "Many established brokers (like IC Markets, Pepperstone) operate Seychelles entities to offer higher leverage and fewer restrictions to clients who cannot or choose not to trade under stricter regulations." },
      { q: "What are the risks of trading with an FSA Seychelles broker?", a: "No compensation if the broker becomes insolvent, limited regulatory enforcement, higher leverage increasing risk of losses, and fewer dispute resolution mechanisms compared to Tier-1 jurisdictions." },
      { q: "How do I verify an FSA Seychelles license?", a: "Visit fsaseychelles.sc and check the list of regulated securities dealers. Verify the broker's license number, status, and authorized activities." }
    ],
  },
  {
    slug: "fsc",
    name: "FSC",
    fullName: "Financial Services Commission (Mauritius)",
    country: "Mauritius",
    code: "MU",
    tier: 3,
    established: 2001,
    website: "https://www.fscmauritius.org",
    licenseCheck: "https://www.fscmauritius.org/en/supervision/register-of-licensees",
    investorProtection: "None",
    leverageLimit: "No statutory cap",
    supervisedFirms: "~900 Global Business Corporations",
    overview: [
      "The Financial Services Commission (FSC) of Mauritius regulates non-banking financial services and global business activities in Mauritius. The FSC has gained prominence as an offshore financial center, particularly for companies serving African, Asian, and Middle Eastern markets.",
      "Mauritius offers an Investment Dealer License for forex and CFD brokers, which comes with relatively modest capital requirements compared to Tier-1 jurisdictions. The FSC does not impose leverage limits or require participation in an investor compensation scheme.",
      "While the FSC has been working to improve its regulatory standards and is a member of IOSCO, it is still classified as a Tier-3 regulator due to limited consumer protections. Traders should approach FSC-regulated brokers with appropriate caution and risk awareness."
    ],
    requirements: [
      "Investment Dealer (Full Service Dealer) License",
      "Minimum unimpaired capital of MUR 10 million (~$220,000)",
      "Annual audited financial statements",
      "Compliance officer and MLRO appointment",
      "AML/CFT compliance under Financial Intelligence Act",
      "Client fund handling per FSC rules",
      "Fit and proper requirements for officers and shareholders",
      "Quarterly prudential returns to FSC"
    ],
    history: "The FSC was established in 2001 under the Financial Services Act 2007 (replacing the earlier Financial Services Development Act 2001). Mauritius has positioned itself as a financial gateway between Africa and Asia, leveraging its network of double tax treaties and its membership in various international organizations including IOSCO.",
    faq: [
      { q: "How does FSC Mauritius compare to other offshore regulators?", a: "FSC Mauritius is considered slightly more credible than some other Tier-3 regulators due to its IOSCO membership and higher capital requirements. However, it still lacks investor compensation and leverage limits." },
      { q: "Are my funds protected with an FSC Mauritius broker?", a: "There is no investor compensation scheme in Mauritius. The FSC requires client fund handling procedures, but there is no statutory fund segregation requirement as stringent as Tier-1 jurisdictions." },
      { q: "How do I verify an FSC Mauritius license?", a: "Search the FSC's Register of Licensees at fscmauritius.org. You can verify a firm's license type, status, and authorized activities." },
      { q: "What leverage can FSC Mauritius brokers offer?", a: "There are no statutory leverage limits. FSC Mauritius-regulated brokers typically offer leverage ranging from 1:100 to 1:1000, depending on their internal risk policies." }
    ],
  },
  {
    slug: "ifsc",
    name: "IFSC",
    fullName: "International Financial Services Commission",
    country: "Belize",
    code: "BZ",
    tier: 3,
    established: 1999,
    website: "https://www.ifsc.gov.bz",
    licenseCheck: "https://www.ifsc.gov.bz/licensees/",
    investorProtection: "None",
    leverageLimit: "No statutory cap",
    supervisedFirms: "~150 licensees",
    overview: [
      "The International Financial Services Commission (IFSC) of Belize regulates international financial services operating from Belize. The IFSC issues licenses for forex and CFD brokers under its Securities Industry framework, with some of the lowest capital requirements and simplest licensing processes in the industry.",
      "Belize is classified as a Tier-3 jurisdiction due to minimal regulatory oversight, no investor compensation scheme, and no leverage restrictions. The IFSC's enforcement capabilities are limited, and dispute resolution options for traders are minimal compared to developed-market regulators.",
      "Despite these limitations, several well-known international brokers maintain IFSC-licensed entities as part of their multi-jurisdictional structure, offering higher leverage and fewer restrictions to clients who choose to trade under Belizean regulation."
    ],
    requirements: [
      "Trading in Securities license from IFSC",
      "Minimum paid-up capital of $500,000",
      "Annual audited financial statements",
      "Local registered agent in Belize",
      "Compliance with IFSC Anti-Money Laundering guidelines",
      "Fit and proper requirements for directors",
      "Annual license renewal fee",
      "Basic record-keeping and reporting obligations"
    ],
    history: "The IFSC was established in 1999 under the International Financial Services Commission Act. Belize positioned itself as an offshore financial center to diversify its economy beyond agriculture and tourism. The IFSC has gradually increased its regulatory requirements over the years, though it remains a permissive jurisdiction by global standards.",
    faq: [
      { q: "Is IFSC Belize regulation reliable?", a: "IFSC Belize provides basic oversight but significantly less protection than Tier-1 or Tier-2 regulators. There is no investor compensation, limited enforcement, and no leverage caps. It should be considered an offshore regulation." },
      { q: "What leverage do IFSC Belize brokers offer?", a: "There are no statutory limits. IFSC-licensed brokers commonly offer leverage of 1:400 to 1:1000. While attractive, this dramatically increases the risk of significant losses." },
      { q: "How do I verify an IFSC license?", a: "Visit ifsc.gov.bz/licensees/ to see the list of currently licensed entities. You can verify a broker's license number and status." },
      { q: "Should I choose an IFSC-regulated entity over a Tier-1 one?", a: "Generally, no. If a broker offers both Tier-1 (FCA, ASIC) and Tier-3 (IFSC) entities, choose the Tier-1 entity for better protection. The only reason to choose IFSC is if you require leverage above Tier-1 limits and fully understand the risks." }
    ],
  },
  {
    slug: "cima",
    name: "CIMA",
    fullName: "Cayman Islands Monetary Authority",
    country: "Cayman Islands",
    code: "KY",
    tier: 3,
    established: 1997,
    website: "https://www.cima.ky",
    licenseCheck: "https://www.cima.ky/search-entities",
    investorProtection: "None",
    leverageLimit: "No statutory cap",
    supervisedFirms: "~14,000 registered entities",
    overview: [
      "The Cayman Islands Monetary Authority (CIMA) is the financial regulatory body of the Cayman Islands, one of the world's largest offshore financial centers. While CIMA oversees a massive volume of regulated entities (primarily investment funds), its oversight of retail forex brokers is relatively limited.",
      "CIMA issues Securities Investment Business licenses for forex and CFD brokers. The Cayman Islands' zero-tax environment and established financial infrastructure make it attractive for broker registration. However, the lack of an investor compensation scheme and no leverage restrictions place it in the Tier-3 category for retail forex regulation.",
      "The Cayman Islands has a sophisticated financial and legal infrastructure more advanced than most Tier-3 jurisdictions. CIMA is recognized by major international bodies and has cooperation agreements with numerous foreign regulators. However, for retail forex traders, the protection level does not match Tier-1 standards."
    ],
    requirements: [
      "Securities Investment Business License from CIMA",
      "Minimum net worth requirements based on license category",
      "Annual audited financial statements by CIMA-approved auditor",
      "Compliance officer appointment required",
      "AML/CFT compliance under Proceeds of Crime Law",
      "Fit and proper requirements for controllers and officers",
      "Local registered office and directors in Cayman Islands",
      "Ongoing regulatory reporting and fees"
    ],
    history: "CIMA was established in 1997 to consolidate financial regulation in the Cayman Islands. The territory has been a leading offshore financial center since the 1960s, initially focused on banking and fund administration. While the Cayman Islands is best known for hedge funds and structured finance, some forex brokers have also established presence there to leverage the jurisdiction's zero-tax status and international recognition.",
    faq: [
      { q: "Is CIMA a credible regulator?", a: "CIMA is a well-established regulatory authority recognized by international bodies. However, for retail forex trading specifically, the lack of investor compensation and leverage limits means it provides less consumer protection than Tier-1 regulators." },
      { q: "Why choose a CIMA-regulated broker?", a: "CIMA-regulated entities may offer higher leverage and more flexible trading conditions. However, this comes with reduced consumer protection. Choose CIMA only if you're an experienced trader who fully understands the trade-offs." },
      { q: "How do I verify a CIMA license?", a: "Search CIMA's entity database at cima.ky/search-entities. You can verify a firm's registration status, license type, and authorized activities." },
      { q: "Are my funds safe with a CIMA-regulated broker?", a: "CIMA requires basic client fund handling procedures, but there is no statutory compensation scheme. If a CIMA-regulated broker becomes insolvent, recovery of client funds depends on the broker's asset management and insolvency proceedings." }
    ],
  },
  {
    slug: "scb",
    name: "SCB",
    fullName: "Securities Commission of the Bahamas",
    country: "Bahamas",
    code: "BS",
    tier: 3,
    established: 1995,
    website: "https://www.scb.gov.bs",
    licenseCheck: "https://www.scb.gov.bs/registered-firms/",
    investorProtection: "None",
    leverageLimit: "No statutory cap",
    supervisedFirms: "~200 registered firms",
    overview: [
      "The Securities Commission of the Bahamas (SCB) regulates the securities and capital markets industry in the Bahamas. The SCB issues licenses for broker-dealers and securities firms, including those offering forex and CFD trading services.",
      "The Bahamas has attracted several notable forex brokers, including IC Markets' offshore entity, due to its proximity to the United States, English-speaking environment, and relatively accessible licensing framework. However, the SCB does not provide the same level of consumer protection as Tier-1 regulators.",
      "The SCB has been working to enhance its regulatory framework and improve international cooperation. It is a member of IOSCO and has signed memoranda of understanding with multiple foreign regulators. Despite these efforts, the absence of an investor compensation scheme and leverage limits keeps it in the Tier-3 category."
    ],
    requirements: [
      "Securities Firm Registration with SCB",
      "Minimum capital requirements based on business category",
      "Annual audited financial statements",
      "Compliance officer appointment",
      "AML/CFT compliance under Financial Transactions Reporting Act",
      "Fit and proper requirements for officers and controllers",
      "Local presence in the Bahamas",
      "Ongoing regulatory reporting and fee obligations"
    ],
    history: "The SCB was established in 1995 under the Securities Industry Act. The Bahamas has a long history as an offshore financial center, initially focused on banking and trust services. The SCB has gradually modernized its regulatory framework and increased cooperation with international regulatory bodies, while maintaining the Bahamas' position as a competitive offshore jurisdiction.",
    faq: [
      { q: "Which major brokers are registered with the SCB?", a: "Several well-known international brokers maintain SCB-registered entities, including IC Markets (Raw Trading Ltd). These entities typically serve clients who want higher leverage than what is available under Tier-1 regulation." },
      { q: "Is SCB regulation safe for forex trading?", a: "The SCB provides basic regulatory oversight but significantly less protection than Tier-1 regulators. There is no investor compensation scheme, and leverage is unrestricted. It is considered an offshore regulation." },
      { q: "How do I verify SCB registration?", a: "Visit scb.gov.bs and check the list of registered firms. You can verify a firm's registration status and authorized activities." },
      { q: "Does the SCB have enforcement capabilities?", a: "The SCB can investigate, sanction, and de-register firms. However, its enforcement resources are limited compared to larger regulators like the FCA or ASIC." }
    ],
  },
  {
    slug: "vfsc",
    name: "VFSC",
    fullName: "Vanuatu Financial Services Commission",
    country: "Vanuatu",
    code: "VU",
    tier: 3,
    established: 1993,
    website: "https://www.vfsc.vu",
    licenseCheck: "https://www.vfsc.vu/find-a-licensee/",
    investorProtection: "None",
    leverageLimit: "No statutory cap",
    supervisedFirms: "~2,000 registered entities",
    overview: [
      "The Vanuatu Financial Services Commission (VFSC) regulates financial services in Vanuatu, a Pacific Island nation. The VFSC issues Financial Dealer Licenses for forex and CFD brokers, and Vanuatu has become a popular offshore jurisdiction due to its low costs and minimal regulatory requirements.",
      "Vanuatu regulation is classified as Tier 3 and is among the most permissive in the forex industry. The VFSC imposes no leverage limits, has no investor compensation scheme, and has limited enforcement resources. The minimum capital requirements and licensing costs are very low compared to other jurisdictions.",
      "In 2019, the VFSC implemented reforms to strengthen its regulatory framework, including higher capital requirements and stricter due diligence for license applicants. However, these changes have not significantly altered its Tier-3 classification in terms of consumer protection."
    ],
    requirements: [
      "Financial Dealer License from VFSC",
      "Minimum capital of $50,000",
      "Annual audited financial statements",
      "Local registered agent in Vanuatu",
      "Compliance with AML/CFT legislation",
      "Fit and proper assessment for directors",
      "Annual license renewal",
      "Basic operational and reporting obligations"
    ],
    history: "The VFSC was established in 1993 under the VFSC Act. Vanuatu emerged as a popular offshore financial center in the 2010s, with dozens of forex brokers obtaining VFSC licenses. The rapid growth led to concerns about regulatory standards, prompting reforms in 2019 that introduced stricter licensing requirements. Despite these improvements, Vanuatu remains one of the most accessible offshore jurisdictions for broker registration.",
    faq: [
      { q: "How does VFSC compare to other offshore regulators?", a: "VFSC is among the most permissive offshore regulators, with lower capital requirements than many peers. It is generally considered less robust than FSA Seychelles or FSC Mauritius in terms of regulatory oversight." },
      { q: "Should I trust a VFSC-regulated broker?", a: "VFSC regulation provides minimal consumer protection. If a broker offers both VFSC and Tier-1 entities, always choose the Tier-1 entity. Only use VFSC entities if you need very high leverage and fully understand the risks." },
      { q: "How do I verify a VFSC license?", a: "Visit vfsc.vu/find-a-licensee/ and search for the company name or license number to verify their registration status." },
      { q: "What leverage do VFSC brokers typically offer?", a: "There are no statutory limits. VFSC-registered brokers commonly offer leverage from 1:200 to 1:1000, with some offering even higher ratios." }
    ],
  },
  // ─── M4 Phase 2.5: New US & International Regulators ───
  {
    slug: "sec",
    name: "SEC",
    fullName: "Securities and Exchange Commission",
    country: "United States",
    code: "US",
    tier: 1,
    established: 1934,
    website: "https://www.sec.gov",
    licenseCheck: "https://www.sec.gov/cgi-bin/browse-edgar",
    investorProtection: "SIPC — $500,000 per customer ($250,000 cash)",
    leverageLimit: "2:1 overnight, 4:1 intraday (PDT)",
    supervisedFirms: "~28,000 registered entities",
    overview: [
      "The Securities and Exchange Commission (SEC) is the primary regulator of securities markets in the United States. Established in 1934 following the Great Depression, the SEC oversees stock exchanges, broker-dealers, investment advisers, and mutual funds.",
      "SEC-registered broker-dealers must maintain net capital requirements, segregate customer assets, and submit to regular examinations. Investors are protected by SIPC coverage up to $500,000 per customer.",
    ],
    requirements: [
      "Registration as broker-dealer under the Securities Exchange Act",
      "Membership in FINRA for broker-dealers",
      "Net capital requirements based on business type",
      "Customer asset segregation and protection",
      "Regular SEC and FINRA examinations",
      "Compliance with Regulation Best Interest (Reg BI)",
    ],
    history: "The SEC was created by the Securities Exchange Act of 1934 to restore investor confidence after the 1929 stock market crash. It has since evolved into one of the world's most influential securities regulators.",
    faq: [
      { q: "What does SEC regulation mean for traders?", a: "SEC regulation means your broker is subject to rigorous US financial laws, regular audits, and SIPC investor protection up to $500K." },
      { q: "Is SEC the same as FINRA?", a: "No. The SEC is a government agency. FINRA is a self-regulatory organization that oversees broker-dealers under SEC authority." },
    ],
  },
  {
    slug: "finra",
    name: "FINRA",
    fullName: "Financial Industry Regulatory Authority",
    country: "United States",
    code: "US",
    tier: 1,
    established: 2007,
    website: "https://www.finra.org",
    licenseCheck: "https://brokercheck.finra.org",
    investorProtection: "SIPC membership required for all members",
    leverageLimit: "Governed by Regulation T and FINRA rules",
    supervisedFirms: "~3,400 broker-dealers",
    overview: [
      "FINRA is the largest self-regulatory organization (SRO) for broker-dealers in the United States. It operates under SEC oversight and is responsible for examining firms, writing rules, and enforcing compliance.",
      "All US broker-dealers must be FINRA members. FINRA's BrokerCheck tool allows investors to verify the registration status and disciplinary history of any broker or financial advisor.",
    ],
    requirements: [
      "All broker-dealers must register with FINRA",
      "Licensed representatives must pass qualifying exams (Series 7, etc.)",
      "Compliance with FINRA conduct rules and fair practice standards",
      "Participation in SIPC for investor protection",
      "Submission to FINRA examination and audit program",
    ],
    history: "FINRA was created in 2007 through the merger of NASD and NYSE's regulatory arm. It inherited NASD's role as the primary regulator of broker-dealers, now overseeing ~3,400 firms and ~620,000 registered representatives.",
    faq: [
      { q: "How do I check if a broker is FINRA registered?", a: "Use FINRA BrokerCheck at brokercheck.finra.org — search by firm name or CRD number to verify registration and view disciplinary history." },
      { q: "What happens if a FINRA broker fails?", a: "SIPC coverage protects customer accounts up to $500,000 ($250,000 cash). FINRA also has enforcement powers to fine, suspend, or expel member firms." },
    ],
  },
  {
    slug: "cftc",
    name: "CFTC",
    fullName: "Commodity Futures Trading Commission",
    country: "United States",
    code: "US",
    tier: 1,
    established: 1974,
    website: "https://www.cftc.gov",
    licenseCheck: "https://www.nfa.futures.org/basicnet/",
    investorProtection: "Customer funds segregated per CFTC regulations",
    leverageLimit: "Set by exchange margins (no statutory retail limit for futures)",
    supervisedFirms: "~4,000 registrants via NFA",
    overview: [
      "The CFTC regulates commodity futures, options, and swaps markets in the United States. Working alongside the NFA, it ensures market integrity and protects participants from fraud and manipulation.",
      "Futures Commission Merchants (FCMs) and Introducing Brokers (IBs) must register with the CFTC and become NFA members. Customer funds must be held in segregated accounts at approved depositories.",
    ],
    requirements: [
      "Registration as FCM, IB, or other regulated entity",
      "NFA membership mandatory",
      "Customer fund segregation requirements",
      "Net capital requirements for FCMs",
      "Regular CFTC/NFA audits and examinations",
    ],
    history: "The CFTC was created by the Commodity Futures Trading Commission Act of 1974. Originally focused on agricultural futures, its jurisdiction expanded to cover financial futures, forex, and swaps following the 2010 Dodd-Frank Act.",
    faq: [
      { q: "What does CFTC regulate?", a: "The CFTC regulates futures, options on futures, and swaps. It does NOT regulate stocks or securities — those fall under SEC/FINRA." },
      { q: "Is CFTC regulation important for futures traders?", a: "Yes. CFTC regulation ensures your futures broker segregates customer funds, maintains adequate capital, and submits to regular audits." },
    ],
  },
  {
    slug: "afm",
    name: "AFM",
    fullName: "Authority for the Financial Markets",
    country: "Netherlands",
    code: "NL",
    tier: 1,
    established: 2002,
    website: "https://www.afm.nl",
    licenseCheck: "https://www.afm.nl/en/professionals/registers",
    investorProtection: "Dutch Investor Compensation Scheme — €20,000",
    leverageLimit: "1:30 (ESMA-aligned)",
    supervisedFirms: "~12,000 financial enterprises",
    overview: [
      "The AFM is the Netherlands' financial markets regulator, responsible for supervising the conduct of financial institutions and ensuring fair and transparent markets. It operates alongside DNB (De Nederlandsche Bank) which handles prudential supervision.",
      "AFM-regulated investment firms must comply with MiFID II requirements and participate in the Dutch Investor Compensation Scheme providing up to €20,000 protection per investor.",
    ],
    requirements: [
      "MiFID II compliance for investment firms",
      "Capital adequacy requirements per CRR/CRD IV",
      "Participation in Dutch Investor Compensation Scheme",
      "Conduct of business rules and best execution obligations",
    ],
    history: "The AFM was established in 2002, taking over securities market supervision from the Amsterdam Stock Exchange. It has grown into one of the EU's more respected regulators.",
    faq: [
      { q: "Is AFM regulation trustworthy?", a: "Yes. The AFM is a Tier-1 EU regulator with MiFID II compliance. It provides €20,000 investor compensation and is part of the EU regulatory framework." },
    ],
  },
  {
    slug: "sfc",
    name: "SFC",
    fullName: "Securities and Futures Commission",
    country: "Hong Kong",
    code: "HK",
    tier: 1,
    established: 1989,
    website: "https://www.sfc.hk",
    licenseCheck: "https://www.sfc.hk/en/Regulatory-functions/Intermediaries/Licensing",
    investorProtection: "Investor Compensation Fund — HK$500,000",
    leverageLimit: "No statutory retail limit (broker-set)",
    supervisedFirms: "~47,000 licensed individuals",
    overview: [
      "The SFC is Hong Kong's statutory securities and futures regulator. It oversees all securities, futures, and leveraged foreign exchange trading conducted in Hong Kong. The SFC is known for its robust enforcement and high standards.",
    ],
    requirements: [
      "Type 1 (Dealing in Securities) or Type 2 (Dealing in Futures) license",
      "Paid-up capital and liquid capital requirements",
      "Responsible officer and licensed representative requirements",
      "Client money segregation and protection",
    ],
    history: "Established in 1989 under the Securities and Futures Commission Ordinance. The SFC has built a reputation as one of Asia's strictest and most effective financial regulators.",
    faq: [
      { q: "Is SFC a Tier-1 regulator?", a: "Yes. The SFC is one of the top financial regulators in Asia, with strict licensing requirements and active enforcement." },
    ],
  },
  // ── NEW: 6 additional regulators (April 2026) ──
  {
    slug: "cssf",
    name: "CSSF",
    fullName: "Commission de Surveillance du Secteur Financier",
    country: "Luxembourg",
    code: "LU",
    tier: 1,
    established: 1998,
    website: "https://www.cssf.lu",
    licenseCheck: "https://www.cssf.lu/en/financial-sector/",
    investorProtection: "SIIL — €20,000 per investor (securities), €100,000 per depositor (deposits)",
    leverageLimit: "1:30 (retail, MiFID II / ESMA)",
    supervisedFirms: "~3,000 entities",
    overview: [
      "The Commission de Surveillance du Secteur Financier (CSSF) is Luxembourg's financial regulator, supervising banks, investment firms, pension funds, and the world's second-largest fund domicile after the United States. Luxembourg is home to more than €5 trillion in fund assets, making the CSSF one of Europe's most important supervisory authorities.",
      "As a full EU member state, Luxembourg applies MiFID II, MiFIR, and ESMA guidelines. The CSSF enforces all EU-wide investor protections including negative balance protection, leverage caps of 1:30 for retail, and mandatory client fund segregation.",
      "The CSSF is particularly significant for brokers seeking a pan-European license via the EU passporting framework. A CSSF-regulated firm can offer services across all 27 EU member states and the EEA without requiring additional national licenses."
    ],
    requirements: [
      "Authorization as investment firm under Luxembourg Law of 5 April 1993",
      "Minimum initial capital of €125,000 (agency broker) to €730,000 (dealing on own account)",
      "Client funds held in segregated accounts at approved credit institutions",
      "Compliance with MiFID II conduct of business rules and best execution obligations",
      "Negative balance protection for all retail clients (ESMA requirement)",
      "Maximum leverage 1:30 for major forex pairs (retail)",
      "Mandatory membership in Système d'Indemnisation des Investisseurs Luxembourg (SIIL)",
      "Annual audit, regulatory reporting, and anti-money laundering compliance (AML/CFT)"
    ],
    history: "The CSSF was established on 1 January 1998, replacing the Institut Monétaire Luxembourgeois in its role as financial sector supervisor. Luxembourg's strategic position as a hub for cross-border fund management and banking has made the CSSF a key regulator in the European financial ecosystem. The CSSF has been an active adopter of ESMA directives and has consistently ranked among the most efficient EU regulators for licensing turnaround times.",
    faq: [
      { q: "Is CSSF a Tier-1 regulator?", a: "Yes. The CSSF is a Tier-1 EU regulator under MiFID II. Luxembourg is a founding EU member state, and the CSSF applies the full suite of European investor protections including €20,000 securities compensation and mandatory negative balance protection." },
      { q: "Can CSSF-regulated brokers operate across Europe?", a: "Yes. Through the EU passporting framework, a CSSF-regulated firm can offer services in all EU/EEA countries without requiring additional national licenses. This makes Luxembourg a popular domicile for brokers targeting the entire European market." },
      { q: "How do I verify a CSSF-regulated broker?", a: "Visit the CSSF website at cssf.lu and search the supervised entities register. You can verify the firm's authorization status, permitted activities, and any sanctions or warnings." },
      { q: "What investor protection does CSSF provide?", a: "The Système d'Indemnisation des Investisseurs Luxembourg (SIIL) protects investors up to €20,000 for securities claims. Deposits are separately protected up to €100,000 under the Luxembourg deposit guarantee scheme (FGDL)." }
    ],
  },
  {
    slug: "iiroc",
    name: "IIROC",
    fullName: "Investment Industry Regulatory Organization of Canada",
    country: "Canada",
    code: "CA",
    tier: 1,
    established: 2008,
    website: "https://www.ciro.ca",
    licenseCheck: "https://www.ciro.ca/investors/check-registration",
    investorProtection: "CIPF — C$1,000,000 per account category",
    leverageLimit: "No statutory retail cap (broker-set, typically 1:50)",
    supervisedFirms: "~170 dealer members",
    overview: [
      "The Investment Industry Regulatory Organization of Canada (IIROC) is Canada's national self-regulatory organization that oversees all investment dealers and trading activity on Canadian debt and equity markets. In 2023, IIROC merged with the Mutual Fund Dealers Association (MFDA) to form the Canadian Investment Regulatory Organization (CIRO).",
      "IIROC/CIRO-regulated brokers are among the most heavily supervised in the world. Canadian investor protection through the Canadian Investor Protection Fund (CIPF) offers coverage up to C$1,000,000 per account category — one of the highest compensation limits globally.",
      "Canada's regulatory framework is unique in that securities regulation is provincial, not federal. However, IIROC/CIRO provides national-level oversight, and brokers must also be registered with the relevant provincial securities commission (e.g., OSC in Ontario, AMF in Quebec)."
    ],
    requirements: [
      "CIRO (formerly IIROC) membership and registration as investment dealer",
      "Registration with relevant provincial securities commission(s)",
      "Minimum capital requirements based on risk-adjusted calculations",
      "Client funds held in segregated trust accounts at Canadian Schedule I banks",
      "Mandatory membership in Canadian Investor Protection Fund (CIPF)",
      "Know Your Client (KYC) and suitability obligations",
      "Comprehensive compliance and supervision procedures",
      "Annual financial filings and regulatory audits"
    ],
    history: "IIROC was created in 2008 through the merger of the Investment Dealers Association of Canada (IDA) and Market Regulation Services Inc. (RS Inc.). In 2023, IIROC merged with the MFDA to form CIRO, creating a single national self-regulatory organization for investment dealers and mutual fund dealers. Despite the name change, 'IIROC' remains widely used in the industry.",
    faq: [
      { q: "Is IIROC the same as CIRO?", a: "Yes. In January 2023, IIROC merged with the MFDA to form the Canadian Investment Regulatory Organization (CIRO). CIRO is the new name, but many brokers still reference IIROC. Both refer to Canada's national SRO for investment dealers." },
      { q: "How much protection do Canadian traders get?", a: "The Canadian Investor Protection Fund (CIPF) covers up to C$1,000,000 per account category (e.g., general, RRSP, TFSA) if a CIRO member becomes insolvent. This is one of the highest investor compensation limits in the world." },
      { q: "How do I check if a broker is CIRO/IIROC-regulated?", a: "Visit ciro.ca and use the 'Check Registration' tool. You can search by firm name or registration number to verify the broker's membership status and any disciplinary history." },
      { q: "Can international clients use IIROC-regulated brokers?", a: "IIROC/CIRO-regulated entities primarily serve Canadian residents. International clients may be routed through affiliated entities in other jurisdictions with different regulatory protections." }
    ],
  },
  {
    slug: "cma",
    name: "CMA",
    fullName: "Capital Markets Authority",
    country: "Kenya",
    code: "KE",
    tier: 2,
    established: 1989,
    website: "https://www.cma.or.ke",
    licenseCheck: "https://www.cma.or.ke/index.php/licensees",
    investorProtection: "Investor Compensation Fund (limited)",
    leverageLimit: "1:400 (retail, no statutory cap)",
    supervisedFirms: "~50 licensed entities",
    overview: [
      "The Capital Markets Authority (CMA) of Kenya is the statutory agency responsible for regulating and developing the capital markets industry in Kenya. Established under the Capital Markets Act (Cap 485A), the CMA licenses and supervises all securities exchanges, brokers, fund managers, and online forex dealers operating in Kenya.",
      "Kenya was one of the first African nations to establish a formal regulatory framework for retail forex and CFD trading. The CMA introduced its Online Foreign Exchange Trading Regulations in 2017, requiring all forex brokers offering services to Kenyan residents to obtain a local license.",
      "While the CMA is a Tier-2 regulator with less extensive investor protection than Tier-1 bodies, it represents a significant improvement over unregulated environments and has actively worked to protect Kenyan retail traders from fraudulent operators."
    ],
    requirements: [
      "CMA Online Forex Dealer license required",
      "Minimum net capital of KES 30 million (~US$230,000)",
      "Client funds held in segregated accounts at licensed Kenyan banks",
      "Mandatory risk disclosures to all retail clients",
      "Regular financial and compliance reporting",
      "Physical office presence in Kenya",
      "Fit and proper requirements for directors and key personnel",
      "Anti-money laundering and Counter Financing of Terrorism compliance"
    ],
    history: "The CMA was established in 1989 as Kenya's capital markets regulator. It introduced specific forex trading regulations in 2017, becoming one of Africa's first regulators to create a dedicated licensing framework for online forex dealers. The CMA has issued warnings against numerous unregulated brokers and maintains a public list of licensed entities.",
    faq: [
      { q: "Is CMA Kenya a trusted regulator?", a: "The CMA is a Tier-2 regulator. While it provides meaningful oversight and requires fund segregation, it does not offer the same level of investor compensation as Tier-1 regulators like the FCA or ASIC. It is the primary regulator for brokers operating in East Africa." },
      { q: "How do I verify a CMA-licensed broker?", a: "Visit the CMA website at cma.or.ke and check the list of licensed Online Foreign Exchange Dealers. Only brokers on this list are authorized to offer forex trading services to Kenyan residents." },
      { q: "What protection do Kenyan traders have?", a: "CMA-regulated brokers must segregate client funds and maintain minimum capital requirements. However, Kenya does not have a comprehensive investor compensation scheme comparable to the FSCS or CIPF." },
    ],
  },
  {
    slug: "cmvm",
    name: "CMVM",
    fullName: "Comissão do Mercado de Valores Mobiliários",
    country: "Portugal",
    code: "PT",
    tier: 1,
    established: 1991,
    website: "https://www.cmvm.pt",
    licenseCheck: "https://www.cmvm.pt/en/Intermediarios/",
    investorProtection: "SII — €25,000 per investor",
    leverageLimit: "1:30 (retail, MiFID II / ESMA)",
    supervisedFirms: "~350 registered entities",
    overview: [
      "The Comissão do Mercado de Valores Mobiliários (CMVM) is Portugal's securities market regulator. It supervises and regulates securities and other financial instruments markets, as well as the entities that operate within them, including investment firms and brokers.",
      "As a full EU member state, Portugal applies MiFID II and ESMA regulations. The CMVM enforces all EU-wide investor protections including leverage limits of 1:30 for retail traders, negative balance protection, and mandatory fund segregation.",
      "Portugal's investor compensation scheme (Sistema de Indemnização aos Investidores — SII) provides coverage up to €25,000 per investor, slightly higher than the EU minimum of €20,000."
    ],
    requirements: [
      "CMVM authorization as financial intermediary",
      "Compliance with MiFID II transposition into Portuguese law",
      "Minimum initial capital per EU Investment Firms Directive",
      "Client fund segregation at authorized credit institutions",
      "Mandatory membership in investor compensation scheme (SII)",
      "Negative balance protection for retail clients",
      "Maximum leverage 1:30 for major forex pairs (retail)",
      "Regular regulatory reporting and annual audits"
    ],
    history: "The CMVM was established in 1991 under Decree-Law 142-A/91 to regulate Portuguese securities markets. It has been a member of ESMA since its formation and actively participates in EU-wide regulatory coordination. Portugal has grown as a fintech hub, and the CMVM has adapted its regulatory framework to accommodate digital financial services.",
    faq: [
      { q: "Is CMVM a Tier-1 regulator?", a: "Yes. The CMVM is a Tier-1 EU regulator that enforces MiFID II. It provides €25,000 investor compensation through the SII and applies all ESMA protections including leverage caps and negative balance protection." },
      { q: "Can CMVM-regulated brokers serve other EU countries?", a: "Yes. Through EU passporting, CMVM-regulated firms can offer services across all EU/EEA member states without additional national authorization." },
    ],
  },
  {
    slug: "ecb",
    name: "ECB",
    fullName: "European Central Bank",
    country: "European Union",
    code: "DE",
    tier: 1,
    established: 1998,
    website: "https://www.ecb.europa.eu",
    licenseCheck: "https://www.bankingsupervision.europa.eu/banking/list/who/html/index.en.html",
    investorProtection: "National deposit guarantee schemes — €100,000 per depositor",
    leverageLimit: "N/A (delegates to national regulators and ESMA)",
    supervisedFirms: "~110 significant banks directly, ~2,500 indirectly",
    overview: [
      "The European Central Bank (ECB) is the central bank for the eurozone and a key supervisory authority under the Single Supervisory Mechanism (SSM). While the ECB primarily oversees significant banks across the euro area, some fintech and investment platforms hold banking licenses that fall under ECB direct or indirect supervision.",
      "The ECB works alongside national regulators (such as BaFin, CSSF, and CBI) to ensure consistent banking supervision across the eurozone. For retail trading and investment platforms that hold banking licenses, ECB oversight provides an additional layer of supervisory scrutiny.",
      "Firms under ECB supervision benefit from the EU's comprehensive regulatory framework, including deposit guarantees of €100,000, ESMA-aligned investor protections, and stringent capital adequacy requirements under CRR/CRD."
    ],
    requirements: [
      "Banking license from a eurozone national competent authority",
      "Capital requirements per Capital Requirements Regulation (CRR) and CRD IV/V",
      "Participation in national deposit guarantee scheme (up to €100,000)",
      "Regular supervisory reporting to ECB and national regulator",
      "Stress testing and ongoing risk assessment (SREP)",
      "Compliance with AML/CFT directives",
      "Governance, fitness and probity requirements for management",
      "Recovery and resolution planning"
    ],
    history: "The ECB was established on 1 June 1998 and took over monetary policy for the eurozone on 1 January 1999. The ECB assumed banking supervision responsibilities in November 2014 under the Single Supervisory Mechanism (SSM), following the eurozone debt crisis. The SSM made the ECB the direct supervisor of 'significant' banks across the euro area.",
    faq: [
      { q: "Does the ECB directly regulate brokers?", a: "The ECB primarily supervises significant banks. However, some investment platforms and fintechs hold banking licenses that bring them under ECB oversight. Retail forex/CFD regulation is delegated to national authorities and ESMA." },
      { q: "What protection does ECB supervision provide?", a: "ECB-supervised entities are covered by national deposit guarantee schemes providing up to €100,000 per depositor. They are also subject to the EU's most stringent capital and liquidity requirements." },
      { q: "How do I check if a firm is ECB-supervised?", a: "Visit the ECB's banking supervision website at bankingsupervision.europa.eu and search the list of supervised entities. You can verify the firm's status and supervisory category." },
    ],
  },
  {
    slug: "adgm-fsra",
    name: "ADGM FSRA",
    fullName: "Abu Dhabi Global Markets Financial Services Regulatory Authority",
    country: "United Arab Emirates",
    code: "AE",
    tier: 2,
    established: 2015,
    website: "https://www.adgm.com/fsra",
    licenseCheck: "https://www.adgm.com/public-registers",
    investorProtection: "No statutory compensation scheme (contractual protections apply)",
    leverageLimit: "1:20 (retail, ADGM regulations)",
    supervisedFirms: "~200 regulated firms",
    overview: [
      "The Financial Services Regulatory Authority (FSRA) is the independent regulator of Abu Dhabi Global Market (ADGM), the UAE's international financial centre. ADGM operates as a free zone with its own legal framework based on English common law, making it distinct from the DIFC (regulated by DFSA) and mainland UAE.",
      "The FSRA has established itself as a modern, technology-forward regulator. It was among the first globally to create a comprehensive regulatory framework for virtual assets and has attracted fintech firms with its RegLab (regulatory sandbox) program.",
      "FSRA-regulated firms operate under a principles-based regulatory framework that combines elements from the UK FCA model with region-specific requirements. While ADGM does not have a statutory investor compensation scheme, firms are required to maintain professional indemnity insurance and capital buffers."
    ],
    requirements: [
      "Financial Services Permission (FSP) from the FSRA",
      "Minimum base capital of US$500,000 for Category 3C (dealing, managing)",
      "Client money held in segregated accounts at ADGM-approved banks",
      "Professional indemnity insurance coverage",
      "Retail leverage limited to 1:20 for forex (ADGM rules)",
      "Fit and proper requirements for controllers and key individuals",
      "Anti-money laundering and sanctions compliance",
      "Annual financial statements audited by ADGM-recognized auditor"
    ],
    history: "ADGM was established by UAE Federal Decree in 2013 and commenced operations in 2015. The FSRA was created as ADGM's independent financial regulator, modeled on international best practices. ADGM has rapidly grown as a financial centre, particularly for fintech and digital assets, and has signed cooperation agreements with regulators worldwide including the FCA, MAS, and HKMA.",
    faq: [
      { q: "What is the difference between ADGM FSRA and DFSA?", a: "ADGM FSRA regulates Abu Dhabi Global Market, while DFSA regulates the Dubai International Financial Centre (DIFC). Both are financial free zones in the UAE with their own legal systems, but they are separate jurisdictions with independent regulatory frameworks." },
      { q: "Is ADGM FSRA a Tier-1 regulator?", a: "ADGM FSRA is classified as Tier-2. While it applies high standards modeled on the FCA, it does not offer a statutory investor compensation scheme. It provides strong operational regulation but lacks the safety net of Tier-1 frameworks." },
      { q: "How do I verify an ADGM-licensed broker?", a: "Visit adgm.com/public-registers and search the Financial Services Register. You can verify a firm's license status, permitted activities, and any regulatory actions." },
    ],
  },
];

// ============================
// HELPER FUNCTIONS
// ============================

const nameMap = {};
const slugMap = {};
REGULATORS.forEach(r => {
  nameMap[r.name.toLowerCase()] = r;
  slugMap[r.slug] = r;
});

/** Find regulator by name (e.g. "FCA", "ASIC"). Case-insensitive. */
export function getRegulatorByName(name) {
  if (!name) return null;
  return nameMap[name.toLowerCase()] || null;
}

/** Get slug for a regulator name. Returns null if unknown. */
export function getRegulatorSlug(name) {
  const r = getRegulatorByName(name);
  return r ? r.slug : null;
}

/** Find regulator by slug (e.g. "fca", "asic"). */
export function getRegulatorBySlug(slug) {
  if (!slug) return null;
  return slugMap[slug] || null;
}
