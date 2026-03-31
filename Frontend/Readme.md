# 📄 Dokumentace projektu – Checklist aplikace

**Autor:** Martin Veber C3a
**Studijní obor:** Informační technologie  

---

## Anotace  
Tato práce se zabývá návrhem a implementací backendové a frontendové části webové aplikace pro správu checklistů. Aplikace umožňuje uživatelům vytvářet, upravovat a spravovat seznamy úkolů. Součástí je autentizace pomocí JSON Web Tokenů a zabezpečení hesel pomocí bcrypt. Cílem projektu je vytvořit jednoduchý, bezpečný a rozšiřitelný systém pro správu úkolů, který je nasazen online.

---

## Úvod  
Organizace úkolů hlavně při nástupu uživatele(na co se aplikace zaměřuje nejvíce) důležitou součástí každodeního provuzu ve firmě. Existuje mnoho aplikací, které tuto potřebu řeší, avšak často jsou složité nebo neumožňují dostatečné přizpůsobení. Tento projekt se zaměřuje na vytvořeníwebové aplikace pro správu checklistů, která je jednoduchá, přehledná a snadno rozšiřitelná.  

Backend zajišťuje komunikaci s klientem, ukládání dat a autentizaci uživatelů. Aplikace je nasazena online na adrese https://checklist-app-1-d0cc.onrender.com/, což umožňuje její reálné použití.  

Cílem bylo vytvořit stabilní webovou  z aplikace, která  slouží k správě ůkolů a také sdílení checklistů mezi uživateli. Důležitým aspektem byla také bezpečnost, zejména při práci s hesly a uživatelskými daty.

---

## Ekonomická rozvaha  

### Konkurence  
- Todoist  
- Microsoft To Do  
- Google Keep  

### Výhody projektu  
- Jednoduchost a přehlednost  
- Nízké náklady na provoz    
- Online dostupnost  

### Propagace  
- GitHub  
- Sociální sítě  
- Webová prezentace  

### Návratnost investic  
Projekt má minimální náklady (vývoj a hosting).  
Možnosti monetizace:  
- prémiové funkce  
- firemní nasazení  
- reklama  

---

## Vývoj  

### Použité technologie  
- Node.js  
- JavaScript  
- JSON Web Token (JWT)  
- bcryptjs  

### Struktura programu  
Aplikace je rozdělena na:  
- autentizaci (registrace, login)  
- API endpointy  
- logiku práce s checklisty  

### Průběh vývoje  
1. Návrh architektury  
2. Implementace autentizace  
3. Vytvoření API  
4. Testování  
5. Opravy chyb  

### Dokumentace v kódu  
Kód obsahuje komentáře pro lepší orientaci a pochopení logiky aplikace.

### Schéma aplikace  
Uživatel
↓
Frontend (UI)
↓
Backend (API)
↓
Databáze

Autentizace probíhá pomocí JWT tokenu.

---

## Testování  

### 1. Registrace uživatele  
Popis: vytvoření nového účtu přes frontend  
Výsledek: uživatel byl úspěšně vytvořen  

### 2. Přihlášení  
Popis: přihlášení přes formulář  
Výsledek: úspěšné přihlášení a získání tokenu  

### 3. Vytvoření checklistu  
Popis: vytvoření checklistu přes UI  
Výsledek: checklist uložen do databáze  

### 4. Úprava checklistu  
Popis: editace položek  
Výsledek: změny byly správně uloženy  

### 5. Nasazení aplikace  
Popis: spuštění aplikace na serveru Render  
Výsledek: aplikace běží online a je dostupná  


## Nasazení a spuštění  

### Online verze  
https://checklist-app-1-d0cc.onrender.com/

### Lokální spuštění  

Požadavky:  
- Node.js  
- npm  

Odkaz na Github:https://github.com/veber07/checklist-app

## Závěr

Projekt splnil stanovené cíle a vytvořil plnohodnotnou webovou aplikaci pro správu checklistů. Byla implementována frontendová i backendová část, autentizace uživatelů a práce s daty.

Díky online nasazení je aplikace dostupná pro reálné použití. Projekt je připraven na další rozšíření.

Práce přinesla praktické zkušenosti s vývojem moderních webových aplikací a může sloužit jako základ pro další projekty.