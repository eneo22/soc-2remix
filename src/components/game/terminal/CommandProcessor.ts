// === KRONOS COMMAND PROCESSOR ===
// Processes commands against the virtual environment

import {
  VFSNode, Process, NetworkConnection, TerminalLine,
  resolveVFSPath, formatLs, MAN_PAGES, ALL_COMMANDS,
  DEFAULT_PROCESSES, DEFAULT_CONNECTIONS, ARP_TABLE, DNS_RECORDS,
  DEFAULT_ALIASES,
} from './TerminalEngine';

export interface CommandContext {
  vfs: Record<string, VFSNode>;
  cwd: string;
  setCwd: (path: string) => void;
  processes: Process[];
  connections: NetworkConnection[];
  aliases: Record<string, string>;
  hostname: string;
  user: string;
}

export function processCommand(
  raw: string,
  ctx: CommandContext,
): TerminalLine[] {
  const lines: TerminalLine[] = [];
  const add = (type: TerminalLine['type'], text: string) => lines.push({ type, text });

  // Resolve aliases
  let resolved = raw.trim();
  const firstWord = resolved.split(/\s+/)[0];
  if (ctx.aliases[firstWord]) {
    resolved = ctx.aliases[firstWord] + resolved.slice(firstWord.length);
  }

  const parts = resolved.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  const flags = args.filter(a => a.startsWith('-'));
  const params = args.filter(a => !a.startsWith('-'));

  switch (cmd) {
    case 'clear':
      return [{ type: 'system', text: '__CLEAR__' }];

    case 'help':
      add('output', `Commandes disponibles :\n${ALL_COMMANDS.sort().join(', ')}`);
      add('hint', "Tape 'man <commande>' pour plus de détails.");
      break;

    case 'man': {
      const t = params[0];
      if (!t) { add('error', 'Usage: man <commande>'); break; }
      const page = MAN_PAGES[t.toLowerCase()];
      page ? add('output', page) : add('error', `No manual entry for ${t}`);
      break;
    }

    case 'whoami':
      add('output', ctx.user);
      break;

    case 'hostname':
      add('output', ctx.hostname);
      break;

    case 'id':
      add('output', `uid=1000(${ctx.user}) gid=1000(${ctx.user}) groups=1000(${ctx.user}),27(sudo),1001(soc-analysts)`);
      break;

    case 'pwd':
      add('output', ctx.cwd);
      break;

    case 'date':
      add('output', 'Sat Mar  1 07:42:33 CET 2026');
      break;

    case 'uptime':
      add('output', ' 07:42:33 up 14 days,  3:21,  2 users,  load average: 0.42, 0.38, 0.35');
      break;

    case 'uname':
      if (flags.includes('-a')) {
        add('output', 'Linux soc-workstation 5.15.0-94-generic #104-Ubuntu SMP x86_64 GNU/Linux');
      } else {
        add('output', 'Linux');
      }
      break;

    case 'echo':
      add('output', params.join(' '));
      break;

    case 'env':
    case 'export':
      add('output', 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\nHOME=/home/kronos\nUSER=kronos\nSHELL=/bin/bash\nLANG=fr_FR.UTF-8\nTERM=xterm-256color');
      break;

    case 'history':
      add('output', '(historique des commandes dans cet onglet)');
      break;

    case 'alias':
      if (params.length === 0) {
        const aliasStr = Object.entries(ctx.aliases).map(([k, v]) => `alias ${k}='${v}'`).join('\n');
        add('output', aliasStr || '(aucun alias)');
      }
      break;

    // ── File System ──
    case 'ls': {
      const long = flags.some(f => f.includes('l'));
      const showHidden = flags.some(f => f.includes('a'));
      const target = params[0] || '.';
      const path = target === '.' ? ctx.cwd : target;
      const node = resolveVFSPath(ctx.vfs, ctx.cwd, path);
      if (!node) { add('error', `ls: cannot access '${path}': No such file or directory`); break; }
      if (node.type === 'file') { add('output', target); break; }
      const result = formatLs(node, long, showHidden);
      add('output', result || '(vide)');
      break;
    }

    case 'cd': {
      const target = params[0] || '/home/kronos';
      if (target === '~') { ctx.setCwd('/home/kronos'); add('output', ''); break; }
      if (target === '..') {
        const parent = ctx.cwd.split('/').slice(0, -1).join('/') || '/';
        ctx.setCwd(parent);
        break;
      }
      if (target === '/root') { add('error', `bash: cd: /root: Permission denied`); break; }
      const abs = target.startsWith('/') ? target : `${ctx.cwd}/${target}`.replace(/\/+/g, '/');
      const node = resolveVFSPath(ctx.vfs, ctx.cwd, target);
      if (!node) { add('error', `bash: cd: ${target}: No such file or directory`); break; }
      if (node.type === 'file') { add('error', `bash: cd: ${target}: Not a directory`); break; }
      ctx.setCwd(abs);
      break;
    }

    case 'cat': {
      const fname = params[0];
      if (!fname) { add('error', 'cat: fichier manquant'); break; }
      const node = resolveVFSPath(ctx.vfs, ctx.cwd, fname);
      if (!node) { add('error', `cat: ${fname}: No such file or directory`); break; }
      if (node.type === 'dir') { add('error', `cat: ${fname}: Is a directory`); break; }
      if (node.permissions?.startsWith('-rw-------') && node.owner === 'root' && ctx.user !== 'root') {
        add('error', `cat: ${fname}: Permission denied`); break;
      }
      add('output', node.content || '');
      break;
    }

    case 'head': {
      const fname = params[0];
      if (!fname) { add('error', 'head: fichier manquant'); break; }
      const node = resolveVFSPath(ctx.vfs, ctx.cwd, fname);
      if (!node || node.type !== 'file') { add('error', `head: ${fname}: No such file or directory`); break; }
      const n = parseInt(flags.find(f => f.startsWith('-n'))?.replace('-n', '') || '10');
      add('output', (node.content || '').split('\n').slice(0, n).join('\n'));
      break;
    }

    case 'tail': {
      const fname = params[0];
      if (!fname) { add('error', 'tail: fichier manquant'); break; }
      const node = resolveVFSPath(ctx.vfs, ctx.cwd, fname);
      if (!node || node.type !== 'file') { add('error', `tail: ${fname}: No such file or directory`); break; }
      const n = parseInt(flags.find(f => f.startsWith('-n'))?.replace('-n', '') || '10');
      const lines_ = (node.content || '').split('\n');
      add('output', lines_.slice(-n).join('\n'));
      break;
    }

    case 'wc': {
      const fname = params[0];
      if (!fname) { add('error', 'wc: fichier manquant'); break; }
      const node = resolveVFSPath(ctx.vfs, ctx.cwd, fname);
      if (!node || node.type !== 'file') { add('error', `wc: ${fname}: No such file or directory`); break; }
      const content = node.content || '';
      const lc = content.split('\n').length;
      const wc = content.split(/\s+/).filter(Boolean).length;
      const cc = content.length;
      add('output', `  ${lc}  ${wc}  ${cc} ${fname}`);
      break;
    }

    case 'file': {
      const fname = params[0];
      if (!fname) { add('error', 'file: fichier manquant'); break; }
      const node = resolveVFSPath(ctx.vfs, ctx.cwd, fname);
      if (!node) { add('error', `file: ${fname}: No such file or directory`); break; }
      if (node.type === 'dir') { add('output', `${fname}: directory`); break; }
      if (fname.endsWith('.py')) add('output', `${fname}: Python script, ASCII text executable`);
      else if (fname.endsWith('.log')) add('output', `${fname}: ASCII text`);
      else add('output', `${fname}: ASCII text`);
      break;
    }

    case 'find': {
      const searchPath = params[0] || '.';
      const nameIdx = args.indexOf('-name');
      const pattern = nameIdx >= 0 ? args[nameIdx + 1] : null;
      // Simplified find — list all files
      const results: string[] = [];
      const walk = (node: VFSNode, path: string) => {
        if (node.type === 'dir' && node.children) {
          for (const [name, child] of Object.entries(node.children)) {
            const full = `${path}/${name}`;
            if (!pattern || name.includes(pattern.replace(/\*/g, ''))) results.push(full);
            walk(child, full);
          }
        }
      };
      const startNode = resolveVFSPath(ctx.vfs, ctx.cwd, searchPath);
      if (startNode) walk(startNode, searchPath === '.' ? ctx.cwd : searchPath);
      add('output', results.join('\n') || '(no results)');
      break;
    }

    case 'grep': {
      const ignoreCase = flags.includes('-i');
      if (params.length < 2) { add('error', 'Usage: grep [-i] MOT_CLE FICHIER'); break; }
      const [keyword, fname] = params;
      const node = resolveVFSPath(ctx.vfs, ctx.cwd, fname);
      if (!node || node.type !== 'file') { add('error', `grep: ${fname}: No such file or directory`); break; }
      const matchLines = (node.content || '').split('\n').filter(l =>
        ignoreCase ? l.toLowerCase().includes(keyword.toLowerCase()) : l.includes(keyword)
      );
      if (matchLines.length) {
        matchLines.forEach(l => {
          // Highlight keyword
          const re = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, ignoreCase ? 'gi' : 'g');
          add('output', l.replace(re, '\x1b[31m$1\x1b[0m'));
        });
      } else {
        add('output', '(aucun résultat)');
      }
      break;
    }

    case 'chmod': {
      if (params.length < 2) { add('error', 'chmod: missing operand'); break; }
      add('output', `permissions of '${params[1]}' changed to ${params[0]}`);
      break;
    }

    case 'chown': {
      if (params.length < 2) { add('error', 'chown: missing operand'); break; }
      add('output', `ownership of '${params[1]}' changed to ${params[0]}`);
      break;
    }

    // ── Network ──
    case 'ping': {
      const target = params[0];
      if (!target) { add('error', 'ping: missing host'); break; }
      const ip = DNS_RECORDS[target] || target;
      const reachable = !target.includes('10.0.5.50');
      add('output', `PING ${ip} (${ip}) 56(84) bytes of data.`);
      if (reachable) {
        add('output', `64 bytes from ${ip}: icmp_seq=1 ttl=52 time=${Math.floor(Math.random() * 20 + 5)}ms`);
        add('output', `64 bytes from ${ip}: icmp_seq=2 ttl=52 time=${Math.floor(Math.random() * 20 + 5)}ms`);
        add('output', `--- ${ip} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`);
      } else {
        add('output', `--- ${ip} ping statistics ---\n2 packets transmitted, 0 received, 100% packet loss`);
      }
      break;
    }

    case 'traceroute': {
      const target = params[0];
      if (!target) { add('error', 'traceroute: missing host'); break; }
      const ip = DNS_RECORDS[target] || target;
      add('output', `traceroute to ${ip}, 30 hops max, 60 byte packets`);
      add('output', ` 1  gateway.kronos.local (192.168.1.1)  1.234 ms`);
      add('output', ` 2  isp-router.net (10.255.0.1)  8.567 ms`);
      add('output', ` 3  core-switch.isp.net (172.16.0.1)  12.891 ms`);
      add('output', ` 4  ${ip}  ${Math.floor(Math.random() * 30 + 15)}.${Math.floor(Math.random() * 999)} ms`);
      break;
    }

    case 'nslookup':
    case 'dig': {
      const domain = params[0];
      if (!domain) { add('error', `${cmd}: missing domain`); break; }
      const ip = DNS_RECORDS[domain];
      if (ip) {
        add('output', `Server:\t\t192.168.1.99\nAddress:\t192.168.1.99#53\n\nNon-authoritative answer:\nName:\t${domain}\nAddress: ${ip}`);
      } else {
        add('output', `** server can't find ${domain}: NXDOMAIN`);
      }
      break;
    }

    case 'arp': {
      const lines_ = ARP_TABLE.map(e => `${e.ip.padEnd(18)} ether   ${e.mac}   C   ${e.iface}`);
      add('output', lines_.join('\n'));
      break;
    }

    case 'netstat': {
      const header = 'Proto  Local Address          Foreign Address        State       PID/Program';
      const rows = ctx.connections.map(c => {
        const proc = ctx.processes.find(p => p.pid === c.pid);
        return `${c.proto.padEnd(7)}${c.localAddr.padEnd(23)}${c.foreignAddr.padEnd(23)}${c.state.padEnd(12)}${c.pid}/${proc?.command.split('/').pop() || 'unknown'}`;
      });
      add('output', `${header}\n${rows.join('\n')}`);
      break;
    }

    case 'ss': {
      // Simplified ss output
      const header = 'State      Recv-Q Send-Q  Local Address:Port   Peer Address:Port';
      const rows = ctx.connections.map(c =>
        `${(c.state || 'UNCONN').padEnd(11)}0      0       ${c.localAddr.padEnd(22)}${c.foreignAddr}`
      );
      add('output', `${header}\n${rows.join('\n')}`);
      break;
    }

    case 'ip': {
      const sub = params[0] || 'a';
      if (sub === 'a' || sub === 'addr') {
        add('output', `1: lo: <LOOPBACK,UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500\n    inet 192.168.1.50/24 brd 192.168.1.255 scope global eth0\n    ether aa:bb:cc:dd:ee:50`);
      } else if (sub === 'r' || sub === 'route') {
        add('output', `default via 192.168.1.1 dev eth0\n192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.50`);
      } else if (sub === 'link') {
        add('output', `1: lo: <LOOPBACK,UP> mtu 65536 state UNKNOWN\n2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500 state UP`);
      }
      break;
    }

    case 'ifconfig': {
      add('output', `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.50  netmask 255.255.255.0  broadcast 192.168.1.255\n        ether aa:bb:cc:dd:ee:50  txqueuelen 1000\n        RX packets 284521  bytes 192847362\n        TX packets 198734  bytes 87234561`);
      break;
    }

    // ── Process Management ──
    case 'ps': {
      const header = 'USER       PID  %CPU %MEM COMMAND';
      const rows = ctx.processes.map(p =>
        `${p.user.padEnd(11)}${p.pid.toString().padEnd(5)}${p.cpu.padEnd(5)}${p.mem.padEnd(5)}${p.command}`
      );
      add('output', `${header}\n${rows.join('\n')}`);
      break;
    }

    case 'top': {
      add('output', `top - 07:42:33 up 14 days, load average: 0.42, 0.38, 0.35\nTasks: ${ctx.processes.length} total, 1 running\n%CPU: 3.9 us, 0.5 sy  |  Mem: 8192MB total, 5124MB used\n`);
      const header = 'PID   USER      %CPU %MEM COMMAND';
      const sorted = [...ctx.processes].sort((a, b) => parseFloat(b.cpu) - parseFloat(a.cpu));
      const rows = sorted.map(p =>
        `${p.pid.toString().padEnd(6)}${p.user.padEnd(10)}${p.cpu.padEnd(5)}${p.mem.padEnd(5)}${p.command}`
      );
      add('output', `${header}\n${rows.join('\n')}`);
      break;
    }

    case 'kill': {
      const pid = parseInt(params[0] || params[1] || '0');
      if (!pid) { add('error', 'kill: usage: kill [-9] PID'); break; }
      const proc = ctx.processes.find(p => p.pid === pid);
      if (proc) {
        add('success', `Process ${pid} (${proc.command}) terminated.`);
      } else {
        add('error', `kill: (${pid}) - No such process`);
      }
      break;
    }

    case 'lsof': {
      if (flags.includes('-i')) {
        const portFilter = params[0]?.replace(':', '');
        const filtered = ctx.connections.filter(c => !portFilter || c.localAddr.includes(portFilter));
        const rows = filtered.map(c => {
          const proc = ctx.processes.find(p => p.pid === c.pid);
          return `${(proc?.command.split('/').pop() || 'unknown').padEnd(15)}${c.pid.toString().padEnd(8)}${ctx.user.padEnd(10)}IPv4  ${c.localAddr} -> ${c.foreignAddr} (${c.state || 'UNCONN'})`;
        });
        add('output', rows.join('\n') || '(no results)');
      } else {
        add('output', 'Usage: lsof -i [:port]');
      }
      break;
    }

    // ── Security / Analysis ──
    case 'tcpdump': {
      const hostIdx = args.indexOf('host');
      const targetIP = hostIdx >= 0 ? args[hostIdx + 1] : null;
      add('output', `tcpdump: listening on eth0, link-type EN10MB`);
      if (targetIP === '185.193.88.42' || targetIP?.startsWith('185.193')) {
        add('output', `07:42:01.001 IP 192.168.1.12.49822 > 185.193.88.42.443: Flags [P.], seq 1:48, ack 1, len 47`);
        add('output', `07:42:01.045 IP 185.193.88.42.443 > 192.168.1.12.49822: Flags [.], ack 48, len 0`);
        add('output', `07:42:31.002 IP 192.168.1.12.49822 > 185.193.88.42.443: Flags [P.], seq 48:96, ack 1, len 48`);
        add('output', `07:42:31.048 IP 185.193.88.42.443 > 192.168.1.12.49822: Flags [.], ack 96, len 0`);
        add('hint', '⚠️ Pattern régulier toutes les 30s — possible beaconing C2');
      } else {
        add('output', `07:42:01.234 IP 192.168.1.10.55201 > 192.168.1.50.443: Flags [S], seq 123456`);
        add('output', `07:42:01.235 IP 192.168.1.50.443 > 192.168.1.10.55201: Flags [S.], seq 789012, ack 123457`);
        add('output', `07:42:01.236 IP 192.168.1.10.55201 > 192.168.1.50.443: Flags [.], ack 789013`);
      }
      add('output', `4 packets captured`);
      break;
    }

    case 'nmap': {
      const target = params[0] || params[1];
      if (!target) { add('error', 'nmap: missing target'); break; }
      add('output', `Starting Nmap 7.93 ( https://nmap.org )\nNmap scan report for ${target}`);
      if (target === '192.168.1.12') {
        add('output', `PORT     STATE SERVICE    VERSION\n22/tcp   open  ssh        OpenSSH 8.9\n443/tcp  open  https      nginx/1.18\n49822/tcp open  unknown`);
        add('hint', '⚠️ Port 49822 non standard — investigation requise');
      } else {
        add('output', `PORT    STATE SERVICE\n22/tcp  open  ssh\n80/tcp  open  http\n443/tcp open  https`);
      }
      add('output', `Nmap done: 1 IP address (1 host up)`);
      break;
    }

    case 'iptables': {
      const ip = args.find((_, i) => args[i - 1] === '-s');
      if (ip && args.includes('DROP')) {
        add('success', `Rule appended: DROP all traffic from ${ip}`);
      } else if (args.includes('-L')) {
        add('output', 'Chain INPUT (policy ACCEPT)\ntarget  prot  source       destination\n\nChain FORWARD (policy DROP)\n\nChain OUTPUT (policy ACCEPT)');
      } else {
        add('error', 'Usage: iptables -A INPUT -s [IP] -j DROP');
      }
      break;
    }

    case 'telnet': {
      const host = params[0];
      const port = params[1] || '23';
      if (!host) { add('error', 'telnet: missing host'); break; }
      if (host === '192.168.1.12' && port === '443') {
        add('output', `Trying ${host}...`);
        add('output', `Connected to ${host}.`);
        add('output', `Connection closed by foreign host.`);
        add('hint', '⚠️ Connexion acceptée puis fermée immédiatement — comportement suspect');
      } else {
        add('output', `Trying ${host}...\nConnected to ${host}.\nEscape character is '^]'.`);
      }
      break;
    }

    case 'whois': {
      const target = params[0];
      if (!target) { add('error', 'whois: missing argument'); break; }
      if (target.includes('185.193')) {
        add('output', `% RIPE Database\nnetname:      SHADOW-NET\ncountry:      RU\norg:          ORG-SHADOW\nadmin-c:      UNKNOWN\nstatus:       ASSIGNED PA\nremarks:      *** ABUSE REPORTS: abuse@shadow-hosting.net ***`);
      } else {
        add('output', `NetRange: ${target}\nOrgName: Internet Assigned Numbers Authority`);
      }
      break;
    }

    case 'curl': {
      const url = params[0];
      if (!url) { add('error', 'curl: missing URL'); break; }
      add('output', `  % Total    % Received\n100  1256  100  1256    0     0   4521      0 --:--:-- --:--:-- --:--:--  4521\n<html><head><title>403 Forbidden</title></head></html>`);
      break;
    }

    case 'ssh': {
      const target = params[0];
      if (!target) { add('error', 'ssh: missing destination'); break; }
      add('output', `ssh: connect to host ${target} port 22: Connection timed out`);
      break;
    }

    // ── Services ──
    case 'systemctl':
    case 'service': {
      const action = params[0];
      const svc = params[1] || params[0];
      if (!action) { add('error', `${cmd}: missing arguments`); break; }
      if (action === 'status') {
        add('output', `● ${svc}.service - ${svc}\n   Loaded: loaded\n   Active: active (running) since Sun 2026-02-15 04:21:33 CET\n   Main PID: ${Math.floor(Math.random() * 3000 + 100)}`);
      } else if (action === 'stop') {
        add('success', `${svc}.service stopped.`);
      } else if (action === 'start') {
        add('success', `${svc}.service started.`);
      } else if (action === 'restart') {
        add('success', `${svc}.service restarted.`);
      }
      break;
    }

    case 'crontab': {
      if (flags.includes('-l')) {
        add('output', `# Crontab for kronos\n*/5 * * * * /usr/bin/system-update --silent 2>/dev/null`);
        add('hint', '⚠️ Tâche suspecte : /usr/bin/system-update exécutée toutes les 5 minutes');
      } else {
        add('output', 'crontab: usage: crontab [-l|-e]');
      }
      break;
    }

    // ── Crypto / Analysis ──
    case 'base64': {
      if (flags.includes('-d') && params[0]) {
        try {
          add('output', atob(params[0]));
        } catch {
          add('error', 'base64: invalid input');
        }
      } else if (params[0]) {
        add('output', btoa(params[0]));
      } else {
        add('error', 'Usage: base64 [-d] <string>');
      }
      break;
    }

    case 'md5sum':
    case 'sha256sum': {
      const fname = params[0];
      if (!fname) { add('error', `${cmd}: missing file`); break; }
      const hash = cmd === 'md5sum'
        ? 'd41d8cd98f00b204e9800998ecf8427e'
        : '8d1f8e7c2a4b9c1d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b9b3a';
      add('output', `${hash}  ${fname}`);
      break;
    }

    case 'strings': {
      const fname = params[0];
      if (!fname) { add('error', 'strings: missing file'); break; }
      if (fname.includes('system-update') || fname.includes('hidden_shell')) {
        add('output', '/bin/bash\n/dev/tcp/185.193.88.42/4444\nreverse shell\nC2_BEACON\nKRONOS_EXFIL');
      } else {
        add('output', 'ELF\n/lib64/ld-linux-x86-64.so.2\nlibc.so.6\n__gmon_start__');
      }
      break;
    }

    case 'diff': {
      add('output', '(diff: comparaison simulée — aucun fichier modifié détecté)');
      break;
    }

    case 'python3': {
      if (params[0]) {
        const node = resolveVFSPath(ctx.vfs, ctx.cwd, params[0]);
        if (node && node.type === 'file') {
          add('output', `[Exécution de ${params[0]}]`);
          if (params[0].includes('scan_ips')) {
            add('output', '[+] 192.168.1.1:22 OPEN\n[+] 192.168.1.12:22 OPEN\n[-] 192.168.1.45:22 CLOSED\n[-] 10.0.5.50:22 CLOSED');
          } else if (params[0].includes('log_parser')) {
            add('output', '[ALERT] Suspicious IP: 45.33.2.1 — 4 requests\n[ALERT] Suspicious IP: 185.193.88.42 — 1 requests');
          } else {
            add('output', 'Script exécuté avec succès.');
          }
        } else {
          add('error', `python3: can't open file '${params[0]}': No such file or directory`);
        }
      } else {
        add('output', 'Python 3.10.12 (main, Jun 2025)\n>>> (mode interactif non disponible — spécifie un script)');
      }
      break;
    }

    default:
      add('error', `bash: ${cmd}: command not found`);
      break;
  }

  return lines;
}
