// === KRONOS CERTIFICATION & PROGRESSION SYSTEM ===

export interface Certification {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  description: string;
  requiredXP: number;
  requiredModules: string[];
  examQuestions: { question: string; options: { text: string; correct: boolean }[]; }[];
  unlocksGrade?: string;
  narrativeGate?: string; // blocks this chapter/mission without cert
}

export interface Grade {
  id: string;
  title: string;
  requiredXP: number;
  requiredCerts: string[];
  icon: string;
}

export interface AcademySkill {
  id: string;
  title: string;
  summary: string;
  explanation: string;
  category: 'network' | 'linux' | 'analysis' | 'python' | 'response';
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  diagram?: string; // ASCII diagram
  practicalExample: string;
  externalLinks: { label: string; url: string; level: 'débutant' | 'intermédiaire' | 'avancé' }[];
}

// ── Grades ──
export const GRADES: Grade[] = [
  { id: 'junior', title: 'Junior Analyst', requiredXP: 0, requiredCerts: [], icon: '🔰' },
  { id: 'soc_analyst', title: 'SOC Analyst', requiredXP: 200, requiredCerts: ['net-associate'], icon: '🛡️' },
  { id: 'senior_analyst', title: 'Senior Analyst', requiredXP: 500, requiredCerts: ['net-associate', 'soc-analyst-1'], icon: '⭐' },
  { id: 'incident_responder', title: 'Incident Responder', requiredXP: 800, requiredCerts: ['soc-analyst-1', 'incident-responder'], icon: '🔥' },
  { id: 'net_security_lead', title: 'Network Security Lead', requiredXP: 1200, requiredCerts: ['incident-responder', 'threat-hunter'], icon: '🌐' },
  { id: 'threat_hunter', title: 'Threat Hunter', requiredXP: 1500, requiredCerts: ['threat-hunter'], icon: '🎯' },
  { id: 'soc_architect', title: 'SOC Architect', requiredXP: 2000, requiredCerts: ['net-associate', 'soc-analyst-1', 'incident-responder', 'threat-hunter'], icon: '👑' },
];

