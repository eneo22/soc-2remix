export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'analysis' | 'linux' | 'response';
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  type: 'quiz' | 'terminal' | 'project';
  requiredSkills: string[];
  xpReward: { technical?: number; analytical?: number; reflexion?: number; detection?: number };
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
  instructions: string;
  validationHint: string;
  validator: (s: string) => { passed: boolean; feedback: string };
}

export const trainingModules: TrainingModule[] = [
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
    requiredSkills: ['analysis-logs'],
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
    requiredSkills: ['analysis-phishing'],
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
    requiredSkills: ['response-isolation'],
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
];
