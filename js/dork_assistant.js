// Dork Assistant functionality
const DORK_CATEGORIES = {
  information: {
    title: "Information Gathering",
    icon: "fas fa-info-circle",
    templates: [
      {
        title: "Domain Information",
        description: "Find all pages indexed for a specific domain",
        query: "site:{domain}"
      },
      {
        title: "Email Discovery",
        description: "Find email addresses associated with a domain",
        query: 'site:{domain} "@{domain}" OR "email" OR "contact"'
      },
      {
        title: "Employee Information",
        description: "Find employee information for a company",
        query: 'site:linkedin.com "{company}" employees OR staff OR team'
      },
        {
            title: "Subdomain Enumeration",
            description: "Find subdomains of a domain",
            query: 'site:{domain} -www'
        },
        {
            title: "IP Address Lookup",
            description: "Find IP addresses associated with a domain",
            query: 'site:{domain} "IP Address" OR "IP Location"'
        },
        {
            title: "DNS Records",
            description: "Find DNS records for a domain",
            query: 'site:{domain} "DNS Records" OR "DNS Lookup"'
        },
        {
            title: "WHOIS Information",
            description: "Find WHOIS information for a domain",
            query: 'site:{domain} "WHOIS" OR "Domain Registration"'
        },
        {
            title: "SSL Certificates",
            description: "Find SSL certificates for a domain",
            query: 'site:{domain} "SSL Certificate" OR "TLS Certificate"'
        },
        {
            title: "Web Technologies",
            description: "Find web technologies used by a domain",
            query: 'site:{domain} "Web Technologies" OR "Tech Stack"'
        },
        {
            title: "Social Media Profiles",
            description: "Find social media profiles for a domain",
            query: 'site:{domain} "Facebook" OR "Twitter" OR "LinkedIn"'
        },
        {
            title: "Public Repositories",
            description: "Find public repositories for a domain",
            query: 'site:{domain} "GitHub" OR "GitLab" OR "Bitbucket"'
        }
    ]
  },
  files: {
    title: "File Discovery",
    icon: "fas fa-file-alt",
    templates: [
      {
        title: "PDF Documents",
        description: "Find PDF files on a domain",
        query: "site:{domain} filetype:pdf"
      },
      {
        title: "Excel Files",
        description: "Find Excel spreadsheets",
        query: "site:{domain} filetype:xlsx OR filetype:xls"
      },
      {
        title: "Configuration Files",
        description: "Find potential configuration files",
        query: 'filetype:conf OR filetype:config OR filetype:env "{keyword}"'
      },
        {
            title: "Backup Files",
            description: "Find backup files",
            query: 'filetype:bak OR filetype:old OR filetype:zip "{keyword}"'
        },
        {
            title: "Word Documents",
            description: "Find Word documents",
            query: "site:{domain} filetype:doc OR filetype:docx"
        },
        {
            title: "PowerPoint Presentations",
            description: "Find PowerPoint presentations",
            query: "site:{domain} filetype:ppt OR filetype:pptx"
        },
        {
            title: "Text Files",
            description: "Find text files",
            query: "site:{domain} filetype:txt"
        },
        {
            title: "Image Files",
            description: "Find image files",
            query: "site:{domain} filetype:jpg OR filetype:png OR filetype:gif"
        },
        {
            title: "Video Files",
            description: "Find video files",
            query: "site:{domain} filetype:mp4 OR filetype:avi OR filetype:mkv"
        },
        {
            title: "Audio Files",
            description: "Find audio files",
            query: "site:{domain} filetype:mp3 OR filetype:wav OR filetype:aac"
        },
        {
            title: "Archive Files",
            description: "Find archive files",
            query: "site:{domain} filetype:zip OR filetype:rar OR filetype:tar"
        },
        {
            title: "Database Dumps",
            description: "Find database dump files",
            query: "site:{domain} filetype:sql OR filetype:dump"
        },
        {
            title: "Code Files",
            description: "Find code files",
            query: "site:{domain} filetype:js OR filetype:py OR filetype:java"
        },
        {
            title: "Configuration Files",
            description: "Find configuration files",
            query: 'site:{domain} filetype:conf OR filetype:ini OR filetype:yml'
        },
        {
            title: "Log Files",
            description: "Find log files",
            query: 'site:{domain} filetype:log'
        },
        {
            title: "Source Code",
            description: "Find source code files",
            query: 'site:{domain} filetype:php OR filetype:html OR filetype:css'
        },
        {
            title: "Scripts",
            description: "Find script files",
            query: 'site:{domain} filetype:sh OR filetype:bat OR filetype:ps1'
        },
        {
            title: "Configuration Backups",
            description: "Find configuration backup files",
            query: 'site:{domain} filetype:bkp OR filetype:bak'
        },
        {
            title: "Sensitive Files",
            description: "Find sensitive files",
            query: 'site:{domain} filetype:key OR filetype:pem'
        },
        {
            title: "Database Files",
            description: "Find database files",
            query: 'site:{domain} filetype:db OR filetype:sqlite'
        },
        {
            title: "Virtual Machine Images",
            description: "Find virtual machine images",
            query: 'site:{domain} filetype:vmdk OR filetype:vdi'
        },
        {
            title: "Docker Images",
            description: "Find Docker images",
            query: 'site:{domain} filetype:tar OR filetype:docker'
        },
        {
            title: "Configuration Templates",
            description: "Find configuration templates",
            query: 'site:{domain} filetype:template OR filetype:yml'
        },
        {
            title: "SSL Certificates",
            description: "Find SSL certificate files",
            query: 'site:{domain} filetype:crt OR filetype:pem'
        },
        {
            title: "SSH Keys",
            description: "Find SSH key files",
            query: 'site:{domain} filetype:key OR filetype:pub'
        },
        {
            title: "API Keys",
            description: "Find API key files",
            query: 'site:{domain} filetype:key OR filetype:json'
        },
        {
            title: "Private Keys",
            description: "Find private key files",
            query: 'site:{domain} filetype:key OR filetype:pem'
        },
        {
            title: "Public Keys",
            description: "Find public key files",
            query: 'site:{domain} filetype:key OR filetype:pub'
        },
        {
            title: "Certificate Signing Requests",
            description: "Find CSR files",
            query: 'site:{domain} filetype:csr'
        },
        {
            title: "SSL Certificate Chains",
            description: "Find SSL certificate chain files",
            query: 'site:{domain} filetype:pem OR filetype:crt'
        },
        {
            title: "Certificate Revocation Lists",
            description: "Find CRL files",
            query: 'site:{domain} filetype:crl'
        },
        {
            title: "Certificate Transparency Logs",
            description: "Find CT log files",
            query: 'site:{domain} filetype:ct'
        },
        {
            title: "Certificate Authority Files",
            description: "Find CA files",
            query: 'site:{domain} filetype:ca'
        },
        {
            title: "Certificate Signing Requests",
            description: "Find CSR files",
            query: 'site:{domain} filetype:csr'
        }
    ]
  },
  vulnerabilities: {
    title: "Vulnerability Scanning",
    icon: "fas fa-bug",
    templates: [
      {
        title: "Admin Panels",
        description: "Find admin login pages",
        query: 'site:{domain} inurl:admin OR inurl:login OR inurl:administrator'
      },
      {
        title: "SQL Errors",
        description: "Find pages with SQL errors",
        query: 'site:{domain} "sql syntax" OR "mysql error"'
      },
      {
        title: "Exposed Git",
        description: "Find exposed Git repositories",
        query: 'site:{domain} inurl:.git'
      },
        {
            title: "Exposed Directories",
            description: "Find exposed directories",
            query: 'site:{domain} inurl:/backup/ OR inurl:/uploads/'
        },
        {
            title: "Sensitive Files",
            description: "Find sensitive files",
            query: 'site:{domain} filetype:log OR filetype:bak OR filetype:old'
        },
        {
            title: "Vulnerable Software",
            description: "Find pages with vulnerable software versions",
            query: 'site:{domain} "version" OR "vulnerability" OR "CVE"'
        },
        {
            title: "Open Redirects",
            description: "Find open redirect vulnerabilities",
            query: 'site:{domain} inurl:"redirect" OR inurl:"url"'
        },
        {
            title: "Cross-Site Scripting (XSS)",
            description: "Find potential XSS vulnerabilities",
            query: 'site:{domain} inurl:"?id=" OR inurl:"?page="'
        },
        {
            title: "Cross-Site Request Forgery (CSRF)",
            description: "Find potential CSRF vulnerabilities",
            query: 'site:{domain} inurl:"csrf" OR inurl:"token"'
        },
        {
            title: "Remote File Inclusion (RFI)",
            description: "Find potential RFI vulnerabilities",
            query: 'site:{domain} inurl:"?file=" OR inurl:"?page="'
        },
        {
            title: "Local File Inclusion (LFI)",
            description: "Find potential LFI vulnerabilities",
            query: 'site:{domain} inurl:"/etc/passwd" OR inurl:"/proc/self/environ"'
        },
        {
            title: "Command Injection",
            description: "Find potential command injection vulnerabilities",
            query: 'site:{domain} inurl:"cmd=" OR inurl:"exec="'
        },
        {
            title: "Directory Traversal",
            description: "Find potential directory traversal vulnerabilities",
            query: 'site:{domain} inurl:"../" OR inurl:"..\\\\"'
        },
        {
            title: "Sensitive Information Disclosure",
            description: "Find sensitive information disclosures",
            query: 'site:{domain} "confidential" OR "sensitive" OR "private"'
        },
        {
            title: "Open Ports",
            description: "Find open ports on a domain",
            query: 'site:{domain} inurl:"8080" OR inurl:"8443" OR inurl:"3306"'
        },
        {
            title: "Exposed APIs",
            description: "Find exposed APIs",
            query: 'site:{domain} inurl:"api" OR inurl:"v1" OR inurl:"v2"'
        },
        {
            title: "Exposed Services",
            description: "Find exposed services",
            query: 'site:{domain} inurl:"service" OR inurl:"status"'
        },
        {
            title: "Sensitive Data Exposure",
            description: "Find sensitive data exposure",
            query: 'site:{domain} "sensitive data" OR "exposed data"'
        },
        {
            title: "Unrestricted File Upload",
            description: "Find unrestricted file upload vulnerabilities",
            query: 'site:{domain} inurl:"upload" OR inurl:"file"'
        },
        {
            title: "Server Misconfigurations",
            description: "Find server misconfigurations",
            query: 'site:{domain} "server" OR "configuration" OR "settings"'
        },
        {
            title: "Open Ports",
            description: "Find open ports on a domain",
            query: 'site:{domain} inurl:"8080" OR inurl:"8443" OR inurl:"3306"'
        },
        {
            title: "Exposed Services",
            description: "Find exposed services",
            query: 'site:{domain} inurl:"service" OR inurl:"status"'
        },
        {
            title: "Sensitive Data Exposure",
            description: "Find sensitive data exposure",
            query: 'site:{domain} "sensitive data" OR "exposed data"'
        },
        {
            title: "Unrestricted File Upload",
            description: "Find unrestricted file upload vulnerabilities",
            query: 'site:{domain} inurl:"upload" OR inurl:"file"'
        },
        {
            title: "Server Misconfigurations",
            description: "Find server misconfigurations",
            query: 'site:{domain} "server" OR "configuration" OR "settings"'
        },
        {
            title: "Open Redirects",
            description: "Find open redirect vulnerabilities",
            query: 'site:{domain} inurl:"redirect" OR inurl:"url"'
        },
        {
            title: "Cross-Site Scripting (XSS)",
            description: "Find potential XSS vulnerabilities",
            query: 'site:{domain} inurl:"?id=" OR inurl:"?page="'
        },
        {
            title: "Cross-Site Request Forgery (CSRF)",
            description: "Find potential CSRF vulnerabilities",
            query: 'site:{domain} inurl:"csrf" OR inurl:"token"'
        },
        {
            title: "Remote File Inclusion (RFI)",
            description: "Find potential RFI vulnerabilities",
            query: 'site:{domain} inurl:"?file=" OR inurl:"?page="'
        },
        {
            title: "Local File Inclusion (LFI)",
            description: "Find potential LFI vulnerabilities",
            query: 'site:{domain} inurl:"/etc/passwd" OR inurl:"/proc/self/environ"'
        },
        {
            title: "Command Injection",
            description: "Find potential command injection vulnerabilities",
            query: 'site:{domain} inurl:"cmd=" OR inurl:"exec="'
        },
        {
            title: "Directory Traversal",
            description: "Find potential directory traversal vulnerabilities",
            query: 'site:{domain} inurl:"../" OR inurl:"..\\\\"'
        }
    ]
  },
  social: {
    title: "Social Media",
    icon: "fas fa-share-alt",
    templates: [
      {
        title: "LinkedIn Profiles",
        description: "Find LinkedIn profiles",
        query: 'site:linkedin.com "{name}" OR "{company}"'
      },
      {
        title: "Twitter Accounts",
        description: "Find Twitter profiles",
        query: 'site:twitter.com "{username}" OR "{name}"'
      },
      {
        title: "Facebook Pages",
        description: "Find Facebook presence",
        query: 'site:facebook.com "{name}" OR "{company}"'
      },
      {
        title: "Reddit Accounts",
        description: "Find Reddit profiles",
        query: 'site:reddit.com "{username}" OR "{name}"'
      },
      {
          title: "Instagram Accounts",
          description: "Find Instagram profiles",
          query: 'site:instagram.com "{username}" OR "{name}"'
      },
      {
          title: "TikTok Accounts",
          description: "Find TikTok profiles",
          query: 'site:tiktok.com "{username}" OR "{name}"'
      },
        {
            title: "YouTube Channels",
            description: "Find YouTube channels",
            query: 'site:youtube.com "{username}" OR "{name}"'
        },
        {
            title: "Pinterest Accounts",
            description: "Find Pinterest profiles",
            query: 'site:pinterest.com "{username}" OR "{name}"'
        },
        {
            title: "Snapchat Accounts",
            description: "Find Snapchat profiles",
            query: 'site:snapchat.com "{username}" OR "{name}"'
        },
        {
            title: "Tumblr Blogs",
            description: "Find Tumblr blogs",
            query: 'site:tumblr.com "{username}" OR "{name}"'
        },
        {
            title: "Flickr Accounts",
            description: "Find Flickr profiles",
            query: 'site:flickr.com "{username}" OR "{name}"'
        },
        {
            title: "Quora Profiles",
            description: "Find Quora profiles",
            query: 'site:quora.com "{username}" OR "{name}"'
        },
        {
            title: "Discord Accounts",
            description: "Find Discord profiles",
            query: 'site:discord.com "{username}" OR "{name}"'
        },
        {
            title: "Telegram Accounts",
            description: "Find Telegram profiles",
            query: 'site:telegram.org "{username}" OR "{name}"'
        },
        {
            title: "WhatsApp Accounts",
            description: "Find WhatsApp profiles",
            query: 'site:whatsapp.com "{username}" OR "{name}"'
        },
        {
            title: "LinkedIn Groups",
            description: "Find LinkedIn groups",
            query: 'site:linkedin.com/groups "{keyword}"'
        },
        {
            title: "Facebook Groups",
            description: "Find Facebook groups",
            query: 'site:facebook.com/groups "{keyword}"'
        },
        {
            title: "Reddit Communities",
            description: "Find Reddit communities",
            query: 'site:reddit.com/r/{keyword}'
        },
        {
            title: "Discord Servers",
            description: "Find Discord servers",
            query: 'site:discord.gg "{keyword}"'
        },
        {
            title: "Telegram Channels",
            description: "Find Telegram channels",
            query: 'site:t.me/{keyword}'
        },
        {
            title: "WhatsApp Groups",
            description: "Find WhatsApp groups",
            query: 'site:wa.me/{keyword}'
        },
        {
            title: "Cryto Wallets",
            description: "Find crypto wallets",
            query: "{username} wallet OR {username} address OR {username} public key",
        },
        {
            title: "Crypto Transactions",
            description: "Find crypto transactions",
            query: "{username} transaction OR {username} tx OR {username} blockchain",
        },
        {
            title: "Crypto Exchanges",
            description: "Find crypto exchanges",
            query: "{username} exchange OR {username} trading OR {username} market",
        },
        {
            title: "Pastebin Posts",
            description: "Find Pastebin posts",
            query: 'site:pastebin.com "{keyword}" OR "{username}"'

        },
        {
            title: "GitHub Repositories",
            description: "Find GitHub repositories",
            query: 'site:github.com "{username}" OR "{keyword}"'
        },
        {
            title: "GitLab Repositories",
            description: "Find GitLab repositories",
            query: 'site:gitlab.com "{username}" OR "{keyword}"'
        },
        {
            title: "Bitbucket Repositories",
            description: "Find Bitbucket repositories",
            query: 'site:bitbucket.org "{username}" OR "{keyword}"'
        },
        {
            title: "Social Media Posts",
            description: "Find social media posts",
            query: 'site:{domain} "{keyword}" OR "{username}"'
        }


    ]
  },
  credentials: {
    title: "Credentials & Auth",
    icon: "fas fa-key",
    templates: [
      {
        title: "Password Files",
        description: "Find potential password files",
        query: 'site:{domain} filetype:txt "password" OR "pwd" OR "passwd"'
      },
      {
        title: "API Keys",
        description: "Find exposed API keys",
        query: 'site:{domain} "api_key" OR "apikey" OR "client_secret"'
      },
      {
        title: "Config Files",
        description: "Find configuration files with credentials",
        query: 'site:{domain} filetype:env OR filetype:cfg "password" OR "credential"'
      },
        {
            title: "Exposed Passwords",
            description: "Find exposed passwords in files",
            query: 'site:{domain} filetype:txt "password" OR "passwd"'
        },
        {
            title: "SSH Keys",
            description: "Find exposed SSH keys",
            query: 'site:{domain} filetype:pub OR filetype:key "ssh-rsa" OR "ssh-dss"'
        },
        {
            title: "API Endpoints",
            description: "Find exposed API endpoints",
            query: 'site:{domain} "api" OR "endpoint" OR "webhook"'
        },
        {
            title: "OAuth Tokens",
            description: "Find exposed OAuth tokens",
            query: 'site:{domain} "oauth" OR "access_token" OR "refresh_token"'
        },
        {
            title: "JWT Tokens",
            description: "Find exposed JWT tokens",
            query: 'site:{domain} "jwt" OR "json web token" OR "bearer token"'
        },
        {
            title: "Session Cookies",
            description: "Find exposed session cookies",
            query: 'site:{domain} "session" OR "cookie" OR "csrf"'
        },
        {
            title: "Credentials in URLs",
            description: "Find credentials in URLs",
            query: 'site:{domain} inurl:"username" OR inurl:"password"'
        },
        {
            title: "Credentials in Forms",
            description: "Find credentials in forms",
            query: 'site:{domain} inurl:"login" OR inurl:"signup" "username" OR "password"'
        },
        {
            title: "Credentials in Comments",
            description: "Find credentials in comments",
            query: 'site:{domain} "<!--" OR "<!---" "username" OR "password"'
        },
        {
            title: "Credentials in Headers",
            description: "Find credentials in HTTP headers",
            query: 'site:{domain} "Authorization" OR "WWW-Authenticate" "Basic" OR "Bearer"'
        },
        {
            title: "Credentials in Cookies",
            description: "Find credentials in cookies",
            query: 'site:{domain} "Set-Cookie" OR "Cookie" "username" OR "password"'
        },
        {
            title: "Credentials in JavaScript",
            description: "Find credentials in JavaScript files",
            query: 'site:{domain} filetype:js "username" OR "password"'
        },
        {
            title: "Credentials in HTML",
            description: "Find credentials in HTML files",
            query: 'site:{domain} filetype:html "username" OR "password"'
        },
        {
            title: "Credentials in XML",
            description: "Find credentials in XML files",
            query: 'site:{domain} filetype:xml "username" OR "password"'
        },
        {
            title: "Credentials in JSON",
            description: "Find credentials in JSON files",
            query: 'site:{domain} filetype:json "username" OR "password"'
        }

    ]
  },
  database: {
    title: "Database Exposure",
    icon: "fas fa-database",
    templates: [
      {
        title: "SQL Dumps",
        description: "Find exposed SQL dumps",
        query: 'site:{domain} filetype:sql "INSERT INTO" OR "CREATE TABLE"'
      },
      {
        title: "Database Files",
        description: "Find database files",
        query: 'site:{domain} filetype:db OR filetype:sqlite OR filetype:mdb'
      },
      {
        title: "Connection Strings",
        description: "Find database connection strings",
        query: 'site:{domain} "mysqli_connect" OR "mysql_connect"'
      }
    ]
  },
  network: {
    title: "Network Infrastructure",
    icon: "fas fa-network-wired",
    templates: [
      {
        title: "Router Config",
        description: "Find exposed router configurations",
        query: 'site:{domain} intitle:"router configuration" OR inurl:cisco'
      },
      {
        title: "Open Ports",
        description: "Find services on non-standard ports",
        query: 'site:{domain} port:8080 OR port:8443 OR port:3306'
      },
      {
        title: "Network Devices",
        description: "Find network devices",
        query: 'site:{domain} intitle:"Network Camera" OR inurl:phpinfo'
      }
    ]
  },
  phones: {
    title: "Phone Numbers",
    icon: "fas fa-phone",
    templates: [
      {
        title: "Contact Numbers",
        description: "Find phone numbers on a domain",
        query: 'site:{domain} "phone" OR "tel" OR "contact" OR "call us"'
      },
      {
        title: "Mobile Numbers",
        description: "Find mobile numbers",
        query: 'site:{domain} intext:"+1" OR "+44" filetype:pdf OR filetype:doc'
      }
    ]
  },
  emails: {
    title: "Emails",
    icon: "fas fa-envelope",
    templates: [
      {
        title: "Email Addresses",
        description: "Find email addresses",
        query: 'site:{domain} "@{domain}"'
      },
      {
        title: "Email Addresses (Across All Providers)",
        description: "Find email addresses across various email providers",
        query: "site:{domain} '{name}' \"@gmail.com\" OR site:outlook.com \"@outlook.com\" OR site:yahoo.com \"@yahoo.com\" OR site:protonmail.com \"@protonmail.com\" OR site:zoho.com \"@zoho.com\" OR site:aol.com \"@aol.com\" OR site:icloud.com \"@icloud.com\" OR site:mail.ru \"@mail.ru\""
      },
      {
        title: "Email Addresses (With Keywords)",
        description: "Find email addresses with specific keywords",
        query: 'site:{domain} "@{keyword}"'
      },
      {
        title: "Email Addresses (With Name)",
        description: "Find email addresses with a specific name",
        query: 'site:{domain} "{name}"'
      }, 
      {
        title: "Contact Emails",
        description: "Find contact email addresses",
        query: 'site:{domain} "contact" OR "email us" "@"'
      },
        {
            title: "Support Emails",
            description: "Find support email addresses",
            query: 'site:{domain} "support" OR "help" OR "customer service" "@"'
        },
        {
            title: "Sales Emails",
            description: "Find sales email addresses",
            query: 'site:{domain} "sales" OR "inquiries" OR "business" "@"'
        },
        {
            title: "Marketing Emails",
            description: "Find marketing email addresses",
            query: 'site:{domain} "marketing" OR "promotions" OR "offers" "@"'
        },
        {
            title: "HR Emails",
            description: "Find HR email addresses",
            query: 'site:{domain} "hr" OR "careers" OR "jobs" "@"'
        },
        {
            title: "Admin Emails",
            description: "Find admin email addresses",
            query: 'site:{domain} "admin" OR "administrator" OR "webmaster" "@"'
        },
        {
            title: "Partnership Emails",
            description: "Find partnership email addresses",
            query: 'site:{domain} "partnership" OR "collaboration" OR "alliances" "@"'
        },
        {
            title: "Legal Emails",
            description: "Find legal email addresses",
            query: 'site:{domain} "legal" OR "compliance" OR "terms" "@"'
        },
        {
            title: "Security Emails",
            description: "Find security email addresses",
            query: 'site:{domain} "security" OR "vulnerability" OR "incident response" "@"'
        },
        {
            title: "Technical Support Emails",
            description: "Find technical support email addresses",
            query: 'site:{domain} "technical support" OR "IT support" OR "troubleshooting" "@"'
        },
        {
            title: "Affiliate Emails",
            description: "Find affiliate email addresses",
            query: 'site:{domain} "affiliate" OR "referral" OR "partner" "@"'
        },
        {
            title: "Customer Service Emails",
            description: "Find customer service email addresses",
            query: 'site:{domain} "customer service" OR "support" OR "help desk" "@"'
        },

    ]
  },
  crypto: {
    title: "Crypto & Wallets",
    icon: "fas fa-coins",
    templates: [
      {
        title: "Bitcoin Addresses",
        description: "Find Bitcoin wallet addresses",
        query: 'site:{domain} "bitcoin" OR "btc" OR "1" OR "3" OR "bc1"'
      },
      {
        title: "Ethereum Addresses",
        description: "Find Ethereum addresses",
        query: 'site:{domain} "ethereum" OR "eth" OR "0x"'
      },
        {
            title: "Crypto Wallets",
            description: "Find crypto wallet addresses",
            query: 'site:{domain} "wallet" OR "address" OR "public key"'
        },
        {
            title: "Crypto Transactions",
            description: "Find crypto transaction details",
            query: 'site:{domain} "transaction" OR "tx" OR "blockchain"'
        },
        {
            title: "Crypto Exchanges",
            description: "Find crypto exchange information",
            query: 'site:{domain} "exchange" OR "trading" OR "market"'
        },
        {
            title: "Crypto News",
            description: "Find crypto news articles",
            query: 'site:{domain} "news" OR "update" OR "announcement"'
        },
        {
            title: "Crypto Wallet Addresses",
            description: "Find crypto wallet addresses",
            query: 'site:{domain} "wallet" OR "address" OR "public key"'
        },
        {
            title: "Crypto Transactions",
            description: "Find crypto transaction details",
            query: 'site:{domain} "transaction" OR "tx" OR "blockchain"'
        },
        {
            title: "Crypto Exchanges",
            description: "Find crypto exchange information",
            query: 'site:{domain} "exchange" OR "trading" OR "market"'
        },
        {
            title: "Crypto News",
            description: "Find crypto news articles",
            query: 'site:{domain} "news" OR "update" OR "announcement"'
        },
        {
            title: "Crypto Mining",
            description: "Find crypto mining information",
            query: 'site:{domain} "mining" OR "pool" OR "hashrate"'
        },
        {
            title: "Crypto Wallets",
            description: "Find crypto wallet addresses",
            query: 'site:{domain} "wallet" OR "address" OR "public key"'
        },
        {
            title: "Crypto Transactions",
            description: "Find crypto transaction details",
            query: 'site:{domain} "transaction" OR "tx" OR "blockchain"'
        }
    ]
  }
};