// ── Certifications ──
export const CERTIFICATIONS: Certification[] = [
  {
    id: 'net-associate',
    title: 'KRONOS Network Associate',
    level: 1,
    description: 'Maîtrise des fondamentaux réseau : modèle OSI, TCP/IP, ports et protocoles.',
    requiredXP: 100,
    requiredModules: ['linux-ping-target', 'net-ports-services'],
    examQuestions: [
      {
        question: "Combien de couches possède le modèle OSI ?",
        options: [
          { text: "4", correct: false },
          { text: "5", correct: false },
          { text: "7", correct: true },
          { text: "6", correct: false },
        ],
      },
      {
        question: "Quel protocole utilise le port 443 par défaut ?",
        options: [
          { text: "HTTP", correct: false },
          { text: "HTTPS", correct: true },
          { text: "SSH", correct: false },
          { text: "FTP", correct: false },
        ],
      },
      {
        question: "Le protocole ARP opère à quelle couche ?",
        options: [
          { text: "Couche 2 (Liaison)", correct: true },
          { text: "Couche 3 (Réseau)", correct: false },
          { text: "Couche 4 (Transport)", correct: false },
          { text: "Couche 7 (Application)", correct: false },
        ],
      },
    ],
  },
  {
    id: 'soc-analyst-1',
    title: 'KRONOS SOC Analyst I',
    level: 2,
    description: "Capacité d'analyse de logs, détection d'anomalies et corrélation d'événements.",
    requiredXP: 300,
    requiredModules: ['analysis-logs-basics', 'analysis-brute-detection'],
    examQuestions: [
      {
        question: "Que signifie un code HTTP 403 dans un log d'accès ?",
        options: [
          { text: "Page non trouvée", correct: false },
          { text: "Accès interdit", correct: true },
          { text: "Erreur serveur", correct: false },
          { text: "Redirection", correct: false },
        ],
      },
      {
        question: "Un utilisateur se connecte depuis 2 pays en 5 minutes. C'est un indicateur de :",
        options: [
          { text: "VPN légitime", correct: false },
          { text: "Impossible travel (compromission probable)", correct: true },
          { text: "Problème DNS", correct: false },
          { text: "Latence réseau", correct: false },
        ],
      },
      {
        question: "Quel outil permet de filtrer un mot-clé dans un fichier texte ?",
        options: [
          { text: "ping", correct: false },
          { text: "netstat", correct: false },
          { text: "grep", correct: true },
          { text: "traceroute", correct: false },
        ],
      },
    ],
  },
  {
    id: 'incident-responder',
    title: 'KRONOS Incident Responder',
    level: 2,
    description: "Capacité de réponse aux incidents : isolation, analyse, remédiation sous pression.",
    requiredXP: 600,
    requiredModules: ['response-firewall-block'],
    narrativeGate: '8', // Required for chapter 8 missions
    examQuestions: [
      {
        question: "Quelle est la première étape lors d'un incident confirmé ?",
        options: [
          { text: "Éteindre le serveur", correct: false },
          { text: "Contenir et isoler la menace", correct: true },
          { text: "Appeler la police", correct: false },
          { text: "Restaurer les backups", correct: false },
        ],
      },
      {
        question: "Quelle commande bloque une IP avec iptables ?",
        options: [
          { text: "iptables -A INPUT -s IP -j DROP", correct: true },
          { text: "iptables -D INPUT -s IP -j ACCEPT", correct: false },
          { text: "firewall-cmd --block IP", correct: false },
          { text: "netstat -block IP", correct: false },
        ],
      },
      {
        question: "Un processus suspect utilise le port 4444. Quel outil pour l'identifier ?",
        options: [
          { text: "ping", correct: false },
          { text: "lsof -i :4444", correct: true },
          { text: "traceroute", correct: false },
          { text: "nslookup", correct: false },
        ],
      },
    ],
  },
  {
    id: 'threat-hunter',
    title: 'KRONOS Threat Hunter',
    level: 3,
    description: "Détection proactive de menaces : corrélation avancée, analyse comportementale, hunting.",
    requiredXP: 1000,
    requiredModules: ['analysis-hash-comparison', 'response-python-blocker'],
    examQuestions: [
      {
        question: "Qu'est-ce que le 'beaconing' ?",
        options: [
          { text: "Un type de scan réseau", correct: false },
          { text: "Communication régulière d'un malware vers son C2", correct: true },
          { text: "Un protocole de routage", correct: false },
          { text: "Une technique de phishing", correct: false },
        ],
      },
      {
        question: "Le DNS tunneling est utilisé pour :",
        options: [
          { text: "Accélérer les requêtes DNS", correct: false },
          { text: "Exfiltrer des données via des requêtes DNS", correct: true },
          { text: "Protéger le DNS", correct: false },
          { text: "Bloquer les domaines malveillants", correct: false },
        ],
      },
      {
        question: "Quel est l'avantage principal du Threat Hunting par rapport au monitoring ?",
        options: [
          { text: "Il est automatisé", correct: false },
          { text: "Il est proactif et cherche les menaces non détectées", correct: true },
          { text: "Il remplace les antivirus", correct: false },
          { text: "Il ne nécessite pas de compétences techniques", correct: false },
        ],
      },
    ],
  },
];

