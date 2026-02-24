export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'analysis' | 'linux' | 'response' | 'network' | 'threats';
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
];