const SEARCH_ENGINES = {
  google: {
    name: "Google",
    icon: "fab fa-google",
    url: "https://www.google.com/search?q="
  },
  yandex: {
    name: "Yandex",
    icon: "fab fa-yandex",
    url: "https://yandex.com/search/?text="
  },
  bing: {
    name: "Bing",
    icon: "fab fa-microsoft",
    url: "https://www.bing.com/search?q="
  },
  duckduckgo: {
    name: "DuckDuckGo",
    icon: "fas fa-duck",
    url: "https://duckduckgo.com/?q="
  },
  yahoo: {
    name: "Yahoo",
    icon: "fab fa-yahoo",
    url: "https://search.yahoo.com/search?p="
  },
  shodan: {
    name: "Shodan",
    icon: "fas fa-globe",
    url: "https://www.shodan.io/search?query="
  },
  censys: {
    name: "Censys",
    icon: "fas fa-search",
    url: "https://search.censys.io/search?resource=hosts&q="
  }
};

function initializeDorkAssistant() {
  const dorkPanel = document.getElementById('dork-panel');
  const dorkHeader = dorkPanel?.querySelector('.dork-header');
  const toggleBtn = document.getElementById('toggle-dork-btn');
  const closeBtn = document.getElementById('close-dork-btn');
  const searchBtn = document.getElementById('search-dork');
  const resetBtn = document.getElementById('reset-dork');
  const helpBtn = document.getElementById('dork-help-btn');
  const categorySelect = document.getElementById('dork-category');
  const templateSelect = document.getElementById('dork-template');
  const searchEngineSelect = document.getElementById('dork-search-engine');
  const customQueryInput = document.getElementById('dork-custom-query');
  const finalQueryDisplay = document.getElementById('dork-final-query');
  const copyBtn = document.getElementById('copy-dork');

  if (!dorkPanel || !dorkHeader) return;

  // Make panel draggable with boundary constraints
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  dorkHeader.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    if (e.target === closeBtn) return;
    
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === dorkHeader) {
      isDragging = true;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      // Calculate boundaries
      const panelRect = dorkPanel.getBoundingClientRect();
      const maxX = window.innerWidth - panelRect.width;
      const maxY = window.innerHeight - panelRect.height;

      // Constrain to screen boundaries
      currentX = Math.min(Math.max(0, currentX), maxX);
      currentY = Math.min(Math.max(0, currentY), maxY);

      xOffset = currentX;
      yOffset = currentY;

      // Remove transform: translateX(-50%) while dragging
      dorkPanel.style.transform = 'none';
      dorkPanel.style.left = currentX + 'px';
      dorkPanel.style.top = currentY + 'px';
      
      // Remove bottom positioning
      dorkPanel.style.bottom = 'auto';
    }
  }

  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
  }

  // Initialize categories
  initializeCategories();
  
  // Initialize search engines
  initializeSearchEngines();

  // Toggle panel
  toggleBtn?.addEventListener('click', () => {
    dorkPanel.classList.toggle('hidden');
  });

  // Close panel
  closeBtn?.addEventListener('click', () => {
    dorkPanel.classList.add('hidden');
  });

  // Category change
  categorySelect?.addEventListener('change', () => {
    updateTemplates();
    updateQuery();
  });

  // Template change
  templateSelect?.addEventListener('change', updateQuery);

  // Custom query input
  customQueryInput?.addEventListener('input', updateQuery);

  // Copy button
  copyBtn?.addEventListener('click', () => {
    const query = finalQueryDisplay.textContent;
    navigator.clipboard.writeText(query).then(() => {
      showNotification('Query copied to clipboard!', 'success');
    });
  });

  // Search button
  searchBtn?.addEventListener('click', () => {
    const query = finalQueryDisplay.textContent;
    const engine = searchEngineSelect.value;
    if (!query) {
      showNotification('Please enter a search query', 'error');
      return;
    }
    const searchUrl = SEARCH_ENGINES[engine].url + encodeURIComponent(query);
    window.open(searchUrl, '_blank');
  });

  // Reset button
  resetBtn?.addEventListener('click', () => {
    categorySelect.selectedIndex = 0;
    updateTemplates();
    customQueryInput.value = '';
    updateQuery();
  });

  // Help button
  helpBtn?.addEventListener('click', showHelp);
}