// ── Academy Skills ──
export const ACADEMY_SKILLS: AcademySkill[] = [
  {
    id: 'osi-model',
    title: 'Modèle OSI',
    summary: 'Les 7 couches du modèle de référence réseau.',
    explanation: "Le modèle OSI divise la communication réseau en 7 couches : Physique, Liaison, Réseau, Transport, Session, Présentation, Application. Chaque couche a un rôle spécifique et communique avec les couches adjacentes.",
    category: 'network',
    difficulty: 'débutant',
    diagram: `┌─────────────────┐\n│ 7. Application  │ HTTP, DNS, SSH\n│ 6. Présentation │ SSL/TLS, compression\n│ 5. Session      │ NetBIOS, RPC\n│ 4. Transport    │ TCP, UDP\n│ 3. Réseau       │ IP, ICMP, ARP\n│ 2. Liaison      │ Ethernet, MAC\n│ 1. Physique     │ Câbles, signaux\n└─────────────────┘`,
    practicalExample: "Quand tu tapes ping 192.168.1.1, ICMP travaille à la couche 3 (Réseau) et le paquet descend à travers les couches 2 et 1 pour être transmis physiquement.",
    externalLinks: [
      { label: 'Cours Cisco - Modèle OSI', url: 'https://www.netacad.com/', level: 'débutant' },
      { label: 'RFC 1122 - Internet Host Requirements', url: 'https://tools.ietf.org/html/rfc1122', level: 'avancé' },
    ],
  },
  {
    id: 'tcp-handshake',
    title: 'TCP Three-Way Handshake',
    summary: 'Le mécanisme de connexion TCP en 3 étapes.',
    explanation: "TCP établit une connexion fiable via un échange en 3 étapes : SYN (demande), SYN-ACK (acceptation), ACK (confirmation). Ce mécanisme garantit que les deux parties sont prêtes à communiquer.",
    category: 'network',
    difficulty: 'intermédiaire',
    diagram: `Client          Serveur\n  │                │\n  │──── SYN ──────▶│\n  │                │\n  │◀── SYN-ACK ───│\n  │                │\n  │──── ACK ──────▶│\n  │                │\n  │  Connexion OK  │`,
    practicalExample: "Utilise tcpdump pour observer le handshake : tu verras les flags [S], [S.] et [.] dans les paquets capturés.",
    externalLinks: [
      { label: 'Wireshark - TCP Analysis', url: 'https://www.wireshark.org/docs/', level: 'intermédiaire' },
      { label: 'RFC 793 - TCP', url: 'https://tools.ietf.org/html/rfc793', level: 'avancé' },
    ],
  },
  {
    id: 'arp-spoofing',
    title: 'ARP Spoofing',
    summary: "Usurpation d'identité au niveau liaison de données.",
    explanation: "L'attaquant envoie de faux paquets ARP pour associer son adresse MAC à l'IP de la gateway. Tout le trafic passe alors par sa machine (Man-in-the-Middle).",
    category: 'network',
    difficulty: 'intermédiaire',
    diagram: `Victime ──────▶ Attaquant ──────▶ Gateway\n  │  (croit que    │  (intercepte    │\n  │  c'est la      │  le trafic)     │\n  │  gateway)      │                 │`,
    practicalExample: "Vérifie avec arp -a si la MAC de la gateway a changé. Compare avec la vraie MAC connue.",
    externalLinks: [
      { label: 'OverTheWire - Bandit', url: 'https://overthewire.org/wargames/bandit/', level: 'débutant' },
      { label: 'Ettercap Documentation', url: 'https://www.ettercap-project.org/doc.html', level: 'avancé' },
    ],
  },
  {
    id: 'dns-poisoning',
    title: 'DNS Poisoning',
    summary: 'Corruption du cache DNS pour rediriger le trafic.',
    explanation: "L'attaquant injecte de fausses réponses DNS dans le cache d'un résolveur. Les victimes sont redirigées vers des serveurs malveillants quand elles accèdent à un domaine légitime.",
    category: 'network',
    difficulty: 'intermédiaire',
    diagram: `Utilisateur ──▶ DNS Cache (empoisonné)\n                    │\n                    ▼\n              Faux Serveur (attaquant)\n              au lieu de vrai serveur`,
    practicalExample: "Compare nslookup et /etc/hosts. Si les résultats diffèrent, le DNS pourrait être compromis.",
    externalLinks: [
      { label: 'CyberChef - Outil d\'analyse', url: 'https://gchq.github.io/CyberChef/', level: 'débutant' },
      { label: 'RFC 5452 - DNS Resilience', url: 'https://tools.ietf.org/html/rfc5452', level: 'avancé' },
    ],
  },
  {
    id: 'log-analysis',
    title: 'Analyse de Logs',
    summary: 'Lecture et corrélation de journaux système.',
    explanation: "Les logs sont la mémoire du système. auth.log trace les authentifications, access.log les requêtes web, syslog les événements système. La corrélation entre ces sources révèle les attaques complexes.",
    category: 'analysis',
    difficulty: 'débutant',
    diagram: `auth.log ────┐\naccess.log ──┼──▶ CORRÉLATION ──▶ Timeline d'attaque\nsyslog ──────┘`,
    practicalExample: "Utilise grep pour filtrer les 'FAILED' dans auth.log, puis corrèle avec les timestamps de access.log.",
    externalLinks: [
      { label: 'Linux Man Pages', url: 'https://man7.org/linux/man-pages/', level: 'débutant' },
      { label: 'Splunk Free Training', url: 'https://www.splunk.com/en_us/training/free-courses.html', level: 'intermédiaire' },
    ],
  },
  {
    id: 'linux-permissions',
    title: 'Permissions Linux',
    summary: 'Comprendre rwx, chmod et chown.',
    explanation: "Chaque fichier a 3 groupes de permissions : propriétaire, groupe, autres. Les permissions sont r (lecture), w (écriture), x (exécution). chmod modifie les permissions, chown le propriétaire.",
    category: 'linux',
    difficulty: 'débutant',
    diagram: `-rwxr-xr--  1 kronos soc  4096 Mar 1 07:42 script.py\n │││ │││ │││\n │││ │││ └── Others: read only\n │││ └── Group: read + execute\n └── Owner: read + write + execute`,
    practicalExample: "chmod 755 script.py donne rwx au propriétaire et rx aux autres. chmod 600 pour fichiers sensibles.",
    externalLinks: [
      { label: 'Linux Journey - Permissions', url: 'https://linuxjourney.com/', level: 'débutant' },
      { label: 'chmod Calculator', url: 'https://chmod-calculator.com/', level: 'débutant' },
    ],
  },
];