function initializeCategories() {
  const categorySelect = document.getElementById('dork-category');
  if (!categorySelect) return;

  Object.entries(DORK_CATEGORIES).forEach(([key, category]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = category.title;
    categorySelect.appendChild(option);
  });

  updateTemplates();
}

function initializeSearchEngines() {
  const searchEngineSelect = document.getElementById('dork-search-engine');
  if (!searchEngineSelect) return;

  Object.entries(SEARCH_ENGINES).forEach(([key, engine]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = engine.name;
    searchEngineSelect.appendChild(option);
  });
}

function updateTemplates() {
  const categorySelect = document.getElementById('dork-category');
  const templateSelect = document.getElementById('dork-template');
  if (!categorySelect || !templateSelect) return;

  const category = DORK_CATEGORIES[categorySelect.value];
  templateSelect.innerHTML = '';

  if (category) {
    category.templates.forEach((template, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = template.title;
      templateSelect.appendChild(option);
    });
  }

  updateQuery();
}

function updateQuery() {
  const categorySelect = document.getElementById('dork-category');
  const templateSelect = document.getElementById('dork-template');
  const customQueryInput = document.getElementById('dork-custom-query');
  const finalQueryDisplay = document.getElementById('dork-final-query');
  
  if (!categorySelect || !templateSelect || !customQueryInput || !finalQueryDisplay) return;

  const category = DORK_CATEGORIES[categorySelect.value];
  const templateIndex = parseInt(templateSelect.value);
  const template = category?.templates[templateIndex];
  const customQuery = customQueryInput.value.trim();

  let finalQuery = '';
  if (template) {
    finalQuery = template.query;
    // Replace placeholders with custom input if provided
    if (customQuery) {
      finalQuery = finalQuery
        .replace(/{domain}/g, customQuery)
        .replace(/{keyword}/g, customQuery)
        .replace(/{name}/g, customQuery)
        .replace(/{company}/g, customQuery)
        .replace(/{username}/g, customQuery);
    }
  }

  finalQueryDisplay.textContent = finalQuery;
}

function showHelp() {
  const helpContent = `
    <h3>Dork Operators</h3>
    <ul>
      <li><strong>site:</strong> - Search within a specific domain</li>
      <li><strong>intitle:</strong> - Search page titles</li>
      <li><strong>inurl:</strong> - Search URLs</li>
      <li><strong>filetype:</strong> - Search for specific file types</li>
      <li><strong>intext:</strong> - Search page content</li>
      <li><strong>cache:</strong> - View cached version</li>
    </ul>
    <h3>Tips</h3>
    <ul>
      <li>Use quotes for exact matches: "example"</li>
      <li>Use OR to combine searches: term1 OR term2</li>
      <li>Use - to exclude terms: -exclude</li>
      <li>Use .. for number ranges: 2020..2023</li>
    </ul>
  `;

  showModal('Dork Help', helpContent);
}

function showModal(title, content) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="btn-icon modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

export { initializeDorkAssistant };